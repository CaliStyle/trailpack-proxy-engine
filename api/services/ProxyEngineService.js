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
   *
   * @param event
   * @returns {event}
   */
  createEvent(event){
    const Event = this.getModel('Event')
    return Event.create(event)
  }
}

