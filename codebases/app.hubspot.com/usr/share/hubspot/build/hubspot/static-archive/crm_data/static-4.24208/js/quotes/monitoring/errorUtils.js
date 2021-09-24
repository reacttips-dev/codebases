'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import Raven from 'Raven';
import { getExtraErrorData } from './getExtraErrorData';
import enviro from 'enviro';
var CPQ_FE = 'cpqFe'; // Copied from https://git.hubteam.com/HubSpot/growth-onboarding-reliability/blob/85385d9c1f7a8c3c36009135d8dd4099c36b0e3b/growth-onboarding-reliability/static/js/utils/raven.js
// Network errors to isolate into groups regardless of URL

var ISOLATED_NETWORK_CODES = ['ABORT', 'NETWORKERROR', 'TIMEOUT', '0', '401', '500', '502']; // taken from https://stackoverflow.com/a/3809435
// eslint-disable-next-line no-useless-escape

var uriRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/; // removes portalId or quote publicUrlKey from URL

export function stripPortalIdOrKey() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var portalIdOrKeyRegex = new RegExp(/\/[0-9]+/, 'g');
  return str.replace(portalIdOrKeyRegex, '/<portal_id_or_key>');
}

function stripQueryParams() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return url.replace(/\?.*$/, '');
}

export function cleanseUrl() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return stripPortalIdOrKey(stripQueryParams(url));
}

function splitIntoLines() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return str.split(/\r?\n/g);
}

function containsUri() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return uriRegex.test(str);
}

function parseUri() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var matches = uriRegex.exec(str);
  return matches && matches[0];
} // taken from https://stackoverflow.com/a/1981366


function stripRepeatedWhitespace() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return str.replace(/\s\s+/g, ' ');
}
/**
 * We want to avoid having multiple sentries for the same error but we still want to track it.
 * The problem is that every request has the portalId in the query string, which results in a
 * different error message, thus a different error.
 * What we are doing here is manually capturing an error with Sentry and adding a fingerprint.
 * Sentry will group all the errors with the same fingerprint regardless of the actual error.
 * The fingerprint for each error network is:
 * url (without query string) + request verb + response status code
 */


export function catchAndRethrowNetworkError(error) {
  var code = error.errorCode || error.status;

  if (code && error.options && error.options.url) {
    var cleansedUrl = cleanseUrl(error.options.url);
    var method = error.options.method;
    var envPrefix = enviro.isQa() ? 'QA: ' : '';
    var message = "" + envPrefix + method + " " + code + ": " + cleansedUrl;
    Raven.captureMessage(message, {
      fingerprint: ISOLATED_NETWORK_CODES.includes(code.toString()) ? [code] : [code, method, cleansedUrl],
      extra: getExtraErrorData(error),
      tags: _defineProperty({}, CPQ_FE, true)
    });

    if (window.newrelic && window.newrelic.noticeError) {
      var _window$newrelic$noti;

      var builtError = Object.assign(new Error(), error, {
        message: message
      });
      window.newrelic.noticeError(builtError, (_window$newrelic$noti = {}, _defineProperty(_window$newrelic$noti, CPQ_FE, true), _defineProperty(_window$newrelic$noti, "source", 'noticeError'), _window$newrelic$noti));
    }
  }

  throw error;
}

function parseStacktracedError(message) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Unspecified Error';

  var _splitIntoLines = splitIntoLines(message),
      _splitIntoLines2 = _slicedToArray(_splitIntoLines, 1),
      firstLine = _splitIntoLines2[0];

  if (containsUri(firstLine)) {
    return "Stacktraced Network Error: " + cleanseUrl(parseUri(firstLine));
  } else {
    // Strip any meaningless characters or strings from JS exceptions.
    return type + ": " + stripRepeatedWhitespace(message);
  }
}

export function ravenDataCallback(data, original) {
  // If the raven request already has a fingerprint, it has already been handled by
  // upstream from us by either our own network failure catches or by other FE tools
  // (e.g. usage tracking), and doesn't need to be assigned a fingerprint
  if (!data.fingerprint) {
    // The gist of the logic here is that we continuously try and find network errors through:
    // - `data` having an `exception` where a URL is mentioned in the first line
    // - `data` having a `request` property
    // - `data` having a `message` where a URL is mentioned in the first line
    // Otherwise we strip for excess whitespace and treat as a JS error.
    var fingerprint;

    if (data.exception && data.exception.values && data.exception.values.length > 0) {
      var _data$exception$value = _slicedToArray(data.exception.values, 1),
          exception = _data$exception$value[0];

      fingerprint = [parseStacktracedError(exception.value, exception.type)];
    } else if (data.request && data.request.url) {
      // Strip portal ids and query params from requests...
      fingerprint = [cleanseUrl(data.request.url)];
    } else {
      fingerprint = [parseStacktracedError(data.message)];
    } // This will cause raven to ignore its default grouping behaviour and go solely
    // off our scrubbed error message


    data.fingerprint = fingerprint;
  }

  return original ? original(data) : data;
}