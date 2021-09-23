'use es6';

import Raven from 'Raven';
var DEFAULT_TIMEOUT = 2000;
var MAX_RELOAD_ATTEMPTS = 10;
/**
 * Triggers window.wootric for CSAT feedbacks.
 */

export function activateWootricSurvey() {
  var currentAttempt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  if (currentAttempt >= MAX_RELOAD_ATTEMPTS) {
    return;
  }

  try {
    if (window.wootric) {
      window.wootric('run');
    } else {
      setTimeout(function () {
        return activateWootricSurvey(currentAttempt + 1);
      }, DEFAULT_TIMEOUT);
    }
  } catch (error) {
    Raven.captureException(error, {
      extra: {
        from: 'activateWootricSurvey'
      }
    });
  }
}