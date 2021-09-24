'use es6';

import Raven from 'Raven';

function captureException(err) {
  console.error(err);

  if (err.xhr || err.realXHR) {
    return;
  }

  Raven.captureException(err);
}

export default (function () {
  return function (next) {
    return function (action) {
      var type = action.type,
          payload = action.payload;

      if (type && type.indexOf('_FAILED') > 0 && payload && payload.error) {
        captureException(payload.error);
      }

      if (typeof action === 'function') {
        var promise = next(action);
        return promise && promise.catch && promise.catch(function (err) {
          captureException(err);
          throw err;
        });
      }

      try {
        return next(action);
      } catch (err) {
        captureException(err);
        throw err;
      }
    };
  };
});