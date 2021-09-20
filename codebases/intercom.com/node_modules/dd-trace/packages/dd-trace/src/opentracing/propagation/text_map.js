'use strict'

const pick = require('lodash.pick')
const id = require('../../id')
const DatadogSpanContext = require('../span_context')
const NoopSpanContext = require('../../noop/span_context')
const log = require('../../log')

const traceKey = 'x-datadog-trace-id'
const spanKey = 'x-datadog-parent-id'
const originKey = 'x-datadog-origin'
const samplingKey = 'x-datadog-sampling-priority'
const sampleKey = 'x-datadog-sampled'
const baggagePrefix = 'ot-baggage-'
const b3TraceKey = 'x-b3-traceid'
const b3TraceExpr = /^([0-9a-f]{16}){1,2}$/i
const b3SpanKey = 'x-b3-spanid'
const b3SpanExpr = /^[0-9a-f]{16}$/i
const b3ParentKey = 'x-b3-parentspanid'
const b3SampledKey = 'x-b3-sampled'
const b3FlagsKey = 'x-b3-flags'
const b3HeaderKey = 'b3'
const b3HeaderExpr = /^(([0-9a-f]{16}){1,2}-[0-9a-f]{16}(-[01d](-[0-9a-f]{16})?)?|[01d])$/i
const baggageExpr = new RegExp(`^${baggagePrefix}(.+)$`)
const ddKeys = [traceKey, spanKey, samplingKey, originKey]
const b3Keys = [b3TraceKey, b3SpanKey, b3ParentKey, b3SampledKey, b3FlagsKey, b3HeaderKey]
const logKeys = ddKeys.concat(b3Keys)

class TextMapPropagator {
  constructor (config) {
    this._config = config
  }

  inject (spanContext, carrier) {
    carrier[traceKey] = spanContext.toTraceId()
    carrier[spanKey] = spanContext.toSpanId()
    carrier[sampleKey] = spanContext._traceFlags.sampled ? '1' : '0'

    this._injectOrigin(spanContext, carrier)
    this._injectSamplingPriority(spanContext, carrier)
    this._injectBaggageItems(spanContext, carrier)
    this._injectB3(spanContext, carrier)

    log.debug(() => `Inject into carrier: ${JSON.stringify(pick(carrier, logKeys))}.`)
  }

  extract (carrier) {
    const spanContext = this._extractSpanContext(carrier)

    if (!spanContext) return spanContext

    this._extractOrigin(carrier, spanContext)
    this._extractBaggageItems(carrier, spanContext)
    this._extractSamplingPriority(carrier, spanContext)

    log.debug(() => `Extract from carrier: ${JSON.stringify(pick(carrier, logKeys))}.`)

    return spanContext
  }

  _injectOrigin (spanContext, carrier) {
    const origin = spanContext._trace.origin

    if (origin) {
      carrier[originKey] = origin
    }
  }

  _injectSamplingPriority (spanContext, carrier) {
    const priority = spanContext._sampling.priority

    if (Number.isInteger(priority)) {
      carrier[samplingKey] = priority.toString()
    }
  }

  _injectBaggageItems (spanContext, carrier) {
    spanContext._baggageItems && Object.keys(spanContext._baggageItems).forEach(key => {
      carrier[baggagePrefix + key] = String(spanContext._baggageItems[key])
    })
  }

  _injectB3 (spanContext, carrier) {
    if (!this._config.experimental.b3) return

    carrier[b3TraceKey] = spanContext._traceId.toString('hex')
    carrier[b3SpanKey] = spanContext._spanId.toString('hex')
    carrier[b3SampledKey] = spanContext._traceFlags.sampled ? '1' : '0'

    if (spanContext._traceFlags.debug) {
      carrier[b3FlagsKey] = '1'
    }

    if (spanContext._parentId) {
      carrier[b3ParentKey] = spanContext._parentId.toString('hex')
    }
  }

  _extractSpanContext (carrier) {
    const context = this._extractContext(carrier)

    if (!context) return null

    if (context.traceFlags.sampled !== false) {
      return new DatadogSpanContext(context)
    } else {
      return new NoopSpanContext(context)
    }
  }

  _extractContext (carrier) {
    return this._extractDatadogContext(carrier) || this._extractB3Context(carrier)
  }

  _extractDatadogContext (carrier) {
    const sampled = this._isSampled(carrier[sampleKey])

    return this._extractGenericContext(carrier, traceKey, spanKey, { sampled }, 10)
  }

  _extractB3Context (carrier) {
    if (!this._config.experimental.b3) return null

    const b3 = this._extractB3Headers(carrier)
    const debug = b3[b3FlagsKey] === '1'
    const sampled = this._isSampled(b3[b3SampledKey], debug)

    return this._extractGenericContext(b3, b3TraceKey, b3SpanKey, { sampled, debug })
  }

  _extractGenericContext (carrier, traceKey, spanKey, traceFlags, radix) {
    if (carrier[traceKey] && carrier[spanKey]) {
      return {
        traceId: id(carrier[traceKey], radix),
        spanId: id(carrier[spanKey], radix),
        traceFlags
      }
    } else if (typeof traceFlags.sampled === 'boolean') {
      return {
        traceId: id(),
        spanId: null,
        traceFlags
      }
    }

    return null
  }

  _extractB3Headers (carrier) {
    if (b3HeaderExpr.test(carrier[b3HeaderKey])) {
      return this._extractB3SingleHeader(carrier)
    } else {
      return this._extractB3MultipleHeaders(carrier)
    }
  }

  _extractB3MultipleHeaders (carrier) {
    const b3 = {}

    if (b3TraceExpr.test(carrier[b3TraceKey]) && b3SpanExpr.test(carrier[b3SpanKey])) {
      b3[b3TraceKey] = carrier[b3TraceKey]
      b3[b3SpanKey] = carrier[b3SpanKey]
    }

    if (carrier[b3SampledKey]) {
      b3[b3SampledKey] = carrier[b3SampledKey]
    }

    if (carrier[b3FlagsKey]) {
      b3[b3FlagsKey] = carrier[b3FlagsKey]
    }

    return b3
  }

  _extractB3SingleHeader (carrier) {
    const parts = carrier[b3HeaderKey].split('-')

    if (parts[0] === 'd') {
      return {
        [b3SampledKey]: '1',
        [b3FlagsKey]: '1'
      }
    } else if (parts.length === 1) {
      return {
        [b3SampledKey]: parts[0]
      }
    } else {
      const b3 = {
        [b3TraceKey]: parts[0],
        [b3SpanKey]: parts[1],
        [b3SampledKey]: parts[2] !== '0' ? '1' : '0'
      }

      if (parts[2] === 'd') {
        b3[b3FlagsKey] = '1'
      }

      return b3
    }
  }

  _extractOrigin (carrier, spanContext) {
    const origin = carrier[originKey]

    if (typeof carrier[originKey] === 'string') {
      spanContext._trace.origin = origin
    }
  }

  _extractBaggageItems (carrier, spanContext) {
    Object.keys(carrier).forEach(key => {
      const match = key.match(baggageExpr)

      if (match) {
        spanContext._baggageItems[match[1]] = carrier[key]
      }
    })
  }

  _extractSamplingPriority (carrier, spanContext) {
    const priority = parseInt(carrier[samplingKey], 10)

    if (Number.isInteger(priority)) {
      spanContext._sampling.priority = parseInt(carrier[samplingKey], 10)
    }
  }

  _isSampled (sampled, debug) {
    if (debug || sampled === '1') {
      return true
    } else if (sampled === '0') {
      return false
    }

    return null
  }
}

module.exports = TextMapPropagator
