'use strict'

const Span = require('opentracing').Span
const Scope = require('./scope')

let singleton = null

const span = new Span()

class ScopeManager {
  constructor () {
    if (!singleton) {
      singleton = this
    }

    return singleton
  }

  active () {
    return new Scope(span)
  }

  activate (span, finishSpanOnClose) {
    return new Scope(span, finishSpanOnClose)
  }
}

module.exports = ScopeManager
