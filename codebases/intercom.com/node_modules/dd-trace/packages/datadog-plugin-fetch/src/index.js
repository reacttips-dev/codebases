'use strict'

const URL = require('url-parse')
const { Reference, REFERENCE_CHILD_OF } = require('opentracing')
const { REFERENCE_NOOP } = require('../../dd-trace/src/constants')
const tx = require('../../dd-trace/src/plugins/util/http')

function createWrapFetch (tracer, config) {
  return function wrapFetch (fetch) {
    const fetchWithTrace = function fetchWithTrace () {
      return fetch._datadog_wrapper.apply(this, arguments)
    }

    fetch._datadog_wrapper = function (resource, init) {
      const service = config.service || `${tracer._service}-http-client`
      const method = getMethod(resource, init)
      const url = getUrl(resource)
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
        init = inject(init, tracer, span, url.origin)
      }

      const promise = tracer.scope().bind(fetch, span).call(this, resource, init)

      promise.then(res => {
        span.setTag('http.status_code', res.status)
      })

      tx.wrap(span, promise)

      return promise
    }

    return fetchWithTrace
  }
}

function unwrapFetch (fetch) {
  fetch._datadog_wrapper = fetch
}

function getMethod (resource, init) {
  if (init && init.method) return init.method
  if (resource && resource.method) return resource.method

  return 'GET'
}

function getUrl (resource) {
  const url = typeof resource === 'object'
    ? resource.url
    : resource

  return new URL(url, window.location.origin)
}

function inject (init, tracer, span, origin) {
  const format = window.ddtrace.ext.formats.HTTP_HEADERS
  const peers = tracer._peers

  if (origin !== window.location.origin && !tx.isPeer(origin, peers)) {
    return init
  }

  init = init || {}
  init.headers = init.headers || {}

  if (typeof init.headers.set === 'function') {
    const headers = {}

    tracer.inject(span, format, headers)

    for (const name in headers) {
      init.headers.set(name, headers[name])
    }
  } else {
    tracer.inject(span, format, init.headers)
  }

  return init
}

// TODO: support staging and other environments
function isFlush (href, url) {
  return (new RegExp(`^${href}/v1/input/[a-z0-9]+$`, 'i')).test(url.href) ||
    url.href.startsWith('https://rum-http-intake.logs.datadoghq.com') ||
    url.href.startsWith('https://browser-http-intake.logs.datadoghq.com')
}

module.exports = {
  name: 'fetch',
  patch (fetch, tracer, config) {
    return createWrapFetch(tracer, config)(fetch)
  },

  unpatch (fetch) {
    unwrapFetch(fetch)
  }
}
