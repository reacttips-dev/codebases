'use strict'

const URL = require('url-parse')
const { Reference, REFERENCE_CHILD_OF } = require('opentracing')
const { REFERENCE_NOOP } = require('../../dd-trace/src/constants')
const tx = require('../../dd-trace/src/plugins/util/http')

function createWrapOpen (tracer) {
  return function wrapOpen (open) {
    return function openWithTrace (method, url) {
      this._datadog_method = method
      this._datadog_url = new URL(url, window.location.origin)

      return open.apply(this, arguments)
    }
  }
}

function createWrapSend (tracer, config) {
  return function wrapSend (send) {
    return function sendWithTrace (body) {
      const service = config.service || `${tracer._service}-http-client`
      const method = this._datadog_method
      const url = this._datadog_url
      const scope = tracer.scope()
      const childOf = scope.active()
      const type = isFlush(tracer._url.href, url) ? REFERENCE_NOOP : REFERENCE_CHILD_OF
      const span = tracer.startSpan('browser.request', {
        references: [
          new Reference(type, childOf)
        ],
        tags: {
          'span.kind': 'client',
          'service.name': service,
          'resource.name': method,
          'span.type': 'http',
          'http.method': method,
          'http.url': url.href
        }
      })

      // HACK: move to backend
      span.setTag('_top_level', 1)

      if (type === REFERENCE_CHILD_OF) {
        inject(this, tracer, span)
      }

      this.addEventListener('error', e => span.setTag('error', e))
      this.addEventListener('load', () => span.setTag('http.status', this.status))
      this.addEventListener('loadend', () => span.finish())

      try {
        return tracer.scope().bind(send, span).apply(this, arguments)
      } catch (e) {
        span.setTag('error', e)
        span.finish()

        throw e
      }
    }
  }
}

function inject (xhr, tracer, span) {
  const format = window.ddtrace.ext.formats.HTTP_HEADERS
  const headers = {}
  const origin = xhr._datadog_url.origin
  const peers = tracer._peers

  if (origin !== window.location.origin && !tx.isPeer(origin, peers)) return

  tracer.inject(span, format, headers)

  for (const name in headers) {
    xhr.setRequestHeader(name, headers[name])
  }
}

// TODO: support staging and other environments
function isFlush (href, url) {
  return (new RegExp(`^${href}/v1/input/[a-z0-9]+$`, 'i')).test(url.href) ||
    url.href.startsWith('https://rum-http-intake.logs.datadoghq.com') ||
    url.href.startsWith('https://browser-http-intake.logs.datadoghq.com')
}

module.exports = {
  name: 'XMLHttpRequest',
  patch (XMLHttpRequest, tracer, config) {
    this.wrap(XMLHttpRequest.prototype, 'open', createWrapOpen(tracer, config))
    this.wrap(XMLHttpRequest.prototype, 'send', createWrapSend(tracer, config))
  },

  unpatch (XMLHttpRequest) {
    this.unwrap(XMLHttpRequest.prototype, 'open')
    this.unwrap(XMLHttpRequest.prototype, 'send')
  }
}
