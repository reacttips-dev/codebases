'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = caseSensitiveType;

var _warn = require('../utils/warn');

var _warn2 = _interopRequireDefault(_warn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function caseSensitiveType(props, propName, componentName) {
  var caseSensitive = props.caseSensitive,
      filterBy = props.filterBy;

  (0, _warn2.default)(!caseSensitive || typeof filterBy !== 'function', 'Your `filterBy` function will override the `caseSensitive` prop.');
}