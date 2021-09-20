'use strict'

const Tracer = require('opentracing').Tracer
const Scope = require('../scope/base')
const Span = require('./span')
const platform = require('../platform')

class NoopTracer extends Tracer {
  constructor (config) {
    super(config)

    let ScopeManager

    if (platform.env('DD_CONTEXT_PROPAGATION') === 'false') {
      ScopeManager = require('../scope/noop/scope_manager')
    } else {
      ScopeManager = require('../scope/scope_manager')
    }

    this._scopeManager = new ScopeManager()
    this._scope = new Scope(config)
    this._span = new Span(this)
  }

  trace (name, options, fn) {
    return fn(this._span, () => {})
  }

  wrap (name, options, fn) {
    return fn
  }

  scopeManager () {
    return this._scopeManager
  }

  scope () {
    return this._scope
  }

  currentSpan () {
    return null
  }

  getRumData () {
    return ''
  }

  setUrl () {
  }

  _startSpan (name, options) {
    return this._span
  }
}

module.exports = NoopTracer
