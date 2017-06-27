# trailpack-proxy-engine

[![NPM version][npm-image]][npm-url]
[![Build status][ci-image]][ci-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Code Climate][codeclimate-image]][codeclimate-url]

Proxy Engine is a modern backend scaffold for progressive web applications. Built on the flexibility and speed ofenvironments](http://trailsjs.io) as a backend framework.

This node.js system is an event management system and loader engine made for plugins from your friends at [Cali Style](https://cali-style.com).

The goals of Proxy Engine is to be a free form scaffold that focuses on modern enterprise grade applications and testability. It marshals three main features:
- Events (Publish, Subscribe, ReTry)
- Tasks
- Loaders

Currently in the Proxy Cart ecosystem and actively maintained by Cali Style:
- [Proxy-Router](https://github.com/calistyle/trailpack-proxy-router) The Router with built in AAA Testing
- [Proxy-Cart](https://github.com/calistyle/trailpack-proxy-cart) A robust eCommerce Backend
  * [Proxy-Cart-Countries](https://github.com/calistyle/trailpack-proxy-cart-countries) Default Tax Rate Provider and Shipping Zones validator.
- [Proxy-CMS](https://github.com/calistyle/trailpack-proxy-cms) A robust Content Management System
- [Proxy-Analytics](https://github.com/calistyle/trailpack-proxy-analytics) A robust Analytics System
- [Proxy-Social](https://github.com/calistyle/trailpack-proxy-social) A robust Social network
- [Proxy-Permissions](https://github.com/calistyle/trailpack-proxy-permissions) A robust ERP level Permissions Systems
- [Proxy-Generics](https://github.com/calistyle/trailpack-proxy-generics) An adapter protocol for common functions
  * [Stripe.com Payment Processor](https://github.com/CaliStyle/proxy-generics-stripe)
  * [Authorize.net Payment Processor](https://github.com/CaliStyle/proxy-generics-authorize.net)
  * [GoShippo.com Shipping/Fulfillment Processor](https://github.com/CaliStyle/proxy-generics-shippo)
  * [Shipstation.com Shipping/Fulfillment Processor](https://github.com/CaliStyle/proxy-generics-shipstation)
  * [Taxjar.com Tax Processor](https://github.com/CaliStyle/proxy-generics-taxjar)
  * [Mandrill Email Provider](https://github.com/CaliStyle/proxy-generics-mandrill)
  * [Gcloud Data Store Provider](https://github.com/CaliStyle/proxy-generics-gcloud)
  * [Google Maps Geolocation Provider](https://github.com/calistyle/proxy-generics-google-maps)
  * [Cloudinary Image Provider](https://github.com/calistyle/proxy-generics-cloudinary)
  * [Render Service](https://github.com/calistyle/proxy-generics-render)

Proxy Engine's main job is a PubSub provider with persistence. Events are published and subscribers consume the events.  If the subscriber fails to consume the event, the event is persisted and tried again based on the configured schedule. By default, all database events are published, however custom events can be published and subscribed to as well.

Proxy Engine can also act as a history API. When configured, it can save every database event as well as every custom event. 

```
(TODO example)
```

## Events (Publish, Subscribe, ReTry)
Proxy Engine events are contained into __two__ base categories: Instance, Global.

### Instance Events
Instance Events are events that __only a single instance__ in a cluster must deal with. The overwhelming majority of events fall into this category. Mostly, database events, service events etc.

### Global Events
Global Events are events that __every instance__ in a cluster must respond to. Very few events fall into this category. Mostly, global settings changes, plugin updates, notifications, etc. 

Events make it easy to extend functionality without having to edit or change the core of any Proxy Engine Module.

### Subscribing to Events
Subscribe takes three arguments
* CallAgainLocation <string> - The location of the Callback function in dot notation eg. `onCustomer.created`. This is used in the event the first event fails.
* EventName <string> - The name of the event to subscribe to eg. `customer.created`
* Callback {Function (msg, data)} - The function to execute when this event happens.

Proxy Engine will automatically subscribe your events if you provide a `subscribe` method in your event handler.

```js
// api/events/onTestEvent.js

class onTestEvent extends Event {
  // This function is called during the Configuration of the trailpack
  subscribe() {
    this.app.services.ProxyEngineService.subscribe('onTestEvent.test','test', this.test)
    this.app.services.ProxyEngineService.subscribe('onTestEvent.test2','test2', this.test2)
  }

  test() {
    // This function will be run when a `test` event is published
  }
  test2() {
    // This function will be run when a `test2` event is published
  }
}
```
Alternatively, you can subscribe to an event in a service or a controller.
```js
// From some service/controller in your app
const ProxyEngineService = this.app.services.ProxyEngineService
// Create a token that you can use later.
const token = ProxyEngineService.subscribe('callAgainLocation', 'eventName', callback)
```

### Removing a subscription from an Event
```js
   // continued from above
   ProxyEngineService.unsubscribe(token)
```

### Creating Event functions
Create events in the `/api/events` directory and subscribe to them on load using `/config/events.js`

```js
// api/events/onTestEvent.js
module.exports = class onTestEvent extends Event {
  // This function is called during the Configuration of the trailpack
  subscribe() {
    this.app.services.ProxyEngineService.subscribe('onTestEvent.test','test', this.test)
    this.app.services.ProxyEngineService.subscribe('onTestEvent.test2','test2', this.test2)
  }

  test(msg, data) {
    // This function will be run when a `test` event is published
  }
  test2(msg, data) {
    // This function will be run when a `test2` event is published
  }
}
```

Events should either succeed and return a value or they should throw an error which will trigger a retry on the burn down schedule.

## Tasks
While event functions respond to events, tasks initiate functions allowed on a specific worker. A common use of a task is a micro-service or a worker environment for example, processing video or any other significant process.

### Creating Task functions
Create tasks in the `/api/tasks` directory. 

```
TODO example
```

## Crons
Crons are environment specific functions that run on a schedule. 

### Creating Crons
Create crons in the `/api/crons` directory. Crons use [node-schedule](https://www.npmjs.com/package/node-schedule) and are configured per worker profile.

```js
// api/crons/onTestCron
module.exports = class onTestCron extends Cron {
  test() {
    console.log('I have been scheduled')
    const j = this.schedule.scheduleJob('42 * * * *', () => {
      console.log('The answer to life, the universe, and everything!')
    })
  }
}
```

## Dependencies
### Supported ORMs
| Repo          |  Build Status (edge)                  |
|---------------|---------------------------------------|
| [trailpack-sequelize](https://github.com/trailsjs/trailpack-sequelize) | [![Build status][ci-sequelize-image]][ci-sequelize-url] |

### Supported Webserver
| Repo          |  Build Status (edge)                  |
|---------------|---------------------------------------|
| [trailpack-express](https://github.com/trailsjs/trailpack-express) | [![Build status][ci-express-image]][ci-express-url] |


## Install

```sh
$ npm install --save trailpack-proxy-engine
```

with yo:

```sh
$ yo trails:trailpack trailpack-proxy-engine
```

## Configure

```js
// config/main.js
module.exports = {
  packs: [
    // ... other trailpacks
    require('trailpack-proxy-engine')
    // ... other proxy-packs
  ]
}
```

```js
// config/proxyEngine.js
module.exports = {
  // If the app is in live mode
  live_mode: true,
  // If every event should be saved automatically
  auto_save: false,
  // Configure Crons
  crons_config: {
    type: 'cron',
    // The profiles that are able to run specified crons
    profiles: {
      // If the worker matches `testProfile`, then it's crons can run
      testProfile: {
        crons: ['onTestCron.test']
      },
      // If the worker matches `otherProfile`, then it's crons can run
      otherProfile: {
        crons: ['otherTestCron.test']
      }
    },
    exchange: 'my-test-exchange-name'
  },
  // Configure Events
  events_config: {
    type: 'event'
  },
  // Configure Tasks
  tasks_config: {
    type: 'task',
    // The profiles that are able to run specified tasks
    profiles: {
      // If the worker matches `testProfile`, then it's tasks can run
      testProfile: {
        tasks: ['TestTask']
      },
      // If the worker matches `otherProfile`, then it's tasks can run
      otherProfile: {
        tasks: ['OtherTestTask']
      }
    },
    exchange: 'my-test-exchange-name'
  },
  // The worker env profile for this app
  worker: 'testProfile'
}
```

## ROADMAP

[npm-image]: https://img.shields.io/npm/v/trailpack-proxy-engine.svg?style=flat-square
[npm-url]: https://npmjs.org/package/trailpack-proxy-engine
[ci-image]: https://img.shields.io/circleci/project/github/CaliStyle/trailpack-proxy-engine/nmaster.svg
[ci-url]: https://circleci.com/gh/CaliStyle/trailpack-proxy-engine/tree/master
[daviddm-image]: http://img.shields.io/david/calistyle/trailpack-proxy-engine.svg?style=flat-square
[daviddm-url]: https://david-dm.org/calistyle/trailpack-proxy-engine
[codeclimate-image]: https://img.shields.io/codeclimate/github/calistyle/trailpack-proxy-engine.svg?style=flat-square
[codeclimate-url]: https://codeclimate.com/github/calistyle/trailpack-proxy-engine

[ci-sequelize-image]: https://img.shields.io/travis/trailsjs/trailpack-sequelize/master.svg?style=flat-square
[ci-sequelize-url]: https://travis-ci.org/trailsjs/trailpack-sequelize

[ci-express-image]: https://img.shields.io/travis/trailsjs/trailpack-express/master.svg?style=flat-square
[ci-express-url]: https://travis-ci.org/trailsjs/trailpack-express
