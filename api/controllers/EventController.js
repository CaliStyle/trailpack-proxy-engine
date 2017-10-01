'use strict'

const Controller = require('trails/controller')

/**
 * @module EventController
 * @description Generated Trails.js Controller.
 */
module.exports = class EventController extends Controller {
  create(req, res) {
    //
    res.json({})
  }
  findOne(req, res) {
    //
    res.json({})
  }
  findAll(req, res) {
    const Event = this.app.orm['Event']
    const limit = Math.max(0,req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]
    const where = this.app.services.ProxyEventService.jsonCritera(req.query.where)

    Event.findAndCount({
      order: sort,
      offset: offset,
      limit: limit,
      where: where
    })
      .then(events => {
        // Paginate
        this.app.services.ProxyEngineService.paginate(res, events.count, limit, offset, sort)
        return this.app.services.ProxyPermissionsService.sanitizeResult(req, events.rows)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }
}

