/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MinimapCharRenderer } from './minimapCharRenderer.js';
import { allCharCodes } from './minimapCharSheet.js';
import { prebakedMiniMaps } from './minimapPreBaked.js';
/**
 * Creates character renderers. It takes a 'scale' that determines how large
 * characters should be drawn. Using this, it draws data into a canvas and
 * then downsamples the characters as necessary for the current display.
 * This makes rendering more efficient, rather than drawing a full (tiny)
 * font, or downsampling in real-time.
 */
var MinimapCharRendererFactory = /** @class */ (function () {
    function MinimapCharRendererFactory() {
    }
    /**
     * Creates a new character renderer factory with the given scale.
     */
    MinimapCharRendererFactory.create = function (scale, fontFamily) {
        // renderers are immutable. By default we'll 'create' a new minimap
        // character renderer whenever we switch editors, no need to do extra work.
        if (this.lastCreated && scale === this.lastCreated.scale && fontFamily === this.lastFontFamily) {
            return this.lastCreated;
        }
        var factory;
        if (prebakedMiniMaps[scale]) {
            factory = new MinimapCharRenderer(prebakedMiniMaps[scale](), scale);
        }
        else {
            factory = MinimapCharRendererFactory.createFromSampleData(MinimapCharRendererFactory.createSampleData(fontFamily).data, scale);
        }
        this.lastFontFamily = fontFamily;
        this.lastCreated = factory;
        return factory;
    };
    /**
     * Creates the font sample data, writing to a canvas.
     */
    MinimapCharRendererFactory.createSampleData = function (fontFamily) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.style.height = 16 /* SAMPLED_CHAR_HEIGHT */ + "px";
        canvas.height = 16 /* SAMPLED_CHAR_HEIGHT */;
        canvas.width = 96 /* CHAR_COUNT */ * 10 /* SAMPLED_CHAR_WIDTH */;
        canvas.style.width = 96 /* CHAR_COUNT */ * 10 /* SAMPLED_CHAR_WIDTH */ + 'px';
        ctx.fillStyle = '#ffffff';
        ctx.font = "bold " + 16 /* SAMPLED_CHAR_HEIGHT */ + "px " + fontFamily;
        ctx.textBaseline = 'middle';
        var x = 0;
        for (var _i = 0, allCharCodes_1 = allCharCodes; _i < allCharCodes_1.length; _i++) {
            var code = allCharCodes_1[_i];
            ctx.fillText(String.fromCharCode(code), x, 16 /* SAMPLED_CHAR_HEIGHT */ / 2);
            x += 10 /* SAMPLED_CHAR_WIDTH */;
        }
        return ctx.getImageData(0, 0, 96 /* CHAR_COUNT */ * 10 /* SAMPLED_CHAR_WIDTH */, 16 /* SAMPLED_CHAR_HEIGHT */);
    };
    /**
     * Creates a character renderer from the canvas sample data.
     */
    MinimapCharRendererFactory.createFromSampleData = function (source, scale) {
        var expectedLength = 16 /* SAMPLED_CHAR_HEIGHT */ * 10 /* SAMPLED_CHAR_WIDTH */ * 4 /* RGBA_CHANNELS_CNT */ * 96 /* CHAR_COUNT */;
        if (source.length !== expectedLength) {
            throw new Error('Unexpected source in MinimapCharRenderer');
        }
        var charData = MinimapCharRendererFactory._downsample(source, scale);
        return new MinimapCharRenderer(charData, scale);
    };
    MinimapCharRendererFactory._downsampleChar = function (source, sourceOffset, dest, destOffset, scale) {
        var width = 1 /* BASE_CHAR_WIDTH */ * scale;
        var height = 2 /* BASE_CHAR_HEIGHT */ * scale;
        var targetIndex = destOffset;
        var brightest = 0;
        // This is essentially an ad-hoc rescaling algorithm. Standard approaches
        // like bicubic interpolation are awesome for scaling between image sizes,
        // but don't work so well when scaling to very small pixel values, we end
        // up with blurry, indistinct forms.
        //
        // The approach taken here is simply mapping each source pixel to the target
        // pixels, and taking the weighted values for all pixels in each, and then
        // averaging them out. Finally we apply an intensity boost in _downsample,
        // since when scaling to the smallest pixel sizes there's more black space
        // which causes characters to be much less distinct.
        for (var y = 0; y < height; y++) {
            // 1. For this destination pixel, get the source pixels we're sampling
            // from (x1, y1) to the next pixel (x2, y2)
            var sourceY1 = (y / height) * 16 /* SAMPLED_CHAR_HEIGHT */;
            var sourceY2 = ((y + 1) / height) * 16 /* SAMPLED_CHAR_HEIGHT */;
            for (var x = 0; x < width; x++) {
                var sourceX1 = (x / width) * 10 /* SAMPLED_CHAR_WIDTH */;
                var sourceX2 = ((x + 1) / width) * 10 /* SAMPLED_CHAR_WIDTH */;
                // 2. Sample all of them, summing them up and weighting them. Similar
                // to bilinear interpolation.
                var value = 0;
                var samples = 0;
                for (var sy = sourceY1; sy < sourceY2; sy++) {
                    var sourceRow = sourceOffset + Math.floor(sy) * 3840 /* RGBA_SAMPLED_ROW_WIDTH */;
                    var yBalance = 1 - (sy - Math.floor(sy));
                    for (var sx = sourceX1; sx < sourceX2; sx++) {
                        var xBalance = 1 - (sx - Math.floor(sx));
                        var sourceIndex = sourceRow + Math.floor(sx) * 4 /* RGBA_CHANNELS_CNT */;
                        var weight = xBalance * yBalance;
                        samples += weight;
                        value += ((source[sourceIndex] * source[sourceIndex + 3]) / 255) * weight;
                    }
                }
                var final = value / samples;
                brightest = Math.max(brightest, final);
                dest[targetIndex++] = final;
            }
        }
        return brightest;
    };
    MinimapCharRendererFactory._downsample = function (data, scale) {
        var pixelsPerCharacter = 2 /* BASE_CHAR_HEIGHT */ * scale * 1 /* BASE_CHAR_WIDTH */ * scale;
        var resultLen = pixelsPerCharacter * 96 /* CHAR_COUNT */;
        var result = new Uint8ClampedArray(resultLen);
        var resultOffset = 0;
        var sourceOffset = 0;
        var brightest = 0;
        for (var charIndex = 0; charIndex < 96 /* CHAR_COUNT */; charIndex++) {
            brightest = Math.max(brightest, this._downsampleChar(data, sourceOffset, result, resultOffset, scale));
            resultOffset += pixelsPerCharacter;
            sourceOffset += 10 /* SAMPLED_CHAR_WIDTH */ * 4 /* RGBA_CHANNELS_CNT */;
        }
        if (brightest > 0) {
            var adjust = 255 / brightest;
            for (var i = 0; i < resultLen; i++) {
                result[i] *= adjust;
            }
        }
        return result;
    };
    return MinimapCharRendererFactory;
}());
export { MinimapCharRendererFactory };
