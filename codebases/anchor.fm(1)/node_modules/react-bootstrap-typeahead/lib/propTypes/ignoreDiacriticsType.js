'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ignoreDiacriticsType;

var _warn = require('../utils/warn');

var _warn2 = _interopRequireDefault(_warn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ignoreDiacriticsType(props, propName, componentName) {
  var filterBy = props.filterBy,
      ignoreDiacritics = props.ignoreDiacritics;

  (0, _warn2.default)(ignoreDiacritics || typeof filterBy !== 'function', 'Your `filterBy` function will override the `ignoreDiacritics` prop.');
}