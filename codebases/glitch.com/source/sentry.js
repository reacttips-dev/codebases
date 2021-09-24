import * as Sentry from '@sentry/browser';

import {
    ENVIRONMENT,
    SENTRY_DSN
} from './env';

/**
 * Find every key in the event matching the given keys (including within a
 * nested object or array), and replace their values with the string
 * "[FILTERED]".
 */
export function filterKeys(event, keys) {
    const eventJSON = JSON.stringify(event);
    return JSON.parse(eventJSON, (eventKey, value) => {
        for (const key of keys) {
            // Keys are strings for direct matches, or regexes
            if ((key instanceof RegExp && eventKey.match && eventKey.match(key)) || eventKey === key) {
                return '[FILTERED]';
            }
        }

        // If the value is valid JSON, we should filter it too.
        try {
            const parsedValue = JSON.parse(value);
            if (parsedValue && typeof parsedValue === 'object') {
                const filteredValue = filterKeys(parsedValue, keys);
                return JSON.stringify(filteredValue);
            }
        } catch (err) {
            // If parsing fails, we assume it wasn't valid JSON.
        }

        return value;
    });
}

/**
 * Removes sensitive info from a Sentry event, such as passwords or tokens, as
 * well as PII, like emails.
 */
export function filterSecrets(event) {
    return filterKeys(event, ['email', 'password', /\w+Token/]);
}

/**
 * Manually sends an error to Sentry
 */
export function captureException(error, context = {}) {
    // Log to console to help development
    if (ENVIRONMENT === 'development') {
        console.group('Captured error for Sentry');
        console.error(error);
        console.groupEnd();
    }
    Sentry.withScope((scope) => {
        scope.setTags(context.tags);
        Sentry.captureException(error);
    });
}

export function initSentry() {
    try {
        if (
            SENTRY_DSN &&
            // Only collect errors from browsers that we explicitly support.
            // Err on the side of not collecting from users spoofing their useragent
            // in case they do it for privacy reasons.
            // eslint-disable-next-line no-undef
            window.navigator.userAgent.match(BROWSERSLIST_REGEX)
        ) {
            Sentry.init({
                dsn: SENTRY_DSN,
                environment: ENVIRONMENT,
                // eslint-disable-next-line no-undef
                release: `glitch-frontend@${GIT_VERSION}`,
                // eslint-disable-next-line no-useless-escape
                whitelistUrls: [/glitch\.com/, /glitch\.me/, /localhost/, /localhost\:8000/, /webpack/],
                beforeSend(event) {
                    return filterSecrets(event);
                },
            });
        }
    } catch (err) {
        // Do not hard-fail if Sentry gets messed up
        console.error('Error while setting up Sentry:');
        console.error(err);
    }
}

export function setSentryTag(tagName, value) {
    Sentry.configureScope((scope) => {
        scope.setTag(tagName, value);
    });
}