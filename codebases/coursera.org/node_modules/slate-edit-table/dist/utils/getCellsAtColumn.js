'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('slate');

require('immutable');

/**
 * Returns the list of cells at the given column index
 */
function getCellsAtColumn(opts,
// The table
table, columnIndex) {
    return table.nodes.map(function (row) {
        return row.nodes.get(columnIndex);
    });
}

exports.default = getCellsAtColumn;