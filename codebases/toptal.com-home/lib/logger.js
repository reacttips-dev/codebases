import {
    isTest
} from '@toptal/frontier'

/**
 * Creates a logger function for each level
 * @param  {String}   level The severity of the logged event
 * @return {Function}       A function that logs the event
 */
const createLogger = level => {
    /**
     * Checks if Sentry is defined and captures an event to it
     * @param  {String} message A message of the event
     * @param  {Object} extra   Extra data to be sent to Sentry
     * @return {Void}
     */
    return (message, extra) => {
        if (!sentryDefined()) {
            return false
        }

        window.Sentry.captureEvent({
            message,
            level,
            extra
        })
    }
}

const sentryDefined = () => {
    if (!window.Sentry) {
        if (!isTest) {
            // eslint-disable-next-line no-console
            console.warn('Sentry is not initialized')
        }
        return false
    }

    return true
}

export default {
    info: createLogger('info'),
    debug: createLogger('debug'),
    warning: createLogger('warning'),
    critical: createLogger('critical'),
    error: createLogger('error')
}