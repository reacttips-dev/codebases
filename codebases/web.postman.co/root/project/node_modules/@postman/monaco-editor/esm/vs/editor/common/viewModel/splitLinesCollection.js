/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as arrays from '../../../base/common/arrays.js';
import { Position } from '../core/position.js';
import { Range } from '../core/range.js';
import { ModelDecorationOptions } from '../model/textModel.js';
import * as viewEvents from '../view/viewEvents.js';
import { PrefixSumIndexOfResult } from './prefixSumComputer.js';
import { ViewLineData } from './viewModel.js';
var OutputPosition = /** @class */ (function () {
    function OutputPosition(outputLineIndex, outputOffset) {
        this.outputLineIndex = outputLineIndex;
        this.outputOffset = outputOffset;
    }
    return OutputPosition;
}());
export { OutputPosition };
var LineBreakData = /** @class */ (function () {
    function LineBreakData(breakOffsets, breakOffsetsVisibleColumn, wrappedTextIndentLength) {
        this.breakOffsets = breakOffsets;
        this.breakOffsetsVisibleColumn = breakOffsetsVisibleColumn;
        this.wrappedTextIndentLength = wrappedTextIndentLength;
    }
    LineBreakData.getInputOffsetOfOutputPosition = function (breakOffsets, outputLineIndex, outputOffset) {
        if (outputLineIndex === 0) {
            return outputOffset;
        }
        else {
            return breakOffsets[outputLineIndex - 1] + outputOffset;
        }
    };
    LineBreakData.getOutputPositionOfInputOffset = function (breakOffsets, inputOffset) {
        var low = 0;
        var high = breakOffsets.length - 1;
        var mid = 0;
        var midStart = 0;
        while (low <= high) {
            mid = low + ((high - low) / 2) | 0;
            var midStop = breakOffsets[mid];
            midStart = mid > 0 ? breakOffsets[mid - 1] : 0;
            if (inputOffset < midStart) {
                high = mid - 1;
            }
            else if (inputOffset >= midStop) {
                low = mid + 1;
            }
            else {
                break;
            }
        }
        return new OutputPosition(mid, inputOffset - midStart);
    };
    return LineBreakData;
}());
export { LineBreakData };
var CoordinatesConverter = /** @class */ (function () {
    function CoordinatesConverter(lines) {
        this._lines = lines;
    }
    // View -> Model conversion and related methods
    CoordinatesConverter.prototype.convertViewPositionToModelPosition = function (viewPosition) {
        return this._lines.convertViewPositionToModelPosition(viewPosition.lineNumber, viewPosition.column);
    };
    CoordinatesConverter.prototype.convertViewRangeToModelRange = function (viewRange) {
        return this._lines.convertViewRangeToModelRange(viewRange);
    };
    CoordinatesConverter.prototype.validateViewPosition = function (viewPosition, expectedModelPosition) {
        return this._lines.validateViewPosition(viewPosition.lineNumber, viewPosition.column, expectedModelPosition);
    };
    CoordinatesConverter.prototype.validateViewRange = function (viewRange, expectedModelRange) {
        return this._lines.validateViewRange(viewRange, expectedModelRange);
    };
    // Model -> View conversion and related methods
    CoordinatesConverter.prototype.convertModelPositionToViewPosition = function (modelPosition) {
        return this._lines.convertModelPositionToViewPosition(modelPosition.lineNumber, modelPosition.column);
    };
    CoordinatesConverter.prototype.convertModelRangeToViewRange = function (modelRange) {
        return this._lines.convertModelRangeToViewRange(modelRange);
    };
    CoordinatesConverter.prototype.modelPositionIsVisible = function (modelPosition) {
        return this._lines.modelPositionIsVisible(modelPosition.lineNumber, modelPosition.column);
    };
    return CoordinatesConverter;
}());
export { CoordinatesConverter };
var LineNumberMapper = /** @class */ (function () {
    function LineNumberMapper(viewLineCounts) {
        this._counts = viewLineCounts;
        this._isValid = false;
        this._validEndIndex = -1;
        this._modelToView = [];
        this._viewToModel = [];
    }
    LineNumberMapper.prototype._invalidate = function (index) {
        this._isValid = false;
        this._validEndIndex = Math.min(this._validEndIndex, index - 1);
    };
    LineNumberMapper.prototype._ensureValid = function () {
        if (this._isValid) {
            return;
        }
        for (var i = this._validEndIndex + 1, len = this._counts.length; i < len; i++) {
            var viewLineCount = this._counts[i];
            var viewLinesAbove = (i > 0 ? this._modelToView[i - 1] : 0);
            this._modelToView[i] = viewLinesAbove + viewLineCount;
            for (var j = 0; j < viewLineCount; j++) {
                this._viewToModel[viewLinesAbove + j] = i;
            }
        }
        // trim things
        this._modelToView.length = this._counts.length;
        this._viewToModel.length = this._modelToView[this._modelToView.length - 1];
        // mark as valid
        this._isValid = true;
        this._validEndIndex = this._counts.length - 1;
    };
    LineNumberMapper.prototype.changeValue = function (index, value) {
        if (this._counts[index] === value) {
            // no change
            return;
        }
        this._counts[index] = value;
        this._invalidate(index);
    };
    LineNumberMapper.prototype.removeValues = function (start, deleteCount) {
        this._counts.splice(start, deleteCount);
        this._invalidate(start);
    };
    LineNumberMapper.prototype.insertValues = function (insertIndex, insertArr) {
        this._counts = arrays.arrayInsert(this._counts, insertIndex, insertArr);
        this._invalidate(insertIndex);
    };
    LineNumberMapper.prototype.getTotalValue = function () {
        this._ensureValid();
        return this._viewToModel.length;
    };
    LineNumberMapper.prototype.getAccumulatedValue = function (index) {
        this._ensureValid();
        return this._modelToView[index];
    };
    LineNumberMapper.prototype.getIndexOf = function (accumulatedValue) {
        this._ensureValid();
        var modelLineIndex = this._viewToModel[accumulatedValue];
        var viewLinesAbove = (modelLineIndex > 0 ? this._modelToView[modelLineIndex - 1] : 0);
        return new PrefixSumIndexOfResult(modelLineIndex, accumulatedValue - viewLinesAbove);
    };
    return LineNumberMapper;
}());
var SplitLinesCollection = /** @class */ (function () {
    function SplitLinesCollection(model, domLineBreaksComputerFactory, monospaceLineBreaksComputerFactory, fontInfo, tabSize, wrappingStrategy, wrappingColumn, wrappingIndent) {
        this.model = model;
        this._validModelVersionId = -1;
        this._domLineBreaksComputerFactory = domLineBreaksComputerFactory;
        this._monospaceLineBreaksComputerFactory = monospaceLineBreaksComputerFactory;
        this.fontInfo = fontInfo;
        this.tabSize = tabSize;
        this.wrappingStrategy = wrappingStrategy;
        this.wrappingColumn = wrappingColumn;
        this.wrappingIndent = wrappingIndent;
        this._constructLines(/*resetHiddenAreas*/ true, null);
    }
    SplitLinesCollection.prototype.dispose = function () {
        this.hiddenAreasIds = this.model.deltaDecorations(this.hiddenAreasIds, []);
    };
    SplitLinesCollection.prototype.createCoordinatesConverter = function () {
        return new CoordinatesConverter(this);
    };
    SplitLinesCollection.prototype._constructLines = function (resetHiddenAreas, previousLineBreaks) {
        var _this = this;
        this.lines = [];
        if (resetHiddenAreas) {
            this.hiddenAreasIds = [];
        }
        var linesContent = this.model.getLinesContent();
        var lineCount = linesContent.length;
        var lineBreaksComputer = this.createLineBreaksComputer();
        for (var i = 0; i < lineCount; i++) {
            lineBreaksComputer.addRequest(linesContent[i], previousLineBreaks ? previousLineBreaks[i] : null);
        }
        var linesBreaks = lineBreaksComputer.finalize();
        var values = [];
        var hiddenAreas = this.hiddenAreasIds.map(function (areaId) { return _this.model.getDecorationRange(areaId); }).sort(Range.compareRangesUsingStarts);
        var hiddenAreaStart = 1, hiddenAreaEnd = 0;
        var hiddenAreaIdx = -1;
        var nextLineNumberToUpdateHiddenArea = (hiddenAreaIdx + 1 < hiddenAreas.length) ? hiddenAreaEnd + 1 : lineCount + 2;
        for (var i = 0; i < lineCount; i++) {
            var lineNumber = i + 1;
            if (lineNumber === nextLineNumberToUpdateHiddenArea) {
                hiddenAreaIdx++;
                hiddenAreaStart = hiddenAreas[hiddenAreaIdx].startLineNumber;
                hiddenAreaEnd = hiddenAreas[hiddenAreaIdx].endLineNumber;
                nextLineNumberToUpdateHiddenArea = (hiddenAreaIdx + 1 < hiddenAreas.length) ? hiddenAreaEnd + 1 : lineCount + 2;
            }
            var isInHiddenArea = (lineNumber >= hiddenAreaStart && lineNumber <= hiddenAreaEnd);
            var line = createSplitLine(linesBreaks[i], !isInHiddenArea);
            values[i] = line.getViewLineCount();
            this.lines[i] = line;
        }
        this._validModelVersionId = this.model.getVersionId();
        this.prefixSumComputer = new LineNumberMapper(values);
    };
    SplitLinesCollection.prototype.getHiddenAreas = function () {
        var _this = this;
        return this.hiddenAreasIds.map(function (decId) {
            return _this.model.getDecorationRange(decId);
        });
    };
    SplitLinesCollection.prototype._reduceRanges = function (_ranges) {
        var _this = this;
        if (_ranges.length === 0) {
            return [];
        }
        var ranges = _ranges.map(function (r) { return _this.model.validateRange(r); }).sort(Range.compareRangesUsingStarts);
        var result = [];
        var currentRangeStart = ranges[0].startLineNumber;
        var currentRangeEnd = ranges[0].endLineNumber;
        for (var i = 1, len = ranges.length; i < len; i++) {
            var range = ranges[i];
            if (range.startLineNumber > currentRangeEnd + 1) {
                result.push(new Range(currentRangeStart, 1, currentRangeEnd, 1));
                currentRangeStart = range.startLineNumber;
                currentRangeEnd = range.endLineNumber;
            }
            else if (range.endLineNumber > currentRangeEnd) {
                currentRangeEnd = range.endLineNumber;
            }
        }
        result.push(new Range(currentRangeStart, 1, currentRangeEnd, 1));
        return result;
    };
    SplitLinesCollection.prototype.setHiddenAreas = function (_ranges) {
        var _this = this;
        var newRanges = this._reduceRanges(_ranges);
        // BEGIN TODO@Martin: Please stop calling this method on each model change!
        var oldRanges = this.hiddenAreasIds.map(function (areaId) { return _this.model.getDecorationRange(areaId); }).sort(Range.compareRangesUsingStarts);
        if (newRanges.length === oldRanges.length) {
            var hasDifference = false;
            for (var i = 0; i < newRanges.length; i++) {
                if (!newRanges[i].equalsRange(oldRanges[i])) {
                    hasDifference = true;
                    break;
                }
            }
            if (!hasDifference) {
                return false;
            }
        }
        // END TODO@Martin: Please stop calling this method on each model change!
        var newDecorations = [];
        for (var _i = 0, newRanges_1 = newRanges; _i < newRanges_1.length; _i++) {
            var newRange = newRanges_1[_i];
            newDecorations.push({
                range: newRange,
                options: ModelDecorationOptions.EMPTY
            });
        }
        this.hiddenAreasIds = this.model.deltaDecorations(this.hiddenAreasIds, newDecorations);
        var hiddenAreas = newRanges;
        var hiddenAreaStart = 1, hiddenAreaEnd = 0;
        var hiddenAreaIdx = -1;
        var nextLineNumberToUpdateHiddenArea = (hiddenAreaIdx + 1 < hiddenAreas.length) ? hiddenAreaEnd + 1 : this.lines.length + 2;
        var hasVisibleLine = false;
        for (var i = 0; i < this.lines.length; i++) {
            var lineNumber = i + 1;
            if (lineNumber === nextLineNumberToUpdateHiddenArea) {
                hiddenAreaIdx++;
                hiddenAreaStart = hiddenAreas[hiddenAreaIdx].startLineNumber;
                hiddenAreaEnd = hiddenAreas[hiddenAreaIdx].endLineNumber;
                nextLineNumberToUpdateHiddenArea = (hiddenAreaIdx + 1 < hiddenAreas.length) ? hiddenAreaEnd + 1 : this.lines.length + 2;
            }
            var lineChanged = false;
            if (lineNumber >= hiddenAreaStart && lineNumber <= hiddenAreaEnd) {
                // Line should be hidden
                if (this.lines[i].isVisible()) {
                    this.lines[i] = this.lines[i].setVisible(false);
                    lineChanged = true;
                }
            }
            else {
                hasVisibleLine = true;
                // Line should be visible
                if (!this.lines[i].isVisible()) {
                    this.lines[i] = this.lines[i].setVisible(true);
                    lineChanged = true;
                }
            }
            if (lineChanged) {
                var newOutputLineCount = this.lines[i].getViewLineCount();
                this.prefixSumComputer.changeValue(i, newOutputLineCount);
            }
        }
        if (!hasVisibleLine) {
            // Cannot have everything be hidden => reveal everything!
            this.setHiddenAreas([]);
        }
        return true;
    };
    SplitLinesCollection.prototype.modelPositionIsVisible = function (modelLineNumber, _modelColumn) {
        if (modelLineNumber < 1 || modelLineNumber > this.lines.length) {
            // invalid arguments
            return false;
        }
        return this.lines[modelLineNumber - 1].isVisible();
    };
    SplitLinesCollection.prototype.setTabSize = function (newTabSize) {
        if (this.tabSize === newTabSize) {
            return false;
        }
        this.tabSize = newTabSize;
        this._constructLines(/*resetHiddenAreas*/ false, null);
        return true;
    };
    SplitLinesCollection.prototype.setWrappingSettings = function (fontInfo, wrappingStrategy, wrappingColumn, wrappingIndent) {
        var equalFontInfo = this.fontInfo.equals(fontInfo);
        var equalWrappingStrategy = (this.wrappingStrategy === wrappingStrategy);
        var equalWrappingColumn = (this.wrappingColumn === wrappingColumn);
        var equalWrappingIndent = (this.wrappingIndent === wrappingIndent);
        if (equalFontInfo && equalWrappingStrategy && equalWrappingColumn && equalWrappingIndent) {
            return false;
        }
        var onlyWrappingColumnChanged = (equalFontInfo && equalWrappingStrategy && !equalWrappingColumn && equalWrappingIndent);
        this.fontInfo = fontInfo;
        this.wrappingStrategy = wrappingStrategy;
        this.wrappingColumn = wrappingColumn;
        this.wrappingIndent = wrappingIndent;
        var previousLineBreaks = null;
        if (onlyWrappingColumnChanged) {
            previousLineBreaks = [];
            for (var i = 0, len = this.lines.length; i < len; i++) {
                previousLineBreaks[i] = this.lines[i].getLineBreakData();
            }
        }
        this._constructLines(/*resetHiddenAreas*/ false, previousLineBreaks);
        return true;
    };
    SplitLinesCollection.prototype.createLineBreaksComputer = function () {
        var lineBreaksComputerFactory = (this.wrappingStrategy === 'advanced'
            ? this._domLineBreaksComputerFactory
            : this._monospaceLineBreaksComputerFactory);
        return lineBreaksComputerFactory.createLineBreaksComputer(this.fontInfo, this.tabSize, this.wrappingColumn, this.wrappingIndent);
    };
    SplitLinesCollection.prototype.onModelFlushed = function () {
        this._constructLines(/*resetHiddenAreas*/ true, null);
    };
    SplitLinesCollection.prototype.onModelLinesDeleted = function (versionId, fromLineNumber, toLineNumber) {
        if (versionId <= this._validModelVersionId) {
            // Here we check for versionId in case the lines were reconstructed in the meantime.
            // We don't want to apply stale change events on top of a newer read model state.
            return null;
        }
        var outputFromLineNumber = (fromLineNumber === 1 ? 1 : this.prefixSumComputer.getAccumulatedValue(fromLineNumber - 2) + 1);
        var outputToLineNumber = this.prefixSumComputer.getAccumulatedValue(toLineNumber - 1);
        this.lines.splice(fromLineNumber - 1, toLineNumber - fromLineNumber + 1);
        this.prefixSumComputer.removeValues(fromLineNumber - 1, toLineNumber - fromLineNumber + 1);
        return new viewEvents.ViewLinesDeletedEvent(outputFromLineNumber, outputToLineNumber);
    };
    SplitLinesCollection.prototype.onModelLinesInserted = function (versionId, fromLineNumber, _toLineNumber, lineBreaks) {
        if (versionId <= this._validModelVersionId) {
            // Here we check for versionId in case the lines were reconstructed in the meantime.
            // We don't want to apply stale change events on top of a newer read model state.
            return null;
        }
        var hiddenAreas = this.getHiddenAreas();
        var isInHiddenArea = false;
        var testPosition = new Position(fromLineNumber, 1);
        for (var _i = 0, hiddenAreas_1 = hiddenAreas; _i < hiddenAreas_1.length; _i++) {
            var hiddenArea = hiddenAreas_1[_i];
            if (hiddenArea.containsPosition(testPosition)) {
                isInHiddenArea = true;
                break;
            }
        }
        var outputFromLineNumber = (fromLineNumber === 1 ? 1 : this.prefixSumComputer.getAccumulatedValue(fromLineNumber - 2) + 1);
        var totalOutputLineCount = 0;
        var insertLines = [];
        var insertPrefixSumValues = [];
        for (var i = 0, len = lineBreaks.length; i < len; i++) {
            var line = createSplitLine(lineBreaks[i], !isInHiddenArea);
            insertLines.push(line);
            var outputLineCount = line.getViewLineCount();
            totalOutputLineCount += outputLineCount;
            insertPrefixSumValues[i] = outputLineCount;
        }
        // TODO@Alex: use arrays.arrayInsert
        this.lines = this.lines.slice(0, fromLineNumber - 1).concat(insertLines).concat(this.lines.slice(fromLineNumber - 1));
        this.prefixSumComputer.insertValues(fromLineNumber - 1, insertPrefixSumValues);
        return new viewEvents.ViewLinesInsertedEvent(outputFromLineNumber, outputFromLineNumber + totalOutputLineCount - 1);
    };
    SplitLinesCollection.prototype.onModelLineChanged = function (versionId, lineNumber, lineBreakData) {
        if (versionId <= this._validModelVersionId) {
            // Here we check for versionId in case the lines were reconstructed in the meantime.
            // We don't want to apply stale change events on top of a newer read model state.
            return [false, null, null, null];
        }
        var lineIndex = lineNumber - 1;
        var oldOutputLineCount = this.lines[lineIndex].getViewLineCount();
        var isVisible = this.lines[lineIndex].isVisible();
        var line = createSplitLine(lineBreakData, isVisible);
        this.lines[lineIndex] = line;
        var newOutputLineCount = this.lines[lineIndex].getViewLineCount();
        var lineMappingChanged = false;
        var changeFrom = 0;
        var changeTo = -1;
        var insertFrom = 0;
        var insertTo = -1;
        var deleteFrom = 0;
        var deleteTo = -1;
        if (oldOutputLineCount > newOutputLineCount) {
            changeFrom = (lineNumber === 1 ? 1 : this.prefixSumComputer.getAccumulatedValue(lineNumber - 2) + 1);
            changeTo = changeFrom + newOutputLineCount - 1;
            deleteFrom = changeTo + 1;
            deleteTo = deleteFrom + (oldOutputLineCount - newOutputLineCount) - 1;
            lineMappingChanged = true;
        }
        else if (oldOutputLineCount < newOutputLineCount) {
            changeFrom = (lineNumber === 1 ? 1 : this.prefixSumComputer.getAccumulatedValue(lineNumber - 2) + 1);
            changeTo = changeFrom + oldOutputLineCount - 1;
            insertFrom = changeTo + 1;
            insertTo = insertFrom + (newOutputLineCount - oldOutputLineCount) - 1;
            lineMappingChanged = true;
        }
        else {
            changeFrom = (lineNumber === 1 ? 1 : this.prefixSumComputer.getAccumulatedValue(lineNumber - 2) + 1);
            changeTo = changeFrom + newOutputLineCount - 1;
        }
        this.prefixSumComputer.changeValue(lineIndex, newOutputLineCount);
        var viewLinesChangedEvent = (changeFrom <= changeTo ? new viewEvents.ViewLinesChangedEvent(changeFrom, changeTo) : null);
        var viewLinesInsertedEvent = (insertFrom <= insertTo ? new viewEvents.ViewLinesInsertedEvent(insertFrom, insertTo) : null);
        var viewLinesDeletedEvent = (deleteFrom <= deleteTo ? new viewEvents.ViewLinesDeletedEvent(deleteFrom, deleteTo) : null);
        return [lineMappingChanged, viewLinesChangedEvent, viewLinesInsertedEvent, viewLinesDeletedEvent];
    };
    SplitLinesCollection.prototype.acceptVersionId = function (versionId) {
        this._validModelVersionId = versionId;
        if (this.lines.length === 1 && !this.lines[0].isVisible()) {
            // At least one line must be visible => reset hidden areas
            this.setHiddenAreas([]);
        }
    };
    SplitLinesCollection.prototype.getViewLineCount = function () {
        return this.prefixSumComputer.getTotalValue();
    };
    SplitLinesCollection.prototype._toValidViewLineNumber = function (viewLineNumber) {
        if (viewLineNumber < 1) {
            return 1;
        }
        var viewLineCount = this.getViewLineCount();
        if (viewLineNumber > viewLineCount) {
            return viewLineCount;
        }
        return viewLineNumber | 0;
    };
    SplitLinesCollection.prototype.getActiveIndentGuide = function (viewLineNumber, minLineNumber, maxLineNumber) {
        viewLineNumber = this._toValidViewLineNumber(viewLineNumber);
        minLineNumber = this._toValidViewLineNumber(minLineNumber);
        maxLineNumber = this._toValidViewLineNumber(maxLineNumber);
        var modelPosition = this.convertViewPositionToModelPosition(viewLineNumber, this.getViewLineMinColumn(viewLineNumber));
        var modelMinPosition = this.convertViewPositionToModelPosition(minLineNumber, this.getViewLineMinColumn(minLineNumber));
        var modelMaxPosition = this.convertViewPositionToModelPosition(maxLineNumber, this.getViewLineMinColumn(maxLineNumber));
        var result = this.model.getActiveIndentGuide(modelPosition.lineNumber, modelMinPosition.lineNumber, modelMaxPosition.lineNumber);
        var viewStartPosition = this.convertModelPositionToViewPosition(result.startLineNumber, 1);
        var viewEndPosition = this.convertModelPositionToViewPosition(result.endLineNumber, this.model.getLineMaxColumn(result.endLineNumber));
        return {
            startLineNumber: viewStartPosition.lineNumber,
            endLineNumber: viewEndPosition.lineNumber,
            indent: result.indent
        };
    };
    SplitLinesCollection.prototype.getViewLinesIndentGuides = function (viewStartLineNumber, viewEndLineNumber) {
        viewStartLineNumber = this._toValidViewLineNumber(viewStartLineNumber);
        viewEndLineNumber = this._toValidViewLineNumber(viewEndLineNumber);
        var modelStart = this.convertViewPositionToModelPosition(viewStartLineNumber, this.getViewLineMinColumn(viewStartLineNumber));
        var modelEnd = this.convertViewPositionToModelPosition(viewEndLineNumber, this.getViewLineMaxColumn(viewEndLineNumber));
        var result = [];
        var resultRepeatCount = [];
        var resultRepeatOption = [];
        var modelStartLineIndex = modelStart.lineNumber - 1;
        var modelEndLineIndex = modelEnd.lineNumber - 1;
        var reqStart = null;
        for (var modelLineIndex = modelStartLineIndex; modelLineIndex <= modelEndLineIndex; modelLineIndex++) {
            var line = this.lines[modelLineIndex];
            if (line.isVisible()) {
                var viewLineStartIndex = line.getViewLineNumberOfModelPosition(0, modelLineIndex === modelStartLineIndex ? modelStart.column : 1);
                var viewLineEndIndex = line.getViewLineNumberOfModelPosition(0, this.model.getLineMaxColumn(modelLineIndex + 1));
                var count = viewLineEndIndex - viewLineStartIndex + 1;
                var option = 0 /* BlockNone */;
                if (count > 1 && line.getViewLineMinColumn(this.model, modelLineIndex + 1, viewLineEndIndex) === 1) {
                    // wrapped lines should block indent guides
                    option = (viewLineStartIndex === 0 ? 1 /* BlockSubsequent */ : 2 /* BlockAll */);
                }
                resultRepeatCount.push(count);
                resultRepeatOption.push(option);
                // merge into previous request
                if (reqStart === null) {
                    reqStart = new Position(modelLineIndex + 1, 0);
                }
            }
            else {
                // hit invisible line => flush request
                if (reqStart !== null) {
                    result = result.concat(this.model.getLinesIndentGuides(reqStart.lineNumber, modelLineIndex));
                    reqStart = null;
                }
            }
        }
        if (reqStart !== null) {
            result = result.concat(this.model.getLinesIndentGuides(reqStart.lineNumber, modelEnd.lineNumber));
            reqStart = null;
        }
        var viewLineCount = viewEndLineNumber - viewStartLineNumber + 1;
        var viewIndents = new Array(viewLineCount);
        var currIndex = 0;
        for (var i = 0, len = result.length; i < len; i++) {
            var value = result[i];
            var count = Math.min(viewLineCount - currIndex, resultRepeatCount[i]);
            var option = resultRepeatOption[i];
            var blockAtIndex = void 0;
            if (option === 2 /* BlockAll */) {
                blockAtIndex = 0;
            }
            else if (option === 1 /* BlockSubsequent */) {
                blockAtIndex = 1;
            }
            else {
                blockAtIndex = count;
            }
            for (var j = 0; j < count; j++) {
                if (j === blockAtIndex) {
                    value = 0;
                }
                viewIndents[currIndex++] = value;
            }
        }
        return viewIndents;
    };
    SplitLinesCollection.prototype.getViewLineContent = function (viewLineNumber) {
        viewLineNumber = this._toValidViewLineNumber(viewLineNumber);
        var r = this.prefixSumComputer.getIndexOf(viewLineNumber - 1);
        var lineIndex = r.index;
        var remainder = r.remainder;
        return this.lines[lineIndex].getViewLineContent(this.model, lineIndex + 1, remainder);
    };
    SplitLinesCollection.prototype.getViewLineLength = function (viewLineNumber) {
        viewLineNumber = this._toValidViewLineNumber(viewLineNumber);
        var r = this.prefixSumComputer.getIndexOf(viewLineNumber - 1);
        var lineIndex = r.index;
        var remainder = r.remainder;
        return this.lines[lineIndex].getViewLineLength(this.model, lineIndex + 1, remainder);
    };
    SplitLinesCollection.prototype.getViewLineMinColumn = function (viewLineNumber) {
        viewLineNumber = this._toValidViewLineNumber(viewLineNumber);
        var r = this.prefixSumComputer.getIndexOf(viewLineNumber - 1);
        var lineIndex = r.index;
        var remainder = r.remainder;
        return this.lines[lineIndex].getViewLineMinColumn(this.model, lineIndex + 1, remainder);
    };
    SplitLinesCollection.prototype.getViewLineMaxColumn = function (viewLineNumber) {
        viewLineNumber = this._toValidViewLineNumber(viewLineNumber);
        var r = this.prefixSumComputer.getIndexOf(viewLineNumber - 1);
        var lineIndex = r.index;
        var remainder = r.remainder;
        return this.lines[lineIndex].getViewLineMaxColumn(this.model, lineIndex + 1, remainder);
    };
    SplitLinesCollection.prototype.getViewLineData = function (viewLineNumber) {
        viewLineNumber = this._toValidViewLineNumber(viewLineNumber);
        var r = this.prefixSumComputer.getIndexOf(viewLineNumber - 1);
        var lineIndex = r.index;
        var remainder = r.remainder;
        return this.lines[lineIndex].getViewLineData(this.model, lineIndex + 1, remainder);
    };
    SplitLinesCollection.prototype.getViewLinesData = function (viewStartLineNumber, viewEndLineNumber, needed) {
        viewStartLineNumber = this._toValidViewLineNumber(viewStartLineNumber);
        viewEndLineNumber = this._toValidViewLineNumber(viewEndLineNumber);
        var start = this.prefixSumComputer.getIndexOf(viewStartLineNumber - 1);
        var viewLineNumber = viewStartLineNumber;
        var startModelLineIndex = start.index;
        var startRemainder = start.remainder;
        var result = [];
        for (var modelLineIndex = startModelLineIndex, len = this.model.getLineCount(); modelLineIndex < len; modelLineIndex++) {
            var line = this.lines[modelLineIndex];
            if (!line.isVisible()) {
                continue;
            }
            var fromViewLineIndex = (modelLineIndex === startModelLineIndex ? startRemainder : 0);
            var remainingViewLineCount = line.getViewLineCount() - fromViewLineIndex;
            var lastLine = false;
            if (viewLineNumber + remainingViewLineCount > viewEndLineNumber) {
                lastLine = true;
                remainingViewLineCount = viewEndLineNumber - viewLineNumber + 1;
            }
            var toViewLineIndex = fromViewLineIndex + remainingViewLineCount;
            line.getViewLinesData(this.model, modelLineIndex + 1, fromViewLineIndex, toViewLineIndex, viewLineNumber - viewStartLineNumber, needed, result);
            viewLineNumber += remainingViewLineCount;
            if (lastLine) {
                break;
            }
        }
        return result;
    };
    SplitLinesCollection.prototype.validateViewPosition = function (viewLineNumber, viewColumn, expectedModelPosition) {
        viewLineNumber = this._toValidViewLineNumber(viewLineNumber);
        var r = this.prefixSumComputer.getIndexOf(viewLineNumber - 1);
        var lineIndex = r.index;
        var remainder = r.remainder;
        var line = this.lines[lineIndex];
        var minColumn = line.getViewLineMinColumn(this.model, lineIndex + 1, remainder);
        var maxColumn = line.getViewLineMaxColumn(this.model, lineIndex + 1, remainder);
        if (viewColumn < minColumn) {
            viewColumn = minColumn;
        }
        if (viewColumn > maxColumn) {
            viewColumn = maxColumn;
        }
        var computedModelColumn = line.getModelColumnOfViewPosition(remainder, viewColumn);
        var computedModelPosition = this.model.validatePosition(new Position(lineIndex + 1, computedModelColumn));
        if (computedModelPosition.equals(expectedModelPosition)) {
            return new Position(viewLineNumber, viewColumn);
        }
        return this.convertModelPositionToViewPosition(expectedModelPosition.lineNumber, expectedModelPosition.column);
    };
    SplitLinesCollection.prototype.validateViewRange = function (viewRange, expectedModelRange) {
        var validViewStart = this.validateViewPosition(viewRange.startLineNumber, viewRange.startColumn, expectedModelRange.getStartPosition());
        var validViewEnd = this.validateViewPosition(viewRange.endLineNumber, viewRange.endColumn, expectedModelRange.getEndPosition());
        return new Range(validViewStart.lineNumber, validViewStart.column, validViewEnd.lineNumber, validViewEnd.column);
    };
    SplitLinesCollection.prototype.convertViewPositionToModelPosition = function (viewLineNumber, viewColumn) {
        viewLineNumber = this._toValidViewLineNumber(viewLineNumber);
        var r = this.prefixSumComputer.getIndexOf(viewLineNumber - 1);
        var lineIndex = r.index;
        var remainder = r.remainder;
        var inputColumn = this.lines[lineIndex].getModelColumnOfViewPosition(remainder, viewColumn);
        // console.log('out -> in ' + viewLineNumber + ',' + viewColumn + ' ===> ' + (lineIndex+1) + ',' + inputColumn);
        return this.model.validatePosition(new Position(lineIndex + 1, inputColumn));
    };
    SplitLinesCollection.prototype.convertViewRangeToModelRange = function (viewRange) {
        var start = this.convertViewPositionToModelPosition(viewRange.startLineNumber, viewRange.startColumn);
        var end = this.convertViewPositionToModelPosition(viewRange.endLineNumber, viewRange.endColumn);
        return new Range(start.lineNumber, start.column, end.lineNumber, end.column);
    };
    SplitLinesCollection.prototype.convertModelPositionToViewPosition = function (_modelLineNumber, _modelColumn) {
        var validPosition = this.model.validatePosition(new Position(_modelLineNumber, _modelColumn));
        var inputLineNumber = validPosition.lineNumber;
        var inputColumn = validPosition.column;
        var lineIndex = inputLineNumber - 1, lineIndexChanged = false;
        while (lineIndex > 0 && !this.lines[lineIndex].isVisible()) {
            lineIndex--;
            lineIndexChanged = true;
        }
        if (lineIndex === 0 && !this.lines[lineIndex].isVisible()) {
            // Could not reach a real line
            // console.log('in -> out ' + inputLineNumber + ',' + inputColumn + ' ===> ' + 1 + ',' + 1);
            return new Position(1, 1);
        }
        var deltaLineNumber = 1 + (lineIndex === 0 ? 0 : this.prefixSumComputer.getAccumulatedValue(lineIndex - 1));
        var r;
        if (lineIndexChanged) {
            r = this.lines[lineIndex].getViewPositionOfModelPosition(deltaLineNumber, this.model.getLineMaxColumn(lineIndex + 1));
        }
        else {
            r = this.lines[inputLineNumber - 1].getViewPositionOfModelPosition(deltaLineNumber, inputColumn);
        }
        // console.log('in -> out ' + inputLineNumber + ',' + inputColumn + ' ===> ' + r.lineNumber + ',' + r);
        return r;
    };
    SplitLinesCollection.prototype.convertModelRangeToViewRange = function (modelRange) {
        var start = this.convertModelPositionToViewPosition(modelRange.startLineNumber, modelRange.startColumn);
        var end = this.convertModelPositionToViewPosition(modelRange.endLineNumber, modelRange.endColumn);
        if (modelRange.startLineNumber === modelRange.endLineNumber && start.lineNumber !== end.lineNumber) {
            // This is a single line range that ends up taking more lines due to wrapping
            if (end.column === this.getViewLineMinColumn(end.lineNumber)) {
                // the end column lands on the first column of the next line
                return new Range(start.lineNumber, start.column, end.lineNumber - 1, this.getViewLineMaxColumn(end.lineNumber - 1));
            }
        }
        return new Range(start.lineNumber, start.column, end.lineNumber, end.column);
    };
    SplitLinesCollection.prototype._getViewLineNumberForModelPosition = function (inputLineNumber, inputColumn) {
        var lineIndex = inputLineNumber - 1;
        if (this.lines[lineIndex].isVisible()) {
            // this model line is visible
            var deltaLineNumber_1 = 1 + (lineIndex === 0 ? 0 : this.prefixSumComputer.getAccumulatedValue(lineIndex - 1));
            return this.lines[lineIndex].getViewLineNumberOfModelPosition(deltaLineNumber_1, inputColumn);
        }
        // this model line is not visible
        while (lineIndex > 0 && !this.lines[lineIndex].isVisible()) {
            lineIndex--;
        }
        if (lineIndex === 0 && !this.lines[lineIndex].isVisible()) {
            // Could not reach a real line
            return 1;
        }
        var deltaLineNumber = 1 + (lineIndex === 0 ? 0 : this.prefixSumComputer.getAccumulatedValue(lineIndex - 1));
        return this.lines[lineIndex].getViewLineNumberOfModelPosition(deltaLineNumber, this.model.getLineMaxColumn(lineIndex + 1));
    };
    SplitLinesCollection.prototype.getAllOverviewRulerDecorations = function (ownerId, filterOutValidation, theme) {
        var decorations = this.model.getOverviewRulerDecorations(ownerId, filterOutValidation);
        var result = new OverviewRulerDecorations();
        for (var _i = 0, decorations_1 = decorations; _i < decorations_1.length; _i++) {
            var decoration = decorations_1[_i];
            var opts = decoration.options.overviewRuler;
            var lane = opts ? opts.position : 0;
            if (lane === 0) {
                continue;
            }
            var color = opts.getColor(theme);
            var viewStartLineNumber = this._getViewLineNumberForModelPosition(decoration.range.startLineNumber, decoration.range.startColumn);
            var viewEndLineNumber = this._getViewLineNumberForModelPosition(decoration.range.endLineNumber, decoration.range.endColumn);
            result.accept(color, viewStartLineNumber, viewEndLineNumber, lane);
        }
        return result.result;
    };
    SplitLinesCollection.prototype.getDecorationsInRange = function (range, ownerId, filterOutValidation) {
        var modelStart = this.convertViewPositionToModelPosition(range.startLineNumber, range.startColumn);
        var modelEnd = this.convertViewPositionToModelPosition(range.endLineNumber, range.endColumn);
        if (modelEnd.lineNumber - modelStart.lineNumber <= range.endLineNumber - range.startLineNumber) {
            // most likely there are no hidden lines => fast path
            // fetch decorations from column 1 to cover the case of wrapped lines that have whole line decorations at column 1
            return this.model.getDecorationsInRange(new Range(modelStart.lineNumber, 1, modelEnd.lineNumber, modelEnd.column), ownerId, filterOutValidation);
        }
        var result = [];
        var modelStartLineIndex = modelStart.lineNumber - 1;
        var modelEndLineIndex = modelEnd.lineNumber - 1;
        var reqStart = null;
        for (var modelLineIndex = modelStartLineIndex; modelLineIndex <= modelEndLineIndex; modelLineIndex++) {
            var line = this.lines[modelLineIndex];
            if (line.isVisible()) {
                // merge into previous request
                if (reqStart === null) {
                    reqStart = new Position(modelLineIndex + 1, modelLineIndex === modelStartLineIndex ? modelStart.column : 1);
                }
            }
            else {
                // hit invisible line => flush request
                if (reqStart !== null) {
                    var maxLineColumn = this.model.getLineMaxColumn(modelLineIndex);
                    result = result.concat(this.model.getDecorationsInRange(new Range(reqStart.lineNumber, reqStart.column, modelLineIndex, maxLineColumn), ownerId, filterOutValidation));
                    reqStart = null;
                }
            }
        }
        if (reqStart !== null) {
            result = result.concat(this.model.getDecorationsInRange(new Range(reqStart.lineNumber, reqStart.column, modelEnd.lineNumber, modelEnd.column), ownerId, filterOutValidation));
            reqStart = null;
        }
        result.sort(function (a, b) {
            var res = Range.compareRangesUsingStarts(a.range, b.range);
            if (res === 0) {
                if (a.id < b.id) {
                    return -1;
                }
                if (a.id > b.id) {
                    return 1;
                }
                return 0;
            }
            return res;
        });
        // Eliminate duplicate decorations that might have intersected our visible ranges multiple times
        var finalResult = [], finalResultLen = 0;
        var prevDecId = null;
        for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
            var dec = result_1[_i];
            var decId = dec.id;
            if (prevDecId === decId) {
                // skip
                continue;
            }
            prevDecId = decId;
            finalResult[finalResultLen++] = dec;
        }
        return finalResult;
    };
    return SplitLinesCollection;
}());
export { SplitLinesCollection };
var VisibleIdentitySplitLine = /** @class */ (function () {
    function VisibleIdentitySplitLine() {
    }
    VisibleIdentitySplitLine.prototype.isVisible = function () {
        return true;
    };
    VisibleIdentitySplitLine.prototype.setVisible = function (isVisible) {
        if (isVisible) {
            return this;
        }
        return InvisibleIdentitySplitLine.INSTANCE;
    };
    VisibleIdentitySplitLine.prototype.getLineBreakData = function () {
        return null;
    };
    VisibleIdentitySplitLine.prototype.getViewLineCount = function () {
        return 1;
    };
    VisibleIdentitySplitLine.prototype.getViewLineContent = function (model, modelLineNumber, _outputLineIndex) {
        return model.getLineContent(modelLineNumber);
    };
    VisibleIdentitySplitLine.prototype.getViewLineLength = function (model, modelLineNumber, _outputLineIndex) {
        return model.getLineLength(modelLineNumber);
    };
    VisibleIdentitySplitLine.prototype.getViewLineMinColumn = function (model, modelLineNumber, _outputLineIndex) {
        return model.getLineMinColumn(modelLineNumber);
    };
    VisibleIdentitySplitLine.prototype.getViewLineMaxColumn = function (model, modelLineNumber, _outputLineIndex) {
        return model.getLineMaxColumn(modelLineNumber);
    };
    VisibleIdentitySplitLine.prototype.getViewLineData = function (model, modelLineNumber, _outputLineIndex) {
        var lineTokens = model.getLineTokens(modelLineNumber);
        var lineContent = lineTokens.getLineContent();
        return new ViewLineData(lineContent, false, 1, lineContent.length + 1, 0, lineTokens.inflate());
    };
    VisibleIdentitySplitLine.prototype.getViewLinesData = function (model, modelLineNumber, _fromOuputLineIndex, _toOutputLineIndex, globalStartIndex, needed, result) {
        if (!needed[globalStartIndex]) {
            result[globalStartIndex] = null;
            return;
        }
        result[globalStartIndex] = this.getViewLineData(model, modelLineNumber, 0);
    };
    VisibleIdentitySplitLine.prototype.getModelColumnOfViewPosition = function (_outputLineIndex, outputColumn) {
        return outputColumn;
    };
    VisibleIdentitySplitLine.prototype.getViewPositionOfModelPosition = function (deltaLineNumber, inputColumn) {
        return new Position(deltaLineNumber, inputColumn);
    };
    VisibleIdentitySplitLine.prototype.getViewLineNumberOfModelPosition = function (deltaLineNumber, _inputColumn) {
        return deltaLineNumber;
    };
    VisibleIdentitySplitLine.INSTANCE = new VisibleIdentitySplitLine();
    return VisibleIdentitySplitLine;
}());
var InvisibleIdentitySplitLine = /** @class */ (function () {
    function InvisibleIdentitySplitLine() {
    }
    InvisibleIdentitySplitLine.prototype.isVisible = function () {
        return false;
    };
    InvisibleIdentitySplitLine.prototype.setVisible = function (isVisible) {
        if (!isVisible) {
            return this;
        }
        return VisibleIdentitySplitLine.INSTANCE;
    };
    InvisibleIdentitySplitLine.prototype.getLineBreakData = function () {
        return null;
    };
    InvisibleIdentitySplitLine.prototype.getViewLineCount = function () {
        return 0;
    };
    InvisibleIdentitySplitLine.prototype.getViewLineContent = function (_model, _modelLineNumber, _outputLineIndex) {
        throw new Error('Not supported');
    };
    InvisibleIdentitySplitLine.prototype.getViewLineLength = function (_model, _modelLineNumber, _outputLineIndex) {
        throw new Error('Not supported');
    };
    InvisibleIdentitySplitLine.prototype.getViewLineMinColumn = function (_model, _modelLineNumber, _outputLineIndex) {
        throw new Error('Not supported');
    };
    InvisibleIdentitySplitLine.prototype.getViewLineMaxColumn = function (_model, _modelLineNumber, _outputLineIndex) {
        throw new Error('Not supported');
    };
    InvisibleIdentitySplitLine.prototype.getViewLineData = function (_model, _modelLineNumber, _outputLineIndex) {
        throw new Error('Not supported');
    };
    InvisibleIdentitySplitLine.prototype.getViewLinesData = function (_model, _modelLineNumber, _fromOuputLineIndex, _toOutputLineIndex, _globalStartIndex, _needed, _result) {
        throw new Error('Not supported');
    };
    InvisibleIdentitySplitLine.prototype.getModelColumnOfViewPosition = function (_outputLineIndex, _outputColumn) {
        throw new Error('Not supported');
    };
    InvisibleIdentitySplitLine.prototype.getViewPositionOfModelPosition = function (_deltaLineNumber, _inputColumn) {
        throw new Error('Not supported');
    };
    InvisibleIdentitySplitLine.prototype.getViewLineNumberOfModelPosition = function (_deltaLineNumber, _inputColumn) {
        throw new Error('Not supported');
    };
    InvisibleIdentitySplitLine.INSTANCE = new InvisibleIdentitySplitLine();
    return InvisibleIdentitySplitLine;
}());
var SplitLine = /** @class */ (function () {
    function SplitLine(lineBreakData, isVisible) {
        this._lineBreakData = lineBreakData;
        this._isVisible = isVisible;
    }
    SplitLine.prototype.isVisible = function () {
        return this._isVisible;
    };
    SplitLine.prototype.setVisible = function (isVisible) {
        this._isVisible = isVisible;
        return this;
    };
    SplitLine.prototype.getLineBreakData = function () {
        return this._lineBreakData;
    };
    SplitLine.prototype.getViewLineCount = function () {
        if (!this._isVisible) {
            return 0;
        }
        return this._lineBreakData.breakOffsets.length;
    };
    SplitLine.prototype.getInputStartOffsetOfOutputLineIndex = function (outputLineIndex) {
        return LineBreakData.getInputOffsetOfOutputPosition(this._lineBreakData.breakOffsets, outputLineIndex, 0);
    };
    SplitLine.prototype.getInputEndOffsetOfOutputLineIndex = function (model, modelLineNumber, outputLineIndex) {
        if (outputLineIndex + 1 === this._lineBreakData.breakOffsets.length) {
            return model.getLineMaxColumn(modelLineNumber) - 1;
        }
        return LineBreakData.getInputOffsetOfOutputPosition(this._lineBreakData.breakOffsets, outputLineIndex + 1, 0);
    };
    SplitLine.prototype.getViewLineContent = function (model, modelLineNumber, outputLineIndex) {
        if (!this._isVisible) {
            throw new Error('Not supported');
        }
        var startOffset = this.getInputStartOffsetOfOutputLineIndex(outputLineIndex);
        var endOffset = this.getInputEndOffsetOfOutputLineIndex(model, modelLineNumber, outputLineIndex);
        var r = model.getValueInRange({
            startLineNumber: modelLineNumber,
            startColumn: startOffset + 1,
            endLineNumber: modelLineNumber,
            endColumn: endOffset + 1
        });
        if (outputLineIndex > 0) {
            r = spaces(this._lineBreakData.wrappedTextIndentLength) + r;
        }
        return r;
    };
    SplitLine.prototype.getViewLineLength = function (model, modelLineNumber, outputLineIndex) {
        if (!this._isVisible) {
            throw new Error('Not supported');
        }
        var startOffset = this.getInputStartOffsetOfOutputLineIndex(outputLineIndex);
        var endOffset = this.getInputEndOffsetOfOutputLineIndex(model, modelLineNumber, outputLineIndex);
        var r = endOffset - startOffset;
        if (outputLineIndex > 0) {
            r = this._lineBreakData.wrappedTextIndentLength + r;
        }
        return r;
    };
    SplitLine.prototype.getViewLineMinColumn = function (_model, _modelLineNumber, outputLineIndex) {
        if (!this._isVisible) {
            throw new Error('Not supported');
        }
        if (outputLineIndex > 0) {
            return this._lineBreakData.wrappedTextIndentLength + 1;
        }
        return 1;
    };
    SplitLine.prototype.getViewLineMaxColumn = function (model, modelLineNumber, outputLineIndex) {
        if (!this._isVisible) {
            throw new Error('Not supported');
        }
        return this.getViewLineContent(model, modelLineNumber, outputLineIndex).length + 1;
    };
    SplitLine.prototype.getViewLineData = function (model, modelLineNumber, outputLineIndex) {
        if (!this._isVisible) {
            throw new Error('Not supported');
        }
        var startOffset = this.getInputStartOffsetOfOutputLineIndex(outputLineIndex);
        var endOffset = this.getInputEndOffsetOfOutputLineIndex(model, modelLineNumber, outputLineIndex);
        var lineContent = model.getValueInRange({
            startLineNumber: modelLineNumber,
            startColumn: startOffset + 1,
            endLineNumber: modelLineNumber,
            endColumn: endOffset + 1
        });
        if (outputLineIndex > 0) {
            lineContent = spaces(this._lineBreakData.wrappedTextIndentLength) + lineContent;
        }
        var minColumn = (outputLineIndex > 0 ? this._lineBreakData.wrappedTextIndentLength + 1 : 1);
        var maxColumn = lineContent.length + 1;
        var continuesWithWrappedLine = (outputLineIndex + 1 < this.getViewLineCount());
        var deltaStartIndex = 0;
        if (outputLineIndex > 0) {
            deltaStartIndex = this._lineBreakData.wrappedTextIndentLength;
        }
        var lineTokens = model.getLineTokens(modelLineNumber);
        var startVisibleColumn = (outputLineIndex === 0 ? 0 : this._lineBreakData.breakOffsetsVisibleColumn[outputLineIndex - 1]);
        return new ViewLineData(lineContent, continuesWithWrappedLine, minColumn, maxColumn, startVisibleColumn, lineTokens.sliceAndInflate(startOffset, endOffset, deltaStartIndex));
    };
    SplitLine.prototype.getViewLinesData = function (model, modelLineNumber, fromOuputLineIndex, toOutputLineIndex, globalStartIndex, needed, result) {
        if (!this._isVisible) {
            throw new Error('Not supported');
        }
        for (var outputLineIndex = fromOuputLineIndex; outputLineIndex < toOutputLineIndex; outputLineIndex++) {
            var globalIndex = globalStartIndex + outputLineIndex - fromOuputLineIndex;
            if (!needed[globalIndex]) {
                result[globalIndex] = null;
                continue;
            }
            result[globalIndex] = this.getViewLineData(model, modelLineNumber, outputLineIndex);
        }
    };
    SplitLine.prototype.getModelColumnOfViewPosition = function (outputLineIndex, outputColumn) {
        if (!this._isVisible) {
            throw new Error('Not supported');
        }
        var adjustedColumn = outputColumn - 1;
        if (outputLineIndex > 0) {
            if (adjustedColumn < this._lineBreakData.wrappedTextIndentLength) {
                adjustedColumn = 0;
            }
            else {
                adjustedColumn -= this._lineBreakData.wrappedTextIndentLength;
            }
        }
        return LineBreakData.getInputOffsetOfOutputPosition(this._lineBreakData.breakOffsets, outputLineIndex, adjustedColumn) + 1;
    };
    SplitLine.prototype.getViewPositionOfModelPosition = function (deltaLineNumber, inputColumn) {
        if (!this._isVisible) {
            throw new Error('Not supported');
        }
        var r = LineBreakData.getOutputPositionOfInputOffset(this._lineBreakData.breakOffsets, inputColumn - 1);
        var outputLineIndex = r.outputLineIndex;
        var outputColumn = r.outputOffset + 1;
        if (outputLineIndex > 0) {
            outputColumn += this._lineBreakData.wrappedTextIndentLength;
        }
        //		console.log('in -> out ' + deltaLineNumber + ',' + inputColumn + ' ===> ' + (deltaLineNumber+outputLineIndex) + ',' + outputColumn);
        return new Position(deltaLineNumber + outputLineIndex, outputColumn);
    };
    SplitLine.prototype.getViewLineNumberOfModelPosition = function (deltaLineNumber, inputColumn) {
        if (!this._isVisible) {
            throw new Error('Not supported');
        }
        var r = LineBreakData.getOutputPositionOfInputOffset(this._lineBreakData.breakOffsets, inputColumn - 1);
        return (deltaLineNumber + r.outputLineIndex);
    };
    return SplitLine;
}());
export { SplitLine };
var _spaces = [''];
function spaces(count) {
    if (count >= _spaces.length) {
        for (var i = 1; i <= count; i++) {
            _spaces[i] = _makeSpaces(i);
        }
    }
    return _spaces[count];
}
function _makeSpaces(count) {
    return new Array(count + 1).join(' ');
}
function createSplitLine(lineBreakData, isVisible) {
    if (lineBreakData === null) {
        // No mapping needed
        if (isVisible) {
            return VisibleIdentitySplitLine.INSTANCE;
        }
        return InvisibleIdentitySplitLine.INSTANCE;
    }
    else {
        return new SplitLine(lineBreakData, isVisible);
    }
}
var IdentityCoordinatesConverter = /** @class */ (function () {
    function IdentityCoordinatesConverter(lines) {
        this._lines = lines;
    }
    IdentityCoordinatesConverter.prototype._validPosition = function (pos) {
        return this._lines.model.validatePosition(pos);
    };
    IdentityCoordinatesConverter.prototype._validRange = function (range) {
        return this._lines.model.validateRange(range);
    };
    // View -> Model conversion and related methods
    IdentityCoordinatesConverter.prototype.convertViewPositionToModelPosition = function (viewPosition) {
        return this._validPosition(viewPosition);
    };
    IdentityCoordinatesConverter.prototype.convertViewRangeToModelRange = function (viewRange) {
        return this._validRange(viewRange);
    };
    IdentityCoordinatesConverter.prototype.validateViewPosition = function (_viewPosition, expectedModelPosition) {
        return this._validPosition(expectedModelPosition);
    };
    IdentityCoordinatesConverter.prototype.validateViewRange = function (_viewRange, expectedModelRange) {
        return this._validRange(expectedModelRange);
    };
    // Model -> View conversion and related methods
    IdentityCoordinatesConverter.prototype.convertModelPositionToViewPosition = function (modelPosition) {
        return this._validPosition(modelPosition);
    };
    IdentityCoordinatesConverter.prototype.convertModelRangeToViewRange = function (modelRange) {
        return this._validRange(modelRange);
    };
    IdentityCoordinatesConverter.prototype.modelPositionIsVisible = function (modelPosition) {
        var lineCount = this._lines.model.getLineCount();
        if (modelPosition.lineNumber < 1 || modelPosition.lineNumber > lineCount) {
            // invalid arguments
            return false;
        }
        return true;
    };
    return IdentityCoordinatesConverter;
}());
export { IdentityCoordinatesConverter };
var IdentityLinesCollection = /** @class */ (function () {
    function IdentityLinesCollection(model) {
        this.model = model;
    }
    IdentityLinesCollection.prototype.dispose = function () {
    };
    IdentityLinesCollection.prototype.createCoordinatesConverter = function () {
        return new IdentityCoordinatesConverter(this);
    };
    IdentityLinesCollection.prototype.getHiddenAreas = function () {
        return [];
    };
    IdentityLinesCollection.prototype.setHiddenAreas = function (_ranges) {
        return false;
    };
    IdentityLinesCollection.prototype.setTabSize = function (_newTabSize) {
        return false;
    };
    IdentityLinesCollection.prototype.setWrappingSettings = function (_fontInfo, _wrappingStrategy, _wrappingColumn, _wrappingIndent) {
        return false;
    };
    IdentityLinesCollection.prototype.createLineBreaksComputer = function () {
        var result = [];
        return {
            addRequest: function (lineText, previousLineBreakData) {
                result.push(null);
            },
            finalize: function () {
                return result;
            }
        };
    };
    IdentityLinesCollection.prototype.onModelFlushed = function () {
    };
    IdentityLinesCollection.prototype.onModelLinesDeleted = function (_versionId, fromLineNumber, toLineNumber) {
        return new viewEvents.ViewLinesDeletedEvent(fromLineNumber, toLineNumber);
    };
    IdentityLinesCollection.prototype.onModelLinesInserted = function (_versionId, fromLineNumber, toLineNumber, lineBreaks) {
        return new viewEvents.ViewLinesInsertedEvent(fromLineNumber, toLineNumber);
    };
    IdentityLinesCollection.prototype.onModelLineChanged = function (_versionId, lineNumber, lineBreakData) {
        return [false, new viewEvents.ViewLinesChangedEvent(lineNumber, lineNumber), null, null];
    };
    IdentityLinesCollection.prototype.acceptVersionId = function (_versionId) {
    };
    IdentityLinesCollection.prototype.getViewLineCount = function () {
        return this.model.getLineCount();
    };
    IdentityLinesCollection.prototype.getActiveIndentGuide = function (viewLineNumber, _minLineNumber, _maxLineNumber) {
        return {
            startLineNumber: viewLineNumber,
            endLineNumber: viewLineNumber,
            indent: 0
        };
    };
    IdentityLinesCollection.prototype.getViewLinesIndentGuides = function (viewStartLineNumber, viewEndLineNumber) {
        var viewLineCount = viewEndLineNumber - viewStartLineNumber + 1;
        var result = new Array(viewLineCount);
        for (var i = 0; i < viewLineCount; i++) {
            result[i] = 0;
        }
        return result;
    };
    IdentityLinesCollection.prototype.getViewLineContent = function (viewLineNumber) {
        return this.model.getLineContent(viewLineNumber);
    };
    IdentityLinesCollection.prototype.getViewLineLength = function (viewLineNumber) {
        return this.model.getLineLength(viewLineNumber);
    };
    IdentityLinesCollection.prototype.getViewLineMinColumn = function (viewLineNumber) {
        return this.model.getLineMinColumn(viewLineNumber);
    };
    IdentityLinesCollection.prototype.getViewLineMaxColumn = function (viewLineNumber) {
        return this.model.getLineMaxColumn(viewLineNumber);
    };
    IdentityLinesCollection.prototype.getViewLineData = function (viewLineNumber) {
        var lineTokens = this.model.getLineTokens(viewLineNumber);
        var lineContent = lineTokens.getLineContent();
        return new ViewLineData(lineContent, false, 1, lineContent.length + 1, 0, lineTokens.inflate());
    };
    IdentityLinesCollection.prototype.getViewLinesData = function (viewStartLineNumber, viewEndLineNumber, needed) {
        var lineCount = this.model.getLineCount();
        viewStartLineNumber = Math.min(Math.max(1, viewStartLineNumber), lineCount);
        viewEndLineNumber = Math.min(Math.max(1, viewEndLineNumber), lineCount);
        var result = [];
        for (var lineNumber = viewStartLineNumber; lineNumber <= viewEndLineNumber; lineNumber++) {
            var idx = lineNumber - viewStartLineNumber;
            if (!needed[idx]) {
                result[idx] = null;
            }
            result[idx] = this.getViewLineData(lineNumber);
        }
        return result;
    };
    IdentityLinesCollection.prototype.getAllOverviewRulerDecorations = function (ownerId, filterOutValidation, theme) {
        var decorations = this.model.getOverviewRulerDecorations(ownerId, filterOutValidation);
        var result = new OverviewRulerDecorations();
        for (var _i = 0, decorations_2 = decorations; _i < decorations_2.length; _i++) {
            var decoration = decorations_2[_i];
            var opts = decoration.options.overviewRuler;
            var lane = opts ? opts.position : 0;
            if (lane === 0) {
                continue;
            }
            var color = opts.getColor(theme);
            var viewStartLineNumber = decoration.range.startLineNumber;
            var viewEndLineNumber = decoration.range.endLineNumber;
            result.accept(color, viewStartLineNumber, viewEndLineNumber, lane);
        }
        return result.result;
    };
    IdentityLinesCollection.prototype.getDecorationsInRange = function (range, ownerId, filterOutValidation) {
        return this.model.getDecorationsInRange(range, ownerId, filterOutValidation);
    };
    return IdentityLinesCollection;
}());
export { IdentityLinesCollection };
var OverviewRulerDecorations = /** @class */ (function () {
    function OverviewRulerDecorations() {
        this.result = Object.create(null);
    }
    OverviewRulerDecorations.prototype.accept = function (color, startLineNumber, endLineNumber, lane) {
        var prev = this.result[color];
        if (prev) {
            var prevLane = prev[prev.length - 3];
            var prevEndLineNumber = prev[prev.length - 1];
            if (prevLane === lane && prevEndLineNumber + 1 >= startLineNumber) {
                // merge into prev
                if (endLineNumber > prevEndLineNumber) {
                    prev[prev.length - 1] = endLineNumber;
                }
                return;
            }
            // push
            prev.push(lane, startLineNumber, endLineNumber);
        }
        else {
            this.result[color] = [lane, startLineNumber, endLineNumber];
        }
    };
    return OverviewRulerDecorations;
}());
