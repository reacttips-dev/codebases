import * as Sentry from '@sentry/browser';

import AuthenticationService from 'services/authentication-service';

const loggingToSentry = ENV !== 'dev' && ENV !== 'test';

if (loggingToSentry) {
    Sentry.init({
        dsn: 'https://81159c9de50e4330b219b96221c6d5cd@sentry.io/4276398',
        environment: ENV,
        ignoreErrors: [/(summaries requires a JWT but none is present)/],
    });

    const userId = AuthenticationService.getCurrentUserId();

    if (userId) {
        Sentry.setUser({
            id: userId
        });
    }
}

export function reportError(error, context = {}) {
    if (loggingToSentry) {
        Sentry.withScope((scope) => {
            const {
                tags,
                extras
            } = context;
            //object of key value pairs that are searchable
            if (tags !== undefined) {
                Object.keys(tags).forEach((key) => {
                    scope.setTag(key, tags[key]);
                });
            }

            //object of key value pairs for additional information
            if (extras !== undefined) {
                Object.keys(extras).forEach((key) => {
                    scope.setExtra(extras, extras[key]);
                });
            }

            Sentry.captureException(error);
        });
    } else {
        console.error(error, context);
    }
}