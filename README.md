# trailpack-proxy-engine

[![NPM version][npm-image]][npm-url]
[![Build status][ci-image]][ci-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Code Climate][codeclimate-image]][codeclimate-url]

Proxy Engine is a modern backend scaffold for progressive web applications. Built on the flexibility and speed of [Trails.js](http://trailsjs.io) as a backend framework.
This node.js system is an event management engine made for plugins from your friends at [Cali Style](https://cali-style.com).

The goals of Proxy Engine is to be a free form scaffold that focuses on modern enterprise grade applications and testability. 

Currently in the Proxy Cart ecosystem and actively maintained by Cali Style:
- [Proxy-Router](https://github.com/calistyle/trailpack-proxy-router) The Router with built in AAA Testing
- [Proxy-Cart](https://github.com/calistyle/trailpack-proxy-cart) A robust eCommerce Backend
- [Proxy-CMS](https://github.com/calistyle/trailpack-proxy-cms) A robust Content Management System
- [Proxy-Analytics](https://github.com/calistyle/trailpack-proxy-analytics) A robust Analytics System
- [Proxy-Permissions](https://github.com/calistyle/trailpack-proxy-permissions) A robust ERP level Permissions Systems
- [Proxy-Generics](https://github.com/calistyle/trailpack-proxy-generics) An adapter protocol for common functions

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

[npm-image]: https://img.shields.io/npm/v/trailpack-proxy-engine.svg?style=flat-square
[npm-url]: https://npmjs.org/package/trailpack-proxy-engine
[ci-image]: https://img.shields.io/travis/calistyle/trailpack-proxy-engine/master.svg?style=flat-square
[ci-url]: https://travis-ci.org/calistyle/trailpack-proxy-engine
[daviddm-image]: http://img.shields.io/david/calistyle/trailpack-proxy-engine.svg?style=flat-square
[daviddm-url]: https://david-dm.org/calistyle/trailpack-proxy-engine
[codeclimate-image]: https://img.shields.io/codeclimate/github/calistyle/trailpack-proxy-engine.svg?style=flat-square
[codeclimate-url]: https://codeclimate.com/github/calistyle/trailpack-proxy-engine

