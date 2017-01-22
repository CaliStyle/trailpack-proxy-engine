/* eslint no-console: [0] */
'use strict'

const _ = require('lodash')
const sequelizeStream =  require('sequelize-stream')
const routes = require('./routes')
const policies = require('./policies')
const agenda = require('./agenda')
const pubSub = require('pubsub-js')

module.exports = {

  /**
   * init - Initialize
   * @param app
   */
  init: (app) => {
    // const proxyengine = app.services.ProxyEngineService.proxyengine
    app.proxyEngine = {}
    app.proxyEngine.pubSub = pubSub
    return
  },
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
   *
   * @param app
   * @returns {Promise.<{}>}
   */
  addAgenda: (app) => {
    if (!app.config.proxyAgenda) {
      app.config.proxyAgenda = []
    }
    app.config.proxyAgenda = _.union(agenda, app.config.proxyAgenda)
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
  }
}
