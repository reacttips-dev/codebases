/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { LineBreakData } from '../../common/viewModel/splitLinesCollection.js';
import { createStringBuilder } from '../../common/core/stringBuilder.js';
import * as strings from '../../../base/common/strings.js';
import { Configuration } from '../config/configuration.js';
var DOMLineBreaksComputerFactory = /** @class */ (function () {
    function DOMLineBreaksComputerFactory() {
    }
    DOMLineBreaksComputerFactory.create = function () {
        return new DOMLineBreaksComputerFactory();
    };
    DOMLineBreaksComputerFactory.prototype.createLineBreaksComputer = function (fontInfo, tabSize, wrappingColumn, wrappingIndent) {
        tabSize = tabSize | 0; //@perf
        wrappingColumn = +wrappingColumn; //@perf
        var requests = [];
        return {
            addRequest: function (lineText, previousLineBreakData) {
                requests.push(lineText);
            },
            finalize: function () {
                return createLineBreaks(requests, fontInfo, tabSize, wrappingColumn, wrappingIndent);
            }
        };
    };
    return DOMLineBreaksComputerFactory;
}());
export { DOMLineBreaksComputerFactory };
function createLineBreaks(requests, fontInfo, tabSize, firstLineBreakColumn, wrappingIndent) {
    if (firstLineBreakColumn === -1) {
        var result_1 = [];
        for (var i = 0, len = requests.length; i < len; i++) {
            result_1[i] = null;
        }
        return result_1;
    }
    var overallWidth = Math.round(firstLineBreakColumn * fontInfo.typicalHalfwidthCharacterWidth);
    // Cannot respect WrappingIndent.Indent and WrappingIndent.DeepIndent because that would require
    // two dom layouts, in order to first set the width of the first line, and then set the width of the wrapped lines
    if (wrappingIndent === 2 /* Indent */ || wrappingIndent === 3 /* DeepIndent */) {
        wrappingIndent = 1 /* Same */;
    }
    var containerDomNode = document.createElement('div');
    Configuration.applyFontInfoSlow(containerDomNode, fontInfo);
    var sb = createStringBuilder(10000);
    var firstNonWhitespaceIndices = [];
    var wrappedTextIndentLengths = [];
    var renderLineContents = [];
    var allCharOffsets = [];
    var allVisibleColumns = [];
    for (var i = 0; i < requests.length; i++) {
        var lineContent = requests[i];
        var firstNonWhitespaceIndex = 0;
        var wrappedTextIndentLength = 0;
        var width = overallWidth;
        if (wrappingIndent !== 0 /* None */) {
            firstNonWhitespaceIndex = strings.firstNonWhitespaceIndex(lineContent);
            if (firstNonWhitespaceIndex === -1) {
                // all whitespace line
                firstNonWhitespaceIndex = 0;
            }
            else {
                // Track existing indent
                for (var i_1 = 0; i_1 < firstNonWhitespaceIndex; i_1++) {
                    var charWidth = (lineContent.charCodeAt(i_1) === 9 /* Tab */
                        ? (tabSize - (wrappedTextIndentLength % tabSize))
                        : 1);
                    wrappedTextIndentLength += charWidth;
                }
                var indentWidth = Math.ceil(fontInfo.spaceWidth * wrappedTextIndentLength);
                // Force sticking to beginning of line if no character would fit except for the indentation
                if (indentWidth + fontInfo.typicalFullwidthCharacterWidth > overallWidth) {
                    firstNonWhitespaceIndex = 0;
                    wrappedTextIndentLength = 0;
                }
                else {
                    width = overallWidth - indentWidth;
                }
            }
        }
        var renderLineContent = lineContent.substr(firstNonWhitespaceIndex);
        var tmp = renderLine(renderLineContent, wrappedTextIndentLength, tabSize, width, sb);
        firstNonWhitespaceIndices[i] = firstNonWhitespaceIndex;
        wrappedTextIndentLengths[i] = wrappedTextIndentLength;
        renderLineContents[i] = renderLineContent;
        allCharOffsets[i] = tmp[0];
        allVisibleColumns[i] = tmp[1];
    }
    containerDomNode.innerHTML = sb.build();
    containerDomNode.style.position = 'absolute';
    containerDomNode.style.top = '10000';
    containerDomNode.style.wordWrap = 'break-word';
    document.body.appendChild(containerDomNode);
    var range = document.createRange();
    var lineDomNodes = Array.prototype.slice.call(containerDomNode.children, 0);
    var result = [];
    for (var i = 0; i < requests.length; i++) {
        var lineDomNode = lineDomNodes[i];
        var breakOffsets = readLineBreaks(range, lineDomNode, renderLineContents[i], allCharOffsets[i]);
        if (breakOffsets === null) {
            result[i] = null;
            continue;
        }
        var firstNonWhitespaceIndex = firstNonWhitespaceIndices[i];
        var wrappedTextIndentLength = wrappedTextIndentLengths[i];
        var visibleColumns = allVisibleColumns[i];
        var breakOffsetsVisibleColumn = [];
        for (var j = 0, len = breakOffsets.length; j < len; j++) {
            breakOffsetsVisibleColumn[j] = visibleColumns[breakOffsets[j]];
        }
        if (firstNonWhitespaceIndex !== 0) {
            // All break offsets are relative to the renderLineContent, make them absolute again
            for (var j = 0, len = breakOffsets.length; j < len; j++) {
                breakOffsets[j] += firstNonWhitespaceIndex;
            }
        }
        result[i] = new LineBreakData(breakOffsets, breakOffsetsVisibleColumn, wrappedTextIndentLength);
    }
    document.body.removeChild(containerDomNode);
    return result;
}
function renderLine(lineContent, initialVisibleColumn, tabSize, width, sb) {
    sb.appendASCIIString('<div style="width:');
    sb.appendASCIIString(String(width));
    sb.appendASCIIString('px;">');
    // if (containsRTL) {
    // 	sb.appendASCIIString('" dir="ltr');
    // }
    var len = lineContent.length;
    var visibleColumn = initialVisibleColumn;
    var charOffset = 0;
    var charOffsets = [];
    var visibleColumns = [];
    var nextCharCode = (0 < len ? lineContent.charCodeAt(0) : 0 /* Null */);
    for (var charIndex = 0; charIndex < len; charIndex++) {
        charOffsets[charIndex] = charOffset;
        visibleColumns[charIndex] = visibleColumn;
        var charCode = nextCharCode;
        nextCharCode = (charIndex + 1 < len ? lineContent.charCodeAt(charIndex + 1) : 0 /* Null */);
        var producedCharacters = 1;
        var charWidth = 1;
        switch (charCode) {
            case 9 /* Tab */:
                producedCharacters = (tabSize - (visibleColumn % tabSize));
                charWidth = producedCharacters;
                for (var space = 1; space <= producedCharacters; space++) {
                    if (space < producedCharacters) {
                        sb.write1(0xA0); // &nbsp;
                    }
                    else {
                        sb.appendASCII(32 /* Space */);
                    }
                }
                break;
            case 32 /* Space */:
                if (nextCharCode === 32 /* Space */) {
                    sb.write1(0xA0); // &nbsp;
                }
                else {
                    sb.appendASCII(32 /* Space */);
                }
                break;
            case 60 /* LessThan */:
                sb.appendASCIIString('&lt;');
                break;
            case 62 /* GreaterThan */:
                sb.appendASCIIString('&gt;');
                break;
            case 38 /* Ampersand */:
                sb.appendASCIIString('&amp;');
                break;
            case 0 /* Null */:
                sb.appendASCIIString('&#00;');
                break;
            case 65279 /* UTF8_BOM */:
            case 8232 /* LINE_SEPARATOR_2028 */:
                sb.write1(0xFFFD);
                break;
            default:
                if (strings.isFullWidthCharacter(charCode)) {
                    charWidth++;
                }
                // if (renderControlCharacters && charCode < 32) {
                // 	sb.write1(9216 + charCode);
                // } else {
                sb.write1(charCode);
            // }
        }
        charOffset += producedCharacters;
        visibleColumn += charWidth;
    }
    charOffsets[lineContent.length] = charOffset;
    visibleColumns[lineContent.length] = visibleColumn;
    sb.appendASCIIString('</div>');
    return [charOffsets, visibleColumns];
}
function readLineBreaks(range, lineDomNode, lineContent, charOffsets) {
    if (lineContent.length <= 1) {
        return null;
    }
    var textContentNode = lineDomNode.firstChild;
    var breakOffsets = [];
    discoverBreaks(range, textContentNode, charOffsets, 0, null, lineContent.length - 1, null, breakOffsets);
    if (breakOffsets.length === 0) {
        return null;
    }
    breakOffsets.push(lineContent.length);
    return breakOffsets;
}
function discoverBreaks(range, textContentNode, charOffsets, low, lowRects, high, highRects, result) {
    if (low === high) {
        return;
    }
    lowRects = lowRects || readClientRect(range, textContentNode, charOffsets[low], charOffsets[low + 1]);
    highRects = highRects || readClientRect(range, textContentNode, charOffsets[high], charOffsets[high + 1]);
    if (Math.abs(lowRects[0].top - highRects[0].top) <= 0.1) {
        // same line
        return;
    }
    // there is at least one line break between these two offsets
    if (low + 1 === high) {
        // the two characters are adjacent, so the line break must be exactly between them
        result.push(high);
        return;
    }
    var mid = low + ((high - low) / 2) | 0;
    var midRects = readClientRect(range, textContentNode, charOffsets[mid], charOffsets[mid + 1]);
    discoverBreaks(range, textContentNode, charOffsets, low, lowRects, mid, midRects, result);
    discoverBreaks(range, textContentNode, charOffsets, mid, midRects, high, highRects, result);
}
function readClientRect(range, textContentNode, startOffset, endOffset) {
    range.setStart(textContentNode, startOffset);
    range.setEnd(textContentNode, endOffset);
    return range.getClientRects();
}
