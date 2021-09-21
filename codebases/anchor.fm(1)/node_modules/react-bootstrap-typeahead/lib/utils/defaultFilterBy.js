'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = defaultFilterBy;

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _some = require('lodash/some');

var _some2 = _interopRequireDefault(_some);

var _stripDiacritics = require('./stripDiacritics');

var _stripDiacritics2 = _interopRequireDefault(_stripDiacritics);

var _warn = require('./warn');

var _warn2 = _interopRequireDefault(_warn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isMatch(input, string, props) {
  if (!props.caseSensitive) {
    input = input.toLowerCase();
    string = string.toLowerCase();
  }

  if (props.ignoreDiacritics) {
    input = (0, _stripDiacritics2.default)(input);
    string = (0, _stripDiacritics2.default)(string);
  }

  return string.indexOf(input) !== -1;
}

/**
 * Default algorithm for filtering results.
 */
function defaultFilterBy(option, state, props) {
  var selected = state.selected,
      text = state.text;
  var filterBy = props.filterBy,
      labelKey = props.labelKey,
      multiple = props.multiple;

  // Don't show selected options in the menu for the multi-select case.

  if (multiple && selected.some(function (o) {
    return (0, _isEqual2.default)(o, option);
  })) {
    return false;
  }

  var fields = filterBy.slice();

  if ((0, _isFunction2.default)(labelKey) && isMatch(text, labelKey(option), props)) {
    return true;
  }

  if ((0, _isString2.default)(labelKey)) {
    // Add the `labelKey` field to the list of fields if it isn't already there.
    if (fields.indexOf(labelKey) === -1) {
      fields.unshift(labelKey);
    }
  }

  if ((0, _isString2.default)(option)) {
    (0, _warn2.default)(fields.length <= 1, 'You cannot filter by properties when `option` is a string.');

    return isMatch(text, option, props);
  }

  return (0, _some2.default)(fields, function (field) {
    var value = option[field];

    if (!(0, _isString2.default)(value)) {
      (0, _warn2.default)(false, 'Fields passed to `filterBy` should have string values. Value will ' + 'be converted to a string; results may be unexpected.');

      // Coerce to string since `toString` isn't null-safe.
      value = value + '';
    }

    return isMatch(text, value, props);
  });
}