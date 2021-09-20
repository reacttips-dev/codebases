/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as arrays from '../../../base/common/arrays.js';
import { LineTokens } from '../core/lineTokens.js';
import { Position } from '../core/position.js';
import { TokenMetadata } from '../modes.js';
export function countEOL(text) {
    var eolCount = 0;
    var firstLineLength = 0;
    var lastLineStart = 0;
    for (var i = 0, len = text.length; i < len; i++) {
        var chr = text.charCodeAt(i);
        if (chr === 13 /* CarriageReturn */) {
            if (eolCount === 0) {
                firstLineLength = i;
            }
            eolCount++;
            if (i + 1 < len && text.charCodeAt(i + 1) === 10 /* LineFeed */) {
                // \r\n... case
                i++; // skip \n
            }
            else {
                // \r... case
            }
            lastLineStart = i + 1;
        }
        else if (chr === 10 /* LineFeed */) {
            if (eolCount === 0) {
                firstLineLength = i;
            }
            eolCount++;
            lastLineStart = i + 1;
        }
    }
    if (eolCount === 0) {
        firstLineLength = text.length;
    }
    return [eolCount, firstLineLength, text.length - lastLineStart];
}
function getDefaultMetadata(topLevelLanguageId) {
    return ((topLevelLanguageId << 0 /* LANGUAGEID_OFFSET */)
        | (0 /* Other */ << 8 /* TOKEN_TYPE_OFFSET */)
        | (0 /* None */ << 11 /* FONT_STYLE_OFFSET */)
        | (1 /* DefaultForeground */ << 14 /* FOREGROUND_OFFSET */)
        | (2 /* DefaultBackground */ << 23 /* BACKGROUND_OFFSET */)) >>> 0;
}
var EMPTY_LINE_TOKENS = (new Uint32Array(0)).buffer;
var MultilineTokensBuilder = /** @class */ (function () {
    function MultilineTokensBuilder() {
        this.tokens = [];
    }
    MultilineTokensBuilder.prototype.add = function (lineNumber, lineTokens) {
        if (this.tokens.length > 0) {
            var last = this.tokens[this.tokens.length - 1];
            var lastLineNumber = last.startLineNumber + last.tokens.length - 1;
            if (lastLineNumber + 1 === lineNumber) {
                // append
                last.tokens.push(lineTokens);
                return;
            }
        }
        this.tokens.push(new MultilineTokens(lineNumber, [lineTokens]));
    };
    return MultilineTokensBuilder;
}());
export { MultilineTokensBuilder };
var SparseEncodedTokens = /** @class */ (function () {
    function SparseEncodedTokens(tokens) {
        this._tokens = tokens;
        this._tokenCount = tokens.length / 4;
    }
    SparseEncodedTokens.prototype.getMaxDeltaLine = function () {
        var tokenCount = this.getTokenCount();
        if (tokenCount === 0) {
            return -1;
        }
        return this.getDeltaLine(tokenCount - 1);
    };
    SparseEncodedTokens.prototype.getTokenCount = function () {
        return this._tokenCount;
    };
    SparseEncodedTokens.prototype.getDeltaLine = function (tokenIndex) {
        return this._tokens[4 * tokenIndex];
    };
    SparseEncodedTokens.prototype.getStartCharacter = function (tokenIndex) {
        return this._tokens[4 * tokenIndex + 1];
    };
    SparseEncodedTokens.prototype.getEndCharacter = function (tokenIndex) {
        return this._tokens[4 * tokenIndex + 2];
    };
    SparseEncodedTokens.prototype.getMetadata = function (tokenIndex) {
        return this._tokens[4 * tokenIndex + 3];
    };
    SparseEncodedTokens.prototype.clear = function () {
        this._tokenCount = 0;
    };
    SparseEncodedTokens.prototype.acceptDeleteRange = function (horizontalShiftForFirstLineTokens, startDeltaLine, startCharacter, endDeltaLine, endCharacter) {
        // This is a bit complex, here are the cases I used to think about this:
        //
        // 1. The token starts before the deletion range
        // 1a. The token is completely before the deletion range
        //               -----------
        //                          xxxxxxxxxxx
        // 1b. The token starts before, the deletion range ends after the token
        //               -----------
        //                      xxxxxxxxxxx
        // 1c. The token starts before, the deletion range ends precisely with the token
        //               ---------------
        //                      xxxxxxxx
        // 1d. The token starts before, the deletion range is inside the token
        //               ---------------
        //                    xxxxx
        //
        // 2. The token starts at the same position with the deletion range
        // 2a. The token starts at the same position, and ends inside the deletion range
        //               -------
        //               xxxxxxxxxxx
        // 2b. The token starts at the same position, and ends at the same position as the deletion range
        //               ----------
        //               xxxxxxxxxx
        // 2c. The token starts at the same position, and ends after the deletion range
        //               -------------
        //               xxxxxxx
        //
        // 3. The token starts inside the deletion range
        // 3a. The token is inside the deletion range
        //                -------
        //             xxxxxxxxxxxxx
        // 3b. The token starts inside the deletion range, and ends at the same position as the deletion range
        //                ----------
        //             xxxxxxxxxxxxx
        // 3c. The token starts inside the deletion range, and ends after the deletion range
        //                ------------
        //             xxxxxxxxxxx
        //
        // 4. The token starts after the deletion range
        //                  -----------
        //          xxxxxxxx
        //
        var tokens = this._tokens;
        var tokenCount = this._tokenCount;
        var deletedLineCount = (endDeltaLine - startDeltaLine);
        var newTokenCount = 0;
        var hasDeletedTokens = false;
        for (var i = 0; i < tokenCount; i++) {
            var srcOffset = 4 * i;
            var tokenDeltaLine = tokens[srcOffset];
            var tokenStartCharacter = tokens[srcOffset + 1];
            var tokenEndCharacter = tokens[srcOffset + 2];
            var tokenMetadata = tokens[srcOffset + 3];
            if (tokenDeltaLine < startDeltaLine || (tokenDeltaLine === startDeltaLine && tokenEndCharacter <= startCharacter)) {
                // 1a. The token is completely before the deletion range
                // => nothing to do
                newTokenCount++;
                continue;
            }
            else if (tokenDeltaLine === startDeltaLine && tokenStartCharacter < startCharacter) {
                // 1b, 1c, 1d
                // => the token survives, but it needs to shrink
                if (tokenDeltaLine === endDeltaLine && tokenEndCharacter > endCharacter) {
                    // 1d. The token starts before, the deletion range is inside the token
                    // => the token shrinks by the deletion character count
                    tokenEndCharacter -= (endCharacter - startCharacter);
                }
                else {
                    // 1b. The token starts before, the deletion range ends after the token
                    // 1c. The token starts before, the deletion range ends precisely with the token
                    // => the token shrinks its ending to the deletion start
                    tokenEndCharacter = startCharacter;
                }
            }
            else if (tokenDeltaLine === startDeltaLine && tokenStartCharacter === startCharacter) {
                // 2a, 2b, 2c
                if (tokenDeltaLine === endDeltaLine && tokenEndCharacter > endCharacter) {
                    // 2c. The token starts at the same position, and ends after the deletion range
                    // => the token shrinks by the deletion character count
                    tokenEndCharacter -= (endCharacter - startCharacter);
                }
                else {
                    // 2a. The token starts at the same position, and ends inside the deletion range
                    // 2b. The token starts at the same position, and ends at the same position as the deletion range
                    // => the token is deleted
                    hasDeletedTokens = true;
                    continue;
                }
            }
            else if (tokenDeltaLine < endDeltaLine || (tokenDeltaLine === endDeltaLine && tokenStartCharacter < endCharacter)) {
                // 3a, 3b, 3c
                if (tokenDeltaLine === endDeltaLine && tokenEndCharacter > endCharacter) {
                    // 3c. The token starts inside the deletion range, and ends after the deletion range
                    // => the token moves left and shrinks
                    if (tokenDeltaLine === startDeltaLine) {
                        // the deletion started on the same line as the token
                        // => the token moves left and shrinks
                        tokenStartCharacter = startCharacter;
                        tokenEndCharacter = tokenStartCharacter + (tokenEndCharacter - endCharacter);
                    }
                    else {
                        // the deletion started on a line above the token
                        // => the token moves to the beginning of the line
                        tokenStartCharacter = 0;
                        tokenEndCharacter = tokenStartCharacter + (tokenEndCharacter - endCharacter);
                    }
                }
                else {
                    // 3a. The token is inside the deletion range
                    // 3b. The token starts inside the deletion range, and ends at the same position as the deletion range
                    // => the token is deleted
                    hasDeletedTokens = true;
                    continue;
                }
            }
            else if (tokenDeltaLine > endDeltaLine) {
                // 4. (partial) The token starts after the deletion range, on a line below...
                if (deletedLineCount === 0 && !hasDeletedTokens) {
                    // early stop, there is no need to walk all the tokens and do nothing...
                    newTokenCount = tokenCount;
                    break;
                }
                tokenDeltaLine -= deletedLineCount;
            }
            else if (tokenDeltaLine === endDeltaLine && tokenStartCharacter >= endCharacter) {
                // 4. (continued) The token starts after the deletion range, on the last line where a deletion occurs
                if (horizontalShiftForFirstLineTokens && tokenDeltaLine === 0) {
                    tokenStartCharacter += horizontalShiftForFirstLineTokens;
                    tokenEndCharacter += horizontalShiftForFirstLineTokens;
                }
                tokenDeltaLine -= deletedLineCount;
                tokenStartCharacter -= (endCharacter - startCharacter);
                tokenEndCharacter -= (endCharacter - startCharacter);
            }
            else {
                throw new Error("Not possible!");
            }
            var destOffset = 4 * newTokenCount;
            tokens[destOffset] = tokenDeltaLine;
            tokens[destOffset + 1] = tokenStartCharacter;
            tokens[destOffset + 2] = tokenEndCharacter;
            tokens[destOffset + 3] = tokenMetadata;
            newTokenCount++;
        }
        this._tokenCount = newTokenCount;
    };
    SparseEncodedTokens.prototype.acceptInsertText = function (deltaLine, character, eolCount, firstLineLength, lastLineLength, firstCharCode) {
        // Here are the cases I used to think about this:
        //
        // 1. The token is completely before the insertion point
        //            -----------   |
        // 2. The token ends precisely at the insertion point
        //            -----------|
        // 3. The token contains the insertion point
        //            -----|------
        // 4. The token starts precisely at the insertion point
        //            |-----------
        // 5. The token is completely after the insertion point
        //            |   -----------
        //
        var isInsertingPreciselyOneWordCharacter = (eolCount === 0
            && firstLineLength === 1
            && ((firstCharCode >= 48 /* Digit0 */ && firstCharCode <= 57 /* Digit9 */)
                || (firstCharCode >= 65 /* A */ && firstCharCode <= 90 /* Z */)
                || (firstCharCode >= 97 /* a */ && firstCharCode <= 122 /* z */)));
        var tokens = this._tokens;
        var tokenCount = this._tokenCount;
        for (var i = 0; i < tokenCount; i++) {
            var offset = 4 * i;
            var tokenDeltaLine = tokens[offset];
            var tokenStartCharacter = tokens[offset + 1];
            var tokenEndCharacter = tokens[offset + 2];
            if (tokenDeltaLine < deltaLine || (tokenDeltaLine === deltaLine && tokenEndCharacter < character)) {
                // 1. The token is completely before the insertion point
                // => nothing to do
                continue;
            }
            else if (tokenDeltaLine === deltaLine && tokenEndCharacter === character) {
                // 2. The token ends precisely at the insertion point
                // => expand the end character only if inserting precisely one character that is a word character
                if (isInsertingPreciselyOneWordCharacter) {
                    tokenEndCharacter += 1;
                }
                else {
                    continue;
                }
            }
            else if (tokenDeltaLine === deltaLine && tokenStartCharacter < character && character < tokenEndCharacter) {
                // 3. The token contains the insertion point
                if (eolCount === 0) {
                    // => just expand the end character
                    tokenEndCharacter += firstLineLength;
                }
                else {
                    // => cut off the token
                    tokenEndCharacter = character;
                }
            }
            else {
                // 4. or 5.
                if (tokenDeltaLine === deltaLine && tokenStartCharacter === character) {
                    // 4. The token starts precisely at the insertion point
                    // => grow the token (by keeping its start constant) only if inserting precisely one character that is a word character
                    // => otherwise behave as in case 5.
                    if (isInsertingPreciselyOneWordCharacter) {
                        continue;
                    }
                }
                // => the token must move and keep its size constant
                if (tokenDeltaLine === deltaLine) {
                    tokenDeltaLine += eolCount;
                    // this token is on the line where the insertion is taking place
                    if (eolCount === 0) {
                        tokenStartCharacter += firstLineLength;
                        tokenEndCharacter += firstLineLength;
                    }
                    else {
                        var tokenLength = tokenEndCharacter - tokenStartCharacter;
                        tokenStartCharacter = lastLineLength + (tokenStartCharacter - character);
                        tokenEndCharacter = tokenStartCharacter + tokenLength;
                    }
                }
                else {
                    tokenDeltaLine += eolCount;
                }
            }
            tokens[offset] = tokenDeltaLine;
            tokens[offset + 1] = tokenStartCharacter;
            tokens[offset + 2] = tokenEndCharacter;
        }
    };
    return SparseEncodedTokens;
}());
export { SparseEncodedTokens };
var LineTokens2 = /** @class */ (function () {
    function LineTokens2(actual, startTokenIndex, endTokenIndex) {
        this._actual = actual;
        this._startTokenIndex = startTokenIndex;
        this._endTokenIndex = endTokenIndex;
    }
    LineTokens2.prototype.getCount = function () {
        return this._endTokenIndex - this._startTokenIndex + 1;
    };
    LineTokens2.prototype.getStartCharacter = function (tokenIndex) {
        return this._actual.getStartCharacter(this._startTokenIndex + tokenIndex);
    };
    LineTokens2.prototype.getEndCharacter = function (tokenIndex) {
        return this._actual.getEndCharacter(this._startTokenIndex + tokenIndex);
    };
    LineTokens2.prototype.getMetadata = function (tokenIndex) {
        return this._actual.getMetadata(this._startTokenIndex + tokenIndex);
    };
    return LineTokens2;
}());
export { LineTokens2 };
var MultilineTokens2 = /** @class */ (function () {
    function MultilineTokens2(startLineNumber, tokens) {
        this.startLineNumber = startLineNumber;
        this.tokens = tokens;
        this.endLineNumber = this.startLineNumber + this.tokens.getMaxDeltaLine();
    }
    MultilineTokens2.prototype._updateEndLineNumber = function () {
        this.endLineNumber = this.startLineNumber + this.tokens.getMaxDeltaLine();
    };
    MultilineTokens2.prototype.getLineTokens = function (lineNumber) {
        if (this.startLineNumber <= lineNumber && lineNumber <= this.endLineNumber) {
            var findResult = MultilineTokens2._findTokensWithLine(this.tokens, lineNumber - this.startLineNumber);
            if (findResult) {
                var startTokenIndex = findResult[0], endTokenIndex = findResult[1];
                return new LineTokens2(this.tokens, startTokenIndex, endTokenIndex);
            }
        }
        return null;
    };
    MultilineTokens2._findTokensWithLine = function (tokens, deltaLine) {
        var low = 0;
        var high = tokens.getTokenCount() - 1;
        while (low < high) {
            var mid = low + Math.floor((high - low) / 2);
            var midDeltaLine = tokens.getDeltaLine(mid);
            if (midDeltaLine < deltaLine) {
                low = mid + 1;
            }
            else if (midDeltaLine > deltaLine) {
                high = mid - 1;
            }
            else {
                var min = mid;
                while (min > low && tokens.getDeltaLine(min - 1) === deltaLine) {
                    min--;
                }
                var max = mid;
                while (max < high && tokens.getDeltaLine(max + 1) === deltaLine) {
                    max++;
                }
                return [min, max];
            }
        }
        if (tokens.getDeltaLine(low) === deltaLine) {
            return [low, low];
        }
        return null;
    };
    MultilineTokens2.prototype.applyEdit = function (range, text) {
        var _a = countEOL(text), eolCount = _a[0], firstLineLength = _a[1], lastLineLength = _a[2];
        this.acceptEdit(range, eolCount, firstLineLength, lastLineLength, text.length > 0 ? text.charCodeAt(0) : 0 /* Null */);
    };
    MultilineTokens2.prototype.acceptEdit = function (range, eolCount, firstLineLength, lastLineLength, firstCharCode) {
        this._acceptDeleteRange(range);
        this._acceptInsertText(new Position(range.startLineNumber, range.startColumn), eolCount, firstLineLength, lastLineLength, firstCharCode);
        this._updateEndLineNumber();
    };
    MultilineTokens2.prototype._acceptDeleteRange = function (range) {
        if (range.startLineNumber === range.endLineNumber && range.startColumn === range.endColumn) {
            // Nothing to delete
            return;
        }
        var firstLineIndex = range.startLineNumber - this.startLineNumber;
        var lastLineIndex = range.endLineNumber - this.startLineNumber;
        if (lastLineIndex < 0) {
            // this deletion occurs entirely before this block, so we only need to adjust line numbers
            var deletedLinesCount = lastLineIndex - firstLineIndex;
            this.startLineNumber -= deletedLinesCount;
            return;
        }
        var tokenMaxDeltaLine = this.tokens.getMaxDeltaLine();
        if (firstLineIndex >= tokenMaxDeltaLine + 1) {
            // this deletion occurs entirely after this block, so there is nothing to do
            return;
        }
        if (firstLineIndex < 0 && lastLineIndex >= tokenMaxDeltaLine + 1) {
            // this deletion completely encompasses this block
            this.startLineNumber = 0;
            this.tokens.clear();
            return;
        }
        if (firstLineIndex < 0) {
            var deletedBefore = -firstLineIndex;
            this.startLineNumber -= deletedBefore;
            this.tokens.acceptDeleteRange(range.startColumn - 1, 0, 0, lastLineIndex, range.endColumn - 1);
        }
        else {
            this.tokens.acceptDeleteRange(0, firstLineIndex, range.startColumn - 1, lastLineIndex, range.endColumn - 1);
        }
    };
    MultilineTokens2.prototype._acceptInsertText = function (position, eolCount, firstLineLength, lastLineLength, firstCharCode) {
        if (eolCount === 0 && firstLineLength === 0) {
            // Nothing to insert
            return;
        }
        var lineIndex = position.lineNumber - this.startLineNumber;
        if (lineIndex < 0) {
            // this insertion occurs before this block, so we only need to adjust line numbers
            this.startLineNumber += eolCount;
            return;
        }
        var tokenMaxDeltaLine = this.tokens.getMaxDeltaLine();
        if (lineIndex >= tokenMaxDeltaLine + 1) {
            // this insertion occurs after this block, so there is nothing to do
            return;
        }
        this.tokens.acceptInsertText(lineIndex, position.column - 1, eolCount, firstLineLength, lastLineLength, firstCharCode);
    };
    return MultilineTokens2;
}());
export { MultilineTokens2 };
var MultilineTokens = /** @class */ (function () {
    function MultilineTokens(startLineNumber, tokens) {
        this.startLineNumber = startLineNumber;
        this.tokens = tokens;
    }
    return MultilineTokens;
}());
export { MultilineTokens };
function toUint32Array(arr) {
    if (arr instanceof Uint32Array) {
        return arr;
    }
    else {
        return new Uint32Array(arr);
    }
}
var TokensStore2 = /** @class */ (function () {
    function TokensStore2() {
        this._pieces = [];
    }
    TokensStore2.prototype.flush = function () {
        this._pieces = [];
    };
    TokensStore2.prototype.set = function (pieces) {
        this._pieces = pieces || [];
    };
    TokensStore2.prototype.addSemanticTokens = function (lineNumber, aTokens) {
        var pieces = this._pieces;
        if (pieces.length === 0) {
            return aTokens;
        }
        var pieceIndex = TokensStore2._findFirstPieceWithLine(pieces, lineNumber);
        var bTokens = this._pieces[pieceIndex].getLineTokens(lineNumber);
        if (!bTokens) {
            return aTokens;
        }
        var aLen = aTokens.getCount();
        var bLen = bTokens.getCount();
        var aIndex = 0;
        var result = [], resultLen = 0;
        for (var bIndex = 0; bIndex < bLen; bIndex++) {
            var bStartCharacter = bTokens.getStartCharacter(bIndex);
            var bEndCharacter = bTokens.getEndCharacter(bIndex);
            var bMetadata = bTokens.getMetadata(bIndex);
            var bMask = (((bMetadata & 1 /* SEMANTIC_USE_ITALIC */) ? 2048 /* ITALIC_MASK */ : 0)
                | ((bMetadata & 2 /* SEMANTIC_USE_BOLD */) ? 4096 /* BOLD_MASK */ : 0)
                | ((bMetadata & 4 /* SEMANTIC_USE_UNDERLINE */) ? 8192 /* UNDERLINE_MASK */ : 0)
                | ((bMetadata & 8 /* SEMANTIC_USE_FOREGROUND */) ? 8372224 /* FOREGROUND_MASK */ : 0)
                | ((bMetadata & 16 /* SEMANTIC_USE_BACKGROUND */) ? 4286578688 /* BACKGROUND_MASK */ : 0)) >>> 0;
            var aMask = (~bMask) >>> 0;
            // push any token from `a` that is before `b`
            while (aIndex < aLen && aTokens.getEndOffset(aIndex) <= bStartCharacter) {
                result[resultLen++] = aTokens.getEndOffset(aIndex);
                result[resultLen++] = aTokens.getMetadata(aIndex);
                aIndex++;
            }
            // push the token from `a` if it intersects the token from `b`
            if (aIndex < aLen && aTokens.getStartOffset(aIndex) < bStartCharacter) {
                result[resultLen++] = bStartCharacter;
                result[resultLen++] = aTokens.getMetadata(aIndex);
            }
            // skip any tokens from `a` that are contained inside `b`
            while (aIndex < aLen && aTokens.getEndOffset(aIndex) < bEndCharacter) {
                result[resultLen++] = aTokens.getEndOffset(aIndex);
                result[resultLen++] = (aTokens.getMetadata(aIndex) & aMask) | (bMetadata & bMask);
                aIndex++;
            }
            if (aIndex < aLen && aTokens.getEndOffset(aIndex) === bEndCharacter) {
                // `a` ends exactly at the same spot as `b`!
                result[resultLen++] = aTokens.getEndOffset(aIndex);
                result[resultLen++] = (aTokens.getMetadata(aIndex) & aMask) | (bMetadata & bMask);
                aIndex++;
            }
            else {
                var aMergeIndex = Math.min(Math.max(0, aIndex - 1), aLen - 1);
                // push the token from `b`
                result[resultLen++] = bEndCharacter;
                result[resultLen++] = (aTokens.getMetadata(aMergeIndex) & aMask) | (bMetadata & bMask);
            }
        }
        // push the remaining tokens from `a`
        while (aIndex < aLen) {
            result[resultLen++] = aTokens.getEndOffset(aIndex);
            result[resultLen++] = aTokens.getMetadata(aIndex);
            aIndex++;
        }
        return new LineTokens(new Uint32Array(result), aTokens.getLineContent());
    };
    TokensStore2._findFirstPieceWithLine = function (pieces, lineNumber) {
        var low = 0;
        var high = pieces.length - 1;
        while (low < high) {
            var mid = low + Math.floor((high - low) / 2);
            if (pieces[mid].endLineNumber < lineNumber) {
                low = mid + 1;
            }
            else if (pieces[mid].startLineNumber > lineNumber) {
                high = mid - 1;
            }
            else {
                while (mid > low && pieces[mid - 1].startLineNumber <= lineNumber && lineNumber <= pieces[mid - 1].endLineNumber) {
                    mid--;
                }
                return mid;
            }
        }
        return low;
    };
    //#region Editing
    TokensStore2.prototype.acceptEdit = function (range, eolCount, firstLineLength, lastLineLength, firstCharCode) {
        for (var _i = 0, _a = this._pieces; _i < _a.length; _i++) {
            var piece = _a[_i];
            piece.acceptEdit(range, eolCount, firstLineLength, lastLineLength, firstCharCode);
        }
    };
    return TokensStore2;
}());
export { TokensStore2 };
var TokensStore = /** @class */ (function () {
    function TokensStore() {
        this._lineTokens = [];
        this._len = 0;
    }
    TokensStore.prototype.flush = function () {
        this._lineTokens = [];
        this._len = 0;
    };
    TokensStore.prototype.getTokens = function (topLevelLanguageId, lineIndex, lineText) {
        var rawLineTokens = null;
        if (lineIndex < this._len) {
            rawLineTokens = this._lineTokens[lineIndex];
        }
        if (rawLineTokens !== null && rawLineTokens !== EMPTY_LINE_TOKENS) {
            return new LineTokens(toUint32Array(rawLineTokens), lineText);
        }
        var lineTokens = new Uint32Array(2);
        lineTokens[0] = lineText.length;
        lineTokens[1] = getDefaultMetadata(topLevelLanguageId);
        return new LineTokens(lineTokens, lineText);
    };
    TokensStore._massageTokens = function (topLevelLanguageId, lineTextLength, _tokens) {
        var tokens = _tokens ? toUint32Array(_tokens) : null;
        if (lineTextLength === 0) {
            var hasDifferentLanguageId = false;
            if (tokens && tokens.length > 1) {
                hasDifferentLanguageId = (TokenMetadata.getLanguageId(tokens[1]) !== topLevelLanguageId);
            }
            if (!hasDifferentLanguageId) {
                return EMPTY_LINE_TOKENS;
            }
        }
        if (!tokens || tokens.length === 0) {
            var tokens_1 = new Uint32Array(2);
            tokens_1[0] = lineTextLength;
            tokens_1[1] = getDefaultMetadata(topLevelLanguageId);
            return tokens_1.buffer;
        }
        // Ensure the last token covers the end of the text
        tokens[tokens.length - 2] = lineTextLength;
        if (tokens.byteOffset === 0 && tokens.byteLength === tokens.buffer.byteLength) {
            // Store directly the ArrayBuffer pointer to save an object
            return tokens.buffer;
        }
        return tokens;
    };
    TokensStore.prototype._ensureLine = function (lineIndex) {
        while (lineIndex >= this._len) {
            this._lineTokens[this._len] = null;
            this._len++;
        }
    };
    TokensStore.prototype._deleteLines = function (start, deleteCount) {
        if (deleteCount === 0) {
            return;
        }
        if (start + deleteCount > this._len) {
            deleteCount = this._len - start;
        }
        this._lineTokens.splice(start, deleteCount);
        this._len -= deleteCount;
    };
    TokensStore.prototype._insertLines = function (insertIndex, insertCount) {
        if (insertCount === 0) {
            return;
        }
        var lineTokens = [];
        for (var i = 0; i < insertCount; i++) {
            lineTokens[i] = null;
        }
        this._lineTokens = arrays.arrayInsert(this._lineTokens, insertIndex, lineTokens);
        this._len += insertCount;
    };
    TokensStore.prototype.setTokens = function (topLevelLanguageId, lineIndex, lineTextLength, _tokens) {
        var tokens = TokensStore._massageTokens(topLevelLanguageId, lineTextLength, _tokens);
        this._ensureLine(lineIndex);
        this._lineTokens[lineIndex] = tokens;
    };
    //#region Editing
    TokensStore.prototype.acceptEdit = function (range, eolCount, firstLineLength) {
        this._acceptDeleteRange(range);
        this._acceptInsertText(new Position(range.startLineNumber, range.startColumn), eolCount, firstLineLength);
    };
    TokensStore.prototype._acceptDeleteRange = function (range) {
        var firstLineIndex = range.startLineNumber - 1;
        if (firstLineIndex >= this._len) {
            return;
        }
        if (range.startLineNumber === range.endLineNumber) {
            if (range.startColumn === range.endColumn) {
                // Nothing to delete
                return;
            }
            this._lineTokens[firstLineIndex] = TokensStore._delete(this._lineTokens[firstLineIndex], range.startColumn - 1, range.endColumn - 1);
            return;
        }
        this._lineTokens[firstLineIndex] = TokensStore._deleteEnding(this._lineTokens[firstLineIndex], range.startColumn - 1);
        var lastLineIndex = range.endLineNumber - 1;
        var lastLineTokens = null;
        if (lastLineIndex < this._len) {
            lastLineTokens = TokensStore._deleteBeginning(this._lineTokens[lastLineIndex], range.endColumn - 1);
        }
        // Take remaining text on last line and append it to remaining text on first line
        this._lineTokens[firstLineIndex] = TokensStore._append(this._lineTokens[firstLineIndex], lastLineTokens);
        // Delete middle lines
        this._deleteLines(range.startLineNumber, range.endLineNumber - range.startLineNumber);
    };
    TokensStore.prototype._acceptInsertText = function (position, eolCount, firstLineLength) {
        if (eolCount === 0 && firstLineLength === 0) {
            // Nothing to insert
            return;
        }
        var lineIndex = position.lineNumber - 1;
        if (lineIndex >= this._len) {
            return;
        }
        if (eolCount === 0) {
            // Inserting text on one line
            this._lineTokens[lineIndex] = TokensStore._insert(this._lineTokens[lineIndex], position.column - 1, firstLineLength);
            return;
        }
        this._lineTokens[lineIndex] = TokensStore._deleteEnding(this._lineTokens[lineIndex], position.column - 1);
        this._lineTokens[lineIndex] = TokensStore._insert(this._lineTokens[lineIndex], position.column - 1, firstLineLength);
        this._insertLines(position.lineNumber, eolCount);
    };
    TokensStore._deleteBeginning = function (lineTokens, toChIndex) {
        if (lineTokens === null || lineTokens === EMPTY_LINE_TOKENS) {
            return lineTokens;
        }
        return TokensStore._delete(lineTokens, 0, toChIndex);
    };
    TokensStore._deleteEnding = function (lineTokens, fromChIndex) {
        if (lineTokens === null || lineTokens === EMPTY_LINE_TOKENS) {
            return lineTokens;
        }
        var tokens = toUint32Array(lineTokens);
        var lineTextLength = tokens[tokens.length - 2];
        return TokensStore._delete(lineTokens, fromChIndex, lineTextLength);
    };
    TokensStore._delete = function (lineTokens, fromChIndex, toChIndex) {
        if (lineTokens === null || lineTokens === EMPTY_LINE_TOKENS || fromChIndex === toChIndex) {
            return lineTokens;
        }
        var tokens = toUint32Array(lineTokens);
        var tokensCount = (tokens.length >>> 1);
        // special case: deleting everything
        if (fromChIndex === 0 && tokens[tokens.length - 2] === toChIndex) {
            return EMPTY_LINE_TOKENS;
        }
        var fromTokenIndex = LineTokens.findIndexInTokensArray(tokens, fromChIndex);
        var fromTokenStartOffset = (fromTokenIndex > 0 ? tokens[(fromTokenIndex - 1) << 1] : 0);
        var fromTokenEndOffset = tokens[fromTokenIndex << 1];
        if (toChIndex < fromTokenEndOffset) {
            // the delete range is inside a single token
            var delta_1 = (toChIndex - fromChIndex);
            for (var i = fromTokenIndex; i < tokensCount; i++) {
                tokens[i << 1] -= delta_1;
            }
            return lineTokens;
        }
        var dest;
        var lastEnd;
        if (fromTokenStartOffset !== fromChIndex) {
            tokens[fromTokenIndex << 1] = fromChIndex;
            dest = ((fromTokenIndex + 1) << 1);
            lastEnd = fromChIndex;
        }
        else {
            dest = (fromTokenIndex << 1);
            lastEnd = fromTokenStartOffset;
        }
        var delta = (toChIndex - fromChIndex);
        for (var tokenIndex = fromTokenIndex + 1; tokenIndex < tokensCount; tokenIndex++) {
            var tokenEndOffset = tokens[tokenIndex << 1] - delta;
            if (tokenEndOffset > lastEnd) {
                tokens[dest++] = tokenEndOffset;
                tokens[dest++] = tokens[(tokenIndex << 1) + 1];
                lastEnd = tokenEndOffset;
            }
        }
        if (dest === tokens.length) {
            // nothing to trim
            return lineTokens;
        }
        var tmp = new Uint32Array(dest);
        tmp.set(tokens.subarray(0, dest), 0);
        return tmp.buffer;
    };
    TokensStore._append = function (lineTokens, _otherTokens) {
        if (_otherTokens === EMPTY_LINE_TOKENS) {
            return lineTokens;
        }
        if (lineTokens === EMPTY_LINE_TOKENS) {
            return _otherTokens;
        }
        if (lineTokens === null) {
            return lineTokens;
        }
        if (_otherTokens === null) {
            // cannot determine combined line length...
            return null;
        }
        var myTokens = toUint32Array(lineTokens);
        var otherTokens = toUint32Array(_otherTokens);
        var otherTokensCount = (otherTokens.length >>> 1);
        var result = new Uint32Array(myTokens.length + otherTokens.length);
        result.set(myTokens, 0);
        var dest = myTokens.length;
        var delta = myTokens[myTokens.length - 2];
        for (var i = 0; i < otherTokensCount; i++) {
            result[dest++] = otherTokens[(i << 1)] + delta;
            result[dest++] = otherTokens[(i << 1) + 1];
        }
        return result.buffer;
    };
    TokensStore._insert = function (lineTokens, chIndex, textLength) {
        if (lineTokens === null || lineTokens === EMPTY_LINE_TOKENS) {
            // nothing to do
            return lineTokens;
        }
        var tokens = toUint32Array(lineTokens);
        var tokensCount = (tokens.length >>> 1);
        var fromTokenIndex = LineTokens.findIndexInTokensArray(tokens, chIndex);
        if (fromTokenIndex > 0) {
            var fromTokenStartOffset = tokens[(fromTokenIndex - 1) << 1];
            if (fromTokenStartOffset === chIndex) {
                fromTokenIndex--;
            }
        }
        for (var tokenIndex = fromTokenIndex; tokenIndex < tokensCount; tokenIndex++) {
            tokens[tokenIndex << 1] += textLength;
        }
        return lineTokens;
    };
    return TokensStore;
}());
export { TokensStore };
