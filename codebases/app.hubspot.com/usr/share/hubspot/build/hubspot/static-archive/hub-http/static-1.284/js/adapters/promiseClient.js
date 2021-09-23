"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _promise = require("../helpers/promise");

var _update = require("../helpers/update");

var _adapterUtils = require("./adapterUtils");

var _staticAppInfo = require("../middlewares/staticAppInfo");

var _index = require("../index");

var _trackRequests = require("../tracking/trackRequests");

var maybeWithIframeXMLHttpRequest = function maybeWithIframeXMLHttpRequest(options) {
  var canUseSyncIframeRequest = options.useIframeRequest && window.iframeXMLHttpRequest && window.apiIframe && window.apiIframe.contentDocument;
  var canUseAsyncIframeRequest = options.useIframeRequest && window.iframeXMLHttpRequestPromise;
  var canUseIframeHack = canUseSyncIframeRequest || canUseAsyncIframeRequest;

  if (!canUseIframeHack) {
    return (0, _update.set)('Request', XMLHttpRequest)(options);
  }

  var newHeaders = Object.assign({
    'X-HS-Referer': window.location.href
  }, options.headers);
  var optionsWithAdditionalHeaders = (0, _staticAppInfo.withStaticAppInfo)((0, _update.set)('headers', newHeaders)(options)); // If iframeXMLHttpRequestPromise is set, wait for it to resolve before issuing a request
  // This is done when all appropriate requests must be sent via the frame

  if (canUseAsyncIframeRequest) {
    return window.iframeXMLHttpRequestPromise.then(function (iframeXMLHttpRequest) {
      return (0, _update.set)('Request', iframeXMLHttpRequest)(optionsWithAdditionalHeaders);
    }).catch(function () {
      return (0, _update.set)('Request', XMLHttpRequest)(options);
    });
  }

  return (0, _update.set)('Request', window.iframeXMLHttpRequest)(optionsWithAdditionalHeaders);
};

var withOptions = function withOptions(options) {
  return new _promise.Promise(function (resolve) {
    var Request = options.Request || XMLHttpRequest;
    var xhr = new Request();

    if (options.error) {
      resolve((0, _adapterUtils.withResponseHandlers)((0, _adapterUtils.buildErrorResponse)(xhr, options.error.message, 'OPTIONSERROR'), options));
      return;
    } // the http request was done by a separate client and is being piped back
    // into this one for response handling


    if (options.externalResponse) {
      var fromExternalResponse = options.externalResponse instanceof XMLHttpRequest ? (0, _adapterUtils.buildResponse)(options.externalResponse) : Object.assign((0, _adapterUtils.buildResponse)(xhr), options.externalResponse);
      resolve((0, _adapterUtils.withResponseHandlers)(fromExternalResponse, options));
      return;
    }

    xhr.open(options.method || 'GET', options.url, true);

    if (typeof options.timeout === 'number') {
      xhr.timeout = options.timeout;
    }

    xhr.withCredentials = options.withCredentials;

    if (options.responseType) {
      xhr.responseType = options.responseType;
    }

    if (typeof options.withXhr === 'function') {
      options.withXhr(xhr);
    }

    Object.keys(options.headers || {}).forEach(function (headerName) {
      if (options.headers[headerName] !== false) {
        xhr.setRequestHeader(headerName, options.headers[headerName]);
      }
    });
    var sendTime = performance.now();
    xhr.addEventListener('load', function () {
      (0, _trackRequests.reportStatusCode)({
        url: xhr.responseURL,
        sendTime: sendTime,
        statusCode: xhr.status
      });
      return resolve((0, _adapterUtils.withResponseHandlers)((0, _adapterUtils.buildResponse)(xhr), options));
    });
    xhr.addEventListener('error', function () {
      (0, _trackRequests.reportStatusCode)({
        url: xhr.responseURL,
        sendTime: sendTime,
        statusCode: xhr.status
      });
      return resolve((0, _adapterUtils.withResponseHandlers)((0, _adapterUtils.buildErrorResponse)(xhr, 'Network request failed', 'NETWORKERROR'), options));
    });
    xhr.addEventListener('timeout', function () {
      (0, _trackRequests.reportStatusCode)({
        url: xhr.responseURL,
        sendTime: sendTime,
        statusCode: xhr.status
      });
      return resolve((0, _adapterUtils.withResponseHandlers)((0, _adapterUtils.buildErrorResponse)(xhr, 'Request timeout', 'TIMEOUT'), options));
    });
    xhr.addEventListener('abort', function () {
      (0, _trackRequests.reportStatusCode)({
        url: xhr.responseURL,
        sendTime: sendTime,
        statusCode: xhr.status
      });
      return resolve((0, _adapterUtils.withResponseHandlers)((0, _adapterUtils.buildErrorResponse)(xhr, 'Request aborted', 'ABORT'), options));
    });
    xhr.send(typeof options.data === 'undefined' ? null : options.data);
  });
};

var handleRequestErrors = function handleRequestErrors(reason) {
  return _promise.Promise.reject((0, _adapterUtils.buildRequestError)(reason));
};

var essentialMiddleware = (0, _index.createStack)(_adapterUtils.withTracking, maybeWithIframeXMLHttpRequest, _staticAppInfo.ensureStaticAppInfo);

var _default = function _default(optionMiddleware) {
  var client = function client(url, options) {
    return (0, _adapterUtils.withRetry)(Object.assign({}, options, {
      url: url
    }), function (o) {
      return optionMiddleware(o).catch(handleRequestErrors).then(essentialMiddleware).then(withOptions);
    }).then(_adapterUtils.trackSuccess, function (response) {
      return _promise.Promise.reject((0, _adapterUtils.trackFailureBasedOnErrorResponse)(response));
    });
  };

  var responseWithMethod = function responseWithMethod(method) {
    return function (url, options) {
      return client(url, Object.assign({}, options, {
        method: method
      }));
    };
  };

  var withMethod = function withMethod(method) {
    return function (url, options) {
      return responseWithMethod(method)(url, options).then(function (_ref) {
        var data = _ref.data;
        return data;
      });
    };
  };

  return Object.assign(client, {
    get: withMethod('GET'),
    post: withMethod('POST'),
    put: withMethod('PUT'),
    patch: withMethod('PATCH'),
    delete: withMethod('DELETE'),
    options: withMethod('OPTIONS'),
    getWithResponse: responseWithMethod('GET'),
    postWithResponse: responseWithMethod('POST'),
    putWithResponse: responseWithMethod('PUT'),
    patchWithResponse: responseWithMethod('PATCH'),
    deleteWithResponse: responseWithMethod('DELETE'),
    optionsWithResponse: responseWithMethod('OPTIONS')
  });
};

exports.default = _default;
module.exports = exports.default;