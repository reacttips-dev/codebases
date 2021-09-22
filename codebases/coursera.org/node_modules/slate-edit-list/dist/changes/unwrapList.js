'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('slate');

var _utils = require('../utils');

/**
 * Unwrap items at range from their list.
 */
function unwrapList(opts, change) {
    var items = (0, _utils.getItemsAtRange)(opts, change.value);

    if (items.isEmpty()) {
        return change;
    }

    // Unwrap the items from their list
    items.forEach(function (item) {
        return change.unwrapNodeByKey(item.key, { normalize: false });
    });

    // Parent of the list of the items
    var firstItem = items.first();
    var parent = change.value.document.getParent(firstItem.key);

    var index = parent.nodes.findIndex(function (node) {
        return node.key === firstItem.key;
    });

    // Unwrap the items' children
    items.forEach(function (item) {
        item.nodes.forEach(function (node) {
            change.moveNodeByKey(node.key, parent.key, index, {
                normalize: false
            });
            index += 1;
        });
    });

    // Finally, remove the now empty items
    items.forEach(function (item) {
        return change.removeNodeByKey(item.key, { normalize: false });
    });

    return change;
}

exports.default = unwrapList;