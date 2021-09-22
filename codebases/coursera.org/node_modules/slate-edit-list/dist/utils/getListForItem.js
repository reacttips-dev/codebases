'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('slate');

var _isList = require('./isList');

var _isList2 = _interopRequireDefault(_isList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Return the parent list block for an item block.
 */
function getListForItem(opts, value, item) {
    var document = value.document;

    var parent = document.getParent(item.key);
    return parent && (0, _isList2.default)(opts, parent) ? parent : null;
}

exports.default = getListForItem;