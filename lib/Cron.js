/* eslint no-console: [0] */
'use strict'

const CronProxyHandler = {
  get (target, key, args) {
    const allowedMethods = target.methods ? target.methods : []
    const unallowedMethods = [
      'cancel',
      'cancelNext',
      'reschedule',
      'nextInvocation',
      'freeze',
      'unfreeze'
    ]

    if (
      target.immutable === true
      && target.timeTilStart > 0
      && allowedMethods.indexOf(key) > -1
      && unallowedMethods.indexOf(key) === -1
    ) {
      return function() {
        return setTimeout(function () {
          target.app.log.debug(`Cron ${target.name}.${key} delayed start by ${ target.timeTilStart / 1000} seconds`)
          return target[key](args)
        }, target.timeTilStart)
      }
    }
    else {
      return target[key]
    }
  }
}

module.exports = class Cron {
  constructor (app) {
    Object.defineProperties(this, {
      app: {
        enumerable: false,
        value: app
      },
      scheduler: {
        enumerable: false,
        value: app.proxyEngine.scheduler
      },
      _uptime: {
        enumerable: false,
        value: process.uptime(),
        writable: false
      },
      _uptime_delay: {
        enumerable: false,
        value: app.config.get('proxyEngine.crons_config.uptime_delay') || 0,
        writable: false
      },
      cancel: {
        enumerable: false,
        value: function(job){
          return job.cancel()
        },
        writable: true
      },
      cancelNext: {
        enumerable: false,
        value: function(job, reschedule) {
          return job.cancelNext(reschedule)
        },
        writable: true
      },
      reschedule: {
        enumerable: false,
        value: function(job, spec) {
          return job.reschedule(spec)
        },
        writable: true
      },
      nextInvocation: {
        enumerable: false,
        value: function(job) {
          return job.nextInvocation()
        },
        writable: true
      },
      immutable: {
        enumerable: false,
        value: false,
        writable: true
      },
      freeze: {
        enumerable: false,
        value: function() {
          this.immutable = true
        },
        writable: true
      },
      unfreeze: {
        enumerable: false,
        value: function() {
          this.immutable = false
        },
        writable: true
      }
    })

    return new Proxy(this, CronProxyHandler)
  }

  /**
   * Return the id of this cron
   */
  get id () {
    return this.constructor.name.replace(/(\w+)Cron/, '$1').toLowerCase()
  }

  get name() {
    return this.constructor.name
  }

  get scheduledJobs() {
    const jobs = []
    if (this.scheduler) {
      for (const j in this.scheduler.scheduledJobs){
        if (this.scheduler.scheduledJobs.hasOwnProperty(j)) {
          const job = this.scheduler.scheduledJobs[j]
          jobs.push(job)
        }
      }
    }
    return jobs
  }

  /**
   * returns milliseconds before crons are allowed to start running.
   * @returns {number}
   */
  get timeTilStart() {
    return Math.max(0, (this._uptime_delay * 1000) - (this._uptime * 1000))
  }
}
