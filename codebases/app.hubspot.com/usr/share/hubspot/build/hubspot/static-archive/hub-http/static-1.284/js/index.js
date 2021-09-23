"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStack = void 0;

var _freeze = _interopRequireDefault(require("./helpers/freeze"));

var _promise = require("./helpers/promise");

var promisifyMiddleware = function promisifyMiddleware(mw, options) {
  return _promise.Promise.resolve(mw((0, _freeze.default)(Object.assign({}, options, {
    _input: options
  }))));
};

var createStack = function createStack() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  var first = fns[0],
      rest = fns.slice(1);
  return function (options) {
    if (rest.length === 0) {
      return promisifyMiddleware(first, options);
    }

    return rest.reduce(function (composed, current) {
      return composed.then(current);
    }, promisifyMiddleware(first, options));
  };
};

exports.createStack = createStack;