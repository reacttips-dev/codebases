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
import { createFastDomNode } from '../../../../base/browser/fastDomNode.js';
import { ViewPart } from '../../view/viewPart.js';
var Margin = /** @class */ (function (_super) {
    __extends(Margin, _super);
    function Margin(context) {
        var _this = _super.call(this, context) || this;
        var options = _this._context.configuration.options;
        var layoutInfo = options.get(107 /* layoutInfo */);
        _this._canUseLayerHinting = !options.get(22 /* disableLayerHinting */);
        _this._contentLeft = layoutInfo.contentLeft;
        _this._glyphMarginLeft = layoutInfo.glyphMarginLeft;
        _this._glyphMarginWidth = layoutInfo.glyphMarginWidth;
        _this._domNode = createFastDomNode(document.createElement('div'));
        _this._domNode.setClassName(Margin.OUTER_CLASS_NAME);
        _this._domNode.setPosition('absolute');
        _this._domNode.setAttribute('role', 'presentation');
        _this._domNode.setAttribute('aria-hidden', 'true');
        _this._glyphMarginBackgroundDomNode = createFastDomNode(document.createElement('div'));
        _this._glyphMarginBackgroundDomNode.setClassName(Margin.CLASS_NAME);
        _this._domNode.appendChild(_this._glyphMarginBackgroundDomNode);
        return _this;
    }
    Margin.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
    };
    Margin.prototype.getDomNode = function () {
        return this._domNode;
    };
    // --- begin event handlers
    Margin.prototype.onConfigurationChanged = function (e) {
        var options = this._context.configuration.options;
        var layoutInfo = options.get(107 /* layoutInfo */);
        this._canUseLayerHinting = !options.get(22 /* disableLayerHinting */);
        this._contentLeft = layoutInfo.contentLeft;
        this._glyphMarginLeft = layoutInfo.glyphMarginLeft;
        this._glyphMarginWidth = layoutInfo.glyphMarginWidth;
        return true;
    };
    Margin.prototype.onScrollChanged = function (e) {
        return _super.prototype.onScrollChanged.call(this, e) || e.scrollTopChanged;
    };
    // --- end event handlers
    Margin.prototype.prepareRender = function (ctx) {
        // Nothing to read
    };
    Margin.prototype.render = function (ctx) {
        this._domNode.setLayerHinting(this._canUseLayerHinting);
        this._domNode.setContain('strict');
        var adjustedScrollTop = ctx.scrollTop - ctx.bigNumbersDelta;
        this._domNode.setTop(-adjustedScrollTop);
        var height = Math.min(ctx.scrollHeight, 1000000);
        this._domNode.setHeight(height);
        this._domNode.setWidth(this._contentLeft);
        this._glyphMarginBackgroundDomNode.setLeft(this._glyphMarginLeft);
        this._glyphMarginBackgroundDomNode.setWidth(this._glyphMarginWidth);
        this._glyphMarginBackgroundDomNode.setHeight(height);
    };
    Margin.CLASS_NAME = 'glyph-margin';
    Margin.OUTER_CLASS_NAME = 'margin';
    return Margin;
}(ViewPart));
export { Margin };
