'use strict'
/* global describe, it */
const assert = require('assert')

describe('Cron', () => {
  it('should exist', () => {
    assert(global.app.api.crons)
    assert(global.app.crons)
  })
  it('should have the crons from profile testProfile', done => {
    assert(global.app.api.crons.onAutoTestCron)
    assert(global.app.api.crons.onTestCron)
    assert(global.app.api.crons.onNotTestCron)

    assert.equal(typeof global.app.crons.onAutoTestCron.test, 'function')
    assert.equal(typeof global.app.crons.onAutoTestCron.test2, 'function')

    assert.equal(typeof global.app.crons.onTestCron.test, 'function')
    assert.equal(typeof global.app.crons.onTestCron.test2, 'function')

    assert.equal(typeof global.app.crons.onNotTestCron.test, 'function')
    assert.equal(typeof global.app.crons.onNotTestCron.test2, 'function')

    done()
  })
})
