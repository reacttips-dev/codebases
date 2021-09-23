"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.userInfoSync = exports.userInfoSafe = exports.userInfoWithDelegatedOptions = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _promise = require("./helpers/promise");

var _loginVerifyClient = _interopRequireDefault(require("./clients/loginVerifyClient"));

var _events = require("./helpers/events");

var _newRelicReporting = require("./helpers/newRelicReporting");

var memoizedPromise;
var memoizedInfo;

var getUserInfo = function getUserInfo(options) {
  var _options$cached = options.cached,
      cached = _options$cached === void 0 ? true : _options$cached,
      otherOptions = (0, _objectWithoutProperties2.default)(options, ["cached"]); // don't use early requester if we're trying to refresh the data

  if (!cached && otherOptions.externalResponse) {
    delete otherOptions.externalResponse;
  }

  if (cached && memoizedPromise) {
    otherOptions.recycledPromise = memoizedPromise;
  }

  var loginVerifyCall = (0, _loginVerifyClient.default)('/login-verify', otherOptions);

  if (!cached || !memoizedPromise) {
    memoizedPromise = loginVerifyCall;
  }

  return loginVerifyCall.then(function (_ref) {
    var data = _ref.data;
    return data;
  });
};

var earlyRequestPromise;

var earlyRequest = function earlyRequest() {
  if (!earlyRequestPromise) {
    earlyRequestPromise = new _promise.Promise(function (resolve, reject) {
      var request = window.quickFetch && window.quickFetch.getRequestStateByName('api-verify');

      if (!request) {
        reject(new Error('No quick-fetch early login-verify request found'));
        (0, _newRelicReporting.setCustomAttribute)('earlyRequesterRequestNotFound', 'true');
        (0, _newRelicReporting.setCustomAttribute)('earlyRequesterFinished', 'false');
        return;
      }

      var earlyRequesterFinished = request.finished;
      request.whenFinished(function (data) {
        (0, _newRelicReporting.setCustomAttribute)('earlyRequesterFinished', "" + Boolean(earlyRequesterFinished));

        if (window.performance && typeof window.performance.getEntriesByName === 'function' && window.performance.getEntriesByName(_newRelicReporting.MEASURE_API_VERIFY_TIME).length) {
          (0, _newRelicReporting.setCustomAttribute)('earlyRequesterApiTime', window.performance.getEntriesByName(_newRelicReporting.MEASURE_API_VERIFY_TIME)[0].duration);
        }

        return resolve(data);
      });
      request.onError(function (xhr) {
        reject(new Error("[hub-http] EarlyRequester token refresh attempt failed with status " + xhr.status + ": " + xhr.statusText));
      });
    });
  }

  return earlyRequestPromise;
};

var get = function get(options) {
  // when earlyRequester fails, pass control over to the login verify client to try again
  var fallback = function fallback(reason) {
    if (reason) {
      // eslint-disable-next-line no-console
      console.error(reason.message);
    }

    return getUserInfo(options);
  }; // when earlyRequester succeeds, send a dummy response in the login verify's client for processing


  var dummyResponse = function dummyResponse(response) {
    return {
      status: 200,
      statusText: 'OK',
      data: response
    };
  };

  var request = earlyRequest().then(function (response) {
    return getUserInfo(Object.assign({}, options, {
      externalResponse: dummyResponse(response)
    }));
  }).catch(fallback);
  return request.then(function (_ref2) {
    var auth = _ref2.auth,
        portal = _ref2.portal,
        user = _ref2.user;
    var info = {
      user: user,
      gates: portal.enabled_gates,
      portal: portal
    };

    if (auth) {
      info.auth = auth;
    }

    if (window.performance && typeof window.performance.mark === 'function' && typeof window.performance.measure === 'function' && typeof window.performance.getEntriesByName === 'function') {
      window.performance.mark(_newRelicReporting.MARK_USER_INFO_SUCCESS);
      window.performance.measure(_newRelicReporting.MEASURE_USER_INFO_TIME, _newRelicReporting.MARK_USER_INFO_START, _newRelicReporting.MARK_USER_INFO_SUCCESS);
      var userInfoTime = window.performance.getEntriesByName(_newRelicReporting.MEASURE_USER_INFO_TIME).length ? window.performance.getEntriesByName(_newRelicReporting.MEASURE_USER_INFO_TIME)[0].duration : -1;
      (0, _newRelicReporting.setCustomAttribute)('userInfoTime', userInfoTime);
    }

    (0, _events.triggerEvent)('hubspot:userinfochange', info);
    return info;
  });
};

var userInfo = function userInfo() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var others = Object.assign({}, options);

  if (window.performance && typeof window.performance.mark === 'function') {
    window.performance.mark(_newRelicReporting.MARK_USER_INFO_START);
  }

  return get(others).then(function (data) {
    memoizedInfo = data;
    return data;
  });
};

var userInfoWithDelegatedOptions = function userInfoWithDelegatedOptions(_ref3) {
  var cached = _ref3.cached,
      ignoreRedirect = _ref3.ignoreRedirect,
      safeMode = _ref3.safeMode,
      allowSuspended = _ref3.allowSuspended;
  return userInfo({
    cached: cached,
    ignoreRedirect: ignoreRedirect,
    safeMode: safeMode,
    allowSuspended: allowSuspended
  });
};

exports.userInfoWithDelegatedOptions = userInfoWithDelegatedOptions;

var userInfoSafe = function userInfoSafe(options) {
  return userInfo(Object.assign({}, options, {
    safeMode: true
  }));
};

exports.userInfoSafe = userInfoSafe;

var userInfoSync = function userInfoSync() {
  if (!memoizedInfo) {
    throw new Error('User info has not be loaded yet. Did you call userInfoSync before the userInfo promise resolved?');
  }

  return memoizedInfo;
};

exports.userInfoSync = userInfoSync;
var _default = userInfo;
exports.default = _default;