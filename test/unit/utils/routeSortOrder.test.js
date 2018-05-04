'use strict'
/* global describe, it */
const assert = require('assert')
const routeOrder = require('../../../lib/utils').routeOrder

describe('Utils Route Sort Order', () => {
  it('should exist', () => {
    assert(routeOrder)
  })
  it('should sort the list', () => {
    const routes = [
      {
        path: '/a',
      },
      {
        path: '/a/:id',
      },
      {
        path: '/a/*',
      },
      {
        path: '/b',
      },
      {
        path: '/a/:id/:world',
      },
      {
        path: '/a/:id/*',
      },
      {
        path: '*',
      },
      {
        path: '/b/:id/:world',
      },
      {
        path: '/',
      },
      {
        path: '/b/:id/*',
      },
      {
        path: '/b/:id',
      },
      {
        path: '/b/*',
      }

    ]
    routes.sort(routeOrder({order: 'asc'}))

    console.log('FIXED ', routes)
  })
})
