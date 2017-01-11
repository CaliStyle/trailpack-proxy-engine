/* eslint new-cap: [0] */
/* eslint no-console: [0] */
'use strict'

const Model = require('trails/model')
const helpers = require('proxy-engine-helpers')
const shortid = require('shortid')

/**
 * @module Event
 * @description Event Model
 */
module.exports = class Event extends Model {

  static config (app, Sequelize) {
    let config = {}
    if (app.config.database.orm === 'sequelize') {
      config = {
        options: {
          underscored: true,
          hooks: {
            beforeCreate: (values, options, fn) => {
              // TODO make this an actual request id and not just a random generate on create
              values.request = `req_${shortid.generate()}`
              console.log(values)
              fn()
            },
            afterCreate: (values, options, fn) => {
              fn()
            }
          },
          classMethods: {
            /**
             * Associate the Model
             * @param models
             */
            // associate: (models) => {
            //
            // }
          }
        }
      }
    }
    return config
  }

  static schema (app, Sequelize) {
    let schema = {}
    if (app.config.database.orm === 'sequelize') {
      schema = {
        // The Model or object
        object: {
          type: Sequelize.STRING
        },
        // The data from populated model
        data: helpers.JSONB('event', app, Sequelize, 'data', {
          defaultValue: {}
        }),
        // The count of pending webhooks
        pending_webhooks: {
          type: Sequelize.INTEGER,
          defaultValue: 0
          // notNull: true
        },
        // The request ID
        request: {
          type: Sequelize.STRING
          // notNull: true
        },
        // The model and method used in dot notation
        type: {
          type: Sequelize.STRING
          // notNull: true
        },
        // Live Mode
        live_mode: {
          type: Sequelize.BOOLEAN,
          defaultValue: app.config.proxyEngine.live_mode
        }
      }
    }
    return schema
  }
}
