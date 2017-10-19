'use strict'

module.exports = class Event {
  constructor (app) {
    Object.defineProperties(this, {
      app: {
        enumerable: false,
        value: app
      },
      pubSub: {
        enumerable: false,
        value: app.proxyEngine.pubSub
      }
    })
  }
}
