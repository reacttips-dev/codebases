"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _get2 = _interopRequireDefault(require("./internal/_get"));

var _reduce2 = _interopRequireDefault(require("./internal/_reduce"));

var _set2 = _interopRequireDefault(require("./internal/_set"));

var _curry = _interopRequireDefault(require("./curry"));

var _immutable = require("immutable");

var _getIn = _interopRequireDefault(require("./getIn"));

var _isRecord = _interopRequireDefault(require("./isRecord"));

var getInOp = _getIn.default.operation;

function runTransform(transform, newKey, subject) {
  if (typeof transform === 'function') {
    return transform(subject, newKey);
  }

  if (transform === true) {
    return (0, _get2.default)(newKey, subject);
  }

  if (Array.isArray(transform)) {
    return getInOp(transform, subject);
  }

  return (0, _get2.default)(transform, subject);
}

function translate(translation, subject) {
  var result = (0, _isRecord.default)(subject) ? (0, _immutable.Map)() : new subject.constructor();
  return (0, _reduce2.default)(result, function (acc, transform, newKey) {
    return (0, _set2.default)(newKey, runTransform(transform, newKey, subject), acc);
  }, translation);
}

var _default = (0, _curry.default)(translate);

exports.default = _default;
module.exports = exports.default;