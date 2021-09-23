"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = partial;

var _enforceFunction2 = _interopRequireDefault(require("./internal/_enforceFunction"));

/**
 * Like `fn.bind()`, but without the option to pass `context`.
 *
 * `partial` is _not_ curried.
 *
 * const add = (a, b, c) => a + b + c;
 * const add11 = partial(add, 5, 6);
 * add11(7); // returns 18
 *
 * @param  {Function} operation  the function to bind.
 * @param  {any} first the first argument to pass to `operation`
 * @param  {Array<any>} ...args  any number of other arguments to pass to `operation`
 * @return {Function}
 */
function partial(operation, first) {
  (0, _enforceFunction2.default)(operation);

  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  return operation.bind.apply(operation, [null, first].concat(args));
}

module.exports = exports.default;