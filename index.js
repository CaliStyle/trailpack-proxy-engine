/* eslint no-console: [0] */
'use strict'

const Trailpack = require('trailpack')
const _ = require('lodash')
const lib = require('./lib')
const utils = require('./lib/utils')
const Client = lib.Client

module.exports = class ProxyEngineTrailpack extends Trailpack {

  /**
   * Validate Configuration
   */
  validate () {
    if (!_.includes(_.keys(this.app.packs), 'express')) {
      return Promise.reject(new Error('This Trailpack only works for express!'))
    }

    if (!_.includes(_.keys(this.app.packs), 'sequelize')) {
      return Promise.reject(new Error('This Trailpack only works for Sequelize!'))
    }
    return Promise.all([
      lib.Validator.validateProxyEngineConfig(this.app.config.proxyEngine)
    ])
  }

  /**
   * Adds Routes, Policies, and Agenda
   */
  configure () {
    let cronConfig = this.app.config.proxyEngine.crons_config
    const cronProfile = getWorkerProfile(cronConfig)

    this.app.crons = new Client(this.app, null, cronConfig.exchangeName)
    utils.registerCrons(cronProfile, this.app, null)

    let eventConfig = this.app.config.proxyEngine.events_config
    const eventProfile = getWorkerProfile(eventConfig)

    this.app.events = new Client(this.app, null, eventConfig.exchangeName)
    utils.registerEvents(eventProfile, this.app, null)

    let taskConfig = this.app.config.proxyEngine.tasks_config
    const taskProfile = getWorkerProfile(taskConfig)

    this.app.tasks = new Client(this.app, null, taskConfig.exchangeName)
    utils.registerTasks(taskProfile, this.app, null)

    this.app.api.crons = this.app.api.crons || {}
    this.app.api.events = this.app.api.events || {}
    this.app.api.tasks = this.app.api.tasks || {}

    return Promise.all([
      lib.ProxyEngine.addPolicies(this.app),
      lib.ProxyEngine.addRoutes(this.app),
      lib.ProxyEngine.copyDefaults(this.app),
      lib.ProxyEngine.addCrons(this.app),
      lib.ProxyEngine.addEvents(this.app),
      lib.ProxyEngine.addTasks(this.app)
    ])
  }

  /**
   * TODO document method
   */
  initialize () {
    return Promise.all([
      lib.ProxyEngine.init(this.app),
      lib.ProxyEngine.streamSequelize(this.app)
    ])
  }

  constructor (app) {
    super(app, {
      config: require('./config'),
      api: require('./api'),
      pkg: require('./package')
    })
  }
}


/**
 * Get the profile for the current process
 * The profile contains a list of tasks that this process can work on
 * If there is no profile (ie the current process is not a worker process), this returns undefined
 */
function getWorkerProfile(typeConfig) {
  const profileName = typeConfig.worker
  const type = typeConfig.type
  if (!profileName || !typeConfig.profiles[profileName]) {
    return { [type]: [] }
  }

  return typeConfig.profiles[profileName]
}

exports.Cron = lib.Cron
exports.Event = lib.Event
exports.Task = lib.Task
