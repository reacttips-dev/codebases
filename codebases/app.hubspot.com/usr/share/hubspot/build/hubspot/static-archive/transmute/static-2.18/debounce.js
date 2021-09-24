"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _curry = _interopRequireDefault(require("./curry"));

var _enforceFunction2 = _interopRequireDefault(require("./internal/_enforceFunction"));

var _enforceInterval2 = _interopRequireDefault(require("./internal/_enforceInterval"));

function debounce(interval, operation) {
  (0, _enforceInterval2.default)(interval);
  (0, _enforceFunction2.default)(operation);
  var lastArgs;
  var lastResult;
  var timer = null;

  function cancel() {
    clearTimeout(timer);
    timer = null;
  }

  function runner() {
    cancel();
    lastResult = operation.apply(void 0, (0, _toConsumableArray2.default)(lastArgs));
  }

  function debounced() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    lastArgs = args;
    cancel();
    timer = setTimeout(runner, interval);
    return lastResult;
  }

  debounced.cancel = cancel;
  return debounced;
}
/**
 * `operation` is called `interval` milliseconds after the most recent call.
 *
 * @param  {number} interval of milliseconds
 * @param  {Function} operation
 * @return {any} the most recent result of `operation`
 */


var _default = (0, _curry.default)(debounce);

exports.default = _default;
module.exports = exports.default;