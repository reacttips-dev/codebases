'use es6';

import { logSentryInfo } from 'calling-error-reporting/report/error';

var isFirefox = function isFirefox() {
  return window.navigator.userAgent.indexOf('Firefox') >= 0;
};

export function requestFn() {
  var permissions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : navigator.permissions;

  if (!permissions || isFirefox()) {
    return Promise.resolve('prompt');
  }

  return permissions.query({
    name: 'microphone'
  }).then(function (_ref) {
    var state = _ref.state;
    return state;
  }).catch(function (error) {
    logSentryInfo({
      error: error,
      errorMessage: 'getUserMedia failed',
      extraData: {
        error: error
      }
    });
    return 'prompt';
  });
}