/* eslint no-console: [0] */
'use strict'

const joi = require('joi')
const lib = require('.')

module.exports = {

  // Validate Proxy Engine Config
  validateProxyEngineConfig (config) {
    return new Promise((resolve, reject) => {
      joi.validate(config, lib.Schemas.proxyEngineConfig, (err, value) => {
        if (err) {
          return reject(new TypeError('config.proxyEngine: ' + err))
        }
        return resolve(value)
      })
    })
  }
}
