/* eslint no-console: [0] */
'use strict'

const Event = require('../../').Event
/**
 * @module ProxyEngineService
 * @description Global Proxy Engine Service
 */
module.exports = class onTestEvent extends Event {
  constructor(app) {
    super(app)
    // console.log('I started')
    this.test()
  }
  test() {
    // console.log('I WAS TESTED')
    console.log('I WAS TESTED',!!this.app)
  }
}
