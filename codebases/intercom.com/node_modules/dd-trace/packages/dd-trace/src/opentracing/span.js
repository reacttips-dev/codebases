'use strict'

const opentracing = require('opentracing')
const Span = opentracing.Span
const SpanContext = require('./span_context')
const platform = require('../platform')
const constants = require('../constants')
const id = require('../id')
const tagger = require('../tagger')

const SAMPLE_RATE_METRIC_KEY = constants.SAMPLE_RATE_METRIC_KEY

class DatadogSpan extends Span {
  constructor (tracer, processor, sampler, prioritySampler, fields, debug) {
    super()

    const operationName = fields.operationName
    const parent = fields.parent || null
    const tags = Object.assign({
      [SAMPLE_RATE_METRIC_KEY]: sampler.rate()
    }, fields.tags)
    const hostname = fields.hostname

    this._parentTracer = tracer
    this._debug = debug
    this._sampler = sampler
    this._processor = processor
    this._prioritySampler = prioritySampler

    this._spanContext = this._createContext(parent)
    this._spanContext._name = operationName
    this._spanContext._tags = tags
    this._spanContext._hostname = hostname

    this._startTime = fields.startTime || this._getTime()

    if (debug) {
      this._handle = platform.metrics().track(this)
    }
  }

  toString () {
    const spanContext = this.context()
    const resourceName = spanContext._tags['resource.name']
    const resource = resourceName.length > 100
      ? `${resourceName.substring(0, 97)}...`
      : resourceName
    const json = JSON.stringify({
      traceId: spanContext._traceId,
      spanId: spanContext._spanId,
      parentId: spanContext._parentId,
      service: spanContext._tags['service.name'],
      name: spanContext._name,
      resource
    })

    return `Span${json}`
  }

  _createContext (parent) {
    let spanContext

    if (parent) {
      spanContext = new SpanContext({
        traceId: parent._traceId,
        spanId: id(),
        parentId: parent._spanId,
        sampling: parent._sampling,
        baggageItems: Object.assign({}, parent._baggageItems),
        trace: parent._trace
      })
    } else {
      const spanId = id()
      spanContext = new SpanContext({
        traceId: spanId,
        spanId
      })
    }

    spanContext._trace.started.push(this)
    spanContext._trace.startTime = spanContext._trace.startTime || Date.now()
    spanContext._trace.ticks = spanContext._trace.ticks || platform.now()

    return spanContext
  }

  _getTime () {
    const { startTime, ticks } = this._spanContext._trace

    return startTime + platform.now() - ticks
  }

  _context () {
    return this._spanContext
  }

  _tracer () {
    return this._parentTracer
  }

  _setOperationName (name) {
    this._spanContext._name = name
  }

  _setBaggageItem (key, value) {
    this._spanContext._baggageItems[key] = value
  }

  _getBaggageItem (key) {
    return this._spanContext._baggageItems[key]
  }

  _addTags (keyValuePairs) {
    tagger.add(this._spanContext._tags, keyValuePairs)
  }

  _finish (finishTime) {
    if (this._duration !== undefined) {
      return
    }

    finishTime = parseFloat(finishTime) || this._getTime()

    this._duration = finishTime - this._startTime
    this._spanContext._trace.finished.push(this)
    this._spanContext._isFinished = true

    if (this._debug) {
      this._handle.finish()
    }

    this._processor.process(this)
  }
}

module.exports = DatadogSpan
