"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _curry = _interopRequireDefault(require("./curry"));

function bind(operation, context) {
  return operation.bind(context);
}
/**
 * Sets a function's `this` context. Similar to `Function.prototype.bind`.
 *
 * @example
 * bind(console.log, console);
 *
 * @param {Function} operation
 * @param {Object} context
 * @return {Function}
 */


var _default = (0, _curry.default)(bind);

exports.default = _default;
module.exports = exports.default;