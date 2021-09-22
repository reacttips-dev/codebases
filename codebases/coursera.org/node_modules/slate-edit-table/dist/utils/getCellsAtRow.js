'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('slate');

require('immutable');

/**
 * Returns the list of cells at the given row index
 */
function getCellsAtRow(opts,
// The table
table, rowIndex) {
    return table.nodes.get(rowIndex).nodes;
}

exports.default = getCellsAtRow;