/* eslint no-console: [0] */
'use strict'

const Trailpack = require('trailpack')
const _ = require('lodash')
const lib = require('./lib')
// const utils = require('./lib/utils')
// const Client = lib.Client
// const rabbit = require('rabbot')
// automatically nack exceptions in handlers
// rabbit.nackOnError()

module.exports = class ProxyEngineTrailpack extends Trailpack {

  /**
   * Validate Configuration
   */
  validate () {
    if (!_.includes(_.keys(this.app.packs), 'express')) {
      return Promise.reject(new Error('This Trailpack currently only works for express!'))
    }

    if (!_.includes(_.keys(this.app.packs), 'proxy-sequelize')) {
      return Promise.reject(new Error('This Trailpack currently only works with trailpack-proxy-sequelize!'))
    }

    return Promise.all([
      lib.Validator.validateProxyEngineConfig(this.app.config.proxyEngine)
    ])
  }

  /**
   * Adds Routes, Policies, and Agenda
   */
  configure () {
    return Promise.all([
      lib.ProxyEngine.configure(this.app),
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
      // lib.ProxyEngine.init(this.app),
      lib.ProxyEngine.streamSequelize(this.app)
    ])
  }

  /**
   * clear subscriptions
   */
  unload() {
    return Promise.all([
      lib.ProxyEngine.cancelPubSub(this.app),
      lib.ProxyEngine.cancelCrons(this.app)
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

module.exports.Cron = lib.Cron
module.exports.Event = lib.Event
module.exports.Task = lib.Task
