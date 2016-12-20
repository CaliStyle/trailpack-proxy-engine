/* eslint new-cap: [0] */
'use strict'

const Model = require('trails/model')
const helpers = require('proxy-engine-helpers')
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
        object: {
          type: Sequelize.STRING
        },
        data: helpers.JSONB('event', app, Sequelize, 'data', {
          defaultValue: {}
        })
      }
    }
    return schema
  }
}
