'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('slate');

/**
 * Return the current list item, from current selection or from a node.
 */
function getCurrentItem(opts, value, block) {
    var document = value.document;


    if (!block) {
        if (!value.selection.startKey) return null;
        block = value.startBlock;
    }

    var parent = document.getParent(block.key);
    return parent && parent.type === opts.typeItem ? parent : null;
}
exports.default = getCurrentItem;