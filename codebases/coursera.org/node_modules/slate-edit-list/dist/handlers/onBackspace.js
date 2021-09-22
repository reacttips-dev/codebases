'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('slate');

var _changes = require('../changes');

var _utils = require('../utils');

/**
 * User pressed Delete in an editor
 */
function onBackspace(event, change, editor, opts) {
    var value = change.value;
    var startOffset = value.startOffset,
        selection = value.selection;

    // Only unwrap...
    // ... with a collapsed selection

    if (selection.isExpanded) {
        return undefined;
    }

    // ... when at the beginning of nodes
    if (startOffset > 0) {
        return undefined;
    }
    // ... in a list
    var currentItem = (0, _utils.getCurrentItem)(opts, value);
    if (!currentItem) {
        return undefined;
    }
    // ... more precisely at the beginning of the current item
    if (!selection.isAtStartOf(currentItem)) {
        return undefined;
    }

    event.preventDefault();
    return (0, _changes.unwrapList)(opts, change);
}
exports.default = onBackspace;