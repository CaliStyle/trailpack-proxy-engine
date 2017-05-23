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
    global.app.services.ProxyEngineService.resolveEvent(
      {
        object: 'user',
        data: {
          email: 'example@example.com'
        },
        message: 'User Created',
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
      global.app.services.ProxyEngineService.publish('test1','hello', {hello: 'world'})
      done()
    }
    catch (err) {
      done(err)
    }
  })
  it('should subscribe to an event', (done) => {
    try {
      token = global.app.services.ProxyEngineService.subscribe('test2','hello', function( msg, data ){
        // console.log('SUBSCRIBED:', msg, data)
        assert.equal(msg,'hello')
        assert.equal(data.hello, 'world')
        done()
      })
      global.app.services.ProxyEngineService.publish('hello', {hello: 'world'})
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
  it('should handle event subscription err', (done) => {
    try {
      token = global.app.services.ProxyEngineService.subscribe('test3', 'hello', function( msg, data ) {
        console.log('SUBSCRIBED:', msg, data)
        assert.equal(msg, 'hello')
        assert.equal(data.hello, 'world')
        if (msg == 'hello') {
          throw new Error('I broke')
        }
      })
      global.app.services.ProxyEngineService.publish('hello', {hello: 'world'})
      setTimeout(function(){
        done()
      }, 50)
    }
    catch (err) {
      done(err)
    }
  })
  it('should handle api.events', (done) => {
    global.app.services.ProxyEngineService.publish('test', {hello: 'world'})
    global.app.services.ProxyEngineService.publish('test2', {hello: 'world'})
    done()
  })
})
