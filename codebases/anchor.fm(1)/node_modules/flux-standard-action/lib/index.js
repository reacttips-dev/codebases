'use strict';

exports.__esModule = true;
exports.isFSA = isFSA;
exports.isError = isError;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashIsplainobject = require('lodash.isplainobject');

var _lodashIsplainobject2 = _interopRequireDefault(_lodashIsplainobject);

var validKeys = ['type', 'payload', 'error', 'meta'];

function isValidKey(key) {
  return validKeys.indexOf(key) > -1;
}

function isFSA(action) {
  return _lodashIsplainobject2['default'](action) && typeof action.type !== 'undefined' && Object.keys(action).every(isValidKey);
}

function isError(action) {
  return action.error === true;
}