/* eslint no-console: [0] */
'use strict'

const Service = require('trails/service')
const _ = require('lodash')
const Errors = require('proxy-engine-errors')
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
   * Publish into proxyEngine PubSub
   * @param type
   * @param data
   * @returns {*}
   */
  publish(type, data) {
    return this.app.proxyEngine.pubSub.publish(type, data)
  }

  /**
   *
   * @param type
   * @param func
   * @returns {*}
   */
  subscribe(name, type, func){
    const tryCatch = function (type, data) {
      try {
        func(type, data)
      }
      catch (err){
        console.log(err)
        const event = {
          object: type.split('.')[0],
          type: type,
          data: data
        }
        this.subscriptionFailure(event, name)
      }
    }
    return this.app.proxyEngine.pubSub.subscribe(type, tryCatch)
  }
  // TODO find or create event and create EventSubscriber
  subscriptionFailure(event, name){
    // return this.createEvent(event, {
    //   include
    // })
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
  createEvent(event, options){
    const Event = this.getModel('Event')
    return Event.create(event, options)
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

