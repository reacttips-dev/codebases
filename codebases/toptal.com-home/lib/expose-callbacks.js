import logger from '~/lib/logger'

class CallbacksCollection {
    _triggered = false
    _triggerArgs = []
    _callbacks = []

    push(callback) {
        if (this._triggered) {
            callback(...this._triggerArgs)
        } else {
            this._callbacks = [...this._callbacks, callback]
        }
    }

    trigger(...args) {
        if (this._triggered) {
            throw new Error('Callbacks already triggered')
        }

        this._triggered = true
        this._triggerArgs = [...args]
        this._callbacks.forEach(callback => callback(...this._triggerArgs))
    }
}

/**
 * Expose callbacks to the `window` object under the specified key.
 * @example
 * Inside the application code:
 * ```
 * const gaInstance = getGAInstance()
 * const callbacks = exposeCallbacks('_onGoogleAnalyticsReady')
 *
 * await gaInstance.waitForReadyState()
 *
 * callbacks.trigger()
 * ```
 *
 * Inside 3-rd party code (for example, Optimizely snippet):
 * ```
 * window._onGoogleAnalyticsReady = window._onGoogleAnalyticsReady || []
 * window._onGoogleAnalyticsReady.push(gaInstance => {
 *   var currentAssignment = window.optimizelyEdge.get('state').getActiveExperiments()['19543730075'].variation.name;
 *   gtag('config', 'UA-21104039-1', {dimension21: currentAssignment});
 * })
 * ```
 *
 * @param {string} name Key to be used for storing callbacks inside the `window` object
 */

export default function exposeCallbacks(name) {
    if (!window[name]) {
        window[name] = new CallbacksCollection()
    } else if (Array.isArray(window[name])) {
        const callbacks = window[name]
        window[name] = new CallbacksCollection()
        callbacks.forEach(cb => window[name].push(cb))
    } else if (!(window[name] instanceof CallbacksCollection)) {
        logger.warning(
            `Failed to expose callbacks, "${window[name]}" has unexpected type.`
        )
    }

    return window[name]
}