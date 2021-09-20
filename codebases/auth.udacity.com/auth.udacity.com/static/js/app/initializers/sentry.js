import * as Sentry from '@sentry/browser';
import env from '../../env';

const environment = env.REACT_APP_ENV;
if (environment === 'staging' || environment === 'production') {
    Sentry.init({
        dsn: env.REACT_APP_SENTRY_DSN,
        environment,
        release: env.REACT_APP_BUILD_VERSION
    });
}