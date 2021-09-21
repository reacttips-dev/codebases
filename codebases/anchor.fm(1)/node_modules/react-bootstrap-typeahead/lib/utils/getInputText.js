'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _head = require('lodash/head');

var _head2 = _interopRequireDefault(_head);

var _getOptionLabel = require('./getOptionLabel');

var _getOptionLabel2 = _interopRequireDefault(_getOptionLabel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getInputText(_ref) {
  var activeItem = _ref.activeItem,
      labelKey = _ref.labelKey,
      multiple = _ref.multiple,
      selected = _ref.selected,
      text = _ref.text;

  if (multiple) {
    return text;
  }

  if (activeItem) {
    return (0, _getOptionLabel2.default)(activeItem, labelKey);
  }

  var selectedItem = !!selected.length && (0, _head2.default)(selected);
  if (selectedItem) {
    return (0, _getOptionLabel2.default)(selectedItem, labelKey);
  }

  return text;
}

exports.default = getInputText;