'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('slate');

var _immutable = require('immutable');

var _isList = require('./isList');

var _isList2 = _interopRequireDefault(_isList);

var _getCurrentItem = require('./getCurrentItem');

var _getCurrentItem2 = _interopRequireDefault(_getCurrentItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Return the list of items at the given range. The returned items are
 * the highest list item blocks that cover the range.
 *
 * Returns an empty list if no list of items can cover the range
 */
function getItemsAtRange(opts, value, range) {
    range = range || value.selection;

    if (!range.startKey) {
        return (0, _immutable.List)();
    }

    var document = value.document;


    var startBlock = document.getClosestBlock(range.startKey);
    var endBlock = document.getClosestBlock(range.endKey);

    if (startBlock === endBlock) {
        var item = (0, _getCurrentItem2.default)(opts, value, startBlock);
        return item ? (0, _immutable.List)([item]) : (0, _immutable.List)();
    }

    var ancestor = document.getCommonAncestor(startBlock.key, endBlock.key);

    if ((0, _isList2.default)(opts, ancestor)) {
        var startPath = ancestor.getPath(startBlock.key);
        var endPath = ancestor.getPath(endBlock.key);

        return ancestor.nodes.slice(startPath[0], endPath[0] + 1);
    } else if (ancestor.type === opts.typeItem) {
        // The ancestor is the highest list item that covers the range
        return (0, _immutable.List)([ancestor]);
    }
    // No list of items can cover the range
    return (0, _immutable.List)();
}

exports.default = getItemsAtRange;