'use strict'
/* global describe, it */
const assert = require('assert')

describe('ProxyEngineService', () => {
  let eventID
  let token
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
  it('should publish an event', (done) => {
    try {
      global.app.services.ProxyEngineService.publish('hello', 'world')
      done()
    }
    catch (err) {
      done(err)
    }
  })
  it('should subscribe to an event', (done) => {
    try {
      token = global.app.services.ProxyEngineService.subscribe('hello', function( msg, data ){
        console.log('SUBSCRIBED:', msg, data)
        done()
      })
      global.app.services.ProxyEngineService.publish('hello', 'world')
    }
    catch (err) {
      done(err)
    }
  })
  it('should unsubscribe to an event', (done) => {
    try {
      global.app.services.ProxyEngineService.unsubscribe(token)
      done()
    }
    catch (err) {
      done(err)
    }
  })
})
