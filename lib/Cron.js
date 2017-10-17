'use strict'

module.exports = class Cron {
  constructor (app) {
    Object.defineProperty(this, 'app', {
      enumerable: false,
      value: app
    })
    Object.defineProperty(this, 'scheduler', {
      enumerable: false,
      value: app.proxyEngine.scheduler
    })
  }
}
