'use strict'

const Model = require('trails/model')

/**
 * @module EventItem
 * @description Event Item Join Table
 */
module.exports = class EventItem extends Model {

  static config (app, Sequelize) {
    return {
      options: {
        underscored: true
      },
      classMethods: {
        /**
         * Associate the Model
         * @param models
         */
        associate: (models) => {
          models.EventItem.belongsTo(models.Event, {

          })
        }
      }
    }
  }

  static schema (app,Sequelize) {
    return {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      event_id: {
        type: Sequelize.INTEGER,
        unique: 'event_object',
        notNull: true
      },
      object: {
        type: Sequelize.STRING,
        unique: 'event_object'
      },
      object_id: {
        type: Sequelize.INTEGER,
        unique: 'event_object',
        notNull: true,
        references: null
      }
    }
  }
}
