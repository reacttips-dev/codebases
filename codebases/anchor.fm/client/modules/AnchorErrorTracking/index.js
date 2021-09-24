import * as Sentry from '@sentry/browser';

const init = ({ commitHash, buildEnvironmentName }) => {
  if (SHOULD_INCLUDE_SENTRY) {
    Sentry.init({
      sampleRate: 0.1,
      dsn: 'https://0a700392b53f44f5acd5b0879f508c74@sentry.io/1333003',
      release: `anchor-frontend@${commitHash}-${buildEnvironmentName}`,
      environment: buildEnvironmentName,
      ignoreErrors: [
        'Unhandled rejection without Error',
        '**non-serializable**',
      ],
      beforeSend(event) {
        if (getIsValidEvent(event)) {
          const {
            exception: { values },
            request: { url },
          } = event;
          if (
            ignoreUrl(url) ||
            values.some(value => ignoreError(value.value))
          ) {
            return null;
          }
          return event;
        }
        return null;
      },
    });
  }
};

function getIsValidEvent(event) {
  return (
    event &&
    event.exception &&
    event.exception.values &&
    event.request &&
    event.request.url
  );
}

function ignoreUrl(url) {
  return url.includes('/embed');
}

function ignoreError(errorMessage) {
  if (errorMessage.includes('Loading chunk')) return true;

  // Uncomment and add any error messages to this array if we have any
  // const ignoredErrorMessages = [];
  // if (ignoredErrorMessages.includes(errorMessage)) return true;
  return false;
}

const captureException = ({ error, extraInformation = {} }) => {
  // To send additional information about an error we need to use scope.
  //   Sentry will probably have a fix for this soon:
  //
  //   Reference: https://github.com/getsentry/sentry-javascript/issues/1607
  if (error && SHOULD_INCLUDE_SENTRY) {
    Sentry.withScope(scope => {
      scope.setExtras(extraInformation);
      if (error instanceof Error) {
        Sentry.captureException(error);
      } else if (typeof errorToThrow === 'string') {
        Sentry.captureMessage(error);
      } else if (error.message && error.stacktrace) {
        Sentry.captureEvent(error);
      } else {
        Sentry.captureMessage(
          `captureException: error type (${typeof error}) not supported: ${error}`
        );
      }
    });
  }
};

const identifyUser = ({ userId }) => {
  if (SHOULD_INCLUDE_SENTRY) {
    Sentry.configureScope(scope => {
      scope.setUser({ id: userId });
    });
  }
};

const AnchorErrorTracking = {
  init,
  captureException,
  identifyUser,
};

export default AnchorErrorTracking;
