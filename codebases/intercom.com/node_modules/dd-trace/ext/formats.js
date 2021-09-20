'use strict'

const opentracing = require('opentracing')

module.exports = {
  TEXT_MAP: opentracing.FORMAT_TEXT_MAP,
  HTTP_HEADERS: opentracing.FORMAT_HTTP_HEADERS,
  BINARY: opentracing.FORMAT_BINARY,
  LOG: 'log'
}
