'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _uniqueId = require('lodash/uniqueId');

var _uniqueId2 = _interopRequireDefault(_uniqueId);

var _getOptionLabel = require('./getOptionLabel');

var _getOptionLabel2 = _interopRequireDefault(_getOptionLabel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function addCustomOption(results, text, labelKey) {
  var exactMatchFound = results.some(function (o) {
    return (0, _getOptionLabel2.default)(o, labelKey) === text;
  });

  if (!text.trim() || exactMatchFound) {
    return results;
  }

  !(typeof labelKey === 'string') ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, '`labelKey` must be a string when creating new options.') : (0, _invariant2.default)(false) : void 0;

  var customOption = _defineProperty({
    customOption: true,
    id: (0, _uniqueId2.default)('new-id-')
  }, labelKey, text);

  return [].concat(_toConsumableArray(results), [customOption]);
}

exports.default = addCustomOption;