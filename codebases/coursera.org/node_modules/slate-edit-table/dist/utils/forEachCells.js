'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('slate');

/**
 * Run the given function against each cells of the table
 */
function forEachCells(opts,
// The table
table, fn) {
    return table.nodes.forEach(function (row, rowIndex) {
        return row.nodes.forEach(function (cell, columnIndex) {
            return fn(cell, rowIndex, columnIndex);
        });
    });
}
exports.default = forEachCells;