'use strict'

const tx = {
  // Set the outgoing host.
  setHost (span, hostname, port) {
    hostname && span.setTag('out.host', hostname)
    port && span.setTag('out.port', port)
  },

  // Wrap a promise or a callback to also finish the span.
  wrap (span, done) {
    if (typeof done === 'function' || !done) {
      return wrapCallback(span, done)
    } else if (isPromise(done)) {
      return wrapPromise(span, done)
    }
  }
}

function wrapCallback (span, callback) {
  const scope = span.tracer().scope()
  const previous = scope.active()

  return function (err) {
    finish(span, err)

    if (callback) {
      return scope.activate(previous, () => callback.apply(this, arguments))
    }
  }
}

function wrapPromise (span, promise) {
  promise.then(
    () => finish(span),
    err => finish(span, err)
  )

  return promise
}

function finish (span, error) {
  if (error) {
    span.addTags({
      'error.type': error.name,
      'error.msg': error.message,
      'error.stack': error.stack
    })
  }

  span.finish()
}

function isPromise (obj) {
  return isObject(obj) && typeof obj.then === 'function'
}

function isObject (obj) {
  return typeof obj === 'object' && obj !== null
}

module.exports = tx
