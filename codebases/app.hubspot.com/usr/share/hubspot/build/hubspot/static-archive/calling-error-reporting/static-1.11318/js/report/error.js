'use es6';

import enviro from 'enviro';
import Raven from 'Raven';
import * as eventLogger from 'customer-data-ui-utilities/eventLogging/eventLogger';
import { createClientError } from './clients/createClientError';

function _logToConsole(errorMessage) {
  var extraData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'error';

  /* eslint-disable no-console */
  if (enviro.debug('calling-widget-debug') && typeof console.group === 'function') {
    console.groupCollapsed("%c Call widget " + type + " %c", "background-color:#" + (type === 'error' ? 'c51212' : '516f90') + ";color:white;padding:.15em .25em", "color:#33475b");
    console.log("%c Message: %c" + errorMessage, 'color:#99acc2', 'color:#33475b');
    console.log("%c Extra Data: ", extraData, 'color:#99acc2', 'color:#33475b');
    console.error(extraData.error);
    console.groupEnd();
    /* eslint-enable no-console */
  }
}

export function logCallingError(_ref) {
  var errorMessage = _ref.errorMessage,
      extraData = _ref.extraData,
      tags = _ref.tags;

  _logToConsole(errorMessage, extraData);

  return eventLogger.logError({
    error: new Error("[Calling]: " + errorMessage),
    extraData: extraData,
    tags: tags
  });
}

var updateLogOptions = function updateLogOptions(options) {
  options.tags = options.tags || {};
  options.tags['communicatorType'] = 'CALL';
};

function sendToClientError(_ref2) {
  var engagementId = _ref2.engagementId,
      code = _ref2.code,
      message = _ref2.message;
  return createClientError(engagementId, code, message, 'CRM');
}

export var logSentryInfo = function logSentryInfo(options) {
  updateLogOptions(options);
  var error = options.error,
      fingerprint = options.fingerprint,
      tags = options.tags,
      extraData = options.extraData;

  _logToConsole(error && error.message, {
    error: error
  }, 'info');

  Raven.captureException(error, {
    fingerprint: fingerprint,
    tags: tags,
    extra: extraData,
    level: 'info'
  });
};
export var logError = function logError(options) {
  updateLogOptions(options);
  var error = options.error,
      extraData = options.extraData; // Send to Sentry + New Relic

  eventLogger.logError(options);
  var clientErrorPayload = {
    message: error.message
  };

  if (extraData) {
    var code = extraData.code,
        engagementId = extraData.engagementId; // message: No transport available to send or receive messages (1.9.5 error introduced)

    if (code === 31009) {
      return undefined;
    }

    Object.assign(clientErrorPayload, {
      code: code,
      engagementId: engagementId
    });
  } // Send to Twilio BE


  _logToConsole(error && error.message, {
    error: error
  });

  return sendToClientError(clientErrorPayload).catch(function (err) {
    // ignore errors if the user doesn't have calling permissions.
    if (err && err.responseJSON && err.responseJSON.message && err.responseJSON.message.includes('This app-cookie does not have proper permissions!')) {
      return;
    }

    logCallingError({
      errorMessage: 'Client Error reporting failed',
      extraData: {
        error: err
      }
    });
  });
};
export var logPageAction = function logPageAction(options) {
  updateLogOptions(options); // Send to Sentry and New Relic

  eventLogger.logPageAction(options);
};