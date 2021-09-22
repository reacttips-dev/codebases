'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _options = require('./options');

var _options2 = _interopRequireDefault(_options);

var _handlers = require('./handlers');

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var KEY_ENTER = 'Enter';
var KEY_TAB = 'Tab';
var KEY_BACKSPACE = 'Backspace';

/**
 * A Slate plugin to handle keyboard events in lists.
 */
function EditList() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    opts = new _options2.default(opts);
    var corePlugin = (0, _core2.default)(opts);

    return _extends({}, corePlugin, {

        onKeyDown: onKeyDown.bind(null, opts)
    });
}

/**
 * User is pressing a key in the editor
 */
function onKeyDown(opts, event, change, editor) {
    var args = [event, change, editor, opts];

    switch (event.key) {
        case KEY_ENTER:
            return _handlers.onEnter.apply(undefined, args);
        case KEY_TAB:
            return _handlers.onTab.apply(undefined, args);
        case KEY_BACKSPACE:
            return _handlers.onBackspace.apply(undefined, args);
        default:
            return undefined;
    }
}

exports.default = EditList;