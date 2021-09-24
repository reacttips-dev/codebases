"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.retryOnError = exports.logoutOnMissingPortalId = exports.logoutOnUnauthorized = exports.logoutOn = exports.logoutOnError = exports.timeoutInQuery = exports.setRequest = exports.maybeUseIframeRequest = exports.hubapi = exports.lab = exports.defaults = void 0;

var params = _interopRequireWildcard(require("../helpers/params"));

var _url = require("../helpers/url");

var _core = require("./core");

var _iframe = require("../helpers/iframe");

var _response = require("../helpers/response");

var _location = require("../helpers/location");

var _authCache = _interopRequireDefault(require("../helpers/authCache"));

var _promise = require("../helpers/promise");

var _update = require("../helpers/update");

var defaults = function defaults(options) {
  return Object.assign({}, {
    timeout: 14000,
    withCredentials: true,
    portalId: window.hubspot && window.hubspot.portal && window.hubspot.portal.id,
    labs: window.hubspot && window.hubspot['__hub-http-labs']
  }, options);
};

exports.defaults = defaults;

var labEnabled = function labEnabled(labKey, options) {
  var localStorageKey = "HUB-HTTP-LABS:" + labKey;
  var labOverride = options.localStorage && options.localStorage.getItem(localStorageKey);

  if (labOverride && labOverride.toLowerCase() === 'true') {
    // eslint-disable-next-line no-console
    console.log("Using localStorage override for " + localStorageKey + ": " + labOverride);
    return labOverride.toLowerCase() === 'true';
  }

  return typeof options.labs === 'object' && options.labs[labKey];
};

var lab = function lab(labKey, middleware) {
  var fallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (o) {
    return o;
  };
  return function (options) {
    return labEnabled(labKey, options) ? middleware(options) : fallback(options);
  };
};

exports.lab = lab;
var hubapi = (0, _core.environmentUrl)((0, _core.hubletApi)('api', 'hubspot'));
exports.hubapi = hubapi;

var maybeUseIframeRequest = function maybeUseIframeRequest(options) {
  var _parseUrl = (0, _url.parseUrl)(options.url),
      hostname = _parseUrl.hostname;

  var useIframeRequest = hostname.indexOf("api" + (0, _core.hubletSubdomainPostfix)() + ".hubspot") === 0;
  return (0, _update.set)('useIframeRequest', useIframeRequest)(options);
};

exports.maybeUseIframeRequest = maybeUseIframeRequest;
var setRequest = maybeUseIframeRequest;
exports.setRequest = setRequest;

var timeoutInQuery = function timeoutInQuery(options) {
  return typeof options.timeout === 'number' ? (0, _core.query)({
    clienttimeout: options.timeout
  })(options) : options;
};

exports.timeoutInQuery = timeoutInQuery;

var buildLogoutUrl = function buildLogoutUrl(options) {
  var hostname = (0, _core.resolveApi)((0, _core.hubletApi)('app', 'hubspot'));
  var loginDescriptor = {
    hostname: hostname,
    path: '/login/'
  };
  var loginQuery = {
    loginRedirectUrl: options.location.href
  };

  if (options.portalId) {
    loginQuery.loginPortalId = options.portalId;
  }

  loginDescriptor.query = params.stringify(loginQuery);
  return (0, _url.buildUrl)(loginDescriptor);
};

var onRedirectToLogin = function onRedirectToLogin(options) {
  return _authCache.default.clear(options);
};

var handleLogoutFromRequest = function handleLogoutFromRequest(options) {
  var redirectUrl = buildLogoutUrl(options);

  if ((0, _location.redirectTo)(redirectUrl, options, onRedirectToLogin)) {
    throw new Error('Aborting: redirection in progress');
  }

  return options;
};

var handleLogoutFromResponse = function handleLogoutFromResponse(response) {
  var options = response.options;
  var redirectUrl = buildLogoutUrl(options);
  (0, _location.redirectTo)(redirectUrl, options, onRedirectToLogin);
  return _promise.Promise.reject((0, _response.responseError)(response, 'Aborting: redirection in progress'));
};

var logoutOnError = (0, _core.onResponseError)(handleLogoutFromResponse);
exports.logoutOnError = logoutOnError;

var logoutOn = function logoutOn(predicate) {
  return function (options) {
    return (0, _core.onResponse)(function (response) {
      if (predicate(response)) {
        return handleLogoutFromResponse(response);
      }

      return response;
    })(options);
  };
};

exports.logoutOn = logoutOn;

var logoutOnUnauthorized = function logoutOnUnauthorized(options) {
  var parentWindow = (0, _iframe.maybeGetParentIframe)();

  if (parentWindow) {
    return (0, _core.onResponse)(function (response) {
      if (response.status === 401) {
        parentWindow.postMessage(_iframe.UNAUTHORIZED_MESSAGE, '*');
        return _promise.Promise.reject((0, _response.responseError)(response, 'Aborting: notifying parents of unauthorized response'));
      }

      return response;
    })(options);
  }

  return logoutOn(function (response) {
    return response.status === 401;
  })(options);
};

exports.logoutOnUnauthorized = logoutOnUnauthorized;

var logoutOnMissingPortalId = function logoutOnMissingPortalId(options) {
  if (!options.portalId) {
    // eslint-disable-next-line no-console
    console.log('[hub-http] Could not find portal id. Redirecting');
    return handleLogoutFromRequest(options);
  }

  return options;
};

exports.logoutOnMissingPortalId = logoutOnMissingPortalId;
var retryOnError = (0, _core.retry)(function (response) {
  return response.options.method === 'GET' && (response.status >= 500 || response.status === 0 && response.errorCode === 'NETWORKERROR');
}, {
  reason: 'Server error'
});
exports.retryOnError = retryOnError;