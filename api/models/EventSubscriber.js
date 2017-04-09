'use strict'

const Model = require('trails/model')
const _ = require('lodash')
const EVENT_SUBSCRIBER_STATUS = require('../utils/enums').EVENT_SUBSCRIBER_STATUS
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
        EVENT_SUBSCRIBER_STATUS: EVENT_SUBSCRIBER_STATUS,
        /**
         * Associate the Model
         * @param models
         */
        associate: (models) => {
          models.EventSubscriber.belongsTo(models.Event, {
            // onDelete: 'CASCADE'
            // unique: 'subscriberUniqueKey'
          })
        }
      }
    }
    return config
  }

  static schema (app, Sequelize) {
    const schema = {
      // The event ID this is bound too.
      // event_id: {
      //   type: Sequelize.INTEGER,
      //   // references: {
      //   //   model: 'Event',
      //   //   key: 'id'
      //   // },
      //   unique: 'subscriberUniqueKey'
      // },
      request: {
        type: Sequelize.STRING,
        // references: {
        //   model: 'Event',
        //   key: 'request'
        // },
        unique: 'subscriberUniqueKey'
      },
      // The name of the subscriber in dot syntax eg. proxyCart.subscribers.new.customer
      name: {
        type: Sequelize.STRING,
        notNull: false,
        unique: 'subscriberUniqueKey'
      },
      // The response from the the subscriber
      response: {
        type: Sequelize.TEXT
      },
      // The amount of attempts made by the event subscriber
      attempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The last attempt timestamp for the event subscriber
      last_attempt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      // The current status of the event subscriber
      status: {
        type: Sequelize.ENUM,
        values: _.values(EVENT_SUBSCRIBER_STATUS),
        defaultValue: EVENT_SUBSCRIBER_STATUS.PENDING
      }
    }
    return schema
  }
}
