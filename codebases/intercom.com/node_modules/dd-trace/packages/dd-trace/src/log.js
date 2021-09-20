'use strict'

const NoopSpan = require('./noop/span')

const _default = {
  debug: msg => console.debug(msg), /* eslint-disable-line no-console */
  info: msg => console.info(msg), /* eslint-disable-line no-console */
  warn: msg => console.warn(msg), /* eslint-disable-line no-console */
  error: msg => console.error(msg) /* eslint-disable-line no-console */
}

// based on: https://github.com/trentm/node-bunyan#levels
const _logLevels = {
  'debug': 20,
  'info': 30,
  'warn': 40,
  'error': 50
}

const _defaultLogLevel = 'debug'

const _checkLogLevel = (logLevel) => {
  if (logLevel && typeof logLevel === 'string') {
    return _logLevels[logLevel.toLowerCase().trim()] || _logLevels[_defaultLogLevel]
  }

  return _logLevels[_defaultLogLevel]
}

const memoize = func => {
  const cache = {}
  const memoized = function (key) {
    if (!cache[key]) {
      cache[key] = func.apply(this, arguments)
    }

    return cache[key]
  }

  return memoized
}

function processMsg (msg) {
  return typeof msg === 'function' ? msg() : msg
}

function withNoop (fn) {
  if (!log._tracer) {
    fn()
  } else {
    log._tracer.scope().activate(log._noopSpan(), fn)
  }
}

const log = {
  _isLogLevelEnabled (level) {
    return _logLevels[level] >= this._logLevel
  },

  use (logger) {
    if (logger && logger.debug instanceof Function && logger.error instanceof Function) {
      this._logger = logger
    }

    return this
  },

  toggle (enabled, logLevel, tracer) {
    this._enabled = enabled
    this._logLevel = _checkLogLevel(logLevel)
    this._tracer = tracer

    return this
  },

  _noopSpan () {
    if (!this.__noopSpan) {
      this.__noopSpan = new NoopSpan(this._tracer)
    }
    return this.__noopSpan
  },

  reset () {
    this._logger = _default
    this._enabled = false
    delete this._tracer
    delete this.__noopSpan
    this._deprecate = memoize((code, message) => {
      withNoop(() => this._logger.error(message))
      return this
    })
    this._logLevel = _checkLogLevel()

    return this
  },

  debug (message) {
    if (this._enabled && this._isLogLevelEnabled('debug')) {
      withNoop(() => this._logger.debug(processMsg(message)))
    }

    return this
  },

  info (message) {
    if (!this._logger.info) return this.debug(message)
    if (this._enabled && this._isLogLevelEnabled('info')) {
      withNoop(() => this._logger.info(processMsg(message)))
    }

    return this
  },

  warn (message) {
    if (!this._logger.warn) return this.debug(message)
    if (this._enabled && this._isLogLevelEnabled('warn')) {
      withNoop(() => this._logger.warn(processMsg(message)))
    }

    return this
  },

  error (err) {
    if (this._enabled && this._isLogLevelEnabled('error')) {
      if (err instanceof Function) {
        err = err()
      }

      if (typeof err !== 'object' || !err) {
        err = String(err)
      } else if (!err.stack) {
        err = String(err.message || err)
      }

      if (typeof err === 'string') {
        err = new Error(err)
      }

      withNoop(() => this._logger.error(err))
    }

    return this
  },

  deprecate (code, message) {
    return this._deprecate(code, message)
  }
}

log.reset()

module.exports = log
