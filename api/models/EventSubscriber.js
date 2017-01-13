'use strict'

const Model = require('trails/model')

/**
 * @module EventSubscriber
 * @description Event Subscriber
 */
module.exports = class EventSubscriber extends Model {

  static config (app, Sequelize) {
    const config = {
      options: {
        underscored: true
      },
      classMethods: {
        /**
         * Associate the Model
         * @param models
         */
        associate: (models) => {
          models.EventSubscriber.belongsTo(models.Event, {
            // onDelete: 'CASCADE'
          })
        }
      }
    }
    return config
  }

  static schema (app, Sequelize) {
    const schema = {
      name: {
        type: Sequelize.STRING,
        notNull: false
      },
      attempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      last_attempt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    }
    return schema
  }
}
