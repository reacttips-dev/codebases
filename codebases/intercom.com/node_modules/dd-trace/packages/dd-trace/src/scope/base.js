'use strict'

class Scope {
  active () {
    return this._active() || null
  }

  activate (span, callback) {
    if (typeof callback !== 'function') return callback

    try {
      return this._activate(span, callback)
    } catch (e) {
      if (span && typeof span.setTag === 'function') {
        span.setTag('error', e)
      }

      throw e
    }
  }

  bind (target, span) {
    target = this._bindEmitter(target, span)
    target = this._bindPromise(target, span)
    target = this._bindFn(target, span)

    return target
  }

  unbind (target) {
    target = this._unbindFn(target)
    target = this._unbindPromise(target)
    target = this._unbindEmitter(target)

    return target
  }

  _active () {
    return null
  }

  _activate (span, callback) {
    return callback()
  }

  _bindFn (fn, span) {
    if (typeof fn !== 'function') return fn

    const scope = this
    const spanOrActive = this._spanOrActive(span)

    const bound = function () {
      return scope.activate(spanOrActive, () => {
        return fn.apply(this, arguments)
      })
    }

    bound._datadog_unbound = fn

    return bound
  }

  _unbindFn (fn) {
    if (typeof fn !== 'function') return fn

    return fn._datadog_unbound || fn
  }

  _bindEmitter (emitter, span) {
    if (!this._isEmitter(emitter)) return emitter
    if (!emitter.__is_dd_emitter) {
      Scope._wrapEmitter(emitter)
    }
    emitter.__dd_span = span
    emitter.__dd_scope = this
    return emitter
  }

  // Occasionally we want to wrap a prototype rather than emitter instances,
  // so we're exposing this as a static method. This gives us a faster
  // path for binding instances of known EventEmitter subclasses.
  static _wrapEmitter (emitter) {
    wrapMethod(emitter, 'addListener', wrapAddListener)
    wrapMethod(emitter, 'prependListener', wrapAddListener)
    wrapMethod(emitter, 'on', wrapAddListener)
    wrapMethod(emitter, 'once', wrapAddListener)
    wrapMethod(emitter, 'removeListener', wrapRemoveListener)
    wrapMethod(emitter, 'off', wrapRemoveListener)
    wrapMethod(emitter, 'removeAllListeners', wrapRemoveAllListeners)
    emitter.__is_dd_emitter = true
  }

  _unbindEmitter (emitter) {
    if (!this._isEmitter(emitter)) return emitter
    delete emitter.__dd_scope
    delete emitter.__dd_span
    return emitter
  }

  _bindPromise (promise, span) {
    if (!this._isPromise(promise)) return promise

    wrapMethod(promise, 'then', wrapThen, this, span)

    return promise
  }

  _unbindPromise (promise) {
    if (!this._isPromise(promise)) return promise

    promise.then = promise.then._datadog_unbound || promise.then

    return promise
  }

  _spanOrActive (span) {
    return span !== undefined ? span : this.active()
  }

  _isEmitter (emitter) {
    return emitter &&
      typeof emitter.emit === 'function' &&
      typeof emitter.on === 'function' &&
      typeof emitter.addListener === 'function' &&
      typeof emitter.removeListener === 'function'
  }

  _isPromise (promise) {
    return promise && typeof promise.then === 'function'
  }
}

function wrapThen (then, scope, span) {
  return function thenWithTrace (onFulfilled, onRejected) {
    const args = new Array(arguments.length)

    for (let i = 0, l = args.length; i < l; i++) {
      args[i] = scope.bind(arguments[i], span)
    }

    return then.apply(this, args)
  }
}

function wrapAddListener (addListener) {
  return function addListenerWithTrace (eventName, listener) {
    if (!this.__dd_scope || !listener || listener._datadog_unbound || listener.listener) {
      return addListener.apply(this, arguments)
    }
    const scope = this.__dd_scope
    const span = this.__dd_span

    const bound = scope.bind(listener, scope._spanOrActive(span))

    this._datadog_events = this._datadog_events || {}

    if (!this._datadog_events[eventName]) {
      this._datadog_events[eventName] = new WeakMap()
    }

    const events = this._datadog_events[eventName]

    if (!events.has(listener)) {
      events.set(listener, [])
    }

    events.get(listener).push(bound)

    return addListener.call(this, eventName, bound)
  }
}

function wrapRemoveListener (removeListener) {
  return function removeListenerWithTrace (eventName, listener) {
    if (!this.__dd_scope) {
      return removeListener.apply(this, arguments)
    }

    const listeners = this._datadog_events && this._datadog_events[eventName]

    if (!listener || !listeners || !listeners.has(listener)) {
      return removeListener.apply(this, arguments)
    }

    for (const bound of listeners.get(listener)) {
      removeListener.call(this, eventName, bound)
    }

    listeners.delete(listener)

    return removeListener.call(this, eventName, listener)
  }
}

function wrapRemoveAllListeners (removeAllListeners) {
  return function removeAllListenersWithTrace (eventName) {
    if (this.__dd_scope && this._datadog_events) {
      if (eventName) {
        delete this._datadog_events[eventName]
      } else {
        delete this._datadog_events
      }
    }

    return removeAllListeners.call(this, eventName)
  }
}

function wrapMethod (target, name, wrapper, ...args) {
  if (!target[name] || target[name]._datadog_unbound) return

  const original = target[name]

  target[name] = wrapper(target[name], ...args)
  target[name]._datadog_unbound = original
}

module.exports = Scope
