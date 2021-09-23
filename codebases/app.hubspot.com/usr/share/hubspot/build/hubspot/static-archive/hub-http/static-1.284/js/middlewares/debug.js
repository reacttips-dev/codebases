"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.allowTimeoutOverride = exports.rewriteUrl = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _core = require("./core");

var _url = require("../helpers/url");

var _update = require("../helpers/update");

var regexRewriteUrl = function regexRewriteUrl(url, patternsRaw) {
  var parsedPatterns = JSON.parse(patternsRaw);

  if (!Array.isArray(parsedPatterns)) {
    // eslint-disable-next-line no-console
    console.error('REWRITE_URL local storage key must be a stringified array');
    return url;
  }

  if (!parsedPatterns.length) return url;
  var urlString = (0, _url.buildUrl)(url);

  if (typeof parsedPatterns[0] === 'string' || parsedPatterns[0] instanceof String) {
    parsedPatterns = [parsedPatterns];
  }

  parsedPatterns.forEach(function (_ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
        pattern = _ref2[0],
        replacement = _ref2[1];

    urlString = urlString.replace(new RegExp(pattern), replacement);
  });
  return (0, _url.parseUrl)(urlString);
};

var localOverideUrl = function localOverideUrl(url, localOverrides) {
  var parsedOverrides = JSON.parse(localOverrides);

  if (!Array.isArray(parsedOverrides)) {
    // eslint-disable-next-line no-console
    console.error('LOCAL_API_OVERRIDES local storage key must be a stringified array');
    return url;
  }

  var urlString = (0, _url.buildUrl)(url);
  parsedOverrides.forEach(function (overrideString) {
    if (urlString.includes(overrideString)) {
      urlString = urlString.replace(/https:\/\/(app|api)/, 'https://local');
    }
  });
  return (0, _url.parseUrl)(urlString);
};

var rewriteUrl = function rewriteUrl(options) {
  return (0, _core.withUrl)(function (url) {
    var patternsRaw = options.localStorage && options.localStorage.getItem('URL_REWRITE');

    if (patternsRaw) {
      return regexRewriteUrl(url, patternsRaw);
    }

    var localOverrides = options.localStorage && options.localStorage.getItem('LOCAL_API_OVERRIDES');

    if (localOverrides) {
      return localOverideUrl(url, localOverrides);
    }

    return url;
  })(options);
};

exports.rewriteUrl = rewriteUrl;
var TIMEOUT_OVERRIDE_KEY = 'HUB-HTTP_TIMEOUT';

var allowTimeoutOverride = function allowTimeoutOverride(options) {
  var timeoutOverride = options.localStorage && options.localStorage.getItem(TIMEOUT_OVERRIDE_KEY);

  if (timeoutOverride != null) {
    // eslint-disable-next-line no-console
    console.log("[hub-http] Using localStorage override " + TIMEOUT_OVERRIDE_KEY + " for request timeout.");
    return (0, _update.set)('timeout', parseInt(timeoutOverride, 10))(options);
  }

  return options;
};

exports.allowTimeoutOverride = allowTimeoutOverride;