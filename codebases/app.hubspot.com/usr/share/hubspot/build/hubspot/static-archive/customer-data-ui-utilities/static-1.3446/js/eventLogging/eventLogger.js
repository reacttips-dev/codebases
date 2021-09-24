/* eslint-disable no-console */
'use es6';

import Raven from 'Raven';
/**
 * @description
 * Utility to report errors to both Sentry and New Relic
 * This is simplified version of: https://git.hubteam.com/HubSpot/conversations-error-reporting/blob/master/static/js/error-reporting/reportError.js
 *
 * @param {Object} options
 * @param {Error} options.error Error to report
 * @param {Array} options.fingerprint Sentry error fingerprint
 * @param {Object} options.tags Tags
 * @param {String} options.level Level error (default), warning, info
 * @returns {string} Sentry event id
 */

export var logError = function logError(_ref) {
  var error = _ref.error,
      extraData = _ref.extraData,
      fingerprint = _ref.fingerprint,
      _ref$tags = _ref.tags,
      tags = _ref$tags === void 0 ? {} : _ref$tags,
      level = _ref.level;

  if (window.newrelic && window.newrelic.noticeError) {
    window.newrelic.noticeError(error, tags);
  }

  Raven.captureException(error, {
    fingerprint: fingerprint,
    tags: tags,
    extra: extraData,
    level: level
  });
  console.debug("Error reported with '" + error.message + "'", extraData);
};
/**
 * @description
 * Utility to add messages to Sentry
 *
 * @param {Object} options
 * @param {Error} options.message Message to report
 * @param {Array} options.fingerprint Sentry error fingerprint
 * @param {Object} options.tags Tags
 * @param {String} options.level Level error (default), warning, info
 */

export var logMessageToSentry = function logMessageToSentry(_ref2) {
  var message = _ref2.message,
      extraData = _ref2.extraData,
      fingerprint = _ref2.fingerprint,
      _ref2$tags = _ref2.tags,
      tags = _ref2$tags === void 0 ? {} : _ref2$tags,
      level = _ref2.level;
  Raven.captureMessage(message, {
    fingerprint: fingerprint,
    tags: tags,
    extra: extraData,
    level: level
  });
};
/**
 * @description
 * Utility to report pageActions to New Relic
 *
 * @param {Object} options
 * @param {string} options.key Key to log
 * @param {Object} options.tags Tags
 */

export function logPageAction(_ref3) {
  var key = _ref3.key,
      tags = _ref3.tags;

  if (window.newrelic && window.newrelic.addPageAction) {
    window.newrelic.addPageAction(key, tags);
  }
}