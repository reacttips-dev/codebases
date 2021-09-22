'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('slate');

var _utils = require('../utils');

var _onEnter = require('./onEnter');

var _onEnter2 = _interopRequireDefault(_onEnter);

var _onModEnter = require('./onModEnter');

var _onModEnter2 = _interopRequireDefault(_onModEnter);

var _onTab = require('./onTab');

var _onTab2 = _interopRequireDefault(_onTab);

var _onBackspace = require('./onBackspace');

var _onBackspace2 = _interopRequireDefault(_onBackspace);

var _onUpDown = require('./onUpDown');

var _onUpDown2 = _interopRequireDefault(_onUpDown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var KEY_ENTER = 'Enter';

var KEY_TAB = 'Tab';
var KEY_BACKSPACE = 'Backspace';
var KEY_DOWN = 'ArrowDown';
var KEY_UP = 'ArrowUp';

/**
 * User is pressing a key in the editor
 */
function onKeyDown(opts, event, change, editor) {
    // Only handle events in cells
    if (!(0, _utils.isSelectionInTable)(opts, change.value)) {
        return undefined;
    }

    // Build arguments list
    var args = [event, change, editor, opts];

    switch (event.key) {
        case KEY_ENTER:
            if (event.metaKey && opts.exitBlockType) {
                return _onModEnter2.default.apply(undefined, args);
            }
            return _onEnter2.default.apply(undefined, args);

        case KEY_TAB:
            return _onTab2.default.apply(undefined, args);
        case KEY_BACKSPACE:
            return _onBackspace2.default.apply(undefined, args);
        case KEY_DOWN:
        case KEY_UP:
            return _onUpDown2.default.apply(undefined, args);
        default:
            return undefined;
    }
}

exports.default = onKeyDown;