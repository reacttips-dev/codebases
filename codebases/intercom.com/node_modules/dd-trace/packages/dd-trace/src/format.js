'use strict'

const constants = require('./constants')
const tags = require('../../../ext/tags')
const log = require('./log')
const id = require('./id')

const SAMPLING_PRIORITY_KEY = constants.SAMPLING_PRIORITY_KEY
const ANALYTICS_KEY = constants.ANALYTICS_KEY
const ANALYTICS = tags.ANALYTICS
const MEASURED = tags.MEASURED
const ORIGIN_KEY = constants.ORIGIN_KEY
const HOSTNAME_KEY = constants.HOSTNAME_KEY

const map = {
  'service.name': 'service',
  'span.type': 'type',
  'resource.name': 'resource'
}

function format (span) {
  const formatted = formatSpan(span)

  extractError(formatted, span)
  extractTags(formatted, span)
  extractAnalytics(formatted, span)

  return formatted
}

function formatSpan (span) {
  const spanContext = span.context()

  return {
    trace_id: spanContext._traceId,
    span_id: spanContext._spanId,
    parent_id: spanContext._parentId || id('0'),
    name: serialize(spanContext._name),
    resource: serialize(spanContext._name),
    error: 0,
    meta: {},
    metrics: {},
    start: Math.round(span._startTime * 1e6),
    duration: Math.round(span._duration * 1e6)
  }
}

function extractTags (trace, span) {
  const context = span.context()
  const origin = context._trace.origin
  const tags = context._tags
  const hostname = context._hostname
  const priority = context._sampling.priority
  const internalErrors = span.tracer()._internalErrors

  for (const tag in tags) {
    switch (tag) {
      case 'service.name':
      case 'span.type':
      case 'resource.name':
        addTag(trace, {}, map[tag], tags[tag])
        break
      // HACK: remove when Datadog supports numeric status code
      case 'http.status_code':
        addTag(trace.meta, {}, tag, tags[tag] && String(tags[tag]))
        break
      case HOSTNAME_KEY:
      case ANALYTICS:
        break
      case MEASURED:
        addTag({}, trace.metrics, tag, tags[tag] === undefined || tags[tag] ? 1 : 0)
        break
      case 'error':
        if (tags[tag] && (tags['span.kind'] !== 'internal' || internalErrors)) {
          trace.error = 1
        }
        break
      case 'error.type':
      case 'error.msg':
      case 'error.stack':
        // HACK: remove when implemented in the backend
        if (tags['span.kind'] !== 'internal' || internalErrors) {
          trace.error = 1
        }
      default: // eslint-disable-line no-fallthrough
        addTag(trace.meta, trace.metrics, tag, tags[tag])
    }
  }

  if (span.tracer()._service === tags['service.name']) {
    addTag(trace.meta, trace.metrics, 'language', 'javascript')
  }

  addTag(trace.meta, trace.metrics, SAMPLING_PRIORITY_KEY, priority)
  addTag(trace.meta, trace.metrics, ORIGIN_KEY, origin)
  addTag(trace.meta, trace.metrics, HOSTNAME_KEY, hostname)
}

function extractError (trace, span) {
  const error = span.context()._tags['error']

  if (error instanceof Error) {
    addTag(trace.meta, trace.metrics, 'error.msg', error.message)
    addTag(trace.meta, trace.metrics, 'error.type', error.name)
    addTag(trace.meta, trace.metrics, 'error.stack', error.stack)
  }
}

function extractAnalytics (trace, span) {
  let analytics = span.context()._tags[ANALYTICS]

  if (analytics === true) {
    analytics = 1
  } else {
    analytics = parseFloat(analytics)
  }

  if (!isNaN(analytics)) {
    trace.metrics[ANALYTICS_KEY] = Math.max(Math.min(analytics, 1), 0)
  }
}

function addTag (meta, metrics, key, value, seen) {
  switch (typeof value) {
    case 'string':
      meta[key] = value
      break
    case 'number':
      if (isNaN(value)) break
      metrics[key] = value
      break
    case 'undefined':
      break
    case 'object':
      if (value === null) break

      // Special case for Node.js Buffer and URL
      if (isNodeBuffer(value) || isUrl(value)) {
        metrics[key] = value.toString()
        break
      }

      if (!Array.isArray(value)) {
        addObjectTag(meta, metrics, key, value, seen)
        break
      }

    default: // eslint-disable-line no-fallthrough
      addTag(meta, metrics, key, serialize(value))
  }
}

function addObjectTag (meta, metrics, key, value, seen) {
  seen = seen || []

  if (~seen.indexOf(value)) {
    meta[key] = '[Circular]'
    return
  }

  seen.push(value)

  for (const prop in value) {
    addTag(meta, metrics, `${key}.${prop}`, value[prop], seen)
  }

  seen.pop()
}

function serialize (obj) {
  try {
    return obj && typeof obj.toString !== 'function' ? JSON.stringify(obj) : String(obj)
  } catch (e) {
    log.error(e)
  }
}

function isNodeBuffer (obj) {
  return obj.constructor && obj.constructor.name === 'Buffer' &&
    typeof obj.readInt8 === 'function' &&
    typeof obj.toString === 'function'
}

function isUrl (obj) {
  return obj.constructor && obj.constructor.name === 'URL' &&
    typeof obj.href === 'string' &&
    typeof obj.toString === 'function'
}

module.exports = format
