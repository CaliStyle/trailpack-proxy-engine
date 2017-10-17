'use strict'
const joi = require('joi')

module.exports =  joi.object().keys({
  live_mode: joi.boolean().required(),
  auto_save: joi.boolean().required(),
  profile: joi.string().allow(null).required(),
  // Crons Config
  crons_config: joi.object().keys({
    profiles: joi.object().pattern(/^/,joi.array().items(joi.string().regex(/(.+)\.(.+)/)))
  }),
  // Events Config
  events_config: joi.object().keys({
    profiles: joi.object().pattern(/^/,joi.array().items(joi.string().regex(/(.+)\.(.+)/)))
  }),
  // Tasks Config
  tasks_config: joi.object().keys({
    profiles: joi.object().pattern(/^/,joi.array().items(joi.string().regex(/(.+)\.(.+)/)))
  })
})
