/* eslint-disable no-console */
import Raven from 'Raven';
import { LogLevel } from './constants/LogLevel';
import { getExtraErrorData } from './getExtraErrorData';
/**
 * @description
 * Report an error to sentry and new relic for more info on fingerprints see
 * https://blog.sentry.io/2018/01/18/setting-up-custom-fingerprints
 *
 * For help with tagging, see:
 * https://docs.sentry.io/enriching-error-data/context/?platform=javascript#tagging-events
 *
 * To enable local debugging, set the following option:
 * `localStorage.setItem('SENTRY_DEPLOYED', true);`
 *
 * Per the following Sentry issue, Sentry will automatically combine and throw out messages that
 * share similar stack traces. This makes it impossible to debug local errors since React will
 * cause errors to bubble up through `componentDidCatch` methods, forcing Sentry to effectively log
 * these errors twice. In order to work around this, building a new error in place inside the
 * `componentDidCatch` and attaching the stacktrace as a custom field of that error allows it to
 * reach Sentry.
 * https://github.com/getsentry/sentry-javascript/issues/1249
 *
 * @returns {string} Sentry event id
 */

export var reportError = function reportError(_ref) {
  var error = _ref.error,
      fingerprint = _ref.fingerprint,
      _ref$tags = _ref.tags,
      tags = _ref$tags === void 0 ? {} : _ref$tags,
      _ref$componentData = _ref.componentData,
      componentData = _ref$componentData === void 0 ? {} : _ref$componentData,
      _ref$extra = _ref.extra,
      extra = _ref$extra === void 0 ? {} : _ref$extra,
      _ref$level = _ref.level,
      level = _ref$level === void 0 ? LogLevel.error : _ref$level;
  var errorTags = Object.assign({
    // default tag values
    componentDidCatch: 'false'
  }, tags);
  var extraData = getExtraErrorData(error) || {};
  var errorContext = Object.assign({}, errorTags, {}, extraData, {}, extra);

  if (window.newrelic && window.newrelic.noticeError) {
    // note: newrelic strips any fields that don't match it's base JavaScriptError format,
    // so we need to pass extra fields as a second param
    window.newrelic.noticeError(error, errorContext);
  }

  Raven.captureException(error, {
    fingerprint: fingerprint,
    tags: errorTags,
    extra: Object.assign({
      error: errorContext,
      componentData: componentData
    }, extra),
    level: level
  });
  var lastEventId = Raven.lastEventId();
  console.error("(Event Id: " + lastEventId + ")\nError reported with '" + error.message + "'");

  if (errorContext) {
    Object.keys(errorContext).forEach(function (key) {
      if (errorContext[key]) {
        console.error("Extra Data [" + key + "]: ", errorContext[key]);
      }
    });
  }

  return lastEventId;
};