'use es6';

import Raven from 'Raven';
import enviro from 'enviro';
import devLogger from 'react-utils/devLogger';
var NEW_RELIC_PAGE_ACTION_EVENT = 'FileManagerLibEvent';
var RAVEN_REQUEST_DATA_LENGTH_LIMIT = 1000;
var isDeployed = enviro.deployed('sentry') || enviro.deployed('newrelic');
var isDebug = Boolean(enviro.debug('newrelic'));
export function logNewRelicPageAction(eventName) {
  var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!(window.newrelic && window.newrelic.addPageAction)) {
    return;
  }

  if (isDebug) {
    console.log('[newrelic addPageAction]', eventName, attrs);
  }

  attrs.eventName = eventName;
  window.newrelic.addPageAction(NEW_RELIC_PAGE_ACTION_EVENT, attrs);
}
export function logNewRelicError(error) {
  var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!(window.newrelic && window.newrelic.noticeError)) {
    return;
  }

  if (isDebug) {
    console.log('[newrelic noticeError]', error, attrs);
  }

  attrs.fromFileManager = true;
  window.newrelic.noticeError(error, attrs);
}
export function reportMessage(message) {
  var extra = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  console.warn(message, extra);

  if (!isDeployed) {
    return;
  }

  Raven.captureMessage(message, {
    extra: extra
  });
  logNewRelicPageAction('log', Object.assign({}, extra, {
    message: message
  }));
}
export function reportError(err) {
  var extra = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  console.error(err);

  if (!isDeployed) {
    return;
  }

  var actionName = extra.action || extra.type || 'UNKNOWN';

  if (typeof err.status === 'number') {
    var tags = {
      status: err.status,
      errorCode: err.errorCode
    };

    if (err instanceof XMLHttpRequest) {
      var errorMessage = "Failed quickFetch request for " + actionName + " with status: " + err.status;
      logNewRelicPageAction('quickFetchFailure', Object.assign({}, extra, {}, tags, {
        isError: true
      }));
      Raven.captureMessage(errorMessage, {
        tags: tags,
        extra: extra
      });
    } else if (err.options) {
      tags = Object.assign({}, tags, {
        requestUrl: err.options.url,
        requestMethod: err.options.method
      });

      var _errorMessage = "Failed hub-http request for " + actionName + " with status: " + err.status;

      logNewRelicPageAction('hubHttpFailure', Object.assign({}, extra, {}, tags, {
        isError: true
      }));

      if (err.options.data && typeof err.options.data === 'string') {
        extra.requestBody = err.options.data.substr(0, RAVEN_REQUEST_DATA_LENGTH_LIMIT);
      }

      if (typeof err.responseText === 'string') {
        extra.responseBody = err.responseText.substr(0, RAVEN_REQUEST_DATA_LENGTH_LIMIT);
      }

      Raven.captureMessage(_errorMessage, {
        tags: tags,
        extra: extra
      });
    }

    return;
  }

  Raven.captureException(err, {
    extra: extra
  });
  logNewRelicError(err.message || 'unknown', Object.assign({}, extra, {
    isError: true
  }));
}
export function getCurrentApp() {
  return window.hubspot && window.hubspot.bender && window.hubspot.bender.currentProject;
}
export function serializeFileInfo(file) {
  return {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size
  };
}
export var logBadConversionAssetData = function logBadConversionAssetData(failureMessage) {
  var error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  devLogger.warn({
    message: "[Video HubL Tag] " + failureMessage + ". HubL tag will ignore it. " + error
  });
};