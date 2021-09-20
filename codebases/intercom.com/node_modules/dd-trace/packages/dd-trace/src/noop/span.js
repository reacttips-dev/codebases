'use strict'

const Span = require('opentracing').Span
const NoopSpanContext = require('../noop/span_context')
const id = require('../id')

class NoopSpan extends Span {
  constructor (tracer, parent) {
    super()

    this._noopTracer = tracer
    this._noopContext = this._createContext(parent)
  }

  _context () {
    return this._noopContext
  }

  _tracer () {
    return this._noopTracer
  }

  _createContext (parent) {
    const spanId = id()

    if (parent) {
      return new NoopSpanContext({
        noop: this,
        traceId: parent._traceId,
        spanId,
        parentId: parent._spanId,
        baggageItems: Object.assign({}, parent._baggageItems)
      })
    } else {
      return new NoopSpanContext({
        noop: this,
        traceId: spanId,
        spanId
      })
    }
  }
}

module.exports = NoopSpan
