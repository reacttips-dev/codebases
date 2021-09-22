import Q from 'q';

import config from 'js/app/config';
import logger from 'js/app/loggerSingleton';
import persistQueryParams from 'js/lib/persistQueryParams';
import sentry from 'js/lib/sentry';

/* globals SENTRY_PUBLIC_DSN */
// This global is defined at compile time by `webpack`
if (SENTRY_PUBLIC_DSN) {
  sentry(SENTRY_PUBLIC_DSN);
}

import { isLocalStorageEnabled } from 'js/lib/envHelper';

// Not supported in SSR
if (typeof window !== 'undefined') {
  if (
    isLocalStorageEnabled() &&
    (localStorage.getItem('debug:longStackSupport') || config.environment !== 'production')
  ) {
    // do not swallow require.js thrown errors in dev mode!
    Q.longStackSupport = true;

    // Work around for chrome not printing correct stack trace
    // See https://code.google.com/p/chromium/issues/detail?id=249575 and
    // https://github.com/kriskowal/q/issues/424
    Q.onerror = function (err) {
      logger.error(err.stack);
    };
  }

  // persist these trackers across page views for tracking purposes
  persistQueryParams(window.location.href, [
    'locale',
    // Used to generate tracking calls to nanigans (paid ads service)
    'nan_pid',
  ]);
}
