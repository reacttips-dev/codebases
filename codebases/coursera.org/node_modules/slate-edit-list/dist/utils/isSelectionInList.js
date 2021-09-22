'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('slate');

var _getItemsAtRange = require('./getItemsAtRange');

var _getItemsAtRange2 = _interopRequireDefault(_getItemsAtRange);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * True if selection is inside a list (and can be unwrapped)
 */
function isSelectionInList(opts, value) {
  return !(0, _getItemsAtRange2.default)(opts, value).isEmpty();
}

exports.default = isSelectionInList;