"use strict";
'use es6';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../index");

var _promiseClient = _interopRequireDefault(require("../adapters/promiseClient"));

var core = _interopRequireWildcard(require("../middlewares/core"));

var hubapi = _interopRequireWildcard(require("../middlewares/hubapi"));

var debug = _interopRequireWildcard(require("../middlewares/debug"));

var user = _interopRequireWildcard(require("../middlewares/user"));

var _params = require("../helpers/params");

var _default = (0, _promiseClient.default)((0, _index.createStack)(core.services, hubapi.defaults, user.recyclePromise, debug.allowTimeoutOverride, user.portalIdBody, core.bodyType('application/x-www-form-urlencoded', _params.stringify), user.hubUserInfoEndpointTest, core.httpsOnly, debug.rewriteUrl, core.reportOptionsError, user.logoutOnUnauthorizedOrForbidden, user.retryOnError, core.jsonResponse, user.redirectSuspendedUsers));

exports.default = _default;
module.exports = exports.default;