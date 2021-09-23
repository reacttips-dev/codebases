"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.redirectSuspendedUsers = exports.hubUserInfoEndpointTest = exports.portalIdBody = exports.retryOnError = exports.logoutOnUnauthorizedOrForbidden = exports.recyclePromise = void 0;

var _index = require("../index");

var _update = require("../helpers/update");

var _core = require("./core");

var _hubapi = require("./hubapi");

var _url = require("../helpers/url");

var _location = require("../helpers/location");

var _promise = require("../helpers/promise");

var _response = require("../helpers/response");

var _toggleable = _interopRequireDefault(require("../decorators/toggleable"));

var _iframe = require("../helpers/iframe");

var recycledResponse = function recycledResponse(response) {
  return response.xhr.readyState === 0 ? {
    status: response.status,
    statusText: response.statusText,
    data: response.data
  } : response.xhr;
};

var withRecycledResponse = function withRecycledResponse(options) {
  return function (response) {
    return (0, _update.set)('externalResponse', recycledResponse(response))(options);
  };
};

var recyclePromise = function recyclePromise(options) {
  if (options.recycledPromise) {
    return options.recycledPromise.then(withRecycledResponse(options), withRecycledResponse(options));
  } else {
    return options;
  }
};

exports.recyclePromise = recyclePromise;

var isUnauthorizedOrForbidden = function isUnauthorizedOrForbidden(response) {
  return response.status === 403 || response.status === 401;
};

var logoutOnUnauthorizedOrForbidden = function logoutOnUnauthorizedOrForbidden(options) {
  var parentWindow = (0, _iframe.maybeGetParentIframe)();

  if (parentWindow) {
    return (0, _core.onResponse)(function (response) {
      if (isUnauthorizedOrForbidden(response)) {
        parentWindow.postMessage(_iframe.UNAUTHORIZED_MESSAGE, '*');
        return _promise.Promise.reject((0, _response.responseError)(response, 'Aborting: notifying parents of unauthorized response'));
      }

      return response;
    })(options);
  }

  return (0, _hubapi.logoutOn)(isUnauthorizedOrForbidden)(options);
};

exports.logoutOnUnauthorizedOrForbidden = logoutOnUnauthorizedOrForbidden;
var retryOnError = (0, _core.retry)(function (response) {
  return response.status !== 200 && !isUnauthorizedOrForbidden(response);
}, {
  reason: 'Error fetching user data',
  maxRetries: 3,
  onMaxAttemptsReached: _hubapi.logoutOnError
});
exports.retryOnError = retryOnError;

var portalIdBody = function portalIdBody(options) {
  return (0, _update.set)('data', {
    portalId: options.portalId
  })(options);
};

exports.portalIdBody = portalIdBody;

var buildForbiddenUrl = function buildForbiddenUrl(options) {
  var hostname = (0, _core.resolveApi)((0, _core.hubletApi)('app', 'hubspot'));
  var portalId = options.portalId || '';
  var dashboardDescriptor = {
    hostname: hostname,
    path: "/account-and-billing/" + portalId + "/forbidden"
  };
  return (0, _url.buildUrl)(dashboardDescriptor);
};

var redirectSuspendedHub = function redirectSuspendedHub(response) {
  var options = response.options;
  var redirectUrl = buildForbiddenUrl(options);
  return (0, _location.redirectTo)(redirectUrl, options) ? _promise.Promise.reject((0, _response.responseError)(response, 'Aborting: redirection in progress')) : response;
};

var shouldRedirectForSuspension = function shouldRedirectForSuspension(response) {
  return !response.options.allowSuspended && response.data.user && Array.isArray(response.data.user.scopes) && response.data.user.scopes.indexOf('suspended') !== -1;
};

var hubUserInfoEndpointTest = (0, _index.createStack)(function (options) {
  return (0, _core.withUrl)(function (url) {
    if (url.path === '/login-verify') {
      return Object.assign({}, url, {
        path: '/login-verify/hub-user-info'
      });
    }

    return url;
  })(options);
}, (0, _core.method)('GET'), function (options) {
  return (0, _core.environmentUrl)((0, _core.hubletApi)('api', 'hubspot', options.hubletOverride))(options);
}, function (options) {
  return (0, _core.query)({
    portalId: options.portalId
  })(options);
});
exports.hubUserInfoEndpointTest = hubUserInfoEndpointTest;
var redirectSuspendedUsers = (0, _toggleable.default)(function (isEnabled) {
  return function (options) {
    if (!isEnabled()) return options;
    return (0, _core.onResponse)(function (response) {
      if (shouldRedirectForSuspension(response)) {
        return redirectSuspendedHub(response);
      }

      return response;
    })(options);
  };
});
exports.redirectSuspendedUsers = redirectSuspendedUsers;