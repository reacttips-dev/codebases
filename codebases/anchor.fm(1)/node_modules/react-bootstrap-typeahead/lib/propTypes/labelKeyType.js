'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = labelKeyType;

var _warn = require('../utils/warn');

var _warn2 = _interopRequireDefault(_warn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function labelKeyType(props, propName, componentName) {
  var allowNew = props.allowNew,
      labelKey = props.labelKey;

  (0, _warn2.default)(!(typeof labelKey === 'function' && allowNew), '`labelKey` must be a string when `allowNew={true}`.');
}