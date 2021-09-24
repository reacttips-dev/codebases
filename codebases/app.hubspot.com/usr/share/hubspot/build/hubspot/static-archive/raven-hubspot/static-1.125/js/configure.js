"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configure;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _enviro = _interopRequireDefault(require("enviro"));

var _PortalIdParser = _interopRequireDefault(require("PortalIdParser"));

var _Raven = _interopRequireDefault(require("Raven"));

var _hubspot = _interopRequireDefault(require("hubspot"));

function registerNewRelicErrorCallback(errorsToIgnore) {
  var cb = function cb() {
    _hubspot.default.newRelicErrorsToIgnore(errorsToIgnore);
  };

  if (_hubspot.default._newRelicCallbacks) {
    _hubspot.default._newRelicCallbacks.push(cb);
  } else {
    _hubspot.default._newRelicCallbacks = [cb];
  }
}

function configure(dsn) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (typeof _hubspot.default.bender === 'undefined') {
    if (_enviro.default.getShort('sentry') !== 'prod') {
      console.warn('[raven-hubspot] `project` and `release` Sentry tags will not be set. See: HubSpot/raven-hubspot/issues/40');
    } else {
      _hubspot.default._newRelicCallbacks = _hubspot.default._newRelicCallbacks || [];

      _hubspot.default._newRelicCallbacks.push(function () {
        if (window.newrelic.setCustomAttribute) {
          window.newrelic.setCustomAttribute('ravenMissingTags', true);
        }
      });
    }
  }

  if (!_enviro.default.deployed('sentry')) {
    return;
  }

  var bender = _hubspot.default.bender;
  var defaultOptions = {
    sampleRate: 1,
    ignoreErrors: ['Aborting: redirection in progress', /Aborting: notifying parents of unauthorized response/, /Cannot set property 'install' of undefined/, /ResizeObserver loop completed with undelivered notifications/, /ResizeObserver loop limit exceeded/],
    ignoreUrls: []
  };
  var providedErrorsToIgnore = options.ignoreErrors || [];
  options = Object.assign({}, defaultOptions, {}, options, {
    ignoreErrors: [].concat((0, _toConsumableArray2.default)(defaultOptions.ignoreErrors), (0, _toConsumableArray2.default)(providedErrorsToIgnore))
  });
  registerNewRelicErrorCallback(options.ignoreErrors);

  var env = _enviro.default.getShort('sentry');

  _Raven.default.config(dsn, {
    release: bender && bender.currentProjectVersion,
    ignoreErrors: options.ignoreErrors,
    ignoreUrls: options.ignoreUrls,
    sampleRate: options.sampleRate,
    environment: env,
    tags: Object.assign({
      env: env,
      project: bender && bender.currentProject,
      portalId: _PortalIdParser.default.get()
    }, options.tags),
    breadcrumbCallback: options.breadcrumbCallback || function (crumb) {
      return crumb;
    },
    autoBreadcrumbs: {
      console: false
    },
    shouldSendCallback: options.shouldSendCallback || function () {
      return true;
    }
  }).install();
}

module.exports = exports.default;