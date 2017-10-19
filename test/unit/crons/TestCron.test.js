'use strict'
/* global describe, it */
const assert = require('assert')
const _ = require('lodash')

describe('Cron', () => {
  it('should exist', () => {
    assert(global.app.api.crons)
    assert(global.app.crons)
  })
  it('should have the crons from profile testProfile', done => {
    assert(global.app.api.crons.onAutoTestCron)
    assert.equal(global.app.crons.onAutoTestCron.id, 'onautotest')
    assert.equal(_.isNumber(global.app.crons.onAutoTestCron.timeTilStart), true)
    assert(global.app.api.crons.onTestCron)
    assert.equal(global.app.crons.onTestCron.id, 'ontest')
    assert.equal(_.isNumber(global.app.crons.onTestCron.timeTilStart), true)
    assert(global.app.api.crons.onNotTestCron)
    assert.equal(global.app.crons.onNotTestCron.id, 'onnottest')
    assert.equal(_.isNumber(global.app.crons.onNotTestCron.timeTilStart), true)

    assert.equal(typeof global.app.crons.onAutoTestCron.test, 'function')

    assert.equal(typeof global.app.crons.onAutoTestCron.test2, 'function')

    assert.equal(typeof global.app.crons.onTestCron.test, 'function')
    assert.equal(typeof global.app.crons.onTestCron.test2, 'function')

    assert.equal(typeof global.app.crons.onNotTestCron.test, 'function')
    assert.equal(typeof global.app.crons.onNotTestCron.test2, 'function')

    done()
  })
  it('should get time remaining until start', done => {
    if (global.app.crons.onAutoTestCron.timeTilStart > 0) {
      assert.equal(global.app.crons.onAutoTestCron.scheduledJobs.length, 0)
    }
    else {
      assert.notEqual(global.app.crons.onAutoTestCron.scheduledJobs.length, 0)
    }
    done()
  })
})
