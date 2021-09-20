/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import './goToDefinitionAtPosition.css';
import * as nls from '../../../../nls.js';
import { createCancelablePromise } from '../../../../base/common/async.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { IModeService } from '../../../common/services/modeService.js';
import { Range } from '../../../common/core/range.js';
import { DefinitionProviderRegistry } from '../../../common/modes.js';
import { registerEditorContribution } from '../../../browser/editorExtensions.js';
import { getDefinitionsAtPosition } from '../goToSymbol.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { ITextModelService } from '../../../common/services/resolverService.js';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { editorActiveLinkForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { EditorState } from '../../../browser/core/editorState.js';
import { DefinitionAction } from '../goToCommands.js';
import { ClickLinkGesture } from './clickLinkGesture.js';
import { Position } from '../../../common/core/position.js';
import { withNullAsUndefined } from '../../../../base/common/types.js';
var GotoDefinitionAtPositionEditorContribution = /** @class */ (function () {
    function GotoDefinitionAtPositionEditorContribution(editor, textModelResolverService, modeService) {
        var _this = this;
        this.textModelResolverService = textModelResolverService;
        this.modeService = modeService;
        this.toUnhook = new DisposableStore();
        this.toUnhookForKeyboard = new DisposableStore();
        this.linkDecorations = [];
        this.currentWordAtPosition = null;
        this.previousPromise = null;
        this.editor = editor;
        var linkGesture = new ClickLinkGesture(editor);
        this.toUnhook.add(linkGesture);
        this.toUnhook.add(linkGesture.onMouseMoveOrRelevantKeyDown(function (_a) {
            var mouseEvent = _a[0], keyboardEvent = _a[1];
            _this.startFindDefinitionFromMouse(mouseEvent, withNullAsUndefined(keyboardEvent));
        }));
        this.toUnhook.add(linkGesture.onExecute(function (mouseEvent) {
            if (_this.isEnabled(mouseEvent)) {
                _this.gotoDefinition(mouseEvent.target.position, mouseEvent.hasSideBySideModifier).then(function () {
                    _this.removeLinkDecorations();
                }, function (error) {
                    _this.removeLinkDecorations();
                    onUnexpectedError(error);
                });
            }
        }));
        this.toUnhook.add(linkGesture.onCancel(function () {
            _this.removeLinkDecorations();
            _this.currentWordAtPosition = null;
        }));
    }
    GotoDefinitionAtPositionEditorContribution.get = function (editor) {
        return editor.getContribution(GotoDefinitionAtPositionEditorContribution.ID);
    };
    GotoDefinitionAtPositionEditorContribution.prototype.startFindDefinitionFromCursor = function (position) {
        // For issue: https://github.com/microsoft/vscode/issues/46257
        // equivalent to mouse move with meta/ctrl key
        var _this = this;
        // First find the definition and add decorations
        // to the editor to be shown with the content hover widget
        return this.startFindDefinition(position).then(function () {
            // Add listeners for editor cursor move and key down events
            // Dismiss the "extended" editor decorations when the user hides
            // the hover widget. There is no event for the widget itself so these
            // serve as a best effort. After removing the link decorations, the hover
            // widget is clean and will only show declarations per next request.
            _this.toUnhookForKeyboard.add(_this.editor.onDidChangeCursorPosition(function () {
                _this.currentWordAtPosition = null;
                _this.removeLinkDecorations();
                _this.toUnhookForKeyboard.clear();
            }));
            _this.toUnhookForKeyboard.add(_this.editor.onKeyDown(function (e) {
                if (e) {
                    _this.currentWordAtPosition = null;
                    _this.removeLinkDecorations();
                    _this.toUnhookForKeyboard.clear();
                }
            }));
        });
    };
    GotoDefinitionAtPositionEditorContribution.prototype.startFindDefinitionFromMouse = function (mouseEvent, withKey) {
        // check if we are active and on a content widget
        if (mouseEvent.target.type === 9 /* CONTENT_WIDGET */ && this.linkDecorations.length > 0) {
            return;
        }
        if (!this.editor.hasModel() || !this.isEnabled(mouseEvent, withKey)) {
            this.currentWordAtPosition = null;
            this.removeLinkDecorations();
            return;
        }
        var position = mouseEvent.target.position;
        this.startFindDefinition(position);
    };
    GotoDefinitionAtPositionEditorContribution.prototype.startFindDefinition = function (position) {
        var _this = this;
        var _a;
        // Dispose listeners for updating decorations when using keyboard to show definition hover
        this.toUnhookForKeyboard.clear();
        // Find word at mouse position
        var word = position ? (_a = this.editor.getModel()) === null || _a === void 0 ? void 0 : _a.getWordAtPosition(position) : null;
        if (!word) {
            this.currentWordAtPosition = null;
            this.removeLinkDecorations();
            return Promise.resolve(0);
        }
        // Return early if word at position is still the same
        if (this.currentWordAtPosition && this.currentWordAtPosition.startColumn === word.startColumn && this.currentWordAtPosition.endColumn === word.endColumn && this.currentWordAtPosition.word === word.word) {
            return Promise.resolve(0);
        }
        this.currentWordAtPosition = word;
        // Find definition and decorate word if found
        var state = new EditorState(this.editor, 4 /* Position */ | 1 /* Value */ | 2 /* Selection */ | 8 /* Scroll */);
        if (this.previousPromise) {
            this.previousPromise.cancel();
            this.previousPromise = null;
        }
        this.previousPromise = createCancelablePromise(function (token) { return _this.findDefinition(position, token); });
        return this.previousPromise.then(function (results) {
            if (!results || !results.length || !state.validate(_this.editor)) {
                _this.removeLinkDecorations();
                return;
            }
            // Multiple results
            if (results.length > 1) {
                _this.addDecoration(new Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn), new MarkdownString().appendText(nls.localize('multipleResults', "Click to show {0} definitions.", results.length)));
            }
            // Single result
            else {
                var result_1 = results[0];
                if (!result_1.uri) {
                    return;
                }
                _this.textModelResolverService.createModelReference(result_1.uri).then(function (ref) {
                    if (!ref.object || !ref.object.textEditorModel) {
                        ref.dispose();
                        return;
                    }
                    var textEditorModel = ref.object.textEditorModel;
                    var startLineNumber = result_1.range.startLineNumber;
                    if (startLineNumber < 1 || startLineNumber > textEditorModel.getLineCount()) {
                        // invalid range
                        ref.dispose();
                        return;
                    }
                    var previewValue = _this.getPreviewValue(textEditorModel, startLineNumber, result_1);
                    var wordRange;
                    if (result_1.originSelectionRange) {
                        wordRange = Range.lift(result_1.originSelectionRange);
                    }
                    else {
                        wordRange = new Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn);
                    }
                    var modeId = _this.modeService.getModeIdByFilepathOrFirstLine(textEditorModel.uri);
                    _this.addDecoration(wordRange, new MarkdownString().appendCodeblock(modeId ? modeId : '', previewValue));
                    ref.dispose();
                });
            }
        }).then(undefined, onUnexpectedError);
    };
    GotoDefinitionAtPositionEditorContribution.prototype.getPreviewValue = function (textEditorModel, startLineNumber, result) {
        var rangeToUse = result.targetSelectionRange ? result.range : this.getPreviewRangeBasedOnBrackets(textEditorModel, startLineNumber);
        var numberOfLinesInRange = rangeToUse.endLineNumber - rangeToUse.startLineNumber;
        if (numberOfLinesInRange >= GotoDefinitionAtPositionEditorContribution.MAX_SOURCE_PREVIEW_LINES) {
            rangeToUse = this.getPreviewRangeBasedOnIndentation(textEditorModel, startLineNumber);
        }
        var previewValue = this.stripIndentationFromPreviewRange(textEditorModel, startLineNumber, rangeToUse);
        return previewValue;
    };
    GotoDefinitionAtPositionEditorContribution.prototype.stripIndentationFromPreviewRange = function (textEditorModel, startLineNumber, previewRange) {
        var startIndent = textEditorModel.getLineFirstNonWhitespaceColumn(startLineNumber);
        var minIndent = startIndent;
        for (var endLineNumber = startLineNumber + 1; endLineNumber < previewRange.endLineNumber; endLineNumber++) {
            var endIndent = textEditorModel.getLineFirstNonWhitespaceColumn(endLineNumber);
            minIndent = Math.min(minIndent, endIndent);
        }
        var previewValue = textEditorModel.getValueInRange(previewRange).replace(new RegExp("^\\s{" + (minIndent - 1) + "}", 'gm'), '').trim();
        return previewValue;
    };
    GotoDefinitionAtPositionEditorContribution.prototype.getPreviewRangeBasedOnIndentation = function (textEditorModel, startLineNumber) {
        var startIndent = textEditorModel.getLineFirstNonWhitespaceColumn(startLineNumber);
        var maxLineNumber = Math.min(textEditorModel.getLineCount(), startLineNumber + GotoDefinitionAtPositionEditorContribution.MAX_SOURCE_PREVIEW_LINES);
        var endLineNumber = startLineNumber + 1;
        for (; endLineNumber < maxLineNumber; endLineNumber++) {
            var endIndent = textEditorModel.getLineFirstNonWhitespaceColumn(endLineNumber);
            if (startIndent === endIndent) {
                break;
            }
        }
        return new Range(startLineNumber, 1, endLineNumber + 1, 1);
    };
    GotoDefinitionAtPositionEditorContribution.prototype.getPreviewRangeBasedOnBrackets = function (textEditorModel, startLineNumber) {
        var maxLineNumber = Math.min(textEditorModel.getLineCount(), startLineNumber + GotoDefinitionAtPositionEditorContribution.MAX_SOURCE_PREVIEW_LINES);
        var brackets = [];
        var ignoreFirstEmpty = true;
        var currentBracket = textEditorModel.findNextBracket(new Position(startLineNumber, 1));
        while (currentBracket !== null) {
            if (brackets.length === 0) {
                brackets.push(currentBracket);
            }
            else {
                var lastBracket = brackets[brackets.length - 1];
                if (lastBracket.open[0] === currentBracket.open[0] && lastBracket.isOpen && !currentBracket.isOpen) {
                    brackets.pop();
                }
                else {
                    brackets.push(currentBracket);
                }
                if (brackets.length === 0) {
                    if (ignoreFirstEmpty) {
                        ignoreFirstEmpty = false;
                    }
                    else {
                        return new Range(startLineNumber, 1, currentBracket.range.endLineNumber + 1, 1);
                    }
                }
            }
            var maxColumn = textEditorModel.getLineMaxColumn(startLineNumber);
            var nextLineNumber = currentBracket.range.endLineNumber;
            var nextColumn = currentBracket.range.endColumn;
            if (maxColumn === currentBracket.range.endColumn) {
                nextLineNumber++;
                nextColumn = 1;
            }
            if (nextLineNumber > maxLineNumber) {
                return new Range(startLineNumber, 1, maxLineNumber + 1, 1);
            }
            currentBracket = textEditorModel.findNextBracket(new Position(nextLineNumber, nextColumn));
        }
        return new Range(startLineNumber, 1, maxLineNumber + 1, 1);
    };
    GotoDefinitionAtPositionEditorContribution.prototype.addDecoration = function (range, hoverMessage) {
        var newDecorations = {
            range: range,
            options: {
                inlineClassName: 'goto-definition-link',
                hoverMessage: hoverMessage
            }
        };
        this.linkDecorations = this.editor.deltaDecorations(this.linkDecorations, [newDecorations]);
    };
    GotoDefinitionAtPositionEditorContribution.prototype.removeLinkDecorations = function () {
        if (this.linkDecorations.length > 0) {
            this.linkDecorations = this.editor.deltaDecorations(this.linkDecorations, []);
        }
    };
    GotoDefinitionAtPositionEditorContribution.prototype.isEnabled = function (mouseEvent, withKey) {
        return this.editor.hasModel() &&
            mouseEvent.isNoneOrSingleMouseDown &&
            (mouseEvent.target.type === 6 /* CONTENT_TEXT */) &&
            (mouseEvent.hasTriggerModifier || (withKey ? withKey.keyCodeIsTriggerKey : false)) &&
            DefinitionProviderRegistry.has(this.editor.getModel());
    };
    GotoDefinitionAtPositionEditorContribution.prototype.findDefinition = function (position, token) {
        var model = this.editor.getModel();
        if (!model) {
            return Promise.resolve(null);
        }
        return getDefinitionsAtPosition(model, position, token);
    };
    GotoDefinitionAtPositionEditorContribution.prototype.gotoDefinition = function (position, openToSide) {
        var _this = this;
        this.editor.setPosition(position);
        var action = new DefinitionAction({ openToSide: openToSide, openInPeek: false, muteMessage: true }, { alias: '', label: '', id: '', precondition: undefined });
        return this.editor.invokeWithinContext(function (accessor) { return action.run(accessor, _this.editor); });
    };
    GotoDefinitionAtPositionEditorContribution.prototype.dispose = function () {
        this.toUnhook.dispose();
    };
    GotoDefinitionAtPositionEditorContribution.ID = 'editor.contrib.gotodefinitionatposition';
    GotoDefinitionAtPositionEditorContribution.MAX_SOURCE_PREVIEW_LINES = 8;
    GotoDefinitionAtPositionEditorContribution = __decorate([
        __param(1, ITextModelService),
        __param(2, IModeService)
    ], GotoDefinitionAtPositionEditorContribution);
    return GotoDefinitionAtPositionEditorContribution;
}());
export { GotoDefinitionAtPositionEditorContribution };
registerEditorContribution(GotoDefinitionAtPositionEditorContribution.ID, GotoDefinitionAtPositionEditorContribution);
registerThemingParticipant(function (theme, collector) {
    var activeLinkForeground = theme.getColor(editorActiveLinkForeground);
    if (activeLinkForeground) {
        collector.addRule(".monaco-editor .goto-definition-link { color: " + activeLinkForeground + " !important; }");
    }
});
