'use es6';

import { logCallingError, logSentryInfo } from 'calling-error-reporting/report/error';
export function requestFn() {
  return navigator.mediaDevices.getUserMedia({
    audio: true
  }).catch(function (error) {
    var formattedError = {
      errorMessage: 'getUserMedia failed',
      extraData: {
        error: error
      }
    };

    if (error && error.message === 'Permission denied') {
      // In this case the user chose to block access.
      logSentryInfo(formattedError);
    } else {
      logCallingError(formattedError);
    }

    throw error;
  });
}