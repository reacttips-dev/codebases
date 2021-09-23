"use strict";
'use es6';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trackSuccess = exports.withRetry = exports.trackFailureBasedOnErrorResponse = exports.withTracking = exports.requestIdKey = exports.buildRequestError = exports.buildErrorResponse = exports.buildResponse = exports.withResponseHandlers = exports.getResponseHeaders = exports.handleResponse = void 0;

var _response = require("../helpers/response");

var _promise = require("../helpers/promise");

var _update = require("../helpers/update");

var requestTracker = _interopRequireWildcard(require("../helpers/requestTracker"));

// Only importing via wildcard for unit test's sake
var handleResponse = function handleResponse(response, handlers) {
  return handlers.reduce(function (previous, handler) {
    return handler(previous);
  }, response);
};

exports.handleResponse = handleResponse;

var getResponseHeaders = function getResponseHeaders(xhr) {
  return (xhr.getAllResponseHeaders() || '').trim().split('\n').reduce(function (headers, current) {
    var split = current.trim().split(':');
    var key = split.shift().trim();
    var value = split.join(':').trim();
    headers[key] = value;
    return headers;
  }, {});
};

exports.getResponseHeaders = getResponseHeaders;

var withResponseHandlers = function withResponseHandlers(response, options) {
  response = (0, _update.set)('options', options)(response);
  var handlers = (0, _response.responseHandlers)(options);
  return handlers && handlers.length ? handleResponse(_promise.Promise.resolve(response), handlers) : _promise.Promise.resolve(response);
};

exports.withResponseHandlers = withResponseHandlers;

var getJSONResponse = function getJSONResponse(xhr) {
  try {
    return xhr.getResponseHeader('content-type').indexOf('application/json') === 0 ? JSON.parse(xhr.responseText) : undefined;
  } catch (err) {
    return undefined;
  }
};

var buildResponse = function buildResponse(xhr) {
  return {
    status: xhr.status,
    statusText: xhr.statusText,
    data: 'response' in xhr ? xhr.response : xhr.responseText,
    headers: getResponseHeaders(xhr),
    xhr: xhr,
    responseText: xhr.responseText,
    responseJSON: getJSONResponse(xhr)
  };
}; // create an error with XHR and response information.


exports.buildResponse = buildResponse;

var buildErrorResponse = function buildErrorResponse(xhr, message, code) {
  var response = buildResponse(xhr);
  return Object.assign(response, {
    statusText: response.statusText || message,
    responseJSON: getJSONResponse(xhr),
    errorMessage: message,
    errorCode: code
  });
};

exports.buildErrorResponse = buildErrorResponse;

var buildRequestError = function buildRequestError(reason) {
  var error;
  var errorCode = 'REQUEST ERROR';

  if (reason instanceof Error) {
    error = reason;
  } else if (typeof reason === 'string' || reason instanceof String) {
    error = new Error(reason);
  }

  return Object.assign(error, {
    code: errorCode,
    status: 0,
    statusText: error.message
  });
};

exports.buildRequestError = buildRequestError;
var requestIdKey = Symbol('requestId');
exports.requestIdKey = requestIdKey;

var withTracking = function withTracking(options) {
  if (options.doNotTrack === true) {
    return options;
  } else {
    var requestId = requestTracker.startTrackingRequest(options.url, 'hub-http');
    var optionsClone = Object.assign({}, options);
    optionsClone[requestIdKey] = requestId;
    return optionsClone;
  }
};

exports.withTracking = withTracking;

var trackFailureBasedOnErrorResponse = function trackFailureBasedOnErrorResponse(response) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$willBeRetried = _ref.willBeRetried,
      willBeRetried = _ref$willBeRetried === void 0 ? false : _ref$willBeRetried,
      retryReason = _ref.retryReason,
      retryAttempt = _ref.retryAttempt;

  if (response.options && response.options[requestIdKey] !== undefined) {
    if (response.errorCode === 'ABORT') {
      requestTracker.finishTrackingRequest(response.options[requestIdKey], response.options.url, 'aborted', {
        status: response.status
      });
    } else if (response.errorCode === 'TIMEOUT') {
      requestTracker.finishTrackingRequest(response.options[requestIdKey], response.options.url, 'timedOut', {
        status: response.status
      });
    } else {
      requestTracker.finishTrackingRequest(response.options[requestIdKey], response.options.url, 'failed', {
        status: response.status,
        statusText: response.statusText,
        willBeRetried: willBeRetried,
        retryReason: retryReason,
        retryAttempt: retryAttempt
      });
    }
  }

  return response;
};

exports.trackFailureBasedOnErrorResponse = trackFailureBasedOnErrorResponse;

var withRetry = function withRetry(options, fn) {
  var attempt = options.retryAttempts || 0;
  return fn(Object.assign({}, options, {
    retryAttempts: attempt
  })).catch(function (response) {
    if (response.retry && response.retry.exceededRetries) {
      return _promise.Promise.reject((0, _response.responseError)(response, "Request for " + response.options.method + " " + response.options.url + " failed with status code " + response.status + " after max retries exceeded (" + response.retry.maxRetries + "). " + (response.statusText || '')));
    } else if (response.retry) {
      var reasonMessage = response.retry.reason ? " Reason: " + response.retry.reason : ''; // Try retries (the final attempt will not have `response.retry` and will be tracked
      // by the normal handlers)

      trackFailureBasedOnErrorResponse(response, {
        willBeRetried: true,
        retryReason: reasonMessage,
        retryAttempt: attempt + 1
      }); // eslint-disable-next-line no-console

      console.log("Retrying. Retry attempt " + (attempt + 1) + " of " + response.retry.maxRetries + "." + reasonMessage);
      return new _promise.Promise(function (resolve) {
        setTimeout(function () {
          return resolve(withRetry(Object.assign({}, options, {
            retryAttempts: attempt + 1
          }), fn));
        }, response.retry.delay);
      });
    } // Just in case some other rejection/error comes through unrelated to retries


    return _promise.Promise.reject(response);
  });
};

exports.withRetry = withRetry;

var trackSuccess = function trackSuccess(response) {
  if (response.options && response.options[requestIdKey] !== undefined) {
    requestTracker.finishTrackingRequest(response.options[requestIdKey], response.options.url, 'succeeded', {
      status: response.status,
      statusText: response.statusText
    });
  }

  return response;
};

exports.trackSuccess = trackSuccess;