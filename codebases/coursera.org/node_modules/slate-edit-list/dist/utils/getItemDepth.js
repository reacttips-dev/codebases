'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('slate');

var _getCurrentItem = require('./getCurrentItem');

var _getCurrentItem2 = _interopRequireDefault(_getCurrentItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get depth of current block in a document list
 */
function getItemDepth(opts, value, block) {
    var document = value.document,
        startBlock = value.startBlock;

    block = block || startBlock;

    var currentItem = (0, _getCurrentItem2.default)(opts, value, block);
    if (!currentItem) {
        return 0;
    }

    var list = document.getParent(currentItem.key);

    return 1 + getItemDepth(opts, value, list);
}

exports.default = getItemDepth;