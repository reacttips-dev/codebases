"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _enviro = _interopRequireDefault(require("enviro"));

var isFunction = function isFunction(options) {
  return typeof options === 'function';
}; // IE11 symbols are just normal properties and don't need this to get picked up


var getOwnPropertySymbols = Object.getOwnPropertySymbols || function () {
  return [];
};

var _default = function _default(options) {
  if (_enviro.default.deployed('hub-http') || !Object.freeze) return options;
  Object.freeze(options);
  Object.getOwnPropertyNames(options).concat(getOwnPropertySymbols(options)).forEach(function (name) {
    if (isFunction(options) && name !== 'caller' && name !== 'callee' && options[name] != null && !Object.isFrozen(options[name])) {
      Object.freeze(options[name]);
    }
  });
  return options;
};

exports.default = _default;
module.exports = exports.default;