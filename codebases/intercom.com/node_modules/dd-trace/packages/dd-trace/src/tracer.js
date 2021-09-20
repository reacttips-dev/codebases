'use strict'

const Tracer = require('./opentracing/tracer')
const tags = require('../../../ext/tags')
const scopes = require('../../../ext/scopes')
const platform = require('./platform')
const { setStartupLogConfig } = platform.startupLog

const SPAN_TYPE = tags.SPAN_TYPE
const RESOURCE_NAME = tags.RESOURCE_NAME
const SERVICE_NAME = tags.SERVICE_NAME
const ANALYTICS = tags.ANALYTICS
const NOOP = scopes.NOOP

class DatadogTracer extends Tracer {
  constructor (config) {
    super(config)

    this._scopeManager = getScopeManager(config)
    this._scope = getScope(config)
    setStartupLogConfig(config)
  }

  trace (name, options, fn) {
    options = Object.assign({}, {
      childOf: this.scope().active()
    }, options)

    if (!options.childOf && options.orphanable === false) {
      return fn(null, () => {})
    }

    const span = this.startSpan(name, options)

    addTags(span, options)

    try {
      if (fn.length > 1) {
        return this.scope().activate(span, () => fn(span, err => {
          addError(span, err)
          span.finish()
        }))
      }

      const result = this.scope().activate(span, () => fn(span))

      if (result && typeof result.then === 'function') {
        result.then(
          () => span.finish(),
          err => {
            addError(span, err)
            span.finish()
          }
        )
      } else {
        span.finish()
      }

      return result
    } catch (e) {
      addError(span, e)
      span.finish()
      throw e
    }
  }

  wrap (name, options, fn) {
    const tracer = this

    return function () {
      let optionsObj = options
      if (typeof optionsObj === 'function' && typeof fn === 'function') {
        optionsObj = optionsObj.apply(this, arguments)
      }

      if (optionsObj.orphanable === false && !tracer.scope().active()) {
        return fn.apply(this, arguments)
      }

      const lastArgId = arguments.length - 1
      const cb = arguments[lastArgId]

      if (typeof cb === 'function') {
        const scopeBoundCb = tracer.scope().bind(cb)
        return tracer.trace(name, optionsObj, (span, done) => {
          arguments[lastArgId] = function (err) {
            done(err)
            return scopeBoundCb.apply(this, arguments)
          }

          return fn.apply(this, arguments)
        })
      } else {
        return tracer.trace(name, optionsObj, () => fn.apply(this, arguments))
      }
    }
  }

  setUrl (url) {
    this._exporter.setUrl(url)
  }

  scopeManager () {
    return this._scopeManager
  }

  scope () {
    return this._scope
  }

  currentSpan () {
    return this.scope().active()
  }

  getRumData () {
    if (!this._enableGetRumData) {
      return ''
    }
    const span = this.scope().active().context()
    const traceId = span.toTraceId()
    const traceTime = Date.now()
    return `\
<meta name="dd-trace-id" content="${traceId}" />\
<meta name="dd-trace-time" content="${traceTime}" />`
  }
}

function addError (span, error) {
  if (error && error instanceof Error) {
    span.addTags({
      'error.type': error.name,
      'error.msg': error.message,
      'error.stack': error.stack
    })
  }
}

function addTags (span, options) {
  const tags = {}

  if (options.type) tags[SPAN_TYPE] = options.type
  if (options.service) tags[SERVICE_NAME] = options.service
  if (options.resource) tags[RESOURCE_NAME] = options.resource

  tags[ANALYTICS] = options.analytics

  span.addTags(tags)
}

function getScopeManager (config) {
  let ScopeManager

  if (config.scope === NOOP) {
    ScopeManager = require('./scope/noop/scope_manager')
  } else {
    ScopeManager = require('./scope/scope_manager')
  }

  return new ScopeManager()
}

function getScope (config) {
  let Scope

  if (config.scope === NOOP) {
    Scope = require('./scope/base')
  } else {
    Scope = platform.getScope(config.scope)
  }

  return new Scope(config)
}

module.exports = DatadogTracer
