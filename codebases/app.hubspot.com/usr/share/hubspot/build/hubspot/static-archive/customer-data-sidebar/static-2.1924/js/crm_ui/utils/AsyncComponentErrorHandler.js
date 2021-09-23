'use es6';

import Raven from 'Raven';
import env from 'enviro';
import { CrmLogger } from 'customer-data-tracking/loggers';
export default function (chunkName) {
  return function asyncComponentErrorHandler(error) {
    var errorMessage = "Failed to load chunk " + chunkName;

    if (!env.deployed()) {
      // eslint-disable-next-line no-console
      console.warn(errorMessage); // eslint-disable-next-line no-console

      console.error(error);
      return null;
    }

    Raven.captureMessage(errorMessage, {
      extra: {
        chunkName: chunkName,
        originalError: error
      }
    });
    CrmLogger.log('debugChunkLoadIssues', {
      chunk: chunkName,
      error: error && error.message || "unknown error loading chunk " + chunkName
    });
    return null;
  };
}