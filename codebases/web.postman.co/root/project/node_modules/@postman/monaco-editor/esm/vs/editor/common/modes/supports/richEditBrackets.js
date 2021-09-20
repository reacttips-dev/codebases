/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as strings from '../../../../base/common/strings.js';
import { Range } from '../../core/range.js';
var RichEditBracket = /** @class */ (function () {
    function RichEditBracket(languageIdentifier, index, open, close, forwardRegex, reversedRegex) {
        this.languageIdentifier = languageIdentifier;
        this.index = index;
        this.open = open;
        this.close = close;
        this.forwardRegex = forwardRegex;
        this.reversedRegex = reversedRegex;
        this._openSet = RichEditBracket._toSet(this.open);
        this._closeSet = RichEditBracket._toSet(this.close);
    }
    RichEditBracket.prototype.isOpen = function (text) {
        return this._openSet.has(text);
    };
    RichEditBracket.prototype.isClose = function (text) {
        return this._closeSet.has(text);
    };
    RichEditBracket._toSet = function (arr) {
        var result = new Set();
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var element = arr_1[_i];
            result.add(element);
        }
        return result;
    };
    return RichEditBracket;
}());
export { RichEditBracket };
function groupFuzzyBrackets(brackets) {
    var N = brackets.length;
    brackets = brackets.map(function (b) { return [b[0].toLowerCase(), b[1].toLowerCase()]; });
    var group = [];
    for (var i = 0; i < N; i++) {
        group[i] = i;
    }
    var areOverlapping = function (a, b) {
        var aOpen = a[0], aClose = a[1];
        var bOpen = b[0], bClose = b[1];
        return (aOpen === bOpen || aOpen === bClose || aClose === bOpen || aClose === bClose);
    };
    var mergeGroups = function (g1, g2) {
        var newG = Math.min(g1, g2);
        var oldG = Math.max(g1, g2);
        for (var i = 0; i < N; i++) {
            if (group[i] === oldG) {
                group[i] = newG;
            }
        }
    };
    // group together brackets that have the same open or the same close sequence
    for (var i = 0; i < N; i++) {
        var a = brackets[i];
        for (var j = i + 1; j < N; j++) {
            var b = brackets[j];
            if (areOverlapping(a, b)) {
                mergeGroups(group[i], group[j]);
            }
        }
    }
    var result = [];
    for (var g = 0; g < N; g++) {
        var currentOpen = [];
        var currentClose = [];
        for (var i = 0; i < N; i++) {
            if (group[i] === g) {
                var _a = brackets[i], open_1 = _a[0], close_1 = _a[1];
                currentOpen.push(open_1);
                currentClose.push(close_1);
            }
        }
        if (currentOpen.length > 0) {
            result.push({
                open: currentOpen,
                close: currentClose
            });
        }
    }
    return result;
}
var RichEditBrackets = /** @class */ (function () {
    function RichEditBrackets(languageIdentifier, _brackets) {
        var brackets = groupFuzzyBrackets(_brackets);
        this.brackets = brackets.map(function (b, index) {
            return new RichEditBracket(languageIdentifier, index, b.open, b.close, getRegexForBracketPair(b.open, b.close, brackets, index), getReversedRegexForBracketPair(b.open, b.close, brackets, index));
        });
        this.forwardRegex = getRegexForBrackets(this.brackets);
        this.reversedRegex = getReversedRegexForBrackets(this.brackets);
        this.textIsBracket = {};
        this.textIsOpenBracket = {};
        this.maxBracketLength = 0;
        for (var _i = 0, _a = this.brackets; _i < _a.length; _i++) {
            var bracket = _a[_i];
            for (var _b = 0, _c = bracket.open; _b < _c.length; _b++) {
                var open_2 = _c[_b];
                this.textIsBracket[open_2] = bracket;
                this.textIsOpenBracket[open_2] = true;
                this.maxBracketLength = Math.max(this.maxBracketLength, open_2.length);
            }
            for (var _d = 0, _e = bracket.close; _d < _e.length; _d++) {
                var close_2 = _e[_d];
                this.textIsBracket[close_2] = bracket;
                this.textIsOpenBracket[close_2] = false;
                this.maxBracketLength = Math.max(this.maxBracketLength, close_2.length);
            }
        }
    }
    return RichEditBrackets;
}());
export { RichEditBrackets };
function collectSuperstrings(str, brackets, currentIndex, dest) {
    for (var i = 0, len = brackets.length; i < len; i++) {
        if (i === currentIndex) {
            continue;
        }
        var bracket = brackets[i];
        for (var _i = 0, _a = bracket.open; _i < _a.length; _i++) {
            var open_3 = _a[_i];
            if (open_3.indexOf(str) >= 0) {
                dest.push(open_3);
            }
        }
        for (var _b = 0, _c = bracket.close; _b < _c.length; _b++) {
            var close_3 = _c[_b];
            if (close_3.indexOf(str) >= 0) {
                dest.push(close_3);
            }
        }
    }
}
function lengthcmp(a, b) {
    return a.length - b.length;
}
function unique(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    var result = [];
    var seen = new Set();
    for (var _i = 0, arr_2 = arr; _i < arr_2.length; _i++) {
        var element = arr_2[_i];
        if (seen.has(element)) {
            continue;
        }
        result.push(element);
        seen.add(element);
    }
    return result;
}
function getRegexForBracketPair(open, close, brackets, currentIndex) {
    // search in all brackets for other brackets that are a superstring of these brackets
    var pieces = [];
    pieces = pieces.concat(open);
    pieces = pieces.concat(close);
    for (var i = 0, len = pieces.length; i < len; i++) {
        collectSuperstrings(pieces[i], brackets, currentIndex, pieces);
    }
    pieces = unique(pieces);
    pieces.sort(lengthcmp);
    pieces.reverse();
    return createBracketOrRegExp(pieces);
}
function getReversedRegexForBracketPair(open, close, brackets, currentIndex) {
    // search in all brackets for other brackets that are a superstring of these brackets
    var pieces = [];
    pieces = pieces.concat(open);
    pieces = pieces.concat(close);
    for (var i = 0, len = pieces.length; i < len; i++) {
        collectSuperstrings(pieces[i], brackets, currentIndex, pieces);
    }
    pieces = unique(pieces);
    pieces.sort(lengthcmp);
    pieces.reverse();
    return createBracketOrRegExp(pieces.map(toReversedString));
}
function getRegexForBrackets(brackets) {
    var pieces = [];
    for (var _i = 0, brackets_1 = brackets; _i < brackets_1.length; _i++) {
        var bracket = brackets_1[_i];
        for (var _a = 0, _b = bracket.open; _a < _b.length; _a++) {
            var open_4 = _b[_a];
            pieces.push(open_4);
        }
        for (var _c = 0, _d = bracket.close; _c < _d.length; _c++) {
            var close_4 = _d[_c];
            pieces.push(close_4);
        }
    }
    pieces = unique(pieces);
    return createBracketOrRegExp(pieces);
}
function getReversedRegexForBrackets(brackets) {
    var pieces = [];
    for (var _i = 0, brackets_2 = brackets; _i < brackets_2.length; _i++) {
        var bracket = brackets_2[_i];
        for (var _a = 0, _b = bracket.open; _a < _b.length; _a++) {
            var open_5 = _b[_a];
            pieces.push(open_5);
        }
        for (var _c = 0, _d = bracket.close; _c < _d.length; _c++) {
            var close_5 = _d[_c];
            pieces.push(close_5);
        }
    }
    pieces = unique(pieces);
    return createBracketOrRegExp(pieces.map(toReversedString));
}
function prepareBracketForRegExp(str) {
    // This bracket pair uses letters like e.g. "begin" - "end"
    var insertWordBoundaries = (/^[\w ]+$/.test(str));
    str = strings.escapeRegExpCharacters(str);
    return (insertWordBoundaries ? "\\b" + str + "\\b" : str);
}
function createBracketOrRegExp(pieces) {
    var regexStr = "(" + pieces.map(prepareBracketForRegExp).join(')|(') + ")";
    return strings.createRegExp(regexStr, true);
}
var toReversedString = (function () {
    function reverse(str) {
        var reversedStr = '';
        for (var i = str.length - 1; i >= 0; i--) {
            reversedStr += str.charAt(i);
        }
        return reversedStr;
    }
    var lastInput = null;
    var lastOutput = null;
    return function toReversedString(str) {
        if (lastInput !== str) {
            lastInput = str;
            lastOutput = reverse(lastInput);
        }
        return lastOutput;
    };
})();
var BracketsUtils = /** @class */ (function () {
    function BracketsUtils() {
    }
    BracketsUtils._findPrevBracketInText = function (reversedBracketRegex, lineNumber, reversedText, offset) {
        var m = reversedText.match(reversedBracketRegex);
        if (!m) {
            return null;
        }
        var matchOffset = reversedText.length - (m.index || 0);
        var matchLength = m[0].length;
        var absoluteMatchOffset = offset + matchOffset;
        return new Range(lineNumber, absoluteMatchOffset - matchLength + 1, lineNumber, absoluteMatchOffset + 1);
    };
    BracketsUtils.findPrevBracketInRange = function (reversedBracketRegex, lineNumber, lineText, startOffset, endOffset) {
        // Because JS does not support backwards regex search, we search forwards in a reversed string with a reversed regex ;)
        var reversedLineText = toReversedString(lineText);
        var reversedSubstr = reversedLineText.substring(lineText.length - endOffset, lineText.length - startOffset);
        return this._findPrevBracketInText(reversedBracketRegex, lineNumber, reversedSubstr, startOffset);
    };
    BracketsUtils.findNextBracketInText = function (bracketRegex, lineNumber, text, offset) {
        var m = text.match(bracketRegex);
        if (!m) {
            return null;
        }
        var matchOffset = m.index || 0;
        var matchLength = m[0].length;
        if (matchLength === 0) {
            return null;
        }
        var absoluteMatchOffset = offset + matchOffset;
        return new Range(lineNumber, absoluteMatchOffset + 1, lineNumber, absoluteMatchOffset + 1 + matchLength);
    };
    BracketsUtils.findNextBracketInRange = function (bracketRegex, lineNumber, lineText, startOffset, endOffset) {
        var substr = lineText.substring(startOffset, endOffset);
        return this.findNextBracketInText(bracketRegex, lineNumber, substr, startOffset);
    };
    return BracketsUtils;
}());
export { BracketsUtils };
