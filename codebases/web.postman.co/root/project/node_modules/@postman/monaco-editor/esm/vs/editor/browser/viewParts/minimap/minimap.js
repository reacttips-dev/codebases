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
import './minimap.css';
import * as dom from '../../../../base/browser/dom.js';
import { createFastDomNode } from '../../../../base/browser/fastDomNode.js';
import { GlobalMouseMoveMonitor, standardMouseMoveMerger } from '../../../../base/browser/globalMouseMoveMonitor.js';
import * as platform from '../../../../base/common/platform.js';
import * as strings from '../../../../base/common/strings.js';
import { RenderedLinesCollection } from '../../view/viewLayer.js';
import { PartFingerprints, ViewPart } from '../../view/viewPart.js';
import { MINIMAP_GUTTER_WIDTH } from '../../../common/config/editorOptions.js';
import { Range } from '../../../common/core/range.js';
import { MinimapTokensColorTracker } from '../../../common/viewModel/minimapTokensColorTracker.js';
import * as viewEvents from '../../../common/view/viewEvents.js';
import { scrollbarShadow, scrollbarSliderActiveBackground, scrollbarSliderBackground, scrollbarSliderHoverBackground, minimapSelection } from '../../../../platform/theme/common/colorRegistry.js';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { EventType, Gesture } from '../../../../base/browser/touch.js';
import { MinimapCharRendererFactory } from './minimapCharRendererFactory.js';
import { MinimapPosition } from '../../../common/model.js';
import { once } from '../../../../base/common/functional.js';
function getMinimapLineHeight(renderMinimap, scale) {
    if (renderMinimap === 1 /* Text */) {
        return 2 /* BASE_CHAR_HEIGHT */ * scale;
    }
    // RenderMinimap.Blocks
    return (2 /* BASE_CHAR_HEIGHT */ + 1) * scale;
}
function getMinimapCharWidth(renderMinimap, scale) {
    if (renderMinimap === 1 /* Text */) {
        return 1 /* BASE_CHAR_WIDTH */ * scale;
    }
    // RenderMinimap.Blocks
    return 1 /* BASE_CHAR_WIDTH */ * scale;
}
/**
 * The orthogonal distance to the slider at which dragging "resets". This implements "snapping"
 */
var MOUSE_DRAG_RESET_DISTANCE = 140;
var GUTTER_DECORATION_WIDTH = 2;
var MinimapOptions = /** @class */ (function () {
    function MinimapOptions(configuration) {
        var _this = this;
        var options = configuration.options;
        var pixelRatio = options.get(105 /* pixelRatio */);
        var layoutInfo = options.get(107 /* layoutInfo */);
        var fontInfo = options.get(34 /* fontInfo */);
        this.renderMinimap = layoutInfo.renderMinimap | 0;
        this.scrollBeyondLastLine = options.get(80 /* scrollBeyondLastLine */);
        var minimapOpts = options.get(54 /* minimap */);
        this.showSlider = minimapOpts.showSlider;
        this.fontScale = Math.round(minimapOpts.scale * pixelRatio);
        this.charRenderer = once(function () { return MinimapCharRendererFactory.create(_this.fontScale, fontInfo.fontFamily); });
        this.pixelRatio = pixelRatio;
        this.typicalHalfwidthCharacterWidth = fontInfo.typicalHalfwidthCharacterWidth;
        this.lineHeight = options.get(49 /* lineHeight */);
        this.minimapLeft = layoutInfo.minimapLeft;
        this.minimapWidth = layoutInfo.minimapWidth;
        this.minimapHeight = layoutInfo.height;
        this.canvasInnerWidth = Math.floor(pixelRatio * this.minimapWidth);
        this.canvasInnerHeight = Math.floor(pixelRatio * this.minimapHeight);
        this.canvasOuterWidth = this.canvasInnerWidth / pixelRatio;
        this.canvasOuterHeight = this.canvasInnerHeight / pixelRatio;
    }
    MinimapOptions.prototype.equals = function (other) {
        return (this.renderMinimap === other.renderMinimap
            && this.scrollBeyondLastLine === other.scrollBeyondLastLine
            && this.showSlider === other.showSlider
            && this.pixelRatio === other.pixelRatio
            && this.typicalHalfwidthCharacterWidth === other.typicalHalfwidthCharacterWidth
            && this.lineHeight === other.lineHeight
            && this.fontScale === other.fontScale
            && this.minimapLeft === other.minimapLeft
            && this.minimapWidth === other.minimapWidth
            && this.minimapHeight === other.minimapHeight
            && this.canvasInnerWidth === other.canvasInnerWidth
            && this.canvasInnerHeight === other.canvasInnerHeight
            && this.canvasOuterWidth === other.canvasOuterWidth
            && this.canvasOuterHeight === other.canvasOuterHeight);
    };
    return MinimapOptions;
}());
var MinimapLayout = /** @class */ (function () {
    function MinimapLayout(scrollTop, scrollHeight, computedSliderRatio, sliderTop, sliderHeight, startLineNumber, endLineNumber) {
        this.scrollTop = scrollTop;
        this.scrollHeight = scrollHeight;
        this._computedSliderRatio = computedSliderRatio;
        this.sliderTop = sliderTop;
        this.sliderHeight = sliderHeight;
        this.startLineNumber = startLineNumber;
        this.endLineNumber = endLineNumber;
    }
    /**
     * Compute a desired `scrollPosition` such that the slider moves by `delta`.
     */
    MinimapLayout.prototype.getDesiredScrollTopFromDelta = function (delta) {
        var desiredSliderPosition = this.sliderTop + delta;
        return Math.round(desiredSliderPosition / this._computedSliderRatio);
    };
    MinimapLayout.prototype.getDesiredScrollTopFromTouchLocation = function (pageY) {
        return Math.round((pageY - this.sliderHeight / 2) / this._computedSliderRatio);
    };
    MinimapLayout.create = function (options, viewportStartLineNumber, viewportEndLineNumber, viewportHeight, viewportContainsWhitespaceGaps, lineCount, scrollTop, scrollHeight, previousLayout) {
        var pixelRatio = options.pixelRatio;
        var minimapLineHeight = getMinimapLineHeight(options.renderMinimap, options.fontScale);
        var minimapLinesFitting = Math.floor(options.canvasInnerHeight / minimapLineHeight);
        var lineHeight = options.lineHeight;
        // The visible line count in a viewport can change due to a number of reasons:
        //  a) with the same viewport width, different scroll positions can result in partial lines being visible:
        //    e.g. for a line height of 20, and a viewport height of 600
        //          * scrollTop = 0  => visible lines are [1, 30]
        //          * scrollTop = 10 => visible lines are [1, 31] (with lines 1 and 31 partially visible)
        //          * scrollTop = 20 => visible lines are [2, 31]
        //  b) whitespace gaps might make their way in the viewport (which results in a decrease in the visible line count)
        //  c) we could be in the scroll beyond last line case (which also results in a decrease in the visible line count, down to possibly only one line being visible)
        // We must first establish a desirable slider height.
        var sliderHeight;
        if (viewportContainsWhitespaceGaps && viewportEndLineNumber !== lineCount) {
            // case b) from above: there are whitespace gaps in the viewport.
            // In this case, the height of the slider directly reflects the visible line count.
            var viewportLineCount = viewportEndLineNumber - viewportStartLineNumber + 1;
            sliderHeight = Math.floor(viewportLineCount * minimapLineHeight / pixelRatio);
        }
        else {
            // The slider has a stable height
            var expectedViewportLineCount = viewportHeight / lineHeight;
            sliderHeight = Math.floor(expectedViewportLineCount * minimapLineHeight / pixelRatio);
        }
        var maxMinimapSliderTop;
        if (options.scrollBeyondLastLine) {
            // The minimap slider, when dragged all the way down, will contain the last line at its top
            maxMinimapSliderTop = (lineCount - 1) * minimapLineHeight / pixelRatio;
        }
        else {
            // The minimap slider, when dragged all the way down, will contain the last line at its bottom
            maxMinimapSliderTop = Math.max(0, lineCount * minimapLineHeight / pixelRatio - sliderHeight);
        }
        maxMinimapSliderTop = Math.min(options.minimapHeight - sliderHeight, maxMinimapSliderTop);
        // The slider can move from 0 to `maxMinimapSliderTop`
        // in the same way `scrollTop` can move from 0 to `scrollHeight` - `viewportHeight`.
        var computedSliderRatio = (maxMinimapSliderTop) / (scrollHeight - viewportHeight);
        var sliderTop = (scrollTop * computedSliderRatio);
        var extraLinesAtTheBottom = 0;
        if (options.scrollBeyondLastLine) {
            var expectedViewportLineCount = viewportHeight / lineHeight;
            extraLinesAtTheBottom = expectedViewportLineCount;
        }
        if (minimapLinesFitting >= lineCount + extraLinesAtTheBottom) {
            // All lines fit in the minimap
            var startLineNumber = 1;
            var endLineNumber = lineCount;
            return new MinimapLayout(scrollTop, scrollHeight, computedSliderRatio, sliderTop, sliderHeight, startLineNumber, endLineNumber);
        }
        else {
            var startLineNumber = Math.max(1, Math.floor(viewportStartLineNumber - sliderTop * pixelRatio / minimapLineHeight));
            // Avoid flickering caused by a partial viewport start line
            // by being consistent w.r.t. the previous layout decision
            if (previousLayout && previousLayout.scrollHeight === scrollHeight) {
                if (previousLayout.scrollTop > scrollTop) {
                    // Scrolling up => never increase `startLineNumber`
                    startLineNumber = Math.min(startLineNumber, previousLayout.startLineNumber);
                }
                if (previousLayout.scrollTop < scrollTop) {
                    // Scrolling down => never decrease `startLineNumber`
                    startLineNumber = Math.max(startLineNumber, previousLayout.startLineNumber);
                }
            }
            var endLineNumber = Math.min(lineCount, startLineNumber + minimapLinesFitting - 1);
            return new MinimapLayout(scrollTop, scrollHeight, computedSliderRatio, sliderTop, sliderHeight, startLineNumber, endLineNumber);
        }
    };
    return MinimapLayout;
}());
var MinimapLine = /** @class */ (function () {
    function MinimapLine(dy) {
        this.dy = dy;
    }
    MinimapLine.prototype.onContentChanged = function () {
        this.dy = -1;
    };
    MinimapLine.prototype.onTokensChanged = function () {
        this.dy = -1;
    };
    MinimapLine.INVALID = new MinimapLine(-1);
    return MinimapLine;
}());
var RenderData = /** @class */ (function () {
    function RenderData(renderedLayout, imageData, lines) {
        this.renderedLayout = renderedLayout;
        this._imageData = imageData;
        this._renderedLines = new RenderedLinesCollection(function () { return MinimapLine.INVALID; });
        this._renderedLines._set(renderedLayout.startLineNumber, lines);
    }
    /**
     * Check if the current RenderData matches accurately the new desired layout and no painting is needed.
     */
    RenderData.prototype.linesEquals = function (layout) {
        if (!this.scrollEquals(layout)) {
            return false;
        }
        var tmp = this._renderedLines._get();
        var lines = tmp.lines;
        for (var i = 0, len = lines.length; i < len; i++) {
            if (lines[i].dy === -1) {
                // This line is invalid
                return false;
            }
        }
        return true;
    };
    /**
     * Check if the current RenderData matches the new layout's scroll position
     */
    RenderData.prototype.scrollEquals = function (layout) {
        return this.renderedLayout.startLineNumber === layout.startLineNumber
            && this.renderedLayout.endLineNumber === layout.endLineNumber;
    };
    RenderData.prototype._get = function () {
        var tmp = this._renderedLines._get();
        return {
            imageData: this._imageData,
            rendLineNumberStart: tmp.rendLineNumberStart,
            lines: tmp.lines
        };
    };
    RenderData.prototype.onLinesChanged = function (e) {
        return this._renderedLines.onLinesChanged(e.fromLineNumber, e.toLineNumber);
    };
    RenderData.prototype.onLinesDeleted = function (e) {
        this._renderedLines.onLinesDeleted(e.fromLineNumber, e.toLineNumber);
    };
    RenderData.prototype.onLinesInserted = function (e) {
        this._renderedLines.onLinesInserted(e.fromLineNumber, e.toLineNumber);
    };
    RenderData.prototype.onTokensChanged = function (e) {
        return this._renderedLines.onTokensChanged(e.ranges);
    };
    return RenderData;
}());
/**
 * Some sort of double buffering.
 *
 * Keeps two buffers around that will be rotated for painting.
 * Always gives a buffer that is filled with the background color.
 */
var MinimapBuffers = /** @class */ (function () {
    function MinimapBuffers(ctx, WIDTH, HEIGHT, background) {
        this._backgroundFillData = MinimapBuffers._createBackgroundFillData(WIDTH, HEIGHT, background);
        this._buffers = [
            ctx.createImageData(WIDTH, HEIGHT),
            ctx.createImageData(WIDTH, HEIGHT)
        ];
        this._lastUsedBuffer = 0;
    }
    MinimapBuffers.prototype.getBuffer = function () {
        // rotate buffers
        this._lastUsedBuffer = 1 - this._lastUsedBuffer;
        var result = this._buffers[this._lastUsedBuffer];
        // fill with background color
        result.data.set(this._backgroundFillData);
        return result;
    };
    MinimapBuffers._createBackgroundFillData = function (WIDTH, HEIGHT, background) {
        var backgroundR = background.r;
        var backgroundG = background.g;
        var backgroundB = background.b;
        var result = new Uint8ClampedArray(WIDTH * HEIGHT * 4);
        var offset = 0;
        for (var i = 0; i < HEIGHT; i++) {
            for (var j = 0; j < WIDTH; j++) {
                result[offset] = backgroundR;
                result[offset + 1] = backgroundG;
                result[offset + 2] = backgroundB;
                result[offset + 3] = 255;
                offset += 4;
            }
        }
        return result;
    };
    return MinimapBuffers;
}());
var Minimap = /** @class */ (function (_super) {
    __extends(Minimap, _super);
    function Minimap(context) {
        var _this = _super.call(this, context) || this;
        _this._selections = [];
        _this._renderDecorations = false;
        _this._gestureInProgress = false;
        _this._options = new MinimapOptions(_this._context.configuration);
        _this._lastRenderData = null;
        _this._buffers = null;
        _this._selectionColor = _this._context.theme.getColor(minimapSelection);
        _this._domNode = createFastDomNode(document.createElement('div'));
        PartFingerprints.write(_this._domNode, 8 /* Minimap */);
        _this._domNode.setClassName(_this._getMinimapDomNodeClassName());
        _this._domNode.setPosition('absolute');
        _this._domNode.setAttribute('role', 'presentation');
        _this._domNode.setAttribute('aria-hidden', 'true');
        _this._shadow = createFastDomNode(document.createElement('div'));
        _this._shadow.setClassName('minimap-shadow-hidden');
        _this._domNode.appendChild(_this._shadow);
        _this._canvas = createFastDomNode(document.createElement('canvas'));
        _this._canvas.setPosition('absolute');
        _this._canvas.setLeft(0);
        _this._domNode.appendChild(_this._canvas);
        _this._decorationsCanvas = createFastDomNode(document.createElement('canvas'));
        _this._decorationsCanvas.setPosition('absolute');
        _this._decorationsCanvas.setClassName('minimap-decorations-layer');
        _this._decorationsCanvas.setLeft(0);
        _this._domNode.appendChild(_this._decorationsCanvas);
        _this._slider = createFastDomNode(document.createElement('div'));
        _this._slider.setPosition('absolute');
        _this._slider.setClassName('minimap-slider');
        _this._slider.setLayerHinting(true);
        _this._slider.setContain('strict');
        _this._domNode.appendChild(_this._slider);
        _this._sliderHorizontal = createFastDomNode(document.createElement('div'));
        _this._sliderHorizontal.setPosition('absolute');
        _this._sliderHorizontal.setClassName('minimap-slider-horizontal');
        _this._slider.appendChild(_this._sliderHorizontal);
        _this._tokensColorTracker = MinimapTokensColorTracker.getInstance();
        _this._applyLayout();
        _this._mouseDownListener = dom.addStandardDisposableListener(_this._domNode.domNode, 'mousedown', function (e) {
            e.preventDefault();
            var renderMinimap = _this._options.renderMinimap;
            if (renderMinimap === 0 /* None */) {
                return;
            }
            if (!_this._lastRenderData) {
                return;
            }
            var minimapLineHeight = getMinimapLineHeight(renderMinimap, _this._options.fontScale);
            var internalOffsetY = _this._options.pixelRatio * e.browserEvent.offsetY;
            var lineIndex = Math.floor(internalOffsetY / minimapLineHeight);
            var lineNumber = lineIndex + _this._lastRenderData.renderedLayout.startLineNumber;
            lineNumber = Math.min(lineNumber, _this._context.model.getLineCount());
            _this._context.privateViewEventBus.emit(new viewEvents.ViewRevealRangeRequestEvent('mouse', new Range(lineNumber, 1, lineNumber, 1), 1 /* Center */, false, 0 /* Smooth */));
        });
        _this._sliderMouseMoveMonitor = new GlobalMouseMoveMonitor();
        _this._sliderMouseDownListener = dom.addStandardDisposableListener(_this._slider.domNode, 'mousedown', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.leftButton && _this._lastRenderData) {
                var initialMousePosition_1 = e.posy;
                var initialMouseOrthogonalPosition_1 = e.posx;
                var initialSliderState_1 = _this._lastRenderData.renderedLayout;
                _this._slider.toggleClassName('active', true);
                _this._sliderMouseMoveMonitor.startMonitoring(e.target, e.buttons, standardMouseMoveMerger, function (mouseMoveData) {
                    var mouseOrthogonalDelta = Math.abs(mouseMoveData.posx - initialMouseOrthogonalPosition_1);
                    if (platform.isWindows && mouseOrthogonalDelta > MOUSE_DRAG_RESET_DISTANCE) {
                        // The mouse has wondered away from the scrollbar => reset dragging
                        _this._context.viewLayout.setScrollPositionNow({
                            scrollTop: initialSliderState_1.scrollTop
                        });
                        return;
                    }
                    var mouseDelta = mouseMoveData.posy - initialMousePosition_1;
                    _this._context.viewLayout.setScrollPositionNow({
                        scrollTop: initialSliderState_1.getDesiredScrollTopFromDelta(mouseDelta)
                    });
                }, function () {
                    _this._slider.toggleClassName('active', false);
                });
            }
        });
        _this._gestureDisposable = Gesture.addTarget(_this._domNode.domNode);
        _this._sliderTouchStartListener = dom.addDisposableListener(_this._domNode.domNode, EventType.Start, function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (_this._lastRenderData) {
                _this._slider.toggleClassName('active', true);
                _this._gestureInProgress = true;
                _this.scrollDueToTouchEvent(e);
            }
        });
        _this._sliderTouchMoveListener = dom.addStandardDisposableListener(_this._domNode.domNode, EventType.Change, function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (_this._lastRenderData && _this._gestureInProgress) {
                _this.scrollDueToTouchEvent(e);
            }
        });
        _this._sliderTouchEndListener = dom.addStandardDisposableListener(_this._domNode.domNode, EventType.End, function (e) {
            e.preventDefault();
            e.stopPropagation();
            _this._gestureInProgress = false;
            _this._slider.toggleClassName('active', false);
        });
        return _this;
    }
    Minimap.prototype.scrollDueToTouchEvent = function (touch) {
        var startY = this._domNode.domNode.getBoundingClientRect().top;
        var scrollTop = this._lastRenderData.renderedLayout.getDesiredScrollTopFromTouchLocation(touch.pageY - startY);
        this._context.viewLayout.setScrollPositionNow({
            scrollTop: scrollTop
        });
    };
    Minimap.prototype.dispose = function () {
        this._mouseDownListener.dispose();
        this._sliderMouseMoveMonitor.dispose();
        this._sliderMouseDownListener.dispose();
        this._gestureDisposable.dispose();
        this._sliderTouchStartListener.dispose();
        this._sliderTouchMoveListener.dispose();
        this._sliderTouchEndListener.dispose();
        _super.prototype.dispose.call(this);
    };
    Minimap.prototype._getMinimapDomNodeClassName = function () {
        if (this._options.showSlider === 'always') {
            return 'minimap slider-always';
        }
        return 'minimap slider-mouseover';
    };
    Minimap.prototype.getDomNode = function () {
        return this._domNode;
    };
    Minimap.prototype._applyLayout = function () {
        this._domNode.setLeft(this._options.minimapLeft);
        this._domNode.setWidth(this._options.minimapWidth);
        this._domNode.setHeight(this._options.minimapHeight);
        this._shadow.setHeight(this._options.minimapHeight);
        this._canvas.setWidth(this._options.canvasOuterWidth);
        this._canvas.setHeight(this._options.canvasOuterHeight);
        this._canvas.domNode.width = this._options.canvasInnerWidth;
        this._canvas.domNode.height = this._options.canvasInnerHeight;
        this._decorationsCanvas.setWidth(this._options.canvasOuterWidth);
        this._decorationsCanvas.setHeight(this._options.canvasOuterHeight);
        this._decorationsCanvas.domNode.width = this._options.canvasInnerWidth;
        this._decorationsCanvas.domNode.height = this._options.canvasInnerHeight;
        this._slider.setWidth(this._options.minimapWidth);
    };
    Minimap.prototype._getBuffer = function () {
        if (!this._buffers) {
            if (this._options.canvasInnerWidth > 0 && this._options.canvasInnerHeight > 0) {
                this._buffers = new MinimapBuffers(this._canvas.domNode.getContext('2d'), this._options.canvasInnerWidth, this._options.canvasInnerHeight, this._tokensColorTracker.getColor(2 /* DefaultBackground */));
            }
        }
        return this._buffers ? this._buffers.getBuffer() : null;
    };
    Minimap.prototype._onOptionsMaybeChanged = function () {
        var opts = new MinimapOptions(this._context.configuration);
        if (this._options.equals(opts)) {
            return false;
        }
        this._options = opts;
        this._lastRenderData = null;
        this._buffers = null;
        this._applyLayout();
        this._domNode.setClassName(this._getMinimapDomNodeClassName());
        return true;
    };
    // ---- begin view event handlers
    Minimap.prototype.onConfigurationChanged = function (e) {
        return this._onOptionsMaybeChanged();
    };
    Minimap.prototype.onCursorStateChanged = function (e) {
        this._selections = e.selections;
        this._renderDecorations = true;
        return true;
    };
    Minimap.prototype.onFlushed = function (e) {
        this._lastRenderData = null;
        return true;
    };
    Minimap.prototype.onLinesChanged = function (e) {
        if (this._lastRenderData) {
            return this._lastRenderData.onLinesChanged(e);
        }
        return false;
    };
    Minimap.prototype.onLinesDeleted = function (e) {
        if (this._lastRenderData) {
            this._lastRenderData.onLinesDeleted(e);
        }
        return true;
    };
    Minimap.prototype.onLinesInserted = function (e) {
        if (this._lastRenderData) {
            this._lastRenderData.onLinesInserted(e);
        }
        return true;
    };
    Minimap.prototype.onScrollChanged = function (e) {
        this._renderDecorations = true;
        return true;
    };
    Minimap.prototype.onTokensChanged = function (e) {
        if (this._lastRenderData) {
            return this._lastRenderData.onTokensChanged(e);
        }
        return false;
    };
    Minimap.prototype.onTokensColorsChanged = function (e) {
        this._lastRenderData = null;
        this._buffers = null;
        return true;
    };
    Minimap.prototype.onZonesChanged = function (e) {
        this._lastRenderData = null;
        return true;
    };
    Minimap.prototype.onDecorationsChanged = function (e) {
        this._renderDecorations = true;
        return true;
    };
    Minimap.prototype.onThemeChanged = function (e) {
        this._context.model.invalidateMinimapColorCache();
        this._selectionColor = this._context.theme.getColor(minimapSelection);
        this._renderDecorations = true;
        return true;
    };
    // --- end event handlers
    Minimap.prototype.prepareRender = function (ctx) {
        // Nothing to read
    };
    Minimap.prototype.render = function (renderingCtx) {
        var renderMinimap = this._options.renderMinimap;
        if (renderMinimap === 0 /* None */) {
            this._shadow.setClassName('minimap-shadow-hidden');
            this._sliderHorizontal.setWidth(0);
            this._sliderHorizontal.setHeight(0);
            return;
        }
        if (renderingCtx.scrollLeft + renderingCtx.viewportWidth >= renderingCtx.scrollWidth) {
            this._shadow.setClassName('minimap-shadow-hidden');
        }
        else {
            this._shadow.setClassName('minimap-shadow-visible');
        }
        var layout = MinimapLayout.create(this._options, renderingCtx.visibleRange.startLineNumber, renderingCtx.visibleRange.endLineNumber, renderingCtx.viewportHeight, (renderingCtx.viewportData.whitespaceViewportData.length > 0), this._context.model.getLineCount(), renderingCtx.scrollTop, renderingCtx.scrollHeight, this._lastRenderData ? this._lastRenderData.renderedLayout : null);
        this._slider.setTop(layout.sliderTop);
        this._slider.setHeight(layout.sliderHeight);
        // Compute horizontal slider coordinates
        var scrollLeftChars = renderingCtx.scrollLeft / this._options.typicalHalfwidthCharacterWidth;
        var horizontalSliderLeft = Math.min(this._options.minimapWidth, Math.round(scrollLeftChars * getMinimapCharWidth(this._options.renderMinimap, this._options.fontScale) / this._options.pixelRatio));
        this._sliderHorizontal.setLeft(horizontalSliderLeft);
        this._sliderHorizontal.setWidth(this._options.minimapWidth - horizontalSliderLeft);
        this._sliderHorizontal.setTop(0);
        this._sliderHorizontal.setHeight(layout.sliderHeight);
        this.renderDecorations(layout);
        this._lastRenderData = this.renderLines(layout);
    };
    Minimap.prototype.renderDecorations = function (layout) {
        if (this._renderDecorations) {
            this._renderDecorations = false;
            var decorations = this._context.model.getDecorationsInViewport(new Range(layout.startLineNumber, 1, layout.endLineNumber, this._context.model.getLineMaxColumn(layout.endLineNumber)));
            var _a = this._options, renderMinimap = _a.renderMinimap, canvasInnerWidth = _a.canvasInnerWidth, canvasInnerHeight = _a.canvasInnerHeight;
            var lineHeight = getMinimapLineHeight(renderMinimap, this._options.fontScale);
            var characterWidth = getMinimapCharWidth(renderMinimap, this._options.fontScale);
            var tabSize = this._context.model.getOptions().tabSize;
            var canvasContext = this._decorationsCanvas.domNode.getContext('2d');
            canvasContext.clearRect(0, 0, canvasInnerWidth, canvasInnerHeight);
            var lineOffsetMap = new Map();
            for (var i = 0; i < this._selections.length; i++) {
                var selection = this._selections[i];
                for (var line = selection.startLineNumber; line <= selection.endLineNumber; line++) {
                    this.renderDecorationOnLine(canvasContext, lineOffsetMap, selection, this._selectionColor, layout, line, lineHeight, lineHeight, tabSize, characterWidth);
                }
            }
            // Loop over decorations, ignoring those that don't have the minimap property set and rendering rectangles for each line the decoration spans
            for (var i = 0; i < decorations.length; i++) {
                var decoration = decorations[i];
                if (!decoration.options.minimap) {
                    continue;
                }
                var decorationColor = decoration.options.minimap.getColor(this._context.theme);
                for (var line = decoration.range.startLineNumber; line <= decoration.range.endLineNumber; line++) {
                    switch (decoration.options.minimap.position) {
                        case MinimapPosition.Inline:
                            this.renderDecorationOnLine(canvasContext, lineOffsetMap, decoration.range, decorationColor, layout, line, lineHeight, lineHeight, tabSize, characterWidth);
                            continue;
                        case MinimapPosition.Gutter:
                            var y = (line - layout.startLineNumber) * lineHeight;
                            var x = 2;
                            this.renderDecoration(canvasContext, decorationColor, x, y, GUTTER_DECORATION_WIDTH, lineHeight);
                            continue;
                    }
                }
            }
        }
    };
    Minimap.prototype.renderDecorationOnLine = function (canvasContext, lineOffsetMap, decorationRange, decorationColor, layout, lineNumber, height, lineHeight, tabSize, charWidth) {
        var y = (lineNumber - layout.startLineNumber) * lineHeight;
        // Skip rendering the line if it's vertically outside our viewport
        if (y + height < 0 || y > this._options.canvasInnerHeight) {
            return;
        }
        // Cache line offset data so that it is only read once per line
        var lineIndexToXOffset = lineOffsetMap.get(lineNumber);
        var isFirstDecorationForLine = !lineIndexToXOffset;
        if (!lineIndexToXOffset) {
            var lineData = this._context.model.getLineContent(lineNumber);
            lineIndexToXOffset = [MINIMAP_GUTTER_WIDTH];
            for (var i = 1; i < lineData.length + 1; i++) {
                var charCode = lineData.charCodeAt(i - 1);
                var dx = charCode === 9 /* Tab */
                    ? tabSize * charWidth
                    : strings.isFullWidthCharacter(charCode)
                        ? 2 * charWidth
                        : charWidth;
                lineIndexToXOffset[i] = lineIndexToXOffset[i - 1] + dx;
            }
            lineOffsetMap.set(lineNumber, lineIndexToXOffset);
        }
        var startColumn = decorationRange.startColumn, endColumn = decorationRange.endColumn, startLineNumber = decorationRange.startLineNumber, endLineNumber = decorationRange.endLineNumber;
        var x = startLineNumber === lineNumber ? lineIndexToXOffset[startColumn - 1] : MINIMAP_GUTTER_WIDTH;
        var endColumnForLine = endLineNumber > lineNumber ? lineIndexToXOffset.length - 1 : endColumn - 1;
        if (endColumnForLine > 0) {
            // If the decoration starts at the last character of the column and spans over it, ensure it has a width
            var width = lineIndexToXOffset[endColumnForLine] - x || 2;
            this.renderDecoration(canvasContext, decorationColor, x, y, width, height);
        }
        if (isFirstDecorationForLine) {
            this.renderLineHighlight(canvasContext, decorationColor, y, height);
        }
    };
    Minimap.prototype.renderLineHighlight = function (canvasContext, decorationColor, y, height) {
        canvasContext.fillStyle = decorationColor && decorationColor.transparent(0.5).toString() || '';
        canvasContext.fillRect(MINIMAP_GUTTER_WIDTH, y, canvasContext.canvas.width, height);
    };
    Minimap.prototype.renderDecoration = function (canvasContext, decorationColor, x, y, width, height) {
        canvasContext.fillStyle = decorationColor && decorationColor.toString() || '';
        canvasContext.fillRect(x, y, width, height);
    };
    Minimap.prototype.renderLines = function (layout) {
        var renderMinimap = this._options.renderMinimap;
        var charRenderer = this._options.charRenderer();
        var startLineNumber = layout.startLineNumber;
        var endLineNumber = layout.endLineNumber;
        var minimapLineHeight = getMinimapLineHeight(renderMinimap, this._options.fontScale);
        // Check if nothing changed w.r.t. lines from last frame
        if (this._lastRenderData && this._lastRenderData.linesEquals(layout)) {
            var _lastData = this._lastRenderData._get();
            // Nice!! Nothing changed from last frame
            return new RenderData(layout, _lastData.imageData, _lastData.lines);
        }
        // Oh well!! We need to repaint some lines...
        var imageData = this._getBuffer();
        if (!imageData) {
            // 0 width or 0 height canvas, nothing to do
            return null;
        }
        // Render untouched lines by using last rendered data.
        var _a = Minimap._renderUntouchedLines(imageData, startLineNumber, endLineNumber, minimapLineHeight, this._lastRenderData), _dirtyY1 = _a[0], _dirtyY2 = _a[1], needed = _a[2];
        // Fetch rendering info from view model for rest of lines that need rendering.
        var lineInfo = this._context.model.getMinimapLinesRenderingData(startLineNumber, endLineNumber, needed);
        var tabSize = lineInfo.tabSize;
        var background = this._tokensColorTracker.getColor(2 /* DefaultBackground */);
        var useLighterFont = this._tokensColorTracker.backgroundIsLight();
        // Render the rest of lines
        var dy = 0;
        var renderedLines = [];
        for (var lineIndex = 0, lineCount = endLineNumber - startLineNumber + 1; lineIndex < lineCount; lineIndex++) {
            if (needed[lineIndex]) {
                Minimap._renderLine(imageData, background, useLighterFont, renderMinimap, this._tokensColorTracker, charRenderer, dy, tabSize, lineInfo.data[lineIndex], this._options.fontScale);
            }
            renderedLines[lineIndex] = new MinimapLine(dy);
            dy += minimapLineHeight;
        }
        var dirtyY1 = (_dirtyY1 === -1 ? 0 : _dirtyY1);
        var dirtyY2 = (_dirtyY2 === -1 ? imageData.height : _dirtyY2);
        var dirtyHeight = dirtyY2 - dirtyY1;
        // Finally, paint to the canvas
        var ctx = this._canvas.domNode.getContext('2d');
        ctx.putImageData(imageData, 0, 0, 0, dirtyY1, imageData.width, dirtyHeight);
        // Save rendered data for reuse on next frame if possible
        return new RenderData(layout, imageData, renderedLines);
    };
    Minimap._renderUntouchedLines = function (target, startLineNumber, endLineNumber, minimapLineHeight, lastRenderData) {
        var needed = [];
        if (!lastRenderData) {
            for (var i = 0, len = endLineNumber - startLineNumber + 1; i < len; i++) {
                needed[i] = true;
            }
            return [-1, -1, needed];
        }
        var _lastData = lastRenderData._get();
        var lastTargetData = _lastData.imageData.data;
        var lastStartLineNumber = _lastData.rendLineNumberStart;
        var lastLines = _lastData.lines;
        var lastLinesLength = lastLines.length;
        var WIDTH = target.width;
        var targetData = target.data;
        var maxDestPixel = (endLineNumber - startLineNumber + 1) * minimapLineHeight * WIDTH * 4;
        var dirtyPixel1 = -1; // the pixel offset up to which all the data is equal to the prev frame
        var dirtyPixel2 = -1; // the pixel offset after which all the data is equal to the prev frame
        var copySourceStart = -1;
        var copySourceEnd = -1;
        var copyDestStart = -1;
        var copyDestEnd = -1;
        var dest_dy = 0;
        for (var lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
            var lineIndex = lineNumber - startLineNumber;
            var lastLineIndex = lineNumber - lastStartLineNumber;
            var source_dy = (lastLineIndex >= 0 && lastLineIndex < lastLinesLength ? lastLines[lastLineIndex].dy : -1);
            if (source_dy === -1) {
                needed[lineIndex] = true;
                dest_dy += minimapLineHeight;
                continue;
            }
            var sourceStart = source_dy * WIDTH * 4;
            var sourceEnd = (source_dy + minimapLineHeight) * WIDTH * 4;
            var destStart = dest_dy * WIDTH * 4;
            var destEnd = (dest_dy + minimapLineHeight) * WIDTH * 4;
            if (copySourceEnd === sourceStart && copyDestEnd === destStart) {
                // contiguous zone => extend copy request
                copySourceEnd = sourceEnd;
                copyDestEnd = destEnd;
            }
            else {
                if (copySourceStart !== -1) {
                    // flush existing copy request
                    targetData.set(lastTargetData.subarray(copySourceStart, copySourceEnd), copyDestStart);
                    if (dirtyPixel1 === -1 && copySourceStart === 0 && copySourceStart === copyDestStart) {
                        dirtyPixel1 = copySourceEnd;
                    }
                    if (dirtyPixel2 === -1 && copySourceEnd === maxDestPixel && copySourceStart === copyDestStart) {
                        dirtyPixel2 = copySourceStart;
                    }
                }
                copySourceStart = sourceStart;
                copySourceEnd = sourceEnd;
                copyDestStart = destStart;
                copyDestEnd = destEnd;
            }
            needed[lineIndex] = false;
            dest_dy += minimapLineHeight;
        }
        if (copySourceStart !== -1) {
            // flush existing copy request
            targetData.set(lastTargetData.subarray(copySourceStart, copySourceEnd), copyDestStart);
            if (dirtyPixel1 === -1 && copySourceStart === 0 && copySourceStart === copyDestStart) {
                dirtyPixel1 = copySourceEnd;
            }
            if (dirtyPixel2 === -1 && copySourceEnd === maxDestPixel && copySourceStart === copyDestStart) {
                dirtyPixel2 = copySourceStart;
            }
        }
        var dirtyY1 = (dirtyPixel1 === -1 ? -1 : dirtyPixel1 / (WIDTH * 4));
        var dirtyY2 = (dirtyPixel2 === -1 ? -1 : dirtyPixel2 / (WIDTH * 4));
        return [dirtyY1, dirtyY2, needed];
    };
    Minimap._renderLine = function (target, backgroundColor, useLighterFont, renderMinimap, colorTracker, minimapCharRenderer, dy, tabSize, lineData, fontScale) {
        var content = lineData.content;
        var tokens = lineData.tokens;
        var charWidth = getMinimapCharWidth(renderMinimap, fontScale);
        var maxDx = target.width - charWidth;
        var dx = MINIMAP_GUTTER_WIDTH;
        var charIndex = 0;
        var tabsCharDelta = 0;
        for (var tokenIndex = 0, tokensLen = tokens.getCount(); tokenIndex < tokensLen; tokenIndex++) {
            var tokenEndIndex = tokens.getEndOffset(tokenIndex);
            var tokenColorId = tokens.getForeground(tokenIndex);
            var tokenColor = colorTracker.getColor(tokenColorId);
            for (; charIndex < tokenEndIndex; charIndex++) {
                if (dx > maxDx) {
                    // hit edge of minimap
                    return;
                }
                var charCode = content.charCodeAt(charIndex);
                if (charCode === 9 /* Tab */) {
                    var insertSpacesCount = tabSize - (charIndex + tabsCharDelta) % tabSize;
                    tabsCharDelta += insertSpacesCount - 1;
                    // No need to render anything since tab is invisible
                    dx += insertSpacesCount * charWidth;
                }
                else if (charCode === 32 /* Space */) {
                    // No need to render anything since space is invisible
                    dx += charWidth;
                }
                else {
                    // Render twice for a full width character
                    var count = strings.isFullWidthCharacter(charCode) ? 2 : 1;
                    for (var i = 0; i < count; i++) {
                        if (renderMinimap === 2 /* Blocks */) {
                            minimapCharRenderer.blockRenderChar(target, dx, dy, tokenColor, backgroundColor, useLighterFont);
                        }
                        else { // RenderMinimap.Text
                            minimapCharRenderer.renderChar(target, dx, dy, charCode, tokenColor, backgroundColor, fontScale, useLighterFont);
                        }
                        dx += charWidth;
                        if (dx > maxDx) {
                            // hit edge of minimap
                            return;
                        }
                    }
                }
            }
        }
    };
    return Minimap;
}(ViewPart));
export { Minimap };
registerThemingParticipant(function (theme, collector) {
    var sliderBackground = theme.getColor(scrollbarSliderBackground);
    if (sliderBackground) {
        var halfSliderBackground = sliderBackground.transparent(0.5);
        collector.addRule(".monaco-editor .minimap-slider, .monaco-editor .minimap-slider .minimap-slider-horizontal { background: " + halfSliderBackground + "; }");
    }
    var sliderHoverBackground = theme.getColor(scrollbarSliderHoverBackground);
    if (sliderHoverBackground) {
        var halfSliderHoverBackground = sliderHoverBackground.transparent(0.5);
        collector.addRule(".monaco-editor .minimap-slider:hover, .monaco-editor .minimap-slider:hover .minimap-slider-horizontal { background: " + halfSliderHoverBackground + "; }");
    }
    var sliderActiveBackground = theme.getColor(scrollbarSliderActiveBackground);
    if (sliderActiveBackground) {
        var halfSliderActiveBackground = sliderActiveBackground.transparent(0.5);
        collector.addRule(".monaco-editor .minimap-slider.active, .monaco-editor .minimap-slider.active .minimap-slider-horizontal { background: " + halfSliderActiveBackground + "; }");
    }
    var shadow = theme.getColor(scrollbarShadow);
    if (shadow) {
        collector.addRule(".monaco-editor .minimap-shadow-visible { box-shadow: " + shadow + " -6px 0 6px -6px inset; }");
    }
});
