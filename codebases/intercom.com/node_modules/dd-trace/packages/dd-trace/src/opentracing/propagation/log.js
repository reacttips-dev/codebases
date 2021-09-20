'use strict'

const id = require('../../id')
const DatadogSpanContext = require('../span_context')

class LogPropagator {
  constructor (config) {
    this._config = config
  }

  inject (spanContext, carrier) {
    if (!carrier) return

    carrier.dd = {}

    if (spanContext) {
      carrier.dd.trace_id = spanContext.toTraceId()
      carrier.dd.span_id = spanContext.toSpanId()
    }

    if (this._config.service) carrier.dd.service = this._config.service
    if (this._config.version) carrier.dd.version = this._config.version
    if (this._config.env) carrier.dd.env = this._config.env
  }

  extract (carrier) {
    if (!carrier || !carrier.dd || !carrier.dd.trace_id || !carrier.dd.span_id) {
      return null
    }

    const spanContext = new DatadogSpanContext({
      traceId: id(carrier.dd.trace_id, 10),
      spanId: id(carrier.dd.span_id, 10)
    })

    return spanContext
  }
}

module.exports = LogPropagator
