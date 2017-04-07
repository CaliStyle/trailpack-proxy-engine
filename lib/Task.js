'use strict'

module.exports = class Task {
  constructor (app) {
    Object.defineProperty(this, 'app', {
      enumerable: false,
      value: app
    })
  }
}
