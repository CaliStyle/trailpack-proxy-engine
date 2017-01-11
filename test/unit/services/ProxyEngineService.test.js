'use strict'
/* global describe, it */
const assert = require('assert')

describe('ProxyEngineService', () => {
  let eventID
  it('should exist', () => {
    assert(global.app.api.services['ProxyEngineService'])
  })
  it('should create event', (done) => {
    global.app.services.ProxyEngineService.createEvent(
      {
        object: 'user',
        data: {
          email: 'example@example.com'
        },
        type: 'user.created'
      }
    )
      .then(event => {
        // console.log(event)
        eventID = event.id
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})
