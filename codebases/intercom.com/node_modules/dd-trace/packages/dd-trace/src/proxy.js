'use strict'

const BaseTracer = require('opentracing').Tracer
const NoopTracer = require('./noop/tracer')
const DatadogTracer = require('./tracer')
const Config = require('./config')
const Instrumenter = require('./instrumenter')
const platform = require('./platform')
const log = require('./log')
const { setStartupLogInstrumenter } = platform.startupLog
const analyticsSampler = require('./analytics_sampler')

const noop = new NoopTracer()

class Tracer extends BaseTracer {
  constructor () {
    super()
    this._tracer = noop
    this._instrumenter = new Instrumenter(this)
    this._deprecate = method => log.deprecate(`tracer.${method}`, [
      `tracer.${method}() is deprecated.`,
      'Please use tracer.startSpan() and tracer.scope() instead.',
      'See: https://datadog.github.io/dd-trace-js/#manual-instrumentation.'
    ].join(' '))
  }

  init (options) {
    if (this._tracer === noop) {
      try {
        const config = new Config(options)

        log.use(config.logger)
        log.toggle(config.debug, config.logLevel, this)

        platform.configure(config)
        platform.profiler().start()

        if (config.enabled) {
          platform.validate()

          if (config.runtimeMetrics) {
            platform.metrics().start()
          }

          if (config.analytics) {
            analyticsSampler.enable()
          }

          this._tracer = new DatadogTracer(config)
          this._instrumenter.enable(config)
          setStartupLogInstrumenter(this._instrumenter)
        }
      } catch (e) {
        log.error(e)
      }
    }

    return this
  }

  use () {
    this._instrumenter.use.apply(this._instrumenter, arguments)
    return this
  }

  trace (name, options, fn) {
    if (!fn) {
      fn = options
      options = {}
    }

    if (typeof fn !== 'function') return

    options = options || {}

    return this._tracer.trace(name, options, fn)
  }

  wrap (name, options, fn) {
    if (!fn) {
      fn = options
      options = {}
    }

    if (typeof fn !== 'function') return fn

    options = options || {}

    return this._tracer.wrap(name, options, fn)
  }

  setUrl () {
    this._tracer.setUrl.apply(this._tracer, arguments)
    return this
  }

  startSpan () {
    return this._tracer.startSpan.apply(this._tracer, arguments)
  }

  inject () {
    return this._tracer.inject.apply(this._tracer, arguments)
  }

  extract () {
    return this._tracer.extract.apply(this._tracer, arguments)
  }

  scopeManager () {
    this._deprecate('scopeManager')
    return this._tracer.scopeManager.apply(this._tracer, arguments)
  }

  scope () {
    return this._tracer.scope.apply(this._tracer, arguments)
  }

  currentSpan () {
    this._deprecate('currentSpan')
    return this._tracer.currentSpan.apply(this._tracer, arguments)
  }

  bind (callback) {
    this._deprecate('bind')
    return callback
  }

  bindEmitter () {
    this._deprecate('bindEmitter')
  }

  getRumData () {
    return this._tracer.getRumData.apply(this._tracer, arguments)
  }
}

module.exports = Tracer
