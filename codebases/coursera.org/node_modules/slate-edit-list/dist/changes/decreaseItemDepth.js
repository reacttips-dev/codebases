'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slate = require('slate');

var _utils = require('../utils');

/**
 * Decreases the depth of the current item. The following items will
 * be moved as sublist of the decreased item.
 *
 * No-op for root items.
 */
function decreaseItemDepth(opts, change) {
    var value = change.value;
    var document = value.document;

    // Cannot decrease item depth of root items

    var depth = (0, _utils.getItemDepth)(opts, value);
    if (depth == 1) {
        return change;
    }

    var currentItem = (0, _utils.getCurrentItem)(opts, value);
    if (!currentItem) {
        return change;
    }

    var currentList = document.getParent(currentItem.key);
    var parentItem = document.getParent(currentList.key);
    var parentList = document.getParent(parentItem.key);
    // The items following the item will be moved to a sublist of currentItem
    var followingItems = currentList.nodes.skipUntil(function (i) {
        return i === currentItem;
    }).rest();

    // True if the currentItem and the followingItems make the whole
    // currentList, and hence the currentList will be emptied
    var willEmptyCurrentList = currentList.nodes.size === followingItems.size + 1;

    if (!followingItems.isEmpty()) {
        // Add them as sublist of currentItem
        var sublist = _slate.Block.create({
            object: 'block',
            type: currentList.type,
            data: currentList.data
        });
        // Add the sublist
        change.insertNodeByKey(currentItem.key, currentItem.nodes.size, sublist, { normalize: false });

        change.moveNodeByKey(currentItem.key, parentList.key, parentList.nodes.indexOf(parentItem) + 1, { normalize: false });

        // Move the followingItems to the sublist
        followingItems.forEach(function (item, index) {
            return change.moveNodeByKey(item.key, sublist.key, sublist.nodes.size + index, { normalize: false });
        });
    } else {
        change.moveNodeByKey(currentItem.key, parentList.key, parentList.nodes.indexOf(parentItem) + 1);
    }

    // Remove the currentList completely if needed
    if (willEmptyCurrentList) {
        change.removeNodeByKey(currentList.key);
    }

    return change;
}

exports.default = decreaseItemDepth;