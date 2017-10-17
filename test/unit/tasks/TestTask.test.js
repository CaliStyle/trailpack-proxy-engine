'use strict'
/* global describe, it */
const assert = require('assert')

describe('Task', () => {
  it('should exist', () => {
    assert(global.app.api.tasks)
    assert(global.app.tasks)
  })
})
