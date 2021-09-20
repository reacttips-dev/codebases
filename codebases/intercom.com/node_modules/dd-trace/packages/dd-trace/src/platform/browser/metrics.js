'use strict'

// TODO: consider implementing browser metrics

let metrics = null

module.exports = function () {
  return metrics || (metrics = { // cache the metrics instance
    start: () => {},

    stop: () => {},

    track () {
      return {
        finish: () => {}
      }
    },

    boolean () {},

    histogram () {},

    count () {},

    gauge () {},

    increment () {},

    decrement () {}
  })
}
