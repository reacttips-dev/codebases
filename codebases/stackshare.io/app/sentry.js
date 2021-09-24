import * as Sentry from '@sentry/browser';

const ignoredErrors = [
  '$(...).select2 is not a function',
  '$(...).masonry is not a function',
  '$ is not defined',
  '$ is not a function',
  'algoliasearch is not defined',
  'trackEvent is not defined',
  'ETIMEDOUT',
  /CORS request rejected/,
  /getDefaultBasicServices/,
  /SecurityError/,
  /InvalidAccessError/
];

Sentry.init({
  dsn: 'https://39550458a8894ba4bac01efacfd2597c@o384841.ingest.sentry.io/5216762',
  environment: process.env.SENTRY_ENVIRONMENT,
  release: process.env.SENTRY_RELEASE || process.env.STACKSHARE_RELEASE || 'unknown',
  whitelistUrls: ['cdn3.stackshare.io', 'cdn4.stackshare.io'],
  ignoreErrors: ignoredErrors,
  blacklistUrls: ['/webcache.googleusercontent.com/i'],
  beforeSend(event, hint) {
    const error = hint.originalException;
    // eslint-disable-next-line no-console
    console.log('beforeSend', event, error);
    // if (error && error.message && ignoredErrors.find(e => error.message.match(e))) {
    //   console.log('ignored!', error.message);
    //   return null;
    // }
    return event;
  }
});
