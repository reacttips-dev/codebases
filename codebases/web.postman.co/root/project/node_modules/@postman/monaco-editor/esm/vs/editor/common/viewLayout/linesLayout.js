/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as strings from '../../../base/common/strings.js';
var PendingChanges = /** @class */ (function () {
    function PendingChanges() {
        this._hasPending = false;
        this._inserts = [];
        this._changes = [];
        this._removes = [];
    }
    PendingChanges.prototype.insert = function (x) {
        this._hasPending = true;
        this._inserts.push(x);
    };
    PendingChanges.prototype.change = function (x) {
        this._hasPending = true;
        this._changes.push(x);
    };
    PendingChanges.prototype.remove = function (x) {
        this._hasPending = true;
        this._removes.push(x);
    };
    PendingChanges.prototype.mustCommit = function () {
        return this._hasPending;
    };
    PendingChanges.prototype.commit = function (linesLayout) {
        if (!this._hasPending) {
            return;
        }
        var inserts = this._inserts;
        var changes = this._changes;
        var removes = this._removes;
        this._hasPending = false;
        this._inserts = [];
        this._changes = [];
        this._removes = [];
        linesLayout._commitPendingChanges(inserts, changes, removes);
    };
    return PendingChanges;
}());
var EditorWhitespace = /** @class */ (function () {
    function EditorWhitespace(id, afterLineNumber, ordinal, height, minWidth) {
        this.id = id;
        this.afterLineNumber = afterLineNumber;
        this.ordinal = ordinal;
        this.height = height;
        this.minWidth = minWidth;
        this.prefixSum = 0;
    }
    return EditorWhitespace;
}());
export { EditorWhitespace };
/**
 * Layouting of objects that take vertical space (by having a height) and push down other objects.
 *
 * These objects are basically either text (lines) or spaces between those lines (whitespaces).
 * This provides commodity operations for working with lines that contain whitespace that pushes lines lower (vertically).
 */
var LinesLayout = /** @class */ (function () {
    function LinesLayout(lineCount, lineHeight) {
        this._instanceId = strings.singleLetterHash(++LinesLayout.INSTANCE_COUNT);
        this._pendingChanges = new PendingChanges();
        this._lastWhitespaceId = 0;
        this._arr = [];
        this._prefixSumValidIndex = -1;
        this._minWidth = -1; /* marker for not being computed */
        this._lineCount = lineCount;
        this._lineHeight = lineHeight;
    }
    /**
     * Find the insertion index for a new value inside a sorted array of values.
     * If the value is already present in the sorted array, the insertion index will be after the already existing value.
     */
    LinesLayout.findInsertionIndex = function (arr, afterLineNumber, ordinal) {
        var low = 0;
        var high = arr.length;
        while (low < high) {
            var mid = ((low + high) >>> 1);
            if (afterLineNumber === arr[mid].afterLineNumber) {
                if (ordinal < arr[mid].ordinal) {
                    high = mid;
                }
                else {
                    low = mid + 1;
                }
            }
            else if (afterLineNumber < arr[mid].afterLineNumber) {
                high = mid;
            }
            else {
                low = mid + 1;
            }
        }
        return low;
    };
    /**
     * Change the height of a line in pixels.
     */
    LinesLayout.prototype.setLineHeight = function (lineHeight) {
        this._checkPendingChanges();
        this._lineHeight = lineHeight;
    };
    /**
     * Set the number of lines.
     *
     * @param lineCount New number of lines.
     */
    LinesLayout.prototype.onFlushed = function (lineCount) {
        this._checkPendingChanges();
        this._lineCount = lineCount;
    };
    LinesLayout.prototype.changeWhitespace = function (callback) {
        var _this = this;
        try {
            var accessor = {
                insertWhitespace: function (afterLineNumber, ordinal, heightInPx, minWidth) {
                    afterLineNumber = afterLineNumber | 0;
                    ordinal = ordinal | 0;
                    heightInPx = heightInPx | 0;
                    minWidth = minWidth | 0;
                    var id = _this._instanceId + (++_this._lastWhitespaceId);
                    _this._pendingChanges.insert(new EditorWhitespace(id, afterLineNumber, ordinal, heightInPx, minWidth));
                    return id;
                },
                changeOneWhitespace: function (id, newAfterLineNumber, newHeight) {
                    newAfterLineNumber = newAfterLineNumber | 0;
                    newHeight = newHeight | 0;
                    _this._pendingChanges.change({ id: id, newAfterLineNumber: newAfterLineNumber, newHeight: newHeight });
                },
                removeWhitespace: function (id) {
                    _this._pendingChanges.remove({ id: id });
                }
            };
            return callback(accessor);
        }
        finally {
            this._pendingChanges.commit(this);
        }
    };
    LinesLayout.prototype._commitPendingChanges = function (inserts, changes, removes) {
        if (inserts.length > 0 || removes.length > 0) {
            this._minWidth = -1; /* marker for not being computed */
        }
        if (inserts.length + changes.length + removes.length <= 1) {
            // when only one thing happened, handle it "delicately"
            for (var _i = 0, inserts_1 = inserts; _i < inserts_1.length; _i++) {
                var insert = inserts_1[_i];
                this._insertWhitespace(insert);
            }
            for (var _a = 0, changes_1 = changes; _a < changes_1.length; _a++) {
                var change = changes_1[_a];
                this._changeOneWhitespace(change.id, change.newAfterLineNumber, change.newHeight);
            }
            for (var _b = 0, removes_1 = removes; _b < removes_1.length; _b++) {
                var remove = removes_1[_b];
                var index = this._findWhitespaceIndex(remove.id);
                if (index === -1) {
                    continue;
                }
                this._removeWhitespace(index);
            }
            return;
        }
        // simply rebuild the entire datastructure
        var toRemove = new Set();
        for (var _c = 0, removes_2 = removes; _c < removes_2.length; _c++) {
            var remove = removes_2[_c];
            toRemove.add(remove.id);
        }
        var toChange = new Map();
        for (var _d = 0, changes_2 = changes; _d < changes_2.length; _d++) {
            var change = changes_2[_d];
            toChange.set(change.id, change);
        }
        var applyRemoveAndChange = function (whitespaces) {
            var result = [];
            for (var _i = 0, whitespaces_1 = whitespaces; _i < whitespaces_1.length; _i++) {
                var whitespace = whitespaces_1[_i];
                if (toRemove.has(whitespace.id)) {
                    continue;
                }
                if (toChange.has(whitespace.id)) {
                    var change = toChange.get(whitespace.id);
                    whitespace.afterLineNumber = change.newAfterLineNumber;
                    whitespace.height = change.newHeight;
                }
                result.push(whitespace);
            }
            return result;
        };
        var result = applyRemoveAndChange(this._arr).concat(applyRemoveAndChange(inserts));
        result.sort(function (a, b) {
            if (a.afterLineNumber === b.afterLineNumber) {
                return a.ordinal - b.ordinal;
            }
            return a.afterLineNumber - b.afterLineNumber;
        });
        this._arr = result;
        this._prefixSumValidIndex = -1;
    };
    LinesLayout.prototype._checkPendingChanges = function () {
        if (this._pendingChanges.mustCommit()) {
            this._pendingChanges.commit(this);
        }
    };
    LinesLayout.prototype._insertWhitespace = function (whitespace) {
        var insertIndex = LinesLayout.findInsertionIndex(this._arr, whitespace.afterLineNumber, whitespace.ordinal);
        this._arr.splice(insertIndex, 0, whitespace);
        this._prefixSumValidIndex = Math.min(this._prefixSumValidIndex, insertIndex - 1);
    };
    LinesLayout.prototype._findWhitespaceIndex = function (id) {
        var arr = this._arr;
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i].id === id) {
                return i;
            }
        }
        return -1;
    };
    LinesLayout.prototype._changeOneWhitespace = function (id, newAfterLineNumber, newHeight) {
        var index = this._findWhitespaceIndex(id);
        if (index === -1) {
            return;
        }
        if (this._arr[index].height !== newHeight) {
            this._arr[index].height = newHeight;
            this._prefixSumValidIndex = Math.min(this._prefixSumValidIndex, index - 1);
        }
        if (this._arr[index].afterLineNumber !== newAfterLineNumber) {
            // `afterLineNumber` changed for this whitespace
            // Record old whitespace
            var whitespace = this._arr[index];
            // Since changing `afterLineNumber` can trigger a reordering, we're gonna remove this whitespace
            this._removeWhitespace(index);
            whitespace.afterLineNumber = newAfterLineNumber;
            // And add it again
            this._insertWhitespace(whitespace);
        }
    };
    LinesLayout.prototype._removeWhitespace = function (removeIndex) {
        this._arr.splice(removeIndex, 1);
        this._prefixSumValidIndex = Math.min(this._prefixSumValidIndex, removeIndex - 1);
    };
    /**
     * Notify the layouter that lines have been deleted (a continuous zone of lines).
     *
     * @param fromLineNumber The line number at which the deletion started, inclusive
     * @param toLineNumber The line number at which the deletion ended, inclusive
     */
    LinesLayout.prototype.onLinesDeleted = function (fromLineNumber, toLineNumber) {
        this._checkPendingChanges();
        fromLineNumber = fromLineNumber | 0;
        toLineNumber = toLineNumber | 0;
        this._lineCount -= (toLineNumber - fromLineNumber + 1);
        for (var i = 0, len = this._arr.length; i < len; i++) {
            var afterLineNumber = this._arr[i].afterLineNumber;
            if (fromLineNumber <= afterLineNumber && afterLineNumber <= toLineNumber) {
                // The line this whitespace was after has been deleted
                //  => move whitespace to before first deleted line
                this._arr[i].afterLineNumber = fromLineNumber - 1;
            }
            else if (afterLineNumber > toLineNumber) {
                // The line this whitespace was after has been moved up
                //  => move whitespace up
                this._arr[i].afterLineNumber -= (toLineNumber - fromLineNumber + 1);
            }
        }
    };
    /**
     * Notify the layouter that lines have been inserted (a continuous zone of lines).
     *
     * @param fromLineNumber The line number at which the insertion started, inclusive
     * @param toLineNumber The line number at which the insertion ended, inclusive.
     */
    LinesLayout.prototype.onLinesInserted = function (fromLineNumber, toLineNumber) {
        this._checkPendingChanges();
        fromLineNumber = fromLineNumber | 0;
        toLineNumber = toLineNumber | 0;
        this._lineCount += (toLineNumber - fromLineNumber + 1);
        for (var i = 0, len = this._arr.length; i < len; i++) {
            var afterLineNumber = this._arr[i].afterLineNumber;
            if (fromLineNumber <= afterLineNumber) {
                this._arr[i].afterLineNumber += (toLineNumber - fromLineNumber + 1);
            }
        }
    };
    /**
     * Get the sum of all the whitespaces.
     */
    LinesLayout.prototype.getWhitespacesTotalHeight = function () {
        this._checkPendingChanges();
        if (this._arr.length === 0) {
            return 0;
        }
        return this.getWhitespacesAccumulatedHeight(this._arr.length - 1);
    };
    /**
     * Return the sum of the heights of the whitespaces at [0..index].
     * This includes the whitespace at `index`.
     *
     * @param index The index of the whitespace.
     * @return The sum of the heights of all whitespaces before the one at `index`, including the one at `index`.
     */
    LinesLayout.prototype.getWhitespacesAccumulatedHeight = function (index) {
        this._checkPendingChanges();
        index = index | 0;
        var startIndex = Math.max(0, this._prefixSumValidIndex + 1);
        if (startIndex === 0) {
            this._arr[0].prefixSum = this._arr[0].height;
            startIndex++;
        }
        for (var i = startIndex; i <= index; i++) {
            this._arr[i].prefixSum = this._arr[i - 1].prefixSum + this._arr[i].height;
        }
        this._prefixSumValidIndex = Math.max(this._prefixSumValidIndex, index);
        return this._arr[index].prefixSum;
    };
    /**
     * Get the sum of heights for all objects.
     *
     * @return The sum of heights for all objects.
     */
    LinesLayout.prototype.getLinesTotalHeight = function () {
        this._checkPendingChanges();
        var linesHeight = this._lineHeight * this._lineCount;
        var whitespacesHeight = this.getWhitespacesTotalHeight();
        return linesHeight + whitespacesHeight;
    };
    /**
     * Returns the accumulated height of whitespaces before the given line number.
     *
     * @param lineNumber The line number
     */
    LinesLayout.prototype.getWhitespaceAccumulatedHeightBeforeLineNumber = function (lineNumber) {
        this._checkPendingChanges();
        lineNumber = lineNumber | 0;
        var lastWhitespaceBeforeLineNumber = this._findLastWhitespaceBeforeLineNumber(lineNumber);
        if (lastWhitespaceBeforeLineNumber === -1) {
            return 0;
        }
        return this.getWhitespacesAccumulatedHeight(lastWhitespaceBeforeLineNumber);
    };
    LinesLayout.prototype._findLastWhitespaceBeforeLineNumber = function (lineNumber) {
        lineNumber = lineNumber | 0;
        // Find the whitespace before line number
        var arr = this._arr;
        var low = 0;
        var high = arr.length - 1;
        while (low <= high) {
            var delta = (high - low) | 0;
            var halfDelta = (delta / 2) | 0;
            var mid = (low + halfDelta) | 0;
            if (arr[mid].afterLineNumber < lineNumber) {
                if (mid + 1 >= arr.length || arr[mid + 1].afterLineNumber >= lineNumber) {
                    return mid;
                }
                else {
                    low = (mid + 1) | 0;
                }
            }
            else {
                high = (mid - 1) | 0;
            }
        }
        return -1;
    };
    LinesLayout.prototype._findFirstWhitespaceAfterLineNumber = function (lineNumber) {
        lineNumber = lineNumber | 0;
        var lastWhitespaceBeforeLineNumber = this._findLastWhitespaceBeforeLineNumber(lineNumber);
        var firstWhitespaceAfterLineNumber = lastWhitespaceBeforeLineNumber + 1;
        if (firstWhitespaceAfterLineNumber < this._arr.length) {
            return firstWhitespaceAfterLineNumber;
        }
        return -1;
    };
    /**
     * Find the index of the first whitespace which has `afterLineNumber` >= `lineNumber`.
     * @return The index of the first whitespace with `afterLineNumber` >= `lineNumber` or -1 if no whitespace is found.
     */
    LinesLayout.prototype.getFirstWhitespaceIndexAfterLineNumber = function (lineNumber) {
        this._checkPendingChanges();
        lineNumber = lineNumber | 0;
        return this._findFirstWhitespaceAfterLineNumber(lineNumber);
    };
    /**
     * Get the vertical offset (the sum of heights for all objects above) a certain line number.
     *
     * @param lineNumber The line number
     * @return The sum of heights for all objects above `lineNumber`.
     */
    LinesLayout.prototype.getVerticalOffsetForLineNumber = function (lineNumber) {
        this._checkPendingChanges();
        lineNumber = lineNumber | 0;
        var previousLinesHeight;
        if (lineNumber > 1) {
            previousLinesHeight = this._lineHeight * (lineNumber - 1);
        }
        else {
            previousLinesHeight = 0;
        }
        var previousWhitespacesHeight = this.getWhitespaceAccumulatedHeightBeforeLineNumber(lineNumber);
        return previousLinesHeight + previousWhitespacesHeight;
    };
    /**
     * The maximum min width for all whitespaces.
     */
    LinesLayout.prototype.getWhitespaceMinWidth = function () {
        this._checkPendingChanges();
        if (this._minWidth === -1) {
            var minWidth = 0;
            for (var i = 0, len = this._arr.length; i < len; i++) {
                minWidth = Math.max(minWidth, this._arr[i].minWidth);
            }
            this._minWidth = minWidth;
        }
        return this._minWidth;
    };
    /**
     * Check if `verticalOffset` is below all lines.
     */
    LinesLayout.prototype.isAfterLines = function (verticalOffset) {
        this._checkPendingChanges();
        var totalHeight = this.getLinesTotalHeight();
        return verticalOffset > totalHeight;
    };
    /**
     * Find the first line number that is at or after vertical offset `verticalOffset`.
     * i.e. if getVerticalOffsetForLine(line) is x and getVerticalOffsetForLine(line + 1) is y, then
     * getLineNumberAtOrAfterVerticalOffset(i) = line, x <= i < y.
     *
     * @param verticalOffset The vertical offset to search at.
     * @return The line number at or after vertical offset `verticalOffset`.
     */
    LinesLayout.prototype.getLineNumberAtOrAfterVerticalOffset = function (verticalOffset) {
        this._checkPendingChanges();
        verticalOffset = verticalOffset | 0;
        if (verticalOffset < 0) {
            return 1;
        }
        var linesCount = this._lineCount | 0;
        var lineHeight = this._lineHeight;
        var minLineNumber = 1;
        var maxLineNumber = linesCount;
        while (minLineNumber < maxLineNumber) {
            var midLineNumber = ((minLineNumber + maxLineNumber) / 2) | 0;
            var midLineNumberVerticalOffset = this.getVerticalOffsetForLineNumber(midLineNumber) | 0;
            if (verticalOffset >= midLineNumberVerticalOffset + lineHeight) {
                // vertical offset is after mid line number
                minLineNumber = midLineNumber + 1;
            }
            else if (verticalOffset >= midLineNumberVerticalOffset) {
                // Hit
                return midLineNumber;
            }
            else {
                // vertical offset is before mid line number, but mid line number could still be what we're searching for
                maxLineNumber = midLineNumber;
            }
        }
        if (minLineNumber > linesCount) {
            return linesCount;
        }
        return minLineNumber;
    };
    /**
     * Get all the lines and their relative vertical offsets that are positioned between `verticalOffset1` and `verticalOffset2`.
     *
     * @param verticalOffset1 The beginning of the viewport.
     * @param verticalOffset2 The end of the viewport.
     * @return A structure describing the lines positioned between `verticalOffset1` and `verticalOffset2`.
     */
    LinesLayout.prototype.getLinesViewportData = function (verticalOffset1, verticalOffset2) {
        this._checkPendingChanges();
        verticalOffset1 = verticalOffset1 | 0;
        verticalOffset2 = verticalOffset2 | 0;
        var lineHeight = this._lineHeight;
        // Find first line number
        // We don't live in a perfect world, so the line number might start before or after verticalOffset1
        var startLineNumber = this.getLineNumberAtOrAfterVerticalOffset(verticalOffset1) | 0;
        var startLineNumberVerticalOffset = this.getVerticalOffsetForLineNumber(startLineNumber) | 0;
        var endLineNumber = this._lineCount | 0;
        // Also keep track of what whitespace we've got
        var whitespaceIndex = this.getFirstWhitespaceIndexAfterLineNumber(startLineNumber) | 0;
        var whitespaceCount = this.getWhitespacesCount() | 0;
        var currentWhitespaceHeight;
        var currentWhitespaceAfterLineNumber;
        if (whitespaceIndex === -1) {
            whitespaceIndex = whitespaceCount;
            currentWhitespaceAfterLineNumber = endLineNumber + 1;
            currentWhitespaceHeight = 0;
        }
        else {
            currentWhitespaceAfterLineNumber = this.getAfterLineNumberForWhitespaceIndex(whitespaceIndex) | 0;
            currentWhitespaceHeight = this.getHeightForWhitespaceIndex(whitespaceIndex) | 0;
        }
        var currentVerticalOffset = startLineNumberVerticalOffset;
        var currentLineRelativeOffset = currentVerticalOffset;
        // IE (all versions) cannot handle units above about 1,533,908 px, so every 500k pixels bring numbers down
        var STEP_SIZE = 500000;
        var bigNumbersDelta = 0;
        if (startLineNumberVerticalOffset >= STEP_SIZE) {
            // Compute a delta that guarantees that lines are positioned at `lineHeight` increments
            bigNumbersDelta = Math.floor(startLineNumberVerticalOffset / STEP_SIZE) * STEP_SIZE;
            bigNumbersDelta = Math.floor(bigNumbersDelta / lineHeight) * lineHeight;
            currentLineRelativeOffset -= bigNumbersDelta;
        }
        var linesOffsets = [];
        var verticalCenter = verticalOffset1 + (verticalOffset2 - verticalOffset1) / 2;
        var centeredLineNumber = -1;
        // Figure out how far the lines go
        for (var lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
            if (centeredLineNumber === -1) {
                var currentLineTop = currentVerticalOffset;
                var currentLineBottom = currentVerticalOffset + lineHeight;
                if ((currentLineTop <= verticalCenter && verticalCenter < currentLineBottom) || currentLineTop > verticalCenter) {
                    centeredLineNumber = lineNumber;
                }
            }
            // Count current line height in the vertical offsets
            currentVerticalOffset += lineHeight;
            linesOffsets[lineNumber - startLineNumber] = currentLineRelativeOffset;
            // Next line starts immediately after this one
            currentLineRelativeOffset += lineHeight;
            while (currentWhitespaceAfterLineNumber === lineNumber) {
                // Push down next line with the height of the current whitespace
                currentLineRelativeOffset += currentWhitespaceHeight;
                // Count current whitespace in the vertical offsets
                currentVerticalOffset += currentWhitespaceHeight;
                whitespaceIndex++;
                if (whitespaceIndex >= whitespaceCount) {
                    currentWhitespaceAfterLineNumber = endLineNumber + 1;
                }
                else {
                    currentWhitespaceAfterLineNumber = this.getAfterLineNumberForWhitespaceIndex(whitespaceIndex) | 0;
                    currentWhitespaceHeight = this.getHeightForWhitespaceIndex(whitespaceIndex) | 0;
                }
            }
            if (currentVerticalOffset >= verticalOffset2) {
                // We have covered the entire viewport area, time to stop
                endLineNumber = lineNumber;
                break;
            }
        }
        if (centeredLineNumber === -1) {
            centeredLineNumber = endLineNumber;
        }
        var endLineNumberVerticalOffset = this.getVerticalOffsetForLineNumber(endLineNumber) | 0;
        var completelyVisibleStartLineNumber = startLineNumber;
        var completelyVisibleEndLineNumber = endLineNumber;
        if (completelyVisibleStartLineNumber < completelyVisibleEndLineNumber) {
            if (startLineNumberVerticalOffset < verticalOffset1) {
                completelyVisibleStartLineNumber++;
            }
        }
        if (completelyVisibleStartLineNumber < completelyVisibleEndLineNumber) {
            if (endLineNumberVerticalOffset + lineHeight > verticalOffset2) {
                completelyVisibleEndLineNumber--;
            }
        }
        return {
            bigNumbersDelta: bigNumbersDelta,
            startLineNumber: startLineNumber,
            endLineNumber: endLineNumber,
            relativeVerticalOffset: linesOffsets,
            centeredLineNumber: centeredLineNumber,
            completelyVisibleStartLineNumber: completelyVisibleStartLineNumber,
            completelyVisibleEndLineNumber: completelyVisibleEndLineNumber
        };
    };
    LinesLayout.prototype.getVerticalOffsetForWhitespaceIndex = function (whitespaceIndex) {
        this._checkPendingChanges();
        whitespaceIndex = whitespaceIndex | 0;
        var afterLineNumber = this.getAfterLineNumberForWhitespaceIndex(whitespaceIndex);
        var previousLinesHeight;
        if (afterLineNumber >= 1) {
            previousLinesHeight = this._lineHeight * afterLineNumber;
        }
        else {
            previousLinesHeight = 0;
        }
        var previousWhitespacesHeight;
        if (whitespaceIndex > 0) {
            previousWhitespacesHeight = this.getWhitespacesAccumulatedHeight(whitespaceIndex - 1);
        }
        else {
            previousWhitespacesHeight = 0;
        }
        return previousLinesHeight + previousWhitespacesHeight;
    };
    LinesLayout.prototype.getWhitespaceIndexAtOrAfterVerticallOffset = function (verticalOffset) {
        this._checkPendingChanges();
        verticalOffset = verticalOffset | 0;
        var minWhitespaceIndex = 0;
        var maxWhitespaceIndex = this.getWhitespacesCount() - 1;
        if (maxWhitespaceIndex < 0) {
            return -1;
        }
        // Special case: nothing to be found
        var maxWhitespaceVerticalOffset = this.getVerticalOffsetForWhitespaceIndex(maxWhitespaceIndex);
        var maxWhitespaceHeight = this.getHeightForWhitespaceIndex(maxWhitespaceIndex);
        if (verticalOffset >= maxWhitespaceVerticalOffset + maxWhitespaceHeight) {
            return -1;
        }
        while (minWhitespaceIndex < maxWhitespaceIndex) {
            var midWhitespaceIndex = Math.floor((minWhitespaceIndex + maxWhitespaceIndex) / 2);
            var midWhitespaceVerticalOffset = this.getVerticalOffsetForWhitespaceIndex(midWhitespaceIndex);
            var midWhitespaceHeight = this.getHeightForWhitespaceIndex(midWhitespaceIndex);
            if (verticalOffset >= midWhitespaceVerticalOffset + midWhitespaceHeight) {
                // vertical offset is after whitespace
                minWhitespaceIndex = midWhitespaceIndex + 1;
            }
            else if (verticalOffset >= midWhitespaceVerticalOffset) {
                // Hit
                return midWhitespaceIndex;
            }
            else {
                // vertical offset is before whitespace, but midWhitespaceIndex might still be what we're searching for
                maxWhitespaceIndex = midWhitespaceIndex;
            }
        }
        return minWhitespaceIndex;
    };
    /**
     * Get exactly the whitespace that is layouted at `verticalOffset`.
     *
     * @param verticalOffset The vertical offset.
     * @return Precisely the whitespace that is layouted at `verticaloffset` or null.
     */
    LinesLayout.prototype.getWhitespaceAtVerticalOffset = function (verticalOffset) {
        this._checkPendingChanges();
        verticalOffset = verticalOffset | 0;
        var candidateIndex = this.getWhitespaceIndexAtOrAfterVerticallOffset(verticalOffset);
        if (candidateIndex < 0) {
            return null;
        }
        if (candidateIndex >= this.getWhitespacesCount()) {
            return null;
        }
        var candidateTop = this.getVerticalOffsetForWhitespaceIndex(candidateIndex);
        if (candidateTop > verticalOffset) {
            return null;
        }
        var candidateHeight = this.getHeightForWhitespaceIndex(candidateIndex);
        var candidateId = this.getIdForWhitespaceIndex(candidateIndex);
        var candidateAfterLineNumber = this.getAfterLineNumberForWhitespaceIndex(candidateIndex);
        return {
            id: candidateId,
            afterLineNumber: candidateAfterLineNumber,
            verticalOffset: candidateTop,
            height: candidateHeight
        };
    };
    /**
     * Get a list of whitespaces that are positioned between `verticalOffset1` and `verticalOffset2`.
     *
     * @param verticalOffset1 The beginning of the viewport.
     * @param verticalOffset2 The end of the viewport.
     * @return An array with all the whitespaces in the viewport. If no whitespace is in viewport, the array is empty.
     */
    LinesLayout.prototype.getWhitespaceViewportData = function (verticalOffset1, verticalOffset2) {
        this._checkPendingChanges();
        verticalOffset1 = verticalOffset1 | 0;
        verticalOffset2 = verticalOffset2 | 0;
        var startIndex = this.getWhitespaceIndexAtOrAfterVerticallOffset(verticalOffset1);
        var endIndex = this.getWhitespacesCount() - 1;
        if (startIndex < 0) {
            return [];
        }
        var result = [];
        for (var i = startIndex; i <= endIndex; i++) {
            var top_1 = this.getVerticalOffsetForWhitespaceIndex(i);
            var height = this.getHeightForWhitespaceIndex(i);
            if (top_1 >= verticalOffset2) {
                break;
            }
            result.push({
                id: this.getIdForWhitespaceIndex(i),
                afterLineNumber: this.getAfterLineNumberForWhitespaceIndex(i),
                verticalOffset: top_1,
                height: height
            });
        }
        return result;
    };
    /**
     * Get all whitespaces.
     */
    LinesLayout.prototype.getWhitespaces = function () {
        this._checkPendingChanges();
        return this._arr.slice(0);
    };
    /**
     * The number of whitespaces.
     */
    LinesLayout.prototype.getWhitespacesCount = function () {
        this._checkPendingChanges();
        return this._arr.length;
    };
    /**
     * Get the `id` for whitespace at index `index`.
     *
     * @param index The index of the whitespace.
     * @return `id` of whitespace at `index`.
     */
    LinesLayout.prototype.getIdForWhitespaceIndex = function (index) {
        this._checkPendingChanges();
        index = index | 0;
        return this._arr[index].id;
    };
    /**
     * Get the `afterLineNumber` for whitespace at index `index`.
     *
     * @param index The index of the whitespace.
     * @return `afterLineNumber` of whitespace at `index`.
     */
    LinesLayout.prototype.getAfterLineNumberForWhitespaceIndex = function (index) {
        this._checkPendingChanges();
        index = index | 0;
        return this._arr[index].afterLineNumber;
    };
    /**
     * Get the `height` for whitespace at index `index`.
     *
     * @param index The index of the whitespace.
     * @return `height` of whitespace at `index`.
     */
    LinesLayout.prototype.getHeightForWhitespaceIndex = function (index) {
        this._checkPendingChanges();
        index = index | 0;
        return this._arr[index].height;
    };
    LinesLayout.INSTANCE_COUNT = 0;
    return LinesLayout;
}());
export { LinesLayout };
