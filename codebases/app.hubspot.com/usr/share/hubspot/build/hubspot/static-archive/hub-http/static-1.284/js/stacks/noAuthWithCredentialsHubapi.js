"use strict";
'use es6';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../index");

var core = _interopRequireWildcard(require("../middlewares/core"));

var hubapi = _interopRequireWildcard(require("../middlewares/hubapi"));

var debug = _interopRequireWildcard(require("../middlewares/debug"));

var _default = (0, _index.createStack)(core.services, hubapi.defaults, debug.allowTimeoutOverride, core.jsonBody, core.httpsOnly, hubapi.hubapi, core.withQuery, debug.rewriteUrl, core.reportOptionsError, hubapi.retryOnError, core.validateStatus, core.jsonResponse);

exports.default = _default;
module.exports = exports.default;