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
import * as platform from '../../../base/common/platform.js';
import { EditorZoom } from './editorZoom.js';
/**
 * Determined from empirical observations.
 * @internal
 */
var GOLDEN_LINE_HEIGHT_RATIO = platform.isMacintosh ? 1.5 : 1.35;
/**
 * @internal
 */
var MINIMUM_LINE_HEIGHT = 8;
var BareFontInfo = /** @class */ (function () {
    /**
     * @internal
     */
    function BareFontInfo(opts) {
        this.zoomLevel = opts.zoomLevel;
        this.fontFamily = String(opts.fontFamily);
        this.fontWeight = String(opts.fontWeight);
        this.fontSize = opts.fontSize;
        this.fontFeatureSettings = opts.fontFeatureSettings;
        this.lineHeight = opts.lineHeight | 0;
        this.letterSpacing = opts.letterSpacing;
    }
    /**
     * @internal
     */
    BareFontInfo.createFromValidatedSettings = function (options, zoomLevel, ignoreEditorZoom) {
        var fontFamily = options.get(33 /* fontFamily */);
        var fontWeight = options.get(37 /* fontWeight */);
        var fontSize = options.get(36 /* fontSize */);
        var fontFeatureSettings = options.get(35 /* fontLigatures */);
        var lineHeight = options.get(49 /* lineHeight */);
        var letterSpacing = options.get(46 /* letterSpacing */);
        return BareFontInfo._create(fontFamily, fontWeight, fontSize, fontFeatureSettings, lineHeight, letterSpacing, zoomLevel, ignoreEditorZoom);
    };
    /**
     * @internal
     */
    BareFontInfo._create = function (fontFamily, fontWeight, fontSize, fontFeatureSettings, lineHeight, letterSpacing, zoomLevel, ignoreEditorZoom) {
        if (lineHeight === 0) {
            lineHeight = Math.round(GOLDEN_LINE_HEIGHT_RATIO * fontSize);
        }
        else if (lineHeight < MINIMUM_LINE_HEIGHT) {
            lineHeight = MINIMUM_LINE_HEIGHT;
        }
        var editorZoomLevelMultiplier = 1 + (ignoreEditorZoom ? 0 : EditorZoom.getZoomLevel() * 0.1);
        fontSize *= editorZoomLevelMultiplier;
        lineHeight *= editorZoomLevelMultiplier;
        return new BareFontInfo({
            zoomLevel: zoomLevel,
            fontFamily: fontFamily,
            fontWeight: fontWeight,
            fontSize: fontSize,
            fontFeatureSettings: fontFeatureSettings,
            lineHeight: lineHeight,
            letterSpacing: letterSpacing
        });
    };
    /**
     * @internal
     */
    BareFontInfo.prototype.getId = function () {
        return this.zoomLevel + '-' + this.fontFamily + '-' + this.fontWeight + '-' + this.fontSize + '-' + this.fontFeatureSettings + '-' + this.lineHeight + '-' + this.letterSpacing;
    };
    /**
     * @internal
     */
    BareFontInfo.prototype.getMassagedFontFamily = function () {
        if (/[,"']/.test(this.fontFamily)) {
            // Looks like the font family might be already escaped
            return this.fontFamily;
        }
        if (/[+ ]/.test(this.fontFamily)) {
            // Wrap a font family using + or <space> with quotes
            return "\"" + this.fontFamily + "\"";
        }
        return this.fontFamily;
    };
    return BareFontInfo;
}());
export { BareFontInfo };
var FontInfo = /** @class */ (function (_super) {
    __extends(FontInfo, _super);
    /**
     * @internal
     */
    function FontInfo(opts, isTrusted) {
        var _this = _super.call(this, opts) || this;
        _this.isTrusted = isTrusted;
        _this.isMonospace = opts.isMonospace;
        _this.typicalHalfwidthCharacterWidth = opts.typicalHalfwidthCharacterWidth;
        _this.typicalFullwidthCharacterWidth = opts.typicalFullwidthCharacterWidth;
        _this.canUseHalfwidthRightwardsArrow = opts.canUseHalfwidthRightwardsArrow;
        _this.spaceWidth = opts.spaceWidth;
        _this.middotWidth = opts.middotWidth;
        _this.maxDigitWidth = opts.maxDigitWidth;
        return _this;
    }
    /**
     * @internal
     */
    FontInfo.prototype.equals = function (other) {
        return (this.fontFamily === other.fontFamily
            && this.fontWeight === other.fontWeight
            && this.fontSize === other.fontSize
            && this.fontFeatureSettings === other.fontFeatureSettings
            && this.lineHeight === other.lineHeight
            && this.letterSpacing === other.letterSpacing
            && this.typicalHalfwidthCharacterWidth === other.typicalHalfwidthCharacterWidth
            && this.typicalFullwidthCharacterWidth === other.typicalFullwidthCharacterWidth
            && this.canUseHalfwidthRightwardsArrow === other.canUseHalfwidthRightwardsArrow
            && this.spaceWidth === other.spaceWidth
            && this.middotWidth === other.middotWidth
            && this.maxDigitWidth === other.maxDigitWidth);
    };
    return FontInfo;
}(BareFontInfo));
export { FontInfo };
