'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = inputPropsType;

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _warn = require('../utils/warn');

var _warn2 = _interopRequireDefault(_warn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BLACKLIST = [{ alt: 'onBlur', prop: 'onBlur' }, { alt: 'onInputChange', prop: 'onChange' }, { alt: 'onFocus', prop: 'onFocus' }, { alt: 'onKeyDown', prop: 'onKeyDown' }];

function inputPropsType(props, propName, componentName) {
  var inputProps = props.inputProps;

  if (!(inputProps && (0, _isPlainObject2.default)(inputProps))) {
    return;
  }

  // Blacklisted properties.
  BLACKLIST.forEach(function (_ref) {
    var alt = _ref.alt,
        prop = _ref.prop;

    var msg = alt ? ' Use the top-level `' + alt + '` prop instead.' : null;
    (0, _warn2.default)(!inputProps.hasOwnProperty(prop), 'The `' + prop + '` property of `inputProps` will be ignored.' + msg);
  });
}