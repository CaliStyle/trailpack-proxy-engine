'use strict'
const joi = require('joi')
module.exports = [
  {
    method: ['GET'],
    path: '/events',
    handler: 'EventController.findAll',
    config: {
      validate: {
        query: {
          offset: joi.number(),
          limit: joi.number(),
          sort: joi.string(),
          where: joi.object()
        }
      },
      app: {
        proxyRouter: {
          ignore: true
        },
        proxyPermissions: {
          resource_name: 'apiGetEventsRoute',
          roles: ['admin']
        }
      }
    }
  },
  {
    method: ['POST'],
    path: '/event',
    handler: 'EventController.create',
    config: {
      app: {
        proxyRouter: {
          ignore: true
        },
        proxyPermissions: {
          resource_name: 'apiPostEventRoute',
          roles: ['admin']
        }
      }
    }
  },
  {
    method: ['GET'],
    path: '/event/:id',
    handler: 'EventController.findOne',
    config: {
      validate: {
        params: {
          id: joi.string().required()
        }
      },
      app: {
        proxyRouter: {
          ignore: true
        },
        proxyPermissions: {
          resource_name: 'apiGetEventIdRoute',
          roles: ['admin']
        }
      }
    }
  },
]
