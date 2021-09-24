"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.redirectTo = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _safeMode = require("./safeMode");

var noop = function noop() {};

var redirectTo = function redirectTo(redirectUrl, options) {
  var onRedirect = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;
  var overrideKey = 'HUB-HTTP_IGNORE_REDIRECTS';

  var isTrue = function isTrue(v) {
    return v && v.toLowerCase() === 'true';
  };

  var skipConditions = [[function () {
    return options.ignoreRedirect;
  }, 'ignoreRedirect option is set'], [function () {
    return options.localStorage && isTrue(options.localStorage.getItem(overrideKey));
  }, "local storage key " + overrideKey + " is set to \"true\""], [function () {
    return (0, _safeMode.isSafeMode)(options);
  }, 'safe mode is enabled']];
  var condition = skipConditions.find(function (_ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 1),
        predicate = _ref2[0];

    return predicate();
  });

  if (condition) {
    // eslint-disable-next-line no-console
    console.log("[hub-http] Skipping redirect because " + condition[1]);
    return false;
  }

  onRedirect(options);
  options.location.href = redirectUrl;
  return true;
};

exports.redirectTo = redirectTo;