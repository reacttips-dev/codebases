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

var _immutable = require("immutable");

function partialApply(operation, args) {
  (0, _enforceFunction2.default)(operation);
  var isArray = Array.isArray(args);

  if (!isArray && !_immutable.Iterable.isOrdered(args)) {
    throw new Error("expected `args` to be an Array or OrderedIterable but got `" + args + "`");
  }

  var arrayArgs = isArray ? args : args.toArray();
  return operation.bind.apply(operation, [null].concat((0, _toConsumableArray2.default)(arrayArgs)));
}
/**
 * Like `transmute/partial`, but takes an Array or Iterable of arguments to pass
 * to `operation` rather than a dynamic number of args. Unlike `partial` it is
 * curried.
 *
 * partial : partialApply :: Function.prototype.call : Function.prototype.apply
 *
 * @example
 * const add = (a, b, c) => a + b + c;
 * const add11 = partialApply(add, [5, 6]);
 * add11(7); // returns 18
 *
 * @param  {Function}  operation  the function to bind.
 * @param  {Array|Iterable}  args  ordered collection of arguments to bind to `fn`.
 * @return {Function}
 */


var _default = (0, _curry.default)(partialApply);

exports.default = _default;
module.exports = exports.default;