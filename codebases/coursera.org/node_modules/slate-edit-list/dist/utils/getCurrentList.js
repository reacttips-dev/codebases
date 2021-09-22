'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('slate');

var _getCurrentItem = require('./getCurrentItem');

var _getCurrentItem2 = _interopRequireDefault(_getCurrentItem);

var _getListForItem = require('./getListForItem');

var _getListForItem2 = _interopRequireDefault(_getListForItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Return the parent list block, from current selection or from a node (paragraph in a list item).
 */
function getCurrentList(opts, value, block) {
    var item = (0, _getCurrentItem2.default)(opts, value, block);

    if (!item) {
        return null;
    }

    return (0, _getListForItem2.default)(opts, value, item);
}
exports.default = getCurrentList;