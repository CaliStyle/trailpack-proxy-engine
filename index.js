/* eslint no-console: [0] */
'use strict'

const Trailpack = require('trailpack')
const _ = require('lodash')
const lib = require('./lib')

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
    return Promise.all([
      lib.ProxyEngine.addPolicies(this.app),
      lib.ProxyEngine.addRoutes(this.app),
      lib.ProxyEngine.addAgenda(this.app),
      lib.ProxyEngine.copyDefaults(this.app)
    ])
  }

  /**
   * TODO document method
   */
  initialize () {
    return lib.ProxyEngine.stream(this.app)
  }

  constructor (app) {
    super(app, {
      config: require('./config'),
      api: require('./api'),
      pkg: require('./package')
    })
  }
}

