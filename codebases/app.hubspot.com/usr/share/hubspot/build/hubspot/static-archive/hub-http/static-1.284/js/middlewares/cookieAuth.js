"use strict";
'use es6';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cookieAuthentication = exports.allowMissingPortalId = exports.ensurePortalId = exports.withCsrf = exports.logoutOnMissingCsrf = exports.ensureHttps = void 0;

var _enviro = _interopRequireDefault(require("enviro"));

var _url = require("../helpers/url");

var params = _interopRequireWildcard(require("../helpers/params"));

var _core = require("./core");

var _hubapi = require("./hubapi");

var _index = require("../index");

var _cookies = require("../helpers/cookies");

var ensureHttps = function ensureHttps(options) {
  if (!_enviro.default.deployed('hub-http') && options.location.protocol !== 'https:') {
    var message = 'Cookie authentication require apps to be on https'; // eslint-disable-next-line no-console

    console.error('[hub-http]', message);
    throw new Error(message);
  }

  return options;
};

exports.ensureHttps = ensureHttps;

var logoutOnMissingCsrf = function logoutOnMissingCsrf(options) {
  return (0, _hubapi.logoutOn)(function () {
    return !(0, _cookies.getCookie)(options.csrfCookieName, options.cookies);
  })(options);
};

exports.logoutOnMissingCsrf = logoutOnMissingCsrf;

var withCsrf = function withCsrf(options) {
  return (0, _core.header)('X-HubSpot-CSRF-hubspotapi', (0, _cookies.getCookie)(options.csrfCookieName, options.cookies))(options);
};

exports.withCsrf = withCsrf;

var ensurePortalId = function ensurePortalId(options) {
  var parsed = (0, _url.parseUrl)(options.url);

  if (!params.parse(parsed.query).portalId) {
    return (0, _index.createStack)(_hubapi.logoutOnMissingPortalId, (0, _core.query)({
      portalId: options.portalId
    }))(options);
  }

  return options;
};

exports.ensurePortalId = ensurePortalId;
var cookieAuthStack = (0, _index.createStack)(logoutOnMissingCsrf, withCsrf, function (options) {
  return options.allowMissingPortalId ? options : ensurePortalId(options);
});

var allowMissingPortalId = function allowMissingPortalId(options) {
  return Object.assign({
    allowMissingPortalId: true
  }, options);
};

exports.allowMissingPortalId = allowMissingPortalId;

var cookieAuthentication = function cookieAuthentication(config) {
  return function (options) {
    var domainsConfig = config;
    var domain = (0, _url.parseUrl)(options.url).hostname;
    var configForDomain = domainsConfig.find(function (dc) {
      return dc.matcher.test(domain);
    });
    return cookieAuthStack(Object.assign({}, options, {
      csrfCookieName: configForDomain.csrfCookieName
    }));
  };
};

exports.cookieAuthentication = cookieAuthentication;