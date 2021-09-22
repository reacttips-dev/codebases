'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slate = require('slate');

/**
 * Clear the content of the given cell
 */
function clearCell(opts, change, cell) {
    var newBlock = _slate.Block.create({ type: opts.typeContent });
    var nodes = cell.nodes;

    // Insert a new empty node

    change.insertNodeByKey(cell.key, 0, newBlock, { normalize: false });

    // Remove all previous nodes
    nodes.forEach(function (node) {
        change.removeNodeByKey(node.key);
    });

    change.normalizeNodeByKey(cell.key);

    return change;
}
exports.default = clearCell;