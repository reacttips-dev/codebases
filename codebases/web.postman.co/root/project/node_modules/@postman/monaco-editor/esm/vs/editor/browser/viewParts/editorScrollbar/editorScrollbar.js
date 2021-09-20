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
import { SmoothScrollableElement } from '../../../../base/browser/ui/scrollbar/scrollableElement.js';
import { PartFingerprints, ViewPart } from '../../view/viewPart.js';
import { getThemeTypeSelector } from '../../../../platform/theme/common/themeService.js';
var EditorScrollbar = /** @class */ (function (_super) {
    __extends(EditorScrollbar, _super);
    function EditorScrollbar(context, linesContent, viewDomNode, overflowGuardDomNode) {
        var _this = _super.call(this, context) || this;
        var options = _this._context.configuration.options;
        var scrollbar = options.get(78 /* scrollbar */);
        var mouseWheelScrollSensitivity = options.get(56 /* mouseWheelScrollSensitivity */);
        var fastScrollSensitivity = options.get(27 /* fastScrollSensitivity */);
        var scrollbarOptions = {
            listenOnDomNode: viewDomNode.domNode,
            className: 'editor-scrollable' + ' ' + getThemeTypeSelector(context.theme.type),
            useShadows: false,
            lazyRender: true,
            vertical: scrollbar.vertical,
            horizontal: scrollbar.horizontal,
            verticalHasArrows: scrollbar.verticalHasArrows,
            horizontalHasArrows: scrollbar.horizontalHasArrows,
            verticalScrollbarSize: scrollbar.verticalScrollbarSize,
            verticalSliderSize: scrollbar.verticalSliderSize,
            horizontalScrollbarSize: scrollbar.horizontalScrollbarSize,
            horizontalSliderSize: scrollbar.horizontalSliderSize,
            handleMouseWheel: scrollbar.handleMouseWheel,
            alwaysConsumeMouseWheel: scrollbar.alwaysConsumeMouseWheel,
            arrowSize: scrollbar.arrowSize,
            mouseWheelScrollSensitivity: mouseWheelScrollSensitivity,
            fastScrollSensitivity: fastScrollSensitivity,
        };
        _this.scrollbar = _this._register(new SmoothScrollableElement(linesContent.domNode, scrollbarOptions, _this._context.viewLayout.getScrollable()));
        PartFingerprints.write(_this.scrollbar.getDomNode(), 5 /* ScrollableElement */);
        _this.scrollbarDomNode = createFastDomNode(_this.scrollbar.getDomNode());
        _this.scrollbarDomNode.setPosition('absolute');
        _this._setLayout();
        // When having a zone widget that calls .focus() on one of its dom elements,
        // the browser will try desperately to reveal that dom node, unexpectedly
        // changing the .scrollTop of this.linesContent
        var onBrowserDesperateReveal = function (domNode, lookAtScrollTop, lookAtScrollLeft) {
            var newScrollPosition = {};
            if (lookAtScrollTop) {
                var deltaTop = domNode.scrollTop;
                if (deltaTop) {
                    newScrollPosition.scrollTop = _this._context.viewLayout.getCurrentScrollTop() + deltaTop;
                    domNode.scrollTop = 0;
                }
            }
            if (lookAtScrollLeft) {
                var deltaLeft = domNode.scrollLeft;
                if (deltaLeft) {
                    newScrollPosition.scrollLeft = _this._context.viewLayout.getCurrentScrollLeft() + deltaLeft;
                    domNode.scrollLeft = 0;
                }
            }
            _this._context.viewLayout.setScrollPositionNow(newScrollPosition);
        };
        // I've seen this happen both on the view dom node & on the lines content dom node.
        _this._register(dom.addDisposableListener(viewDomNode.domNode, 'scroll', function (e) { return onBrowserDesperateReveal(viewDomNode.domNode, true, true); }));
        _this._register(dom.addDisposableListener(linesContent.domNode, 'scroll', function (e) { return onBrowserDesperateReveal(linesContent.domNode, true, false); }));
        _this._register(dom.addDisposableListener(overflowGuardDomNode.domNode, 'scroll', function (e) { return onBrowserDesperateReveal(overflowGuardDomNode.domNode, true, false); }));
        _this._register(dom.addDisposableListener(_this.scrollbarDomNode.domNode, 'scroll', function (e) { return onBrowserDesperateReveal(_this.scrollbarDomNode.domNode, true, false); }));
        return _this;
    }
    EditorScrollbar.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
    };
    EditorScrollbar.prototype._setLayout = function () {
        var options = this._context.configuration.options;
        var layoutInfo = options.get(107 /* layoutInfo */);
        this.scrollbarDomNode.setLeft(layoutInfo.contentLeft);
        var minimap = options.get(54 /* minimap */);
        var side = minimap.side;
        if (side === 'right') {
            this.scrollbarDomNode.setWidth(layoutInfo.contentWidth + layoutInfo.minimapWidth);
        }
        else {
            this.scrollbarDomNode.setWidth(layoutInfo.contentWidth);
        }
        this.scrollbarDomNode.setHeight(layoutInfo.height);
    };
    EditorScrollbar.prototype.getOverviewRulerLayoutInfo = function () {
        return this.scrollbar.getOverviewRulerLayoutInfo();
    };
    EditorScrollbar.prototype.getDomNode = function () {
        return this.scrollbarDomNode;
    };
    EditorScrollbar.prototype.delegateVerticalScrollbarMouseDown = function (browserEvent) {
        this.scrollbar.delegateVerticalScrollbarMouseDown(browserEvent);
    };
    // --- begin event handlers
    EditorScrollbar.prototype.onConfigurationChanged = function (e) {
        if (e.hasChanged(78 /* scrollbar */)
            || e.hasChanged(56 /* mouseWheelScrollSensitivity */)
            || e.hasChanged(27 /* fastScrollSensitivity */)) {
            var options = this._context.configuration.options;
            var scrollbar = options.get(78 /* scrollbar */);
            var mouseWheelScrollSensitivity = options.get(56 /* mouseWheelScrollSensitivity */);
            var fastScrollSensitivity = options.get(27 /* fastScrollSensitivity */);
            var newOpts = {
                handleMouseWheel: scrollbar.handleMouseWheel,
                mouseWheelScrollSensitivity: mouseWheelScrollSensitivity,
                fastScrollSensitivity: fastScrollSensitivity
            };
            this.scrollbar.updateOptions(newOpts);
        }
        if (e.hasChanged(107 /* layoutInfo */)) {
            this._setLayout();
        }
        return true;
    };
    EditorScrollbar.prototype.onScrollChanged = function (e) {
        return true;
    };
    EditorScrollbar.prototype.onThemeChanged = function (e) {
        this.scrollbar.updateClassName('editor-scrollable' + ' ' + getThemeTypeSelector(this._context.theme.type));
        return true;
    };
    // --- end event handlers
    EditorScrollbar.prototype.prepareRender = function (ctx) {
        // Nothing to do
    };
    EditorScrollbar.prototype.render = function (ctx) {
        this.scrollbar.renderNow();
    };
    return EditorScrollbar;
}(ViewPart));
export { EditorScrollbar };
