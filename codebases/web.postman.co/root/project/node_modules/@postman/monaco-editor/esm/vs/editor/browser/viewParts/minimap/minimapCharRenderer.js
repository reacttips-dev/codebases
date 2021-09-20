/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { getCharIndex } from './minimapCharSheet.js';
var MinimapCharRenderer = /** @class */ (function () {
    function MinimapCharRenderer(charData, scale) {
        this.scale = scale;
        this.charDataNormal = MinimapCharRenderer.soften(charData, 12 / 15);
        this.charDataLight = MinimapCharRenderer.soften(charData, 50 / 60);
    }
    MinimapCharRenderer.soften = function (input, ratio) {
        var result = new Uint8ClampedArray(input.length);
        for (var i = 0, len = input.length; i < len; i++) {
            result[i] = input[i] * ratio;
        }
        return result;
    };
    MinimapCharRenderer.prototype.renderChar = function (target, dx, dy, chCode, color, backgroundColor, fontScale, useLighterFont) {
        var charWidth = 1 /* BASE_CHAR_WIDTH */ * this.scale;
        var charHeight = 2 /* BASE_CHAR_HEIGHT */ * this.scale;
        if (dx + charWidth > target.width || dy + charHeight > target.height) {
            console.warn('bad render request outside image data');
            return;
        }
        var charData = useLighterFont ? this.charDataLight : this.charDataNormal;
        var charIndex = getCharIndex(chCode, fontScale);
        var destWidth = target.width * 4 /* RGBA_CHANNELS_CNT */;
        var backgroundR = backgroundColor.r;
        var backgroundG = backgroundColor.g;
        var backgroundB = backgroundColor.b;
        var deltaR = color.r - backgroundR;
        var deltaG = color.g - backgroundG;
        var deltaB = color.b - backgroundB;
        var dest = target.data;
        var sourceOffset = charIndex * charWidth * charHeight;
        var row = dy * destWidth + dx * 4 /* RGBA_CHANNELS_CNT */;
        for (var y = 0; y < charHeight; y++) {
            var column = row;
            for (var x = 0; x < charWidth; x++) {
                var c = charData[sourceOffset++] / 255;
                dest[column++] = backgroundR + deltaR * c;
                dest[column++] = backgroundG + deltaG * c;
                dest[column++] = backgroundB + deltaB * c;
                column++;
            }
            row += destWidth;
        }
    };
    MinimapCharRenderer.prototype.blockRenderChar = function (target, dx, dy, color, backgroundColor, useLighterFont) {
        var charWidth = 1 /* BASE_CHAR_WIDTH */ * this.scale;
        var charHeight = 2 /* BASE_CHAR_HEIGHT */ * this.scale;
        if (dx + charWidth > target.width || dy + charHeight > target.height) {
            console.warn('bad render request outside image data');
            return;
        }
        var destWidth = target.width * 4 /* RGBA_CHANNELS_CNT */;
        var c = 0.5;
        var backgroundR = backgroundColor.r;
        var backgroundG = backgroundColor.g;
        var backgroundB = backgroundColor.b;
        var deltaR = color.r - backgroundR;
        var deltaG = color.g - backgroundG;
        var deltaB = color.b - backgroundB;
        var colorR = backgroundR + deltaR * c;
        var colorG = backgroundG + deltaG * c;
        var colorB = backgroundB + deltaB * c;
        var dest = target.data;
        var row = dy * destWidth + dx * 4 /* RGBA_CHANNELS_CNT */;
        for (var y = 0; y < charHeight; y++) {
            var column = row;
            for (var x = 0; x < charWidth; x++) {
                dest[column++] = colorR;
                dest[column++] = colorG;
                dest[column++] = colorB;
                column++;
            }
            row += destWidth;
        }
    };
    return MinimapCharRenderer;
}());
export { MinimapCharRenderer };
