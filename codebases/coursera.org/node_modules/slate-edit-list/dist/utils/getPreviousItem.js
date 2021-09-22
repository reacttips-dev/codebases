'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('slate');

var _getCurrentItem = require('./getCurrentItem');

var _getCurrentItem2 = _interopRequireDefault(_getCurrentItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Return the previous item, from current selection or from a node.
 */
function getPreviousItem(opts, value, block) {
    var document = value.document,
        startBlock = value.startBlock;

    block = block || startBlock;

    var currentItem = (0, _getCurrentItem2.default)(opts, value, block);
    if (!currentItem) {
        return null;
    }

    var previousSibling = document.getPreviousSibling(currentItem.key);

    if (!previousSibling) {
        return null;
    } else if (previousSibling.type === opts.typeItem) {
        return previousSibling;
    }
    return null;
}

exports.default = getPreviousItem;