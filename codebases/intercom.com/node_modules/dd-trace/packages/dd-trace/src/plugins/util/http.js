'use strict'

const tx = require('./tx')

const http = {
  isPeer (origin, peers) {
    if (!origin) return false

    for (const peer of peers) {
      if (origin === peer) return true
      if (peer instanceof RegExp && peer.test(origin)) return true
    }

    return false
  }
}

module.exports = Object.assign({}, tx, http)
