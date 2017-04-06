/* eslint new-cap: [0]*/
'use strict'

const _ = require('lodash')
const smokesignals = require('smokesignals')
const fs = require('fs')
const Model = require('trails/model')
// const lib = require('../lib')

const packs = [
  require('trailpack-router'),
  require('../') // trailpack-proxy-engine
]


const SERVER = process.env.SERVER || 'express'
const ORM = process.env.ORM || 'sequelize'
let web = {}

const stores = {
  sqlitedev: {
    adapter: require('sails-disk')
  }
}

if (ORM === 'waterline') {
  packs.push(require('trailpack-waterline'))
}
else if (ORM === 'sequelize') {
  packs.push(require('trailpack-sequelize'))
  stores.sqlitedev = {
    database: 'ProxyEngine',
    storage: './test/test.sqlite',
    host: '127.0.0.1',
    dialect: 'sqlite'
  }
}

if ( SERVER == 'express' ) {
  packs.push(require('trailpack-express'))
  web = {
    express: require('express'),
    middlewares: {
      order: [
        'static',
        'addMethods',
        'cookieParser',
        'session',
        'bodyParser',
        'passportInit',
        'passportSession',
        'methodOverride',
        'router',
        'www',
        '404',
        '500'
      ],
      static: require('express').static('test/static')
    }
  }
}

const App = {
  api: {
    models: {
      Event: require('../api/models/Event'),
      Item: class Item extends Model {
        static config(app, Sequelize) {
          return {
            options: {}
          }
        }
        static schema(app, Sequelize) {
          return {
            name: {
              type: Sequelize.STRING,
              allowNull: false
            }
          }
        }
      }
    },
    services: require('../api/services')
  },
  pkg: {
    name: 'trailpack-proxy-engine-test',
    version: '1.0.0'
  },
  config: {
    database: {
      stores: stores,
      models: {
        defaultStore: 'sqlitedev',
        migrate: 'drop'
      }
    },
    routes: [],
    main: {
      packs: packs
    },
    policies: {

    },
    log: {
      logger: new smokesignals.Logger('debug')
    },
    web: web,
    // Proxy Generics
    proxyGenerics: {},
    proxyEngine: {
      live_mode: true,
      auto_save: false,

      crons_config: {
        type: 'cron',
        profiles: {
          testProfile: {
            tasks: ['TestCron']
          },
          otherProfile: {
            tasks: ['OtherTestTask']
          }
        },
        exchange: 'my-test-exchange-name'
      },
      events_config: {
        type: 'event'
      },
      tasks_config: {
        type: 'task'
      },
      worker: 'testProfile'
    }
  }
}
const dbPath = __dirname + './test.sqlite'
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath)
}

_.defaultsDeep(App, smokesignals.FailsafeConfig)
module.exports = App
