'use strict'

module.exports = class Event {
  constructor (app) {
    Object.defineProperty(this, 'app', {
      enumerable: false,
      value: app
    })
    // Object.defineProperty(this, 'subscriber', {
    //   enumerable: false,
    //   value: app.services.ProxyEngineService.subscribe
    // })
  }
}
