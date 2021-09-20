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
import './currentLineHighlight.css';
import { DynamicViewOverlay } from '../../view/dynamicViewOverlay.js';
import { editorLineHighlight, editorLineHighlightBorder } from '../../../common/view/editorColorRegistry.js';
import * as arrays from '../../../../base/common/arrays.js';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
var isRenderedUsingBorder = true;
var AbstractLineHighlightOverlay = /** @class */ (function (_super) {
    __extends(AbstractLineHighlightOverlay, _super);
    function AbstractLineHighlightOverlay(context) {
        var _this = _super.call(this) || this;
        _this._context = context;
        var options = _this._context.configuration.options;
        var layoutInfo = options.get(107 /* layoutInfo */);
        _this._lineHeight = options.get(49 /* lineHeight */);
        _this._renderLineHighlight = options.get(72 /* renderLineHighlight */);
        _this._contentLeft = layoutInfo.contentLeft;
        _this._contentWidth = layoutInfo.contentWidth;
        _this._selectionIsEmpty = true;
        _this._cursorLineNumbers = [];
        _this._selections = [];
        _this._renderData = null;
        _this._context.addEventHandler(_this);
        return _this;
    }
    AbstractLineHighlightOverlay.prototype.dispose = function () {
        this._context.removeEventHandler(this);
        _super.prototype.dispose.call(this);
    };
    AbstractLineHighlightOverlay.prototype._readFromSelections = function () {
        var hasChanged = false;
        // Only render the first selection when using border
        var renderSelections = isRenderedUsingBorder ? this._selections.slice(0, 1) : this._selections;
        var cursorsLineNumbers = renderSelections.map(function (s) { return s.positionLineNumber; });
        cursorsLineNumbers.sort(function (a, b) { return a - b; });
        if (!arrays.equals(this._cursorLineNumbers, cursorsLineNumbers)) {
            this._cursorLineNumbers = cursorsLineNumbers;
            hasChanged = true;
        }
        var selectionIsEmpty = renderSelections.every(function (s) { return s.isEmpty(); });
        if (this._selectionIsEmpty !== selectionIsEmpty) {
            this._selectionIsEmpty = selectionIsEmpty;
            hasChanged = true;
        }
        return hasChanged;
    };
    // --- begin event handlers
    AbstractLineHighlightOverlay.prototype.onThemeChanged = function (e) {
        return this._readFromSelections();
    };
    AbstractLineHighlightOverlay.prototype.onConfigurationChanged = function (e) {
        var options = this._context.configuration.options;
        var layoutInfo = options.get(107 /* layoutInfo */);
        this._lineHeight = options.get(49 /* lineHeight */);
        this._renderLineHighlight = options.get(72 /* renderLineHighlight */);
        this._contentLeft = layoutInfo.contentLeft;
        this._contentWidth = layoutInfo.contentWidth;
        return true;
    };
    AbstractLineHighlightOverlay.prototype.onCursorStateChanged = function (e) {
        this._selections = e.selections;
        return this._readFromSelections();
    };
    AbstractLineHighlightOverlay.prototype.onFlushed = function (e) {
        return true;
    };
    AbstractLineHighlightOverlay.prototype.onLinesDeleted = function (e) {
        return true;
    };
    AbstractLineHighlightOverlay.prototype.onLinesInserted = function (e) {
        return true;
    };
    AbstractLineHighlightOverlay.prototype.onScrollChanged = function (e) {
        return e.scrollWidthChanged || e.scrollTopChanged;
    };
    AbstractLineHighlightOverlay.prototype.onZonesChanged = function (e) {
        return true;
    };
    // --- end event handlers
    AbstractLineHighlightOverlay.prototype.prepareRender = function (ctx) {
        if (!this._shouldRenderThis()) {
            this._renderData = null;
            return;
        }
        var renderedLine = this._renderOne(ctx);
        var visibleStartLineNumber = ctx.visibleRange.startLineNumber;
        var visibleEndLineNumber = ctx.visibleRange.endLineNumber;
        var len = this._cursorLineNumbers.length;
        var index = 0;
        var renderData = [];
        for (var lineNumber = visibleStartLineNumber; lineNumber <= visibleEndLineNumber; lineNumber++) {
            var lineIndex = lineNumber - visibleStartLineNumber;
            while (index < len && this._cursorLineNumbers[index] < lineNumber) {
                index++;
            }
            if (index < len && this._cursorLineNumbers[index] === lineNumber) {
                renderData[lineIndex] = renderedLine;
            }
            else {
                renderData[lineIndex] = '';
            }
        }
        this._renderData = renderData;
    };
    AbstractLineHighlightOverlay.prototype.render = function (startLineNumber, lineNumber) {
        if (!this._renderData) {
            return '';
        }
        var lineIndex = lineNumber - startLineNumber;
        if (lineIndex >= this._renderData.length) {
            return '';
        }
        return this._renderData[lineIndex];
    };
    return AbstractLineHighlightOverlay;
}(DynamicViewOverlay));
export { AbstractLineHighlightOverlay };
var CurrentLineHighlightOverlay = /** @class */ (function (_super) {
    __extends(CurrentLineHighlightOverlay, _super);
    function CurrentLineHighlightOverlay() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CurrentLineHighlightOverlay.prototype._renderOne = function (ctx) {
        var className = 'current-line' + (this._shouldRenderOther() ? ' current-line-both' : '');
        return "<div class=\"" + className + "\" style=\"width:" + Math.max(ctx.scrollWidth, this._contentWidth) + "px; height:" + this._lineHeight + "px;\"></div>";
    };
    CurrentLineHighlightOverlay.prototype._shouldRenderThis = function () {
        return ((this._renderLineHighlight === 'line' || this._renderLineHighlight === 'all')
            && this._selectionIsEmpty);
    };
    CurrentLineHighlightOverlay.prototype._shouldRenderOther = function () {
        return ((this._renderLineHighlight === 'gutter' || this._renderLineHighlight === 'all'));
    };
    return CurrentLineHighlightOverlay;
}(AbstractLineHighlightOverlay));
export { CurrentLineHighlightOverlay };
var CurrentLineMarginHighlightOverlay = /** @class */ (function (_super) {
    __extends(CurrentLineMarginHighlightOverlay, _super);
    function CurrentLineMarginHighlightOverlay() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CurrentLineMarginHighlightOverlay.prototype._renderOne = function (ctx) {
        var className = 'current-line current-line-margin' + (this._shouldRenderOther() ? ' current-line-margin-both' : '');
        return "<div class=\"" + className + "\" style=\"width:" + this._contentLeft + "px; height:" + this._lineHeight + "px;\"></div>";
    };
    CurrentLineMarginHighlightOverlay.prototype._shouldRenderThis = function () {
        return ((this._renderLineHighlight === 'gutter' || this._renderLineHighlight === 'all'));
    };
    CurrentLineMarginHighlightOverlay.prototype._shouldRenderOther = function () {
        return ((this._renderLineHighlight === 'line' || this._renderLineHighlight === 'all')
            && this._selectionIsEmpty);
    };
    return CurrentLineMarginHighlightOverlay;
}(AbstractLineHighlightOverlay));
export { CurrentLineMarginHighlightOverlay };
registerThemingParticipant(function (theme, collector) {
    isRenderedUsingBorder = false;
    var lineHighlight = theme.getColor(editorLineHighlight);
    if (lineHighlight) {
        collector.addRule(".monaco-editor .view-overlays .current-line { background-color: " + lineHighlight + "; }");
        collector.addRule(".monaco-editor .margin-view-overlays .current-line-margin { background-color: " + lineHighlight + "; border: none; }");
    }
    if (!lineHighlight || lineHighlight.isTransparent() || theme.defines(editorLineHighlightBorder)) {
        var lineHighlightBorder = theme.getColor(editorLineHighlightBorder);
        if (lineHighlightBorder) {
            isRenderedUsingBorder = true;
            collector.addRule(".monaco-editor .view-overlays .current-line { border: 2px solid " + lineHighlightBorder + "; }");
            collector.addRule(".monaco-editor .margin-view-overlays .current-line-margin { border: 2px solid " + lineHighlightBorder + "; }");
            if (theme.type === 'hc') {
                collector.addRule(".monaco-editor .view-overlays .current-line { border-width: 1px; }");
                collector.addRule(".monaco-editor .margin-view-overlays .current-line-margin { border-width: 1px; }");
            }
        }
    }
});
