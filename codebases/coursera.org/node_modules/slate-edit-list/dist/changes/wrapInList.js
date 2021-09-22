'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slate = require('slate');

var _immutable = require('immutable');

var _utils = require('../utils');

/**
 * Wrap the blocks in the current selection in a new list. Selected
 * lists are merged together.
 */
function wrapInList(opts, change, type, data) {
    var selectedBlocks = getHighestSelectedBlocks(change.value);
    type = type || opts.types[0];

    // Wrap in container
    change.wrapBlock({
        type: type,
        data: _slate.Data.create(data)
    }, { normalize: false });

    // Wrap in list items
    selectedBlocks.forEach(function (node) {
        if ((0, _utils.isList)(opts, node)) {
            // Merge its items with the created list
            node.nodes.forEach(function (_ref) {
                var key = _ref.key;
                return change.unwrapNodeByKey(key, { normalize: false });
            });
        } else {
            change.wrapBlockByKey(node.key, opts.typeItem, {
                normalize: false
            });
        }
    });

    return change.normalize();
}

/**
 * Returns the highest list of blocks that cover the current selection
 */

function getHighestSelectedBlocks(value) {
    var range = value.selection;
    var document = value.document;


    var startBlock = document.getClosestBlock(range.startKey);
    var endBlock = document.getClosestBlock(range.endKey);

    if (startBlock === endBlock) {
        return (0, _immutable.List)([startBlock]);
    }
    var ancestor = document.getCommonAncestor(startBlock.key, endBlock.key);
    var startPath = ancestor.getPath(startBlock.key);
    var endPath = ancestor.getPath(endBlock.key);

    return ancestor.nodes.slice(startPath[0], endPath[0] + 1);
}

exports.default = wrapInList;