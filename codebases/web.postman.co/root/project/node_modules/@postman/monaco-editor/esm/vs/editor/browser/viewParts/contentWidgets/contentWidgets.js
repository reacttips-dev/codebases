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
import * as dom from '../../../../base/browser/dom.js';
import { createFastDomNode } from '../../../../base/browser/fastDomNode.js';
import { PartFingerprints, ViewPart } from '../../view/viewPart.js';
var Coordinate = /** @class */ (function () {
    function Coordinate(top, left) {
        this.top = top;
        this.left = left;
    }
    return Coordinate;
}());
var ViewContentWidgets = /** @class */ (function (_super) {
    __extends(ViewContentWidgets, _super);
    function ViewContentWidgets(context, viewDomNode) {
        var _this = _super.call(this, context) || this;
        _this._viewDomNode = viewDomNode;
        _this._widgets = {};
        _this.domNode = createFastDomNode(document.createElement('div'));
        PartFingerprints.write(_this.domNode, 1 /* ContentWidgets */);
        _this.domNode.setClassName('contentWidgets');
        _this.domNode.setPosition('absolute');
        _this.domNode.setTop(0);
        _this.overflowingContentWidgetsDomNode = createFastDomNode(document.createElement('div'));
        PartFingerprints.write(_this.overflowingContentWidgetsDomNode, 2 /* OverflowingContentWidgets */);
        _this.overflowingContentWidgetsDomNode.setClassName('overflowingContentWidgets');
        return _this;
    }
    ViewContentWidgets.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this._widgets = {};
    };
    // --- begin event handlers
    ViewContentWidgets.prototype.onConfigurationChanged = function (e) {
        var keys = Object.keys(this._widgets);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var widgetId = keys_1[_i];
            this._widgets[widgetId].onConfigurationChanged(e);
        }
        return true;
    };
    ViewContentWidgets.prototype.onDecorationsChanged = function (e) {
        // true for inline decorations that can end up relayouting text
        return true;
    };
    ViewContentWidgets.prototype.onFlushed = function (e) {
        return true;
    };
    ViewContentWidgets.prototype.onLineMappingChanged = function (e) {
        var keys = Object.keys(this._widgets);
        for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
            var widgetId = keys_2[_i];
            this._widgets[widgetId].onLineMappingChanged(e);
        }
        return true;
    };
    ViewContentWidgets.prototype.onLinesChanged = function (e) {
        return true;
    };
    ViewContentWidgets.prototype.onLinesDeleted = function (e) {
        return true;
    };
    ViewContentWidgets.prototype.onLinesInserted = function (e) {
        return true;
    };
    ViewContentWidgets.prototype.onScrollChanged = function (e) {
        return true;
    };
    ViewContentWidgets.prototype.onZonesChanged = function (e) {
        return true;
    };
    // ---- end view event handlers
    ViewContentWidgets.prototype.addWidget = function (_widget) {
        var myWidget = new Widget(this._context, this._viewDomNode, _widget);
        this._widgets[myWidget.id] = myWidget;
        if (myWidget.allowEditorOverflow) {
            this.overflowingContentWidgetsDomNode.appendChild(myWidget.domNode);
        }
        else {
            this.domNode.appendChild(myWidget.domNode);
        }
        this.setShouldRender();
    };
    ViewContentWidgets.prototype.setWidgetPosition = function (widget, range, preference) {
        var myWidget = this._widgets[widget.getId()];
        myWidget.setPosition(range, preference);
        this.setShouldRender();
    };
    ViewContentWidgets.prototype.removeWidget = function (widget) {
        var widgetId = widget.getId();
        if (this._widgets.hasOwnProperty(widgetId)) {
            var myWidget = this._widgets[widgetId];
            delete this._widgets[widgetId];
            var domNode = myWidget.domNode.domNode;
            domNode.parentNode.removeChild(domNode);
            domNode.removeAttribute('monaco-visible-content-widget');
            this.setShouldRender();
        }
    };
    ViewContentWidgets.prototype.shouldSuppressMouseDownOnWidget = function (widgetId) {
        if (this._widgets.hasOwnProperty(widgetId)) {
            return this._widgets[widgetId].suppressMouseDown;
        }
        return false;
    };
    ViewContentWidgets.prototype.onBeforeRender = function (viewportData) {
        var keys = Object.keys(this._widgets);
        for (var _i = 0, keys_3 = keys; _i < keys_3.length; _i++) {
            var widgetId = keys_3[_i];
            this._widgets[widgetId].onBeforeRender(viewportData);
        }
    };
    ViewContentWidgets.prototype.prepareRender = function (ctx) {
        var keys = Object.keys(this._widgets);
        for (var _i = 0, keys_4 = keys; _i < keys_4.length; _i++) {
            var widgetId = keys_4[_i];
            this._widgets[widgetId].prepareRender(ctx);
        }
    };
    ViewContentWidgets.prototype.render = function (ctx) {
        var keys = Object.keys(this._widgets);
        for (var _i = 0, keys_5 = keys; _i < keys_5.length; _i++) {
            var widgetId = keys_5[_i];
            this._widgets[widgetId].render(ctx);
        }
    };
    return ViewContentWidgets;
}(ViewPart));
export { ViewContentWidgets };
var Widget = /** @class */ (function () {
    function Widget(context, viewDomNode, actual) {
        this._context = context;
        this._viewDomNode = viewDomNode;
        this._actual = actual;
        this.domNode = createFastDomNode(this._actual.getDomNode());
        this.id = this._actual.getId();
        this.allowEditorOverflow = this._actual.allowEditorOverflow || false;
        this.suppressMouseDown = this._actual.suppressMouseDown || false;
        var options = this._context.configuration.options;
        var layoutInfo = options.get(107 /* layoutInfo */);
        this._fixedOverflowWidgets = options.get(29 /* fixedOverflowWidgets */);
        this._contentWidth = layoutInfo.contentWidth;
        this._contentLeft = layoutInfo.contentLeft;
        this._lineHeight = options.get(49 /* lineHeight */);
        this._range = null;
        this._viewRange = null;
        this._preference = [];
        this._cachedDomNodeClientWidth = -1;
        this._cachedDomNodeClientHeight = -1;
        this._maxWidth = this._getMaxWidth();
        this._isVisible = false;
        this._renderData = null;
        this.domNode.setPosition((this._fixedOverflowWidgets && this.allowEditorOverflow) ? 'fixed' : 'absolute');
        this.domNode.setVisibility('hidden');
        this.domNode.setAttribute('widgetId', this.id);
        this.domNode.setMaxWidth(this._maxWidth);
    }
    Widget.prototype.onConfigurationChanged = function (e) {
        var options = this._context.configuration.options;
        this._lineHeight = options.get(49 /* lineHeight */);
        if (e.hasChanged(107 /* layoutInfo */)) {
            var layoutInfo = options.get(107 /* layoutInfo */);
            this._contentLeft = layoutInfo.contentLeft;
            this._contentWidth = layoutInfo.contentWidth;
            this._maxWidth = this._getMaxWidth();
        }
    };
    Widget.prototype.onLineMappingChanged = function (e) {
        this._setPosition(this._range);
    };
    Widget.prototype._setPosition = function (range) {
        this._range = range;
        this._viewRange = null;
        if (this._range) {
            // Do not trust that widgets give a valid position
            var validModelRange = this._context.model.validateModelRange(this._range);
            if (this._context.model.coordinatesConverter.modelPositionIsVisible(validModelRange.getStartPosition()) || this._context.model.coordinatesConverter.modelPositionIsVisible(validModelRange.getEndPosition())) {
                this._viewRange = this._context.model.coordinatesConverter.convertModelRangeToViewRange(validModelRange);
            }
        }
    };
    Widget.prototype._getMaxWidth = function () {
        return (this.allowEditorOverflow
            ? window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
            : this._contentWidth);
    };
    Widget.prototype.setPosition = function (range, preference) {
        this._setPosition(range);
        this._preference = preference;
        this._cachedDomNodeClientWidth = -1;
        this._cachedDomNodeClientHeight = -1;
    };
    Widget.prototype._layoutBoxInViewport = function (topLeft, bottomLeft, width, height, ctx) {
        // Our visible box is split horizontally by the current line => 2 boxes
        // a) the box above the line
        var aboveLineTop = topLeft.top;
        var heightAboveLine = aboveLineTop;
        // b) the box under the line
        var underLineTop = bottomLeft.top + this._lineHeight;
        var heightUnderLine = ctx.viewportHeight - underLineTop;
        var aboveTop = aboveLineTop - height;
        var fitsAbove = (heightAboveLine >= height);
        var belowTop = underLineTop;
        var fitsBelow = (heightUnderLine >= height);
        // And its left
        var actualAboveLeft = topLeft.left;
        var actualBelowLeft = bottomLeft.left;
        if (actualAboveLeft + width > ctx.scrollLeft + ctx.viewportWidth) {
            actualAboveLeft = ctx.scrollLeft + ctx.viewportWidth - width;
        }
        if (actualBelowLeft + width > ctx.scrollLeft + ctx.viewportWidth) {
            actualBelowLeft = ctx.scrollLeft + ctx.viewportWidth - width;
        }
        if (actualAboveLeft < ctx.scrollLeft) {
            actualAboveLeft = ctx.scrollLeft;
        }
        if (actualBelowLeft < ctx.scrollLeft) {
            actualBelowLeft = ctx.scrollLeft;
        }
        return {
            fitsAbove: fitsAbove,
            aboveTop: aboveTop,
            aboveLeft: actualAboveLeft,
            fitsBelow: fitsBelow,
            belowTop: belowTop,
            belowLeft: actualBelowLeft,
        };
    };
    Widget.prototype._layoutHorizontalSegmentInPage = function (windowSize, domNodePosition, left, width) {
        // Initially, the limits are defined as the dom node limits
        var MIN_LIMIT = Math.max(0, domNodePosition.left - width);
        var MAX_LIMIT = Math.min(domNodePosition.left + domNodePosition.width + width, windowSize.width);
        var absoluteLeft = domNodePosition.left + left - dom.StandardWindow.scrollX;
        if (absoluteLeft + width > MAX_LIMIT) {
            var delta = absoluteLeft - (MAX_LIMIT - width);
            absoluteLeft -= delta;
            left -= delta;
        }
        if (absoluteLeft < MIN_LIMIT) {
            var delta = absoluteLeft - MIN_LIMIT;
            absoluteLeft -= delta;
            left -= delta;
        }
        return [left, absoluteLeft];
    };
    Widget.prototype._layoutBoxInPage = function (topLeft, bottomLeft, width, height, ctx) {
        var aboveTop = topLeft.top - height;
        var belowTop = bottomLeft.top + this._lineHeight;
        var domNodePosition = dom.getDomNodePagePosition(this._viewDomNode.domNode);
        var absoluteAboveTop = domNodePosition.top + aboveTop - dom.StandardWindow.scrollY;
        var absoluteBelowTop = domNodePosition.top + belowTop - dom.StandardWindow.scrollY;
        var windowSize = dom.getClientArea(document.body);
        var _a = this._layoutHorizontalSegmentInPage(windowSize, domNodePosition, topLeft.left - ctx.scrollLeft + this._contentLeft, width), aboveLeft = _a[0], absoluteAboveLeft = _a[1];
        var _b = this._layoutHorizontalSegmentInPage(windowSize, domNodePosition, bottomLeft.left - ctx.scrollLeft + this._contentLeft, width), belowLeft = _b[0], absoluteBelowLeft = _b[1];
        // Leave some clearance to the top/bottom
        var TOP_PADDING = 22;
        var BOTTOM_PADDING = 22;
        var fitsAbove = (absoluteAboveTop >= TOP_PADDING);
        var fitsBelow = (absoluteBelowTop + height <= windowSize.height - BOTTOM_PADDING);
        if (this._fixedOverflowWidgets) {
            return {
                fitsAbove: fitsAbove,
                aboveTop: Math.max(absoluteAboveTop, TOP_PADDING),
                aboveLeft: absoluteAboveLeft,
                fitsBelow: fitsBelow,
                belowTop: absoluteBelowTop,
                belowLeft: absoluteBelowLeft
            };
        }
        return {
            fitsAbove: fitsAbove,
            aboveTop: Math.max(aboveTop, TOP_PADDING),
            aboveLeft: aboveLeft,
            fitsBelow: fitsBelow,
            belowTop: belowTop,
            belowLeft: belowLeft
        };
    };
    Widget.prototype._prepareRenderWidgetAtExactPositionOverflowing = function (topLeft) {
        return new Coordinate(topLeft.top, topLeft.left + this._contentLeft);
    };
    /**
     * Compute `this._topLeft`
     */
    Widget.prototype._getTopAndBottomLeft = function (ctx) {
        if (!this._viewRange) {
            return [null, null];
        }
        var visibleRangesForRange = ctx.linesVisibleRangesForRange(this._viewRange, false);
        if (!visibleRangesForRange || visibleRangesForRange.length === 0) {
            return [null, null];
        }
        var firstLine = visibleRangesForRange[0];
        var lastLine = visibleRangesForRange[0];
        for (var _i = 0, visibleRangesForRange_1 = visibleRangesForRange; _i < visibleRangesForRange_1.length; _i++) {
            var visibleRangesForLine = visibleRangesForRange_1[_i];
            if (visibleRangesForLine.lineNumber < firstLine.lineNumber) {
                firstLine = visibleRangesForLine;
            }
            if (visibleRangesForLine.lineNumber > lastLine.lineNumber) {
                lastLine = visibleRangesForLine;
            }
        }
        var firstLineMinLeft = 1073741824 /* MAX_SAFE_SMALL_INTEGER */; //firstLine.Constants.MAX_SAFE_SMALL_INTEGER;
        for (var _a = 0, _b = firstLine.ranges; _a < _b.length; _a++) {
            var visibleRange = _b[_a];
            if (visibleRange.left < firstLineMinLeft) {
                firstLineMinLeft = visibleRange.left;
            }
        }
        var lastLineMinLeft = 1073741824 /* MAX_SAFE_SMALL_INTEGER */; //lastLine.Constants.MAX_SAFE_SMALL_INTEGER;
        for (var _c = 0, _d = lastLine.ranges; _c < _d.length; _c++) {
            var visibleRange = _d[_c];
            if (visibleRange.left < lastLineMinLeft) {
                lastLineMinLeft = visibleRange.left;
            }
        }
        var topForPosition = ctx.getVerticalOffsetForLineNumber(firstLine.lineNumber) - ctx.scrollTop;
        var topLeft = new Coordinate(topForPosition, firstLineMinLeft);
        var topForBottomLine = ctx.getVerticalOffsetForLineNumber(lastLine.lineNumber) - ctx.scrollTop;
        var bottomLeft = new Coordinate(topForBottomLine, lastLineMinLeft);
        return [topLeft, bottomLeft];
    };
    Widget.prototype._prepareRenderWidget = function (ctx) {
        var _a = this._getTopAndBottomLeft(ctx), topLeft = _a[0], bottomLeft = _a[1];
        if (!topLeft || !bottomLeft) {
            return null;
        }
        if (this._cachedDomNodeClientWidth === -1 || this._cachedDomNodeClientHeight === -1) {
            var domNode = this.domNode.domNode;
            this._cachedDomNodeClientWidth = domNode.clientWidth;
            this._cachedDomNodeClientHeight = domNode.clientHeight;
        }
        var placement;
        if (this.allowEditorOverflow) {
            placement = this._layoutBoxInPage(topLeft, bottomLeft, this._cachedDomNodeClientWidth, this._cachedDomNodeClientHeight, ctx);
        }
        else {
            placement = this._layoutBoxInViewport(topLeft, bottomLeft, this._cachedDomNodeClientWidth, this._cachedDomNodeClientHeight, ctx);
        }
        // Do two passes, first for perfect fit, second picks first option
        if (this._preference) {
            for (var pass = 1; pass <= 2; pass++) {
                for (var _i = 0, _b = this._preference; _i < _b.length; _i++) {
                    var pref = _b[_i];
                    // placement
                    if (pref === 1 /* ABOVE */) {
                        if (!placement) {
                            // Widget outside of viewport
                            return null;
                        }
                        if (pass === 2 || placement.fitsAbove) {
                            return new Coordinate(placement.aboveTop, placement.aboveLeft);
                        }
                    }
                    else if (pref === 2 /* BELOW */) {
                        if (!placement) {
                            // Widget outside of viewport
                            return null;
                        }
                        if (pass === 2 || placement.fitsBelow) {
                            return new Coordinate(placement.belowTop, placement.belowLeft);
                        }
                    }
                    else {
                        if (this.allowEditorOverflow) {
                            return this._prepareRenderWidgetAtExactPositionOverflowing(topLeft);
                        }
                        else {
                            return topLeft;
                        }
                    }
                }
            }
        }
        return null;
    };
    /**
     * On this first pass, we ensure that the content widget (if it is in the viewport) has the max width set correctly.
     */
    Widget.prototype.onBeforeRender = function (viewportData) {
        if (!this._viewRange || !this._preference) {
            return;
        }
        if (this._viewRange.endLineNumber < viewportData.startLineNumber || this._viewRange.startLineNumber > viewportData.endLineNumber) {
            // Outside of viewport
            return;
        }
        this.domNode.setMaxWidth(this._maxWidth);
    };
    Widget.prototype.prepareRender = function (ctx) {
        this._renderData = this._prepareRenderWidget(ctx);
    };
    Widget.prototype.render = function (ctx) {
        if (!this._renderData) {
            // This widget should be invisible
            if (this._isVisible) {
                this.domNode.removeAttribute('monaco-visible-content-widget');
                this._isVisible = false;
                this.domNode.setVisibility('hidden');
            }
            return;
        }
        // This widget should be visible
        if (this.allowEditorOverflow) {
            this.domNode.setTop(this._renderData.top);
            this.domNode.setLeft(this._renderData.left);
        }
        else {
            this.domNode.setTop(this._renderData.top + ctx.scrollTop - ctx.bigNumbersDelta);
            this.domNode.setLeft(this._renderData.left);
        }
        if (!this._isVisible) {
            this.domNode.setVisibility('inherit');
            this.domNode.setAttribute('monaco-visible-content-widget', 'true');
            this._isVisible = true;
        }
    };
    return Widget;
}());
