/* eslint no-console: [0] */
'use strict'
// const path = require('path')
// const _ = require('lodash')

exports.registerTasks = function(profile, app, messenger) {
  //
}

exports.registerCrons = function(profile, app, messenger) {
  //
}

exports.registerEvents = function(profile, app, messenger) {
  //
}

function createSpecificityComparator(options) {
  options = options || {}
  // Ascending order flag, defaults to false
  let asc = false
  if (options.order && options.order === 'asc') {
    asc = true
  }
  // Bit misleading: here we mean that the default route is ''
  const defaultRoute = options.default || ''

  return function specificityComparator(routeA, routeB) {
    routeA = (routeA.path || '').toLowerCase()
    routeB = (routeB.path || '').toLowerCase()
    // If it's the default route, push it all the way
    // over to one of the ends
    if (routeA === defaultRoute) {
      return asc ? 1 : -1
      // Also push index route down to end, but not past the default
    }
    else if (/^\/$/.test(routeA) && routeB !== defaultRoute) {
      return asc ? 1 : -1
      // Otherwise, sort based on either depth or free variable priority
    }
    else {
      const slicedA = routeA.split('/') // path.normalize('/' + routeA + '/').split('/').join('/')
      const slicedB = routeB.split('/') // path.normalize('/' + routeB + '/').split('/').join('/')
      const joinedA = slicedA.join('')
      const joinedB = slicedB.join('')
      const depthA = optionalParts(slicedA)
      const depthB = optionalParts(slicedB)

      // let status = 0
      // slicedA.forEach(slice, index => {
      //   if (slicedA[index] === slicedB[index]) {
      //
      //   }
      //   else{
      //
      //   }
      // })
      // return status
      // If the start is already alphabetical different
      if (slicedA[1] > slicedB[1]) {
        return asc ? 1 : -1
      }
      if (slicedA[1] < slicedB[1]) {
        return asc ? -1 : 1
      }
      // If the start is alphabetically the same
      if (slicedA[1] === slicedB[1]) {
        // If one has more url parts
        if (depthA > depthB) {
          return asc ? 1 : -1
        }
        if (depthA < depthB) {
          return asc ? -1 : 1
        }
        // They the have the same amount of url parts
        if (depthA === depthB) {
          const weightA = freeVariableWeight(joinedA)
          const weightB = freeVariableWeight(joinedB)

          if (weightA > weightB) {
            return asc ? -1 : 1
          }
          if (weightA < weightB) {
            return asc ? 1 : -1
          }
          // They have the same weighted score
          if (weightA === weightB) {
            if (joinedA > joinedB) {
              return asc ? 1 : -1
            }
            if (joinedA < joinedB) {
              return asc ? -1 : 1
            }
          }
        }
      }
    }
    return 0
  }
}

/**
 * Takes a sliced path and returns an integer representing the
 * "weight" of its free variables. More specific routes are heavier
 *
 * Intuitively: when a free variable is at the base of a path e.g.
 * '/:resource', this is more generic than '/resourceName/:id' and thus has
 * a lower weight
 *
 * Weight can only be used to compare paths of the same depth
 */
function freeVariableWeight(sliced) {
  const colMatches = sliced.match(/(:|\{)/gm)
  const optionalMatches = sliced.match(/(\?\})/gm)
  const col = colMatches ? colMatches.length : 0
  const optional = optionalMatches ? optionalMatches.length : 0
  return col - optional
}

function optionalParts(sliced) {
  let count = 0
  sliced.forEach(slice => {
    if (!/\{.*\?\}$/.test(slice)) {
      count = count + 1
    }
    else {
      // count = count 
    }
  })
  return count
}

exports.routeOrder = createSpecificityComparator
