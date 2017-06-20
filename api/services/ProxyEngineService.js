/* eslint no-console: [0] */
'use strict'

const Service = require('trails/service')
const _ = require('lodash')
const Errors = require('proxy-engine-errors')
const EVENT_SUBSCRIBER_STATUS = require('../utils/enums').EVENT_SUBSCRIBER_STATUS
/**
 * @module ProxyEngineService
 * @description Global Proxy Engine Service
 */
module.exports = class ProxyEngineService extends Service {
  /**
   * Internal method to retrieve model object
   * @param modelName name of the model to retrieve
   * @returns {*} sequelize model object
   */
  getModel(modelName) {
    return this.app.orm[modelName] || this.app.packs.sequelize.orm[modelName]
  }

  /**
   * Returns just the count of a model and criteria
   * @param modelName
   * @param criteria
   * @param options
   * @returns {*}
   */
  count(modelName, criteria, options) {
    const Model = this.getModel(modelName)
    const modelOptions = _.defaultsDeep({}, options, _.get(this.app.config, 'footprints.models.options'))
    if (!Model) {
      return Promise.reject(new Errors.ModelError('E_NOT_FOUND', `${modelName} can't be found`))
    }
    return Model.count(criteria, modelOptions)
  }

  /**
   * Paginate Sequelize
   * @param res
   * @param count
   * @param limit
   * @param offset
   * @param sort
   * @returns {*}
   */
  paginate(res, count, limit, offset, sort) {
    limit = parseInt(limit || 0)
    offset = parseInt(offset || 0)

    const pages = Math.ceil(count / limit) == 0 ? 1 : Math.ceil(count / limit)
    const page = Math.round(((offset + limit) / limit))
    res.set('X-Pagination-Total', count)
    res.set('X-Pagination-Pages', pages)
    res.set('X-Pagination-Page', page)
    res.set('X-Pagination-Offset', offset)
    res.set('X-Pagination-Limit', limit)
    res.set('X-Pagination-Sort', sort)

    return res
  }

  // TODO handle INSTANCE or GLOBAL events
  /**
   * Publish into proxyEngine PubSub
   * @param type
   * @param data
   * @param options
   * @returns {Promise.<T>}
   */
  publish(type, data, options) {
    // console.log('PUBLISHING', type, data)
    return new Promise((resolve, resject) => {
      const event = this.app.proxyEngine.pubSub.publish(type, data)
      // If this needs to be auto saved, save and continue immediately.
      if (this.app.config.proxyEngine.auto_save || (options && options.save)) {
        this.resolveEvent(data)
          .then(resEvent => {
            return resolve(event)
          })
          .catch(err => {
            this.app.log.debug(err)
            return resolve(event)
          })
      }
      else {
        return resolve(event)
      }
    })
  }

  /**
   * @param name
   * @param type
   * @param func
   * @returns {*}
   */
  subscribe(name, type, func){
    const self = this
    const tryCatch = function (type, data) {
      try {
        func(type, data)
      }
      catch (err){
        const event = {
          object: type.split('.')[0],
          type: type,
          data: data
        }
        return self.subscriptionFailure(event, name, err.toString())
      }
    }
    return this.app.proxyEngine.pubSub.subscribe(type, tryCatch)
  }

  /**
   *
   * @param event
   * @param name
   * @param err
   * @returns {Promise.<TResult>}
   */
  subscriptionFailure(event, name, err){
    let resEvent
    let resSubscriber
    return this.resolveEvent(event)
      .then(event => {
        resEvent = event
        return this.resolveEventSubscriber({
          event_id: resEvent.id,
          name: name,
          response: err
        })
      })
      .then(eventSubscriber => {
        resSubscriber = eventSubscriber
        return resEvent.hasSubscribers([resSubscriber])
      })
      .then((result) => {
        if (result) {
          resSubscriber.last_attempt = new Date()
          resSubscriber.status = EVENT_SUBSCRIBER_STATUS.PENDING
          return resSubscriber.increment('attempts')
        }
        else {
          return resEvent.addSubscriber(resSubscriber)
        }
      })
      .then(eventSubcriber => {
        return resSubscriber.reload()
      })
  }

  /**
   *
   * @param token
   * @returns {*}
   */
  unsubscribe(token){
    return this.app.proxyEngine.pubSub.unsubscribe(token)
  }

  /**
   *
   * @param event
   * @returns {event}
   */
  resolveEvent(event, options){
    const Event = this.getModel('Event')
    if (event instanceof Event.Instance){
      return Promise.resolve(event)
    }
    return Event.sequelize.transaction(t => {
      if (event.id) {
        return Event.findById(event.id, options)
      }
      else if (event.request && event.request !== ''){
        return Event.find({
          where: {
            request: event.request
          }
        }, options)
      }
      else if (_.isString(event) || _.isNumber(event)){
        return Event.findById(event.id, options)
      }
      else {
        return Event.create(event, options)
      }
    })
  }

  /**
   *
   * @param eventSubscriber
   * @param options
   * @returns {*}
   */
  resolveEventSubscriber(eventSubscriber, options) {
    const EventSubscriber = this.getModel('EventSubscriber')
    if (eventSubscriber instanceof EventSubscriber.Instance){
      return Promise.resolve(eventSubscriber)
    }
    return EventSubscriber.sequelize.transaction(t => {
      if (eventSubscriber.id) {
        return EventSubscriber.findById(eventSubscriber.id, options)
      }
      else if (eventSubscriber.event_id && eventSubscriber.name){
        return EventSubscriber.find({
          where: {
            event_id: eventSubscriber.event_id,
            name: eventSubscriber.name
          }
        })
          .then(resSubscriber => {
            if (!resSubscriber) {
              return EventSubscriber.create(eventSubscriber)
            }
            return resSubscriber
          })
      }
      else {
        const err = new Error('Event Subscriber not able to resolve')
        return Promise.reject(err)
      }
    })
  }

  /**
   *
   * @param event
   * @returns {*|Promise}
   */
  destroyEvent(event){
    const Event = this.getModel('Event')
    return Event.destroy({
      where: {
        id: event.id
      }
    })
  }
}

