'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getMatchBounds = require('./getMatchBounds');

var _getMatchBounds2 = _interopRequireDefault(_getMatchBounds);

var _getOptionLabel = require('./getOptionLabel');

var _getOptionLabel2 = _interopRequireDefault(_getOptionLabel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getHintText(_ref) {
  var activeItem = _ref.activeItem,
      initialItem = _ref.initialItem,
      isMenuShown = _ref.isMenuShown,
      labelKey = _ref.labelKey,
      minLength = _ref.minLength,
      selected = _ref.selected,
      text = _ref.text;

  // Don't display a hint under the following conditions:
  if (
  // No text entered.
  !text ||
  // Text doesn't meet `minLength` threshold.
  text.length < minLength ||
  // The menu is hidden.
  !isMenuShown ||
  // No item in the menu.
  !initialItem ||
  // The initial item is a custom option.
  initialItem.customOption ||
  // One of the menu items is active.
  activeItem ||
  // There's already a selection.
  !!selected.length) {
    return '';
  }

  var initialItemStr = (0, _getOptionLabel2.default)(initialItem, labelKey);
  var bounds = (0, _getMatchBounds2.default)(initialItemStr.toLowerCase(), text.toLowerCase());

  if (!(bounds && bounds.start === 0)) {
    return '';
  }

  // Text matching is case- and accent-insensitive, so to display the hint
  // correctly, splice the input string with the hint string.
  return text + initialItemStr.slice(bounds.end, initialItemStr.length);
}

exports.default = getHintText;