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
import { Emitter } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { Scrollable } from '../../../base/common/scrollable.js';
import { LinesLayout } from './linesLayout.js';
import { Viewport } from '../viewModel/viewModel.js';
var SMOOTH_SCROLLING_TIME = 125;
var EditorScrollDimensions = /** @class */ (function () {
    function EditorScrollDimensions(width, contentWidth, height, contentHeight) {
        width = width | 0;
        contentWidth = contentWidth | 0;
        height = height | 0;
        contentHeight = contentHeight | 0;
        if (width < 0) {
            width = 0;
        }
        if (contentWidth < 0) {
            contentWidth = 0;
        }
        if (height < 0) {
            height = 0;
        }
        if (contentHeight < 0) {
            contentHeight = 0;
        }
        this.width = width;
        this.contentWidth = contentWidth;
        this.scrollWidth = Math.max(width, contentWidth);
        this.height = height;
        this.contentHeight = contentHeight;
        this.scrollHeight = Math.max(height, contentHeight);
    }
    EditorScrollDimensions.prototype.equals = function (other) {
        return (this.width === other.width
            && this.contentWidth === other.contentWidth
            && this.height === other.height
            && this.contentHeight === other.contentHeight);
    };
    return EditorScrollDimensions;
}());
var EditorScrollable = /** @class */ (function (_super) {
    __extends(EditorScrollable, _super);
    function EditorScrollable(smoothScrollDuration, scheduleAtNextAnimationFrame) {
        var _this = _super.call(this) || this;
        _this._onDidContentSizeChange = _this._register(new Emitter());
        _this.onDidContentSizeChange = _this._onDidContentSizeChange.event;
        _this._dimensions = new EditorScrollDimensions(0, 0, 0, 0);
        _this._scrollable = _this._register(new Scrollable(smoothScrollDuration, scheduleAtNextAnimationFrame));
        _this.onDidScroll = _this._scrollable.onScroll;
        return _this;
    }
    EditorScrollable.prototype.getScrollable = function () {
        return this._scrollable;
    };
    EditorScrollable.prototype.setSmoothScrollDuration = function (smoothScrollDuration) {
        this._scrollable.setSmoothScrollDuration(smoothScrollDuration);
    };
    EditorScrollable.prototype.validateScrollPosition = function (scrollPosition) {
        return this._scrollable.validateScrollPosition(scrollPosition);
    };
    EditorScrollable.prototype.getScrollDimensions = function () {
        return this._dimensions;
    };
    EditorScrollable.prototype.setScrollDimensions = function (dimensions) {
        if (this._dimensions.equals(dimensions)) {
            return;
        }
        var oldDimensions = this._dimensions;
        this._dimensions = dimensions;
        this._scrollable.setScrollDimensions({
            width: dimensions.width,
            scrollWidth: dimensions.scrollWidth,
            height: dimensions.height,
            scrollHeight: dimensions.scrollHeight
        });
        var contentWidthChanged = (oldDimensions.contentWidth !== dimensions.contentWidth);
        var contentHeightChanged = (oldDimensions.contentHeight !== dimensions.contentHeight);
        if (contentWidthChanged || contentHeightChanged) {
            this._onDidContentSizeChange.fire({
                contentWidth: dimensions.contentWidth,
                contentHeight: dimensions.contentHeight,
                contentWidthChanged: contentWidthChanged,
                contentHeightChanged: contentHeightChanged
            });
        }
    };
    EditorScrollable.prototype.getFutureScrollPosition = function () {
        return this._scrollable.getFutureScrollPosition();
    };
    EditorScrollable.prototype.getCurrentScrollPosition = function () {
        return this._scrollable.getCurrentScrollPosition();
    };
    EditorScrollable.prototype.setScrollPositionNow = function (update) {
        this._scrollable.setScrollPositionNow(update);
    };
    EditorScrollable.prototype.setScrollPositionSmooth = function (update) {
        this._scrollable.setScrollPositionSmooth(update);
    };
    return EditorScrollable;
}(Disposable));
var ViewLayout = /** @class */ (function (_super) {
    __extends(ViewLayout, _super);
    function ViewLayout(configuration, lineCount, scheduleAtNextAnimationFrame) {
        var _this = _super.call(this) || this;
        _this._configuration = configuration;
        var options = _this._configuration.options;
        var layoutInfo = options.get(107 /* layoutInfo */);
        _this._linesLayout = new LinesLayout(lineCount, options.get(49 /* lineHeight */));
        _this._scrollable = _this._register(new EditorScrollable(0, scheduleAtNextAnimationFrame));
        _this._configureSmoothScrollDuration();
        _this._scrollable.setScrollDimensions(new EditorScrollDimensions(layoutInfo.contentWidth, 0, layoutInfo.height, 0));
        _this.onDidScroll = _this._scrollable.onDidScroll;
        _this.onDidContentSizeChange = _this._scrollable.onDidContentSizeChange;
        _this._updateHeight();
        return _this;
    }
    ViewLayout.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
    };
    ViewLayout.prototype.getScrollable = function () {
        return this._scrollable.getScrollable();
    };
    ViewLayout.prototype.onHeightMaybeChanged = function () {
        this._updateHeight();
    };
    ViewLayout.prototype._configureSmoothScrollDuration = function () {
        this._scrollable.setSmoothScrollDuration(this._configuration.options.get(87 /* smoothScrolling */) ? SMOOTH_SCROLLING_TIME : 0);
    };
    // ---- begin view event handlers
    ViewLayout.prototype.onConfigurationChanged = function (e) {
        var options = this._configuration.options;
        if (e.hasChanged(49 /* lineHeight */)) {
            this._linesLayout.setLineHeight(options.get(49 /* lineHeight */));
        }
        if (e.hasChanged(107 /* layoutInfo */)) {
            var layoutInfo = options.get(107 /* layoutInfo */);
            var width = layoutInfo.contentWidth;
            var height = layoutInfo.height;
            var scrollDimensions = this._scrollable.getScrollDimensions();
            var scrollWidth = scrollDimensions.scrollWidth;
            this._scrollable.setScrollDimensions(new EditorScrollDimensions(width, scrollDimensions.contentWidth, height, this._getContentHeight(width, height, scrollWidth)));
        }
        else {
            this._updateHeight();
        }
        if (e.hasChanged(87 /* smoothScrolling */)) {
            this._configureSmoothScrollDuration();
        }
    };
    ViewLayout.prototype.onFlushed = function (lineCount) {
        this._linesLayout.onFlushed(lineCount);
    };
    ViewLayout.prototype.onLinesDeleted = function (fromLineNumber, toLineNumber) {
        this._linesLayout.onLinesDeleted(fromLineNumber, toLineNumber);
    };
    ViewLayout.prototype.onLinesInserted = function (fromLineNumber, toLineNumber) {
        this._linesLayout.onLinesInserted(fromLineNumber, toLineNumber);
    };
    // ---- end view event handlers
    ViewLayout.prototype._getHorizontalScrollbarHeight = function (width, scrollWidth) {
        var options = this._configuration.options;
        var scrollbar = options.get(78 /* scrollbar */);
        if (scrollbar.horizontal === 2 /* Hidden */) {
            // horizontal scrollbar not visible
            return 0;
        }
        if (width >= scrollWidth) {
            // horizontal scrollbar not visible
            return 0;
        }
        return scrollbar.horizontalScrollbarSize;
    };
    ViewLayout.prototype._getContentHeight = function (width, height, scrollWidth) {
        var options = this._configuration.options;
        var result = this._linesLayout.getLinesTotalHeight();
        if (options.get(80 /* scrollBeyondLastLine */)) {
            result += height - options.get(49 /* lineHeight */);
        }
        else {
            result += this._getHorizontalScrollbarHeight(width, scrollWidth);
        }
        return result;
    };
    ViewLayout.prototype._updateHeight = function () {
        var scrollDimensions = this._scrollable.getScrollDimensions();
        var width = scrollDimensions.width;
        var height = scrollDimensions.height;
        var scrollWidth = scrollDimensions.scrollWidth;
        this._scrollable.setScrollDimensions(new EditorScrollDimensions(width, scrollDimensions.contentWidth, height, this._getContentHeight(width, height, scrollWidth)));
    };
    // ---- Layouting logic
    ViewLayout.prototype.getCurrentViewport = function () {
        var scrollDimensions = this._scrollable.getScrollDimensions();
        var currentScrollPosition = this._scrollable.getCurrentScrollPosition();
        return new Viewport(currentScrollPosition.scrollTop, currentScrollPosition.scrollLeft, scrollDimensions.width, scrollDimensions.height);
    };
    ViewLayout.prototype.getFutureViewport = function () {
        var scrollDimensions = this._scrollable.getScrollDimensions();
        var currentScrollPosition = this._scrollable.getFutureScrollPosition();
        return new Viewport(currentScrollPosition.scrollTop, currentScrollPosition.scrollLeft, scrollDimensions.width, scrollDimensions.height);
    };
    ViewLayout.prototype._computeContentWidth = function (maxLineWidth) {
        var options = this._configuration.options;
        var wrappingInfo = options.get(108 /* wrappingInfo */);
        var fontInfo = options.get(34 /* fontInfo */);
        if (wrappingInfo.isViewportWrapping) {
            var layoutInfo = options.get(107 /* layoutInfo */);
            var minimap = options.get(54 /* minimap */);
            if (maxLineWidth > layoutInfo.contentWidth + fontInfo.typicalHalfwidthCharacterWidth) {
                // This is a case where viewport wrapping is on, but the line extends above the viewport
                if (minimap.enabled && minimap.side === 'right') {
                    // We need to accomodate the scrollbar width
                    return maxLineWidth + layoutInfo.verticalScrollbarWidth;
                }
            }
            return maxLineWidth;
        }
        else {
            var extraHorizontalSpace = options.get(79 /* scrollBeyondLastColumn */) * fontInfo.typicalHalfwidthCharacterWidth;
            var whitespaceMinWidth = this._linesLayout.getWhitespaceMinWidth();
            return Math.max(maxLineWidth + extraHorizontalSpace, whitespaceMinWidth);
        }
    };
    ViewLayout.prototype.onMaxLineWidthChanged = function (maxLineWidth) {
        var scrollDimensions = this._scrollable.getScrollDimensions();
        // const newScrollWidth = ;
        this._scrollable.setScrollDimensions(new EditorScrollDimensions(scrollDimensions.width, this._computeContentWidth(maxLineWidth), scrollDimensions.height, scrollDimensions.contentHeight));
        // The height might depend on the fact that there is a horizontal scrollbar or not
        this._updateHeight();
    };
    // ---- view state
    ViewLayout.prototype.saveState = function () {
        var currentScrollPosition = this._scrollable.getFutureScrollPosition();
        var scrollTop = currentScrollPosition.scrollTop;
        var firstLineNumberInViewport = this._linesLayout.getLineNumberAtOrAfterVerticalOffset(scrollTop);
        var whitespaceAboveFirstLine = this._linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(firstLineNumberInViewport);
        return {
            scrollTop: scrollTop,
            scrollTopWithoutViewZones: scrollTop - whitespaceAboveFirstLine,
            scrollLeft: currentScrollPosition.scrollLeft
        };
    };
    // ---- IVerticalLayoutProvider
    ViewLayout.prototype.changeWhitespace = function (callback) {
        return this._linesLayout.changeWhitespace(callback);
    };
    ViewLayout.prototype.getVerticalOffsetForLineNumber = function (lineNumber) {
        return this._linesLayout.getVerticalOffsetForLineNumber(lineNumber);
    };
    ViewLayout.prototype.isAfterLines = function (verticalOffset) {
        return this._linesLayout.isAfterLines(verticalOffset);
    };
    ViewLayout.prototype.getLineNumberAtVerticalOffset = function (verticalOffset) {
        return this._linesLayout.getLineNumberAtOrAfterVerticalOffset(verticalOffset);
    };
    ViewLayout.prototype.getWhitespaceAtVerticalOffset = function (verticalOffset) {
        return this._linesLayout.getWhitespaceAtVerticalOffset(verticalOffset);
    };
    ViewLayout.prototype.getLinesViewportData = function () {
        var visibleBox = this.getCurrentViewport();
        return this._linesLayout.getLinesViewportData(visibleBox.top, visibleBox.top + visibleBox.height);
    };
    ViewLayout.prototype.getLinesViewportDataAtScrollTop = function (scrollTop) {
        // do some minimal validations on scrollTop
        var scrollDimensions = this._scrollable.getScrollDimensions();
        if (scrollTop + scrollDimensions.height > scrollDimensions.scrollHeight) {
            scrollTop = scrollDimensions.scrollHeight - scrollDimensions.height;
        }
        if (scrollTop < 0) {
            scrollTop = 0;
        }
        return this._linesLayout.getLinesViewportData(scrollTop, scrollTop + scrollDimensions.height);
    };
    ViewLayout.prototype.getWhitespaceViewportData = function () {
        var visibleBox = this.getCurrentViewport();
        return this._linesLayout.getWhitespaceViewportData(visibleBox.top, visibleBox.top + visibleBox.height);
    };
    ViewLayout.prototype.getWhitespaces = function () {
        return this._linesLayout.getWhitespaces();
    };
    // ---- IScrollingProvider
    ViewLayout.prototype.getContentWidth = function () {
        var scrollDimensions = this._scrollable.getScrollDimensions();
        return scrollDimensions.contentWidth;
    };
    ViewLayout.prototype.getScrollWidth = function () {
        var scrollDimensions = this._scrollable.getScrollDimensions();
        return scrollDimensions.scrollWidth;
    };
    ViewLayout.prototype.getContentHeight = function () {
        var scrollDimensions = this._scrollable.getScrollDimensions();
        return scrollDimensions.contentHeight;
    };
    ViewLayout.prototype.getScrollHeight = function () {
        var scrollDimensions = this._scrollable.getScrollDimensions();
        return scrollDimensions.scrollHeight;
    };
    ViewLayout.prototype.getCurrentScrollLeft = function () {
        var currentScrollPosition = this._scrollable.getCurrentScrollPosition();
        return currentScrollPosition.scrollLeft;
    };
    ViewLayout.prototype.getCurrentScrollTop = function () {
        var currentScrollPosition = this._scrollable.getCurrentScrollPosition();
        return currentScrollPosition.scrollTop;
    };
    ViewLayout.prototype.validateScrollPosition = function (scrollPosition) {
        return this._scrollable.validateScrollPosition(scrollPosition);
    };
    ViewLayout.prototype.setScrollPositionNow = function (position) {
        this._scrollable.setScrollPositionNow(position);
    };
    ViewLayout.prototype.setScrollPositionSmooth = function (position) {
        this._scrollable.setScrollPositionSmooth(position);
    };
    ViewLayout.prototype.deltaScrollNow = function (deltaScrollLeft, deltaScrollTop) {
        var currentScrollPosition = this._scrollable.getCurrentScrollPosition();
        this._scrollable.setScrollPositionNow({
            scrollLeft: currentScrollPosition.scrollLeft + deltaScrollLeft,
            scrollTop: currentScrollPosition.scrollTop + deltaScrollTop
        });
    };
    return ViewLayout;
}(Disposable));
export { ViewLayout };
