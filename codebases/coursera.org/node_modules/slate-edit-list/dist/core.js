'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _options = require('./options');

var _options2 = _interopRequireDefault(_options);

var _validation = require('./validation');

var _changes = require('./changes');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Returns the core of the plugin, limited to the validation and normalization
 * part of `slate-edit-list`, and utils.
 *
 * Import this directly: `import EditListCore from 'slate-edit-table/lib/core'`
 * if you don't care about behavior/rendering and you
 * are only manipulating `Slate.Values` without rendering them.
 * That way you do not depend on importing `slate-react`.
 */
function core() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    opts = new _options2.default(opts);

    return {
        schema: (0, _validation.schema)(opts),
        validateNode: (0, _validation.validateNode)(opts),

        utils: {
            getCurrentItem: _utils.getCurrentItem.bind(null, opts),
            getCurrentList: _utils.getCurrentList.bind(null, opts),
            getItemDepth: _utils.getItemDepth.bind(null, opts),
            getItemsAtRange: _utils.getItemsAtRange.bind(null, opts),
            getPreviousItem: _utils.getPreviousItem.bind(null, opts),
            isList: _utils.isList.bind(null, opts),
            isSelectionInList: _utils.isSelectionInList.bind(null, opts)
        },

        changes: {
            decreaseItemDepth: bindAndScopeChange(opts, _changes.decreaseItemDepth),
            increaseItemDepth: bindAndScopeChange(opts, _changes.increaseItemDepth),
            splitListItem: bindAndScopeChange(opts, _changes.splitListItem),
            unwrapList: bindAndScopeChange(opts, _changes.unwrapList),
            wrapInList: _changes.wrapInList.bind(null, opts)
        }
    };
}

/**
 * Bind a change to given options, and scope it to act only inside a list
 */
function bindAndScopeChange(opts, fn) {
    return function (change) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        var value = change.value;


        if (!(0, _utils.isSelectionInList)(opts, value)) {
            return change;
        }

        // $FlowFixMe
        return fn.apply(undefined, _toConsumableArray([opts, change].concat(args)));
    };
}

exports.default = core;