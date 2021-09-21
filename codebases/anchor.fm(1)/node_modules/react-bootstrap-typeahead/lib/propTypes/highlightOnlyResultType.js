'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = highlightOnlyResultType;

var _warn = require('../utils/warn');

var _warn2 = _interopRequireDefault(_warn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function highlightOnlyResultType(props, propName, componentName) {
  var allowNew = props.allowNew,
      highlightOnlyResult = props.highlightOnlyResult;

  (0, _warn2.default)(!(highlightOnlyResult && allowNew), '`highlightOnlyResult` will not work with `allowNew`.');
}