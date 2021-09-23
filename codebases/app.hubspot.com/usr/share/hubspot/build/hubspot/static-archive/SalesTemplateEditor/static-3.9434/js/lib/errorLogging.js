'use es6';

import Raven from 'Raven';
export default (function (errorText) {
  return function (error) {
    if (!error || error.status === 404 || error.status === 0) {
      return;
    }

    Raven.captureMessage(errorText + " " + error.status, {
      extra: {
        err: error
      }
    });
  };
});