'use strict'
/* global describe, it */
const assert = require('assert')

describe('ProxyEngineService', () => {
  it('should exist', () => {
    assert(global.app.api.services['ProxyEngineService'])
  })
})
