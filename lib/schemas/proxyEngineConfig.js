'use strict'
const joi = require('joi')

module.exports =  joi.object().keys({
  live_mode: joi.boolean(),
  auto_save: joi.boolean(),
  crons_config: joi.object().keys({
    type: joi.string(),
    profiles: joi.object(),
    exchange: joi.string()
  }),
  events_config: joi.object().keys({
    type: joi.string(),
    profiles: joi.object(),
    exchange: joi.string()
  }),
  tasks_config: joi.object().keys({
    type: joi.string(),
    profiles: joi.object(),
    exchange: joi.string()
  }),
  worker: joi.string()
})
