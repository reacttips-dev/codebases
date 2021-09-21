'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = defaultInputValueType;

var _warn = require('../utils/warn');

var _warn2 = _interopRequireDefault(_warn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function defaultInputValueType(props, propName, componentName) {
  var defaultInputValue = props.defaultInputValue,
      defaultSelected = props.defaultSelected,
      multiple = props.multiple,
      selected = props.selected;

  var name = defaultSelected.length ? 'defaultSelected' : 'selected';

  (0, _warn2.default)(!(!multiple && defaultInputValue && (defaultSelected.length || selected && selected.length)), '`defaultInputValue` will be overridden by the value from `' + name + '`.');
}