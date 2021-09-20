import {
    memoize
} from 'lodash'

import {
    FetchStatus
} from './fetch-status'
import logger from './logger'

export const memoizedFetch = memoize(url => {
    const cachedQuizResultState = new FetchJSONWithCache()
    cachedQuizResultState.fetch(url)
    return cachedQuizResultState
})

/**
 * Makes a single fetch attempt for a given URL and memorizes the result.
 * Provides an interface for many listeners to subscribe to the result
 * so that network isn't abused.
 *
 * ToDo:
 * - Add retry support (now a failed request will remain in such state).
 */
class FetchJSONWithCache {
    constructor() {
        this.status = FetchStatus.INITIAL
        this.value = null
        this.listeners = []
    }

    /**
     * Subscribe to a future or already happened fetch
     * result.
     *
     * Will invoke the callback with:
     * - Fetched and parsed value or null
     * - Fetch status - either FetchStatus.SUCCESS or ERROR
     *
     * @param {function} listener
     */
    subscribe(listener) {
        if (
            this.status === FetchStatus.SUCCESS ||
            this.status === FetchStatus.ERROR
        ) {
            listener(this.value, this.status)
        } else {
            this.listeners.push(listener)
        }
    }

    /**
     * Fetch the given URL with options, parse the result JSON, and store it indefinitely.
     * Invoke existent and future listeners with the results.
     *
     * @param {string} url
     * @param {object} options
     */
    fetch(url, options = {}) {
        if (this.status === FetchStatus.INITIAL) {
            this.status = FetchStatus.LOADING
            fetch(url, options)
                .then(response => response.json())
                .then(result => {
                    this.value = result
                    this.status = FetchStatus.SUCCESS
                    this._broadcast()
                })
                .catch(error => {
                    logger.error('FetchJSONWithCache Error', {
                        error,
                        url
                    })
                    this.status = FetchStatus.ERROR
                    this._broadcast()
                })
        }
    }

    _broadcast() {
        this.listeners.forEach(listener => listener(this.value, this.status))
        this.listeners = []
    }
}

export default FetchJSONWithCache