# trailpack-proxy-engine

[![NPM version][npm-image]][npm-url]
[![Build status][ci-image]][ci-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Code Climate][codeclimate-image]][codeclimate-url]

Proxy Engine is a modern backend scaffold for progressive web applications. Built on the flexability of [Trails.js](http://trailsjs.io) as a backend framework, this node.js system is an event management engine made for plugins, most notably Proxy-CMS and Proxy-Cart from your friends at [Cali Style](https://cali-style.com).

The goals of Proxy Engine is to be a free form scaffold that focuses on modern web applications and testability for enterprise grade applications. 

Currently in the Proxy Cart ecosystem:
- [Proxy-Router](https://github.com/calistyle/trailpack-proxy-router)
- [Proxy-Cart](https://github.com/calistyle/trailpack-proxy-cart)
- [Proxy-CMS](https://github.com/calistyle/trailpack-proxy-cms)


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

