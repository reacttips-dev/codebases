"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _promiseClient = _interopRequireDefault(require("../adapters/promiseClient"));

var _noAuthWithCredentialsHubapi = _interopRequireDefault(require("../stacks/noAuthWithCredentialsHubapi"));

var _default = (0, _promiseClient.default)(_noAuthWithCredentialsHubapi.default);

exports.default = _default;
module.exports = exports.default;