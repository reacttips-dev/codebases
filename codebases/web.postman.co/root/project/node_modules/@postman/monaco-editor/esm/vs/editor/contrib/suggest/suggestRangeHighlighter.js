/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { DisposableStore, dispose } from '../../../base/common/lifecycle.js';
import { Range } from '../../common/core/range.js';
import { Emitter } from '../../../base/common/event.js';
import { domEvent } from '../../../base/browser/event.js';
var SuggestRangeHighlighter = /** @class */ (function () {
    function SuggestRangeHighlighter(_controller) {
        var _this = this;
        this._controller = _controller;
        this._disposables = new DisposableStore();
        this._decorations = [];
        this._disposables.add(_controller.model.onDidSuggest(function (e) {
            if (!e.shy) {
                var widget = _this._controller.widget.getValue();
                var focused = widget.getFocusedItem();
                if (focused) {
                    _this._highlight(focused.item);
                }
                if (!_this._widgetListener) {
                    _this._widgetListener = widget.onDidFocus(function (e) { return _this._highlight(e.item); });
                }
            }
        }));
        this._disposables.add(_controller.model.onDidCancel(function () {
            _this._reset();
        }));
    }
    SuggestRangeHighlighter.prototype.dispose = function () {
        this._reset();
        this._disposables.dispose();
        dispose(this._widgetListener);
        dispose(this._shiftKeyListener);
    };
    SuggestRangeHighlighter.prototype._reset = function () {
        this._decorations = this._controller.editor.deltaDecorations(this._decorations, []);
        if (this._shiftKeyListener) {
            this._shiftKeyListener.dispose();
            this._shiftKeyListener = undefined;
        }
    };
    SuggestRangeHighlighter.prototype._highlight = function (item) {
        var _this = this;
        var _a;
        this._currentItem = item;
        var opts = this._controller.editor.getOption(89 /* suggest */);
        var newDeco = [];
        if (opts.insertHighlight) {
            if (!this._shiftKeyListener) {
                this._shiftKeyListener = shiftKey.event(function () { return _this._highlight(_this._currentItem); });
            }
            var info = this._controller.getOverwriteInfo(item, shiftKey.isPressed);
            var position = this._controller.editor.getPosition();
            if (opts.insertMode === 'insert' && info.overwriteAfter > 0) {
                // wants inserts but got replace-mode -> highlight AFTER range
                newDeco = [{
                        range: new Range(position.lineNumber, position.column, position.lineNumber, position.column + info.overwriteAfter),
                        options: { inlineClassName: 'suggest-insert-unexpected' }
                    }];
            }
            else if (opts.insertMode === 'replace' && info.overwriteAfter === 0) {
                // want replace but likely got insert -> highlight AFTER range
                var wordInfo = (_a = this._controller.editor.getModel()) === null || _a === void 0 ? void 0 : _a.getWordAtPosition(position);
                if (wordInfo && wordInfo.endColumn > position.column) {
                    newDeco = [{
                            range: new Range(position.lineNumber, position.column, position.lineNumber, wordInfo.endColumn),
                            options: { inlineClassName: 'suggest-insert-unexpected' }
                        }];
                }
            }
        }
        // update editor decorations
        this._decorations = this._controller.editor.deltaDecorations(this._decorations, newDeco);
    };
    return SuggestRangeHighlighter;
}());
export { SuggestRangeHighlighter };
var shiftKey = new /** @class */ (function (_super) {
    __extends(ShiftKey, _super);
    function ShiftKey() {
        var _this = _super.call(this) || this;
        _this._subscriptions = new DisposableStore();
        _this._isPressed = false;
        _this._subscriptions.add(domEvent(document.body, 'keydown')(function (e) { return _this.isPressed = e.shiftKey; }));
        _this._subscriptions.add(domEvent(document.body, 'keyup')(function () { return _this.isPressed = false; }));
        _this._subscriptions.add(domEvent(document.body, 'mouseleave')(function () { return _this.isPressed = false; }));
        _this._subscriptions.add(domEvent(document.body, 'blur')(function () { return _this.isPressed = false; }));
        return _this;
    }
    Object.defineProperty(ShiftKey.prototype, "isPressed", {
        get: function () {
            return this._isPressed;
        },
        set: function (value) {
            if (this._isPressed !== value) {
                this._isPressed = value;
                this.fire(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    ShiftKey.prototype.dispose = function () {
        this._subscriptions.dispose();
        _super.prototype.dispose.call(this);
    };
    return ShiftKey;
}(Emitter));
