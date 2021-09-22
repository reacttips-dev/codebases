'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _immutable = require('immutable');

var _slate = require('slate');

var _createRow = require('./createRow');

var _createRow2 = _interopRequireDefault(_createRow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a table
 */
function createTable(opts, columns, rows, getCellContent) {
    var rowNodes = (0, _immutable.Range)(0, rows).map(function (i) {
        return (0, _createRow2.default)(opts, columns, getCellContent ? getCellContent.bind(null, i) : undefined);
    }).toList();

    return _slate.Block.create({
        type: opts.typeTable,
        nodes: rowNodes
    });
}
exports.default = createTable;