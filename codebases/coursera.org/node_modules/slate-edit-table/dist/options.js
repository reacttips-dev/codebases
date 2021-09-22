'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _immutable = require('immutable');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The plugin options
 */
var Options = function (_Record) {
    _inherits(Options, _Record);

    function Options() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Options);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Options.__proto__ || Object.getPrototypeOf(Options)).call.apply(_ref, [this].concat(args))), _this), _this.isCell = function (node) {
            return node.object == 'block' && node.type == _this.typeCell;
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }
    // The type of table blocks

    // The type of row blocks

    // The type of cell blocks

    // The default type for blocks in cells

    // The type of block inserted when exiting


    /*
     * Return a node filter to find a cell.
     */


    return Options;
}((0, _immutable.Record)({
    typeTable: 'table',
    typeRow: 'table_row',
    typeCell: 'table_cell',
    typeContent: 'paragraph',
    exitBlockType: 'paragraph'
}));

exports.default = Options;