'use strict'

const SpanContext = require('opentracing').SpanContext

class DatadogSpanContext extends SpanContext {
  constructor (props) {
    super()

    props = props || {}

    this._traceId = props.traceId
    this._spanId = props.spanId
    this._parentId = props.parentId || null
    this._name = props.name
    this._isFinished = props.isFinished || false
    this._tags = props.tags || {}
    this._sampling = props.sampling || {}
    this._baggageItems = props.baggageItems || {}
    this._traceFlags = props.traceFlags || {}
    this._traceFlags.sampled = this._traceFlags.sampled !== false
    this._traceFlags.debug = this._traceFlags.debug === true
    this._noop = props.noop || null
    this._trace = props.trace || {
      started: [],
      finished: []
    }
  }

  toTraceId () {
    return this._traceId.toString(10)
  }

  toSpanId () {
    return this._spanId.toString(10)
  }
}

module.exports = DatadogSpanContext
