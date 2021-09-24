"use strict";
'use es6';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.safeMode = exports.retry = exports.validateStatus = exports.reportOptionsError = exports.jsonResponse = exports.responseInterceptor = exports.onResponseError = exports.onResponse = exports.jsonBody = exports.bodyType = exports.hubletApi = exports.hubletSubdomainPostfix = exports.standardApi = exports.withApiAsOption = exports.environmentUrl = exports.httpsOnly = exports.withQuery = exports.query = exports.base = exports.header = exports.method = exports.defaultTo = exports.withOptions = exports.withUrl = exports.resolveApi = exports.validateOptions = exports.services = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _enviro = _interopRequireDefault(require("enviro"));

var _index = require("../index");

var _promise = require("../helpers/promise");

var _update = require("../helpers/update");

var _response = require("../helpers/response");

var _url = require("../helpers/url");

var params = _interopRequireWildcard(require("../helpers/params"));

var headers = _interopRequireWildcard(require("../helpers/headers"));

// defensive over accessing localStorage because http://meyerweb.com/eric/thoughts/2012/04/25/firefox-failing-localstorage/
var getLocalStorage = function getLocalStorage() {
  try {
    return window.localStorage;
  } catch (error) {
    return undefined;
  }
};

var getAppInfo = function getAppInfo() {
  return window.hubspot && window.hubspot.bender ? {
    name: window.hubspot.bender.currentProject,
    version: window.hubspot.bender.currentProjectVersion
  } : null;
};

var services = function services(options) {
  return Object.assign({
    location: window.location,
    cookies: window.document.cookie,
    localStorage: getLocalStorage(),
    document: window.document,
    appInfo: getAppInfo()
  }, options);
};

exports.services = services;

var validateOptions = function validateOptions(validator, errorMessage) {
  return function (options) {
    if (!validator || typeof validator !== 'function') {
      throw new Error('validator must be a function');
    }

    if (!validator(options)) throw new Error(errorMessage);
    return options;
  };
};

exports.validateOptions = validateOptions;

var resolveApi = function resolveApi(api) {
  var environment = _enviro.default.getShort('hub-http');

  var location = environment === 'local' ? 'local' : 'deployed';
  var hostname = api[location] ? api[location][environment] : null;

  if (!hostname) {
    throw new Error("No hostname defined for environment " + environment + " and " + location);
  }

  return hostname;
};

exports.resolveApi = resolveApi;
var parsedUrl = Symbol('url'); // ensures consistant handling of the parsed url object when making url modifications
// without losing information

var withUrl = function withUrl(urlMutator) {
  return function (options) {
    var descriptor = options[parsedUrl] || (0, _url.parseUrl)(options.url);
    descriptor = urlMutator(descriptor);
    options = (0, _update.set)(parsedUrl, descriptor)(options);
    options = (0, _update.set)('url', (0, _url.buildUrl)(descriptor))(options);
    return options;
  };
};

exports.withUrl = withUrl;

var withOptions = function withOptions(options, newOptions) {
  return Object.assign({}, options, newOptions);
}; // TODO: REVIEW


exports.withOptions = withOptions;

var fromInput = function fromInput(propertyName, options) {
  /**
   * If options.input exists, this is a composed middleware's options, and we want to check if
   * the initial arguments had the property name. Otherwise, there's only one middleware
   * current options === initial options.
   */
  var input = options && options._input ? options._input : options;
  return input[propertyName] !== undefined ? input[propertyName] : undefined;
};

var defaultTo = function defaultTo(propertyName, value) {
  return function (options) {
    return fromInput(propertyName, options) === undefined ? (0, _update.set)(propertyName, value)(options) : options;
  };
};

exports.defaultTo = defaultTo;

var method = function method(verb) {
  return defaultTo('method', verb);
};

exports.method = method;

var header = function header(name, value, override) {
  return function (options) {
    var headerValue = headers.getHeader(name, options);
    return override || headerValue === undefined ? headers.setHeader(name, value, options) : options;
  };
};

exports.header = header;

var base = function base(baseUrl) {
  return function (options) {
    return (0, _update.set)('url', baseUrl + options.url)(options);
  };
};

exports.base = base;
var initialQuery = Symbol('initialQuery');
var notOverridableQuery = Symbol('noOverrideQuery');
var overridableQuery = Symbol('overrideQuery');

var query = function query(obj) {
  var allowOverride = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return withUrl(function (url) {
    var descriptor = url;

    if (typeof descriptor[initialQuery] === 'undefined') {
      descriptor = (0, _update.set)(initialQuery, url.query || '')(descriptor);
    }

    var _ref = allowOverride ? [overridableQuery, descriptor[overridableQuery], obj] : [notOverridableQuery, obj, descriptor[notOverridableQuery]],
        _ref2 = (0, _slicedToArray2.default)(_ref, 3),
        key = _ref2[0],
        baseObj = _ref2[1],
        superset = _ref2[2];

    descriptor = (0, _update.setIn)([key], Object.assign({}, baseObj, {}, superset))(descriptor);
    return (0, _update.set)('query', [descriptor[initialQuery], params.stringify(Object.assign({}, descriptor[overridableQuery], {}, descriptor[notOverridableQuery]))].filter(Boolean).join('&'))(descriptor);
  });
};

exports.query = query;

var withQuery = function withQuery(options) {
  return query(options.query, false)(options);
};

exports.withQuery = withQuery;
var httpsOnly = withUrl((0, _update.set)('protocol', 'https'));
exports.httpsOnly = httpsOnly;

var environmentUrl = function environmentUrl(defaultApi) {
  return function (options) {
    return withUrl(function (url) {
      if (!url.protocol && options.location) {
        url.protocol = options.location.protocol.slice(0, -1);
      }

      if (!url.hostname) {
        var api = options.api || defaultApi;
        url.hostname = resolveApi(api);
      }

      return url;
    })(options);
  };
};

exports.environmentUrl = environmentUrl;

var withApiAsOption = function withApiAsOption(options) {
  if (!options.api) {
    throw new Error('Missing api option. Expected api object (you can create one with the hubletApi function');
  }

  return environmentUrl(null)(options);
};
/*
 * @deprecated - Use `hubletApi` instead for a hublet aware version.
 */


exports.withApiAsOption = withApiAsOption;

var standardApi = function standardApi(name, domainPrefix) {
  return {
    local: {
      qa: "local." + domainPrefix + "qa.com",
      prod: "local." + domainPrefix + ".com"
    },
    deployed: {
      qa: name + "." + domainPrefix + "qa.com",
      prod: name + "." + domainPrefix + ".com"
    }
  };
};

exports.standardApi = standardApi;

var hubletSubdomainPostfix = function hubletSubdomainPostfix(hubletOverride) {
  if (hubletOverride && hubletOverride !== 'na1') {
    return "-" + hubletOverride;
  }

  var currentHublet = _enviro.default.getHublet();

  if (currentHublet === 'na1' || hubletOverride === 'na1') {
    return '';
  }

  return "-" + currentHublet;
};

exports.hubletSubdomainPostfix = hubletSubdomainPostfix;

var hubletApi = function hubletApi(name, domainPrefix, hubletOverride) {
  var targetHublet = hubletSubdomainPostfix(hubletOverride);
  return {
    local: {
      qa: "local" + targetHublet + "." + domainPrefix + "qa.com",
      prod: "local" + targetHublet + "." + domainPrefix + ".com"
    },
    deployed: {
      qa: "" + name + targetHublet + "." + domainPrefix + "qa.com",
      prod: "" + name + targetHublet + "." + domainPrefix + ".com"
    }
  };
};

exports.hubletApi = hubletApi;

var bodyType = function bodyType(contentType, stringifyFn) {
  return function (options) {
    options = header('content-type', contentType)(options);

    if (options.rawData) {
      options.data = options.rawData;
    } else if (typeof stringifyFn === 'function' && headers.getHeader('content-type', options) === contentType) {
      options.data = stringifyFn(options.data);
    }

    return options;
  };
};

exports.bodyType = bodyType;

var jsonBody = function jsonBody(options) {
  return (// null will stringify to "null", whereas undefined will stringify to ""
    // (a body with content-length: 0), which is invalid json.
    options.data !== undefined || options.rawData !== undefined ? bodyType('application/json', JSON.stringify)(options) : options
  );
};

exports.jsonBody = jsonBody;

var wrapResponseHandler = function wrapResponseHandler(handler) {
  return function (response) {
    try {
      return handler(response);
    } catch (error) {
      error.response = response;
      throw error;
    }
  };
};

var onResponse = function onResponse(handler) {
  return (0, _response.handleResponse)(function (response) {
    return response.then(wrapResponseHandler(handler));
  });
};

exports.onResponse = onResponse;

var onResponseError = function onResponseError(handler) {
  return (0, _response.handleResponse)(function (response) {
    return response.catch(wrapResponseHandler(handler));
  });
};

exports.onResponseError = onResponseError;

var responseInterceptor = function responseInterceptor(handler) {
  var alwaysRejectOnCatch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return (0, _response.handleResponse)(function (response) {
    return response.then(wrapResponseHandler(handler), function (r) {
      return alwaysRejectOnCatch ? _promise.Promise.reject(handler(r)) : handler(r);
    });
  });
};

exports.responseInterceptor = responseInterceptor;

var getContentType = function getContentType(response) {
  if (!response || !response.headers) return '';
  return headers.getHeader('content-type', response) || '';
};

var jsonResponse = (0, _index.createStack)(header('Accept', 'application/json, text/javascript, */*; q=0.01'), onResponse(function (response) {
  return (0, _update.setIf)(typeof response.data === 'string' && getContentType(response).indexOf('application/json') === 0, 'data', function () {
    return response.data.length ? JSON.parse(response.data) : undefined;
  })(response);
}));
exports.jsonResponse = jsonResponse;
var reportOptionsError = onResponse(function (response) {
  if (response.errorCode === 'OPTIONSERROR') {
    return _promise.Promise.reject((0, _response.responseError)(response, "hub-http error building request options: " + response.options.error.message));
  }

  return response;
});
exports.reportOptionsError = reportOptionsError;

var validateStatus = function validateStatus(options) {
  return onResponse(function (response) {
    return response.status >= 200 && response.status < 300 ? response : _promise.Promise.reject((0, _response.responseError)(response, "Request for " + options.url + " failed with status " + response.status + ". " + (response.statusText || '')));
  })(options);
};

exports.validateStatus = validateStatus;

var retry = function retry(predicate) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      reason = _ref3.reason,
      _ref3$maxRetries = _ref3.maxRetries,
      maxRetries = _ref3$maxRetries === void 0 ? 1 : _ref3$maxRetries,
      _ref3$delay = _ref3.delay,
      delay = _ref3$delay === void 0 ? 250 : _ref3$delay,
      onMaxAttemptsReached = _ref3.onMaxAttemptsReached;

  return function (options) {
    var interceptor = function interceptor(response) {
      if (predicate(response)) {
        var responseWithRetryInfo = (0, _update.set)('retry', {
          reason: reason,
          maxRetries: maxRetries,
          delay: delay,
          exceededRetries: response.options.retryAttempts >= maxRetries
        })(response);
        return _promise.Promise.reject(responseWithRetryInfo);
      }

      return response;
    };

    if (maxRetries === 0) {
      // Make the retry middleware a no-op
      return options;
    } else {
      // Intercept the current response to do retries
      var responseMiddleware = options.retryAttempts >= maxRetries && typeof onMaxAttemptsReached === 'function' ? (0, _index.createStack)(onResponse(interceptor), onMaxAttemptsReached) : onResponse(interceptor);
      return responseMiddleware(options);
    }
  };
};

exports.retry = retry;
var safeMode = (0, _update.set)('safeMode', true);
exports.safeMode = safeMode;