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
import * as strings from '../../../base/common/strings.js';
import { CharacterClassifier } from '../core/characterClassifier.js';
import { LineBreakData } from './splitLinesCollection.js';
var WrappingCharacterClassifier = /** @class */ (function (_super) {
    __extends(WrappingCharacterClassifier, _super);
    function WrappingCharacterClassifier(BREAK_BEFORE, BREAK_AFTER) {
        var _this = _super.call(this, 0 /* NONE */) || this;
        for (var i = 0; i < BREAK_BEFORE.length; i++) {
            _this.set(BREAK_BEFORE.charCodeAt(i), 1 /* BREAK_BEFORE */);
        }
        for (var i = 0; i < BREAK_AFTER.length; i++) {
            _this.set(BREAK_AFTER.charCodeAt(i), 2 /* BREAK_AFTER */);
        }
        return _this;
    }
    WrappingCharacterClassifier.prototype.get = function (charCode) {
        if (charCode >= 0 && charCode < 256) {
            return this._asciiMap[charCode];
        }
        else {
            // Initialize CharacterClass.BREAK_IDEOGRAPHIC for these Unicode ranges:
            // 1. CJK Unified Ideographs (0x4E00 -- 0x9FFF)
            // 2. CJK Unified Ideographs Extension A (0x3400 -- 0x4DBF)
            // 3. Hiragana and Katakana (0x3040 -- 0x30FF)
            if ((charCode >= 0x3040 && charCode <= 0x30FF)
                || (charCode >= 0x3400 && charCode <= 0x4DBF)
                || (charCode >= 0x4E00 && charCode <= 0x9FFF)) {
                return 3 /* BREAK_IDEOGRAPHIC */;
            }
            return (this._map.get(charCode) || this._defaultValue);
        }
    };
    return WrappingCharacterClassifier;
}(CharacterClassifier));
var arrPool1 = [];
var arrPool2 = [];
var MonospaceLineBreaksComputerFactory = /** @class */ (function () {
    function MonospaceLineBreaksComputerFactory(breakBeforeChars, breakAfterChars) {
        this.classifier = new WrappingCharacterClassifier(breakBeforeChars, breakAfterChars);
    }
    MonospaceLineBreaksComputerFactory.create = function (options) {
        return new MonospaceLineBreaksComputerFactory(options.get(99 /* wordWrapBreakBeforeCharacters */), options.get(98 /* wordWrapBreakAfterCharacters */));
    };
    MonospaceLineBreaksComputerFactory.prototype.createLineBreaksComputer = function (fontInfo, tabSize, wrappingColumn, wrappingIndent) {
        var _this = this;
        tabSize = tabSize | 0; //@perf
        wrappingColumn = +wrappingColumn; //@perf
        var requests = [];
        var previousBreakingData = [];
        return {
            addRequest: function (lineText, previousLineBreakData) {
                requests.push(lineText);
                previousBreakingData.push(previousLineBreakData);
            },
            finalize: function () {
                var columnsForFullWidthChar = fontInfo.typicalFullwidthCharacterWidth / fontInfo.typicalHalfwidthCharacterWidth; //@perf
                var result = [];
                for (var i = 0, len = requests.length; i < len; i++) {
                    var previousLineBreakData = previousBreakingData[i];
                    if (previousLineBreakData) {
                        result[i] = createLineBreaksFromPreviousLineBreaks(_this.classifier, previousLineBreakData, requests[i], tabSize, wrappingColumn, columnsForFullWidthChar, wrappingIndent);
                    }
                    else {
                        result[i] = createLineBreaks(_this.classifier, requests[i], tabSize, wrappingColumn, columnsForFullWidthChar, wrappingIndent);
                    }
                }
                arrPool1.length = 0;
                arrPool2.length = 0;
                return result;
            }
        };
    };
    return MonospaceLineBreaksComputerFactory;
}());
export { MonospaceLineBreaksComputerFactory };
function createLineBreaksFromPreviousLineBreaks(classifier, previousBreakingData, lineText, tabSize, firstLineBreakColumn, columnsForFullWidthChar, wrappingIndent) {
    if (firstLineBreakColumn === -1) {
        return null;
    }
    var len = lineText.length;
    if (len <= 1) {
        return null;
    }
    var prevBreakingOffsets = previousBreakingData.breakOffsets;
    var prevBreakingOffsetsVisibleColumn = previousBreakingData.breakOffsetsVisibleColumn;
    var wrappedTextIndentLength = computeWrappedTextIndentLength(lineText, tabSize, firstLineBreakColumn, columnsForFullWidthChar, wrappingIndent);
    var wrappedLineBreakColumn = firstLineBreakColumn - wrappedTextIndentLength;
    var breakingOffsets = arrPool1;
    var breakingOffsetsVisibleColumn = arrPool2;
    var breakingOffsetsCount = 0;
    var breakingColumn = firstLineBreakColumn;
    var prevLen = prevBreakingOffsets.length;
    var prevIndex = 0;
    if (prevIndex >= 0) {
        var bestDistance = Math.abs(prevBreakingOffsetsVisibleColumn[prevIndex] - breakingColumn);
        while (prevIndex + 1 < prevLen) {
            var distance = Math.abs(prevBreakingOffsetsVisibleColumn[prevIndex + 1] - breakingColumn);
            if (distance >= bestDistance) {
                break;
            }
            bestDistance = distance;
            prevIndex++;
        }
    }
    while (prevIndex < prevLen) {
        // Allow for prevIndex to be -1 (for the case where we hit a tab when walking backwards from the first break)
        var prevBreakOffset = prevIndex < 0 ? 0 : prevBreakingOffsets[prevIndex];
        var prevBreakoffsetVisibleColumn = prevIndex < 0 ? 0 : prevBreakingOffsetsVisibleColumn[prevIndex];
        var breakOffset = 0;
        var breakOffsetVisibleColumn = 0;
        var forcedBreakOffset = 0;
        var forcedBreakOffsetVisibleColumn = 0;
        // initially, we search as much as possible to the right (if it fits)
        if (prevBreakoffsetVisibleColumn <= breakingColumn) {
            var visibleColumn = prevBreakoffsetVisibleColumn;
            var prevCharCode = lineText.charCodeAt(prevBreakOffset - 1);
            var prevCharCodeClass = classifier.get(prevCharCode);
            var entireLineFits = true;
            for (var i = prevBreakOffset; i < len; i++) {
                var charStartOffset = i;
                var charCode = lineText.charCodeAt(i);
                var charCodeClass = void 0;
                var charWidth = void 0;
                if (strings.isHighSurrogate(charCode)) {
                    // A surrogate pair must always be considered as a single unit, so it is never to be broken
                    i++;
                    charCodeClass = 0 /* NONE */;
                    charWidth = 2;
                }
                else {
                    charCodeClass = classifier.get(charCode);
                    charWidth = computeCharWidth(charCode, visibleColumn, tabSize, columnsForFullWidthChar);
                }
                if (canBreak(prevCharCode, prevCharCodeClass, charCode, charCodeClass)) {
                    breakOffset = charStartOffset;
                    breakOffsetVisibleColumn = visibleColumn;
                }
                visibleColumn += charWidth;
                // check if adding character at `i` will go over the breaking column
                if (visibleColumn > breakingColumn) {
                    // We need to break at least before character at `i`:
                    forcedBreakOffset = charStartOffset;
                    forcedBreakOffsetVisibleColumn = visibleColumn - charWidth;
                    if (visibleColumn - breakOffsetVisibleColumn > wrappedLineBreakColumn) {
                        // Cannot break at `breakOffset` => reset it if it was set
                        breakOffset = 0;
                    }
                    entireLineFits = false;
                    break;
                }
                prevCharCode = charCode;
                prevCharCodeClass = charCodeClass;
            }
            if (entireLineFits) {
                // there is no more need to break => stop the outer loop!
                if (breakingOffsetsCount > 0) {
                    // Add last segment
                    breakingOffsets[breakingOffsetsCount] = prevBreakingOffsets[prevBreakingOffsets.length - 1];
                    breakingOffsetsVisibleColumn[breakingOffsetsCount] = prevBreakingOffsetsVisibleColumn[prevBreakingOffsets.length - 1];
                    breakingOffsetsCount++;
                }
                break;
            }
        }
        if (breakOffset === 0) {
            // must search left
            var visibleColumn = prevBreakoffsetVisibleColumn;
            var charCode = lineText.charCodeAt(prevBreakOffset);
            var charCodeClass = classifier.get(charCode);
            var hitATabCharacter = false;
            for (var i = prevBreakOffset - 1; i >= 0; i--) {
                var charStartOffset = i + 1;
                var prevCharCode = lineText.charCodeAt(i);
                if (prevCharCode === 9 /* Tab */) {
                    // cannot determine the width of a tab when going backwards, so we must go forwards
                    hitATabCharacter = true;
                    break;
                }
                var prevCharCodeClass = void 0;
                var prevCharWidth = void 0;
                if (strings.isLowSurrogate(prevCharCode)) {
                    // A surrogate pair must always be considered as a single unit, so it is never to be broken
                    i--;
                    prevCharCodeClass = 0 /* NONE */;
                    prevCharWidth = 2;
                }
                else {
                    prevCharCodeClass = classifier.get(prevCharCode);
                    prevCharWidth = (strings.isFullWidthCharacter(prevCharCode) ? columnsForFullWidthChar : 1);
                }
                if (visibleColumn <= breakingColumn) {
                    if (forcedBreakOffset === 0) {
                        forcedBreakOffset = charStartOffset;
                        forcedBreakOffsetVisibleColumn = visibleColumn;
                    }
                    if (visibleColumn <= breakingColumn - wrappedLineBreakColumn) {
                        // went too far!
                        break;
                    }
                    if (canBreak(prevCharCode, prevCharCodeClass, charCode, charCodeClass)) {
                        breakOffset = charStartOffset;
                        breakOffsetVisibleColumn = visibleColumn;
                        break;
                    }
                }
                visibleColumn -= prevCharWidth;
                charCode = prevCharCode;
                charCodeClass = prevCharCodeClass;
            }
            if (breakOffset !== 0) {
                var remainingWidthOfNextLine = wrappedLineBreakColumn - (forcedBreakOffsetVisibleColumn - breakOffsetVisibleColumn);
                if (remainingWidthOfNextLine <= tabSize) {
                    var charCodeAtForcedBreakOffset = lineText.charCodeAt(forcedBreakOffset);
                    var charWidth = void 0;
                    if (strings.isHighSurrogate(charCodeAtForcedBreakOffset)) {
                        // A surrogate pair must always be considered as a single unit, so it is never to be broken
                        charWidth = 2;
                    }
                    else {
                        charWidth = computeCharWidth(charCodeAtForcedBreakOffset, forcedBreakOffsetVisibleColumn, tabSize, columnsForFullWidthChar);
                    }
                    if (remainingWidthOfNextLine - charWidth < 0) {
                        // it is not worth it to break at breakOffset, it just introduces an extra needless line!
                        breakOffset = 0;
                    }
                }
            }
            if (hitATabCharacter) {
                // cannot determine the width of a tab when going backwards, so we must go forwards from the previous break
                prevIndex--;
                continue;
            }
        }
        if (breakOffset === 0) {
            // Could not find a good breaking point
            breakOffset = forcedBreakOffset;
            breakOffsetVisibleColumn = forcedBreakOffsetVisibleColumn;
        }
        breakingOffsets[breakingOffsetsCount] = breakOffset;
        breakingOffsetsVisibleColumn[breakingOffsetsCount] = breakOffsetVisibleColumn;
        breakingOffsetsCount++;
        breakingColumn = breakOffsetVisibleColumn + wrappedLineBreakColumn;
        while (prevIndex < 0 || (prevIndex < prevLen && prevBreakingOffsetsVisibleColumn[prevIndex] < breakOffsetVisibleColumn)) {
            prevIndex++;
        }
        var bestDistance = Math.abs(prevBreakingOffsetsVisibleColumn[prevIndex] - breakingColumn);
        while (prevIndex + 1 < prevLen) {
            var distance = Math.abs(prevBreakingOffsetsVisibleColumn[prevIndex + 1] - breakingColumn);
            if (distance >= bestDistance) {
                break;
            }
            bestDistance = distance;
            prevIndex++;
        }
    }
    if (breakingOffsetsCount === 0) {
        return null;
    }
    // Doing here some object reuse which ends up helping a huge deal with GC pauses!
    breakingOffsets.length = breakingOffsetsCount;
    breakingOffsetsVisibleColumn.length = breakingOffsetsCount;
    arrPool1 = previousBreakingData.breakOffsets;
    arrPool2 = previousBreakingData.breakOffsetsVisibleColumn;
    previousBreakingData.breakOffsets = breakingOffsets;
    previousBreakingData.breakOffsetsVisibleColumn = breakingOffsetsVisibleColumn;
    previousBreakingData.wrappedTextIndentLength = wrappedTextIndentLength;
    return previousBreakingData;
}
function createLineBreaks(classifier, lineText, tabSize, firstLineBreakColumn, columnsForFullWidthChar, wrappingIndent) {
    if (firstLineBreakColumn === -1) {
        return null;
    }
    var len = lineText.length;
    if (len <= 1) {
        return null;
    }
    var wrappedTextIndentLength = computeWrappedTextIndentLength(lineText, tabSize, firstLineBreakColumn, columnsForFullWidthChar, wrappingIndent);
    var wrappedLineBreakColumn = firstLineBreakColumn - wrappedTextIndentLength;
    var breakingOffsets = [];
    var breakingOffsetsVisibleColumn = [];
    var breakingOffsetsCount = 0;
    var breakOffset = 0;
    var breakOffsetVisibleColumn = 0;
    var breakingColumn = firstLineBreakColumn;
    var prevCharCode = lineText.charCodeAt(0);
    var prevCharCodeClass = classifier.get(prevCharCode);
    var visibleColumn = computeCharWidth(prevCharCode, 0, tabSize, columnsForFullWidthChar);
    var startOffset = 1;
    if (strings.isHighSurrogate(prevCharCode)) {
        // A surrogate pair must always be considered as a single unit, so it is never to be broken
        visibleColumn += 1;
        prevCharCode = lineText.charCodeAt(1);
        prevCharCodeClass = classifier.get(prevCharCode);
        startOffset++;
    }
    for (var i = startOffset; i < len; i++) {
        var charStartOffset = i;
        var charCode = lineText.charCodeAt(i);
        var charCodeClass = void 0;
        var charWidth = void 0;
        if (strings.isHighSurrogate(charCode)) {
            // A surrogate pair must always be considered as a single unit, so it is never to be broken
            i++;
            charCodeClass = 0 /* NONE */;
            charWidth = 2;
        }
        else {
            charCodeClass = classifier.get(charCode);
            charWidth = computeCharWidth(charCode, visibleColumn, tabSize, columnsForFullWidthChar);
        }
        if (canBreak(prevCharCode, prevCharCodeClass, charCode, charCodeClass)) {
            breakOffset = charStartOffset;
            breakOffsetVisibleColumn = visibleColumn;
        }
        visibleColumn += charWidth;
        // check if adding character at `i` will go over the breaking column
        if (visibleColumn > breakingColumn) {
            // We need to break at least before character at `i`:
            if (breakOffset === 0 || visibleColumn - breakOffsetVisibleColumn > wrappedLineBreakColumn) {
                // Cannot break at `breakOffset`, must break at `i`
                breakOffset = charStartOffset;
                breakOffsetVisibleColumn = visibleColumn - charWidth;
            }
            breakingOffsets[breakingOffsetsCount] = breakOffset;
            breakingOffsetsVisibleColumn[breakingOffsetsCount] = breakOffsetVisibleColumn;
            breakingOffsetsCount++;
            breakingColumn = breakOffsetVisibleColumn + wrappedLineBreakColumn;
            breakOffset = 0;
        }
        prevCharCode = charCode;
        prevCharCodeClass = charCodeClass;
    }
    if (breakingOffsetsCount === 0) {
        return null;
    }
    // Add last segment
    breakingOffsets[breakingOffsetsCount] = len;
    breakingOffsetsVisibleColumn[breakingOffsetsCount] = visibleColumn;
    return new LineBreakData(breakingOffsets, breakingOffsetsVisibleColumn, wrappedTextIndentLength);
}
function computeCharWidth(charCode, visibleColumn, tabSize, columnsForFullWidthChar) {
    if (charCode === 9 /* Tab */) {
        return (tabSize - (visibleColumn % tabSize));
    }
    if (strings.isFullWidthCharacter(charCode)) {
        return columnsForFullWidthChar;
    }
    return 1;
}
function tabCharacterWidth(visibleColumn, tabSize) {
    return (tabSize - (visibleColumn % tabSize));
}
/**
 * Kinsoku Shori : Don't break after a leading character, like an open bracket
 * Kinsoku Shori : Don't break before a trailing character, like a period
 */
function canBreak(prevCharCode, prevCharCodeClass, charCode, charCodeClass) {
    return (charCode !== 32 /* Space */
        && ((prevCharCodeClass === 2 /* BREAK_AFTER */)
            || (prevCharCodeClass === 3 /* BREAK_IDEOGRAPHIC */ && charCodeClass !== 2 /* BREAK_AFTER */)
            || (charCodeClass === 1 /* BREAK_BEFORE */)
            || (charCodeClass === 3 /* BREAK_IDEOGRAPHIC */ && prevCharCodeClass !== 1 /* BREAK_BEFORE */)));
}
function computeWrappedTextIndentLength(lineText, tabSize, firstLineBreakColumn, columnsForFullWidthChar, wrappingIndent) {
    var wrappedTextIndentLength = 0;
    if (wrappingIndent !== 0 /* None */) {
        var firstNonWhitespaceIndex = strings.firstNonWhitespaceIndex(lineText);
        if (firstNonWhitespaceIndex !== -1) {
            // Track existing indent
            for (var i = 0; i < firstNonWhitespaceIndex; i++) {
                var charWidth = (lineText.charCodeAt(i) === 9 /* Tab */ ? tabCharacterWidth(wrappedTextIndentLength, tabSize) : 1);
                wrappedTextIndentLength += charWidth;
            }
            // Increase indent of continuation lines, if desired
            var numberOfAdditionalTabs = (wrappingIndent === 3 /* DeepIndent */ ? 2 : wrappingIndent === 2 /* Indent */ ? 1 : 0);
            for (var i = 0; i < numberOfAdditionalTabs; i++) {
                var charWidth = tabCharacterWidth(wrappedTextIndentLength, tabSize);
                wrappedTextIndentLength += charWidth;
            }
            // Force sticking to beginning of line if no character would fit except for the indentation
            if (wrappedTextIndentLength + columnsForFullWidthChar > firstLineBreakColumn) {
                wrappedTextIndentLength = 0;
            }
        }
    }
    return wrappedTextIndentLength;
}
