/* eslint no-console: [0] */
'use strict'

const _ = require('lodash')
const sequelizeStream =  require('sequelize-stream')
const routes = require('./routes')
const policies = require('./policies')
const pubSub = require('./pubSub')
const schedule = require('node-schedule')
const trailsCore = require('trails/lib').Core
const routeOrder = require('./utils').routeOrder
const Client = require('./Client')
const utils = require('./utils')

// RabbitMQ TODO make this a generic instead of hardcode
const rabbit = require('rabbot')
// automatically nack exceptions in handlers
rabbit.nackOnError()

module.exports = {

  /**
   * configure - Configure the Proxy Engine
   * @param app
   */
  configure: (app) => {
    // Load Defaults for api: crons, events, tasks
    app.api.crons = app.api.crons || {}
    app.api.events = app.api.events || {}
    app.api.tasks = app.api.tasks || {}

    const taskConfig = app.config.get('proxyEngine.tasks_config')

    // Define New properties on app
    Object.defineProperties(app, {
      proxyEngine: {
        enumerable: true,
        writable: false,
        value: {
          pubSub: pubSub,
          scheduler: schedule
        }
      },
      events: {
        enumerable: true,
        writable: false,
        value: { }
      },
      tasks: {
        enumerable: true,
        writable: false,
        value: new Client(app, rabbit, taskConfig.exchange_name)
      },
      crons: {
        enumerable: true,
        writable: false,
        value: { }
      }
    })

    // Bind the Methods
    Object.assign(app.proxyEngine, trailsCore.bindMethods(app, 'proxyEngine'))
    Object.assign(app.events, trailsCore.bindMethods(app, 'events'))
    Object.assign(app.tasks, trailsCore.bindMethods(app, 'tasks'))
    Object.assign(app.crons, trailsCore.bindMethods(app, 'crons'))

    return
  },
  /**
   *
   * @param app
   */
  streamSequelize: (app) => {
    const stream = sequelizeStream(app.orm['Event'].sequelize)
    // Make past tense
    const METHODS = {
      'create': 'created',
      'update': 'updated',
      'destroy': 'destroyed'
    }
    stream.on('data', (instance, event) => {
      if (instance && instance.$modelOptions && instance.$modelOptions.tableName !== 'event') {
        const object = instance.$modelOptions.tableName
        const data = instance.toJSON()
        const newEvent = {
          object: object,
          object_id: data.id,
          type: `${object}.${METHODS[event]}`,
          data: data
        }
        app.services.ProxyEngineService.publish(newEvent.type, newEvent, { save: instance.$modelOptions.autoSave })
      }
    })
  },
  /**
   *
   * @param app
   * @returns {Promise.<T>}
   */
  cancelPubSub: (app) => {
    app.proxyEngine.pubSub.clearAllSubscriptions()
    return Promise.resolve()
  },
  /**
   *
   * @param app
   * @returns {Promise.<T>}
   */
  cancelCrons: (app) => {
    for (const j in app.proxyEngine.scheduler.scheduledJobs){
      if (app.proxyEngine.scheduler.scheduledJobs.hasOwnProperty(j)) {
        const job = app.proxyEngine.scheduler.scheduledJobs[j]
        job.cancel()
      }
    }
    return Promise.resolve()
  },

  /**
   * addRoutes - Add the Proxy Router controller routes
   * @param app
   */
  addRoutes: (app) => {
    const prefix = _.get(app.config, 'proxyroute.prefix') || _.get(app.config, 'footprints.prefix')
    const routerUtil = app.packs.router.util
    if (prefix){
      routes.forEach(route => {
        route.path = prefix + route.path
      })
    }
    app.config.routes = routerUtil.mergeRoutes(routes, app.config.routes)
    app.config.routes.sort(routeOrder({order: 'asc'}))
    // console.log(app.config.routes)
    return Promise.resolve({})
  },
  /**
   *
   * @param app
   * @returns {Promise.<{}>}
   */
  addPolicies: (app) => {
    app.config.policies = _.merge(policies, app.config.policies)
    return Promise.resolve({})
  },

  /**
   * copyDefaults - Copies the default configuration so that it can be restored later
   * @param app
   * @returns {Promise.<{}>}
   */
  copyDefaults: (app) => {
    app.config.proxyEngineDefaults = _.clone(app.config.proxyEngine)
    return Promise.resolve({})
  },
  // /**
  //  * add Cron Jobs to Proxy Engine
  //  * @param app
  //  * @returns {Promise.<{}>}
  //  */
  addCrons: (app) => {
    // Schedule the cron jobs
    // Then, allow the profile follow it's own pattern
    Object.keys(app.crons).forEach(function(key) {
      const cron = app.crons[key]
      // Crons are now immutable
      cron.freeze()

      // Schedule the cron
      if (cron.methods && cron.methods.indexOf('schedule') > -1){
        cron.schedule()
      }

      const profile = app.config.get('proxyEngine.profile')

      if (
        app.config.proxyEngine.crons_config.profiles
        && app.config.proxyEngine.crons_config.profiles[profile]
      ) {
        app.config.proxyEngine.crons_config.profiles[profile].forEach(allowed => {
          const allowedCron = allowed.split('.')[0]
          const allowedMethod = allowed.split('.')[1]
          if (allowedCron === key && cron.methods.indexOf(allowedMethod) > -1) {
            cron[allowedMethod]()
          }
        })
      }
    })

    return
  },
  // /**
  //  * add Events to Proxy Engine
  //  * @param app
  //  * @returns {Promise.<{}>}
  //  */
  addEvents: (app) => {
    // Subscribe to Events using the Subscribe method provided in each event
    // Then, allow the profile follow it's own pattern
    Object.keys(app.events).forEach(function(key) {
      const event = app.events[key]
      if (event.methods && event.methods.indexOf('subscribe') > -1){
        event.subscribe()
      }
      // Load profile
      const profile = app.config.get('proxyEngine.profile')
      if (
        app.config.proxyEngine.events_config.profiles
        && app.config.proxyEngine.events_config.profiles[profile]
      ) {
        app.config.proxyEngine.events_config.profiles[profile].forEach(allowed => {
          const allowedEvent = allowed.split('.')[0]
          const allowedMethod = allowed.split('.')[1]
          if (
            allowedEvent === key
            && allowedMethod
            && event.methods.indexOf(allowedMethod) > -1
          ) {
            app.services.ProxyEngineService.subscribe(allowed,allowedMethod, event[allowedMethod])
          }
        })
      }
    })

    return
  },
  // /**
  //  * add Tasks to Proxy Engine
  //  * @param app
  //  * @param taskProfile
  //  * @param messenger
  //  * @returns {Promise.<{}>}
  //  */
  addTasks: (app) => {
    const taskConfig = app.config.get('proxyEngine.tasks_config')
    const taskProfile = utils.getWorkerProfile(taskConfig)
    return taskProfile
  }
}
