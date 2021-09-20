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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { alert } from '../../../base/browser/ui/aria/aria.js';
import { isNonEmptyArray } from '../../../base/common/arrays.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { SimpleKeybinding } from '../../../base/common/keyCodes.js';
import { dispose, DisposableStore, toDisposable, MutableDisposable } from '../../../base/common/lifecycle.js';
import { EditorAction, EditorCommand, registerEditorAction, registerEditorCommand, registerEditorContribution } from '../../browser/editorExtensions.js';
import { EditOperation } from '../../common/core/editOperation.js';
import { Range } from '../../common/core/range.js';
import { EditorContextKeys } from '../../common/editorContextKeys.js';
import { SnippetController2 } from '../snippet/snippetController2.js';
import { SnippetParser } from '../snippet/snippetParser.js';
import { ISuggestMemoryService } from './suggestMemory.js';
import * as nls from '../../../nls.js';
import { ICommandService, CommandsRegistry } from '../../../platform/commands/common/commands.js';
import { ContextKeyExpr, IContextKeyService } from '../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { KeybindingsRegistry } from '../../../platform/keybinding/common/keybindingsRegistry.js';
import { Context as SuggestContext } from './suggest.js';
import { SuggestAlternatives } from './suggestAlternatives.js';
import { SuggestModel } from './suggestModel.js';
import { SuggestWidget } from './suggestWidget.js';
import { WordContextKey } from './wordContextKey.js';
import { Event } from '../../../base/common/event.js';
import { IEditorWorkerService } from '../../common/services/editorWorkerService.js';
import { IdleValue } from '../../../base/common/async.js';
import { isObject, assertType } from '../../../base/common/types.js';
import { CommitCharacterController } from './suggestCommitCharacters.js';
import * as platform from '../../../base/common/platform.js';
import { SuggestRangeHighlighter } from './suggestRangeHighlighter.js';
/**
 * Stop suggest widget from disappearing when clicking into other areas
 * For development purpose only
 */
var _sticky = false;
var LineSuffix = /** @class */ (function () {
    function LineSuffix(_model, _position) {
        this._model = _model;
        this._position = _position;
        // spy on what's happening right of the cursor. two cases:
        // 1. end of line -> check that it's still end of line
        // 2. mid of line -> add a marker and compute the delta
        var maxColumn = _model.getLineMaxColumn(_position.lineNumber);
        if (maxColumn !== _position.column) {
            var offset = _model.getOffsetAt(_position);
            var end = _model.getPositionAt(offset + 1);
            this._marker = _model.deltaDecorations([], [{
                    range: Range.fromPositions(_position, end),
                    options: { stickiness: 1 /* NeverGrowsWhenTypingAtEdges */ }
                }]);
        }
    }
    LineSuffix.prototype.dispose = function () {
        if (this._marker && !this._model.isDisposed()) {
            this._model.deltaDecorations(this._marker, []);
        }
    };
    LineSuffix.prototype.delta = function (position) {
        if (this._model.isDisposed() || this._position.lineNumber !== position.lineNumber) {
            // bail out early if things seems fishy
            return 0;
        }
        // read the marker (in case suggest was triggered at line end) or compare
        // the cursor to the line end.
        if (this._marker) {
            var range = this._model.getDecorationRange(this._marker[0]);
            var end = this._model.getOffsetAt(range.getStartPosition());
            return end - this._model.getOffsetAt(position);
        }
        else {
            return this._model.getLineMaxColumn(position.lineNumber) - position.column;
        }
    };
    return LineSuffix;
}());
var SuggestController = /** @class */ (function () {
    function SuggestController(editor, editorWorker, _memoryService, _commandService, _contextKeyService, _instantiationService) {
        var _this = this;
        this._memoryService = _memoryService;
        this._commandService = _commandService;
        this._contextKeyService = _contextKeyService;
        this._instantiationService = _instantiationService;
        this._lineSuffix = new MutableDisposable();
        this._toDispose = new DisposableStore();
        this.editor = editor;
        this.model = new SuggestModel(this.editor, editorWorker);
        this.widget = this._toDispose.add(new IdleValue(function () {
            var widget = _this._instantiationService.createInstance(SuggestWidget, _this.editor);
            _this._toDispose.add(widget);
            _this._toDispose.add(widget.onDidSelect(function (item) { return _this._insertSuggestion(item, 0); }, _this));
            // Wire up logic to accept a suggestion on certain characters
            var commitCharacterController = new CommitCharacterController(_this.editor, widget, function (item) { return _this._insertSuggestion(item, 2 /* NoAfterUndoStop */); });
            _this._toDispose.add(commitCharacterController);
            _this._toDispose.add(_this.model.onDidSuggest(function (e) {
                if (e.completionModel.items.length === 0) {
                    commitCharacterController.reset();
                }
            }));
            // Wire up makes text edit context key
            var makesTextEdit = SuggestContext.MakesTextEdit.bindTo(_this._contextKeyService);
            _this._toDispose.add(widget.onDidFocus(function (_a) {
                var item = _a.item;
                var position = _this.editor.getPosition();
                var startColumn = item.editStart.column;
                var endColumn = position.column;
                var value = true;
                if (_this.editor.getOption(1 /* acceptSuggestionOnEnter */) === 'smart'
                    && _this.model.state === 2 /* Auto */
                    && !item.completion.command
                    && !item.completion.additionalTextEdits
                    && !(item.completion.insertTextRules & 4 /* InsertAsSnippet */)
                    && endColumn - startColumn === item.completion.insertText.length) {
                    var oldText = _this.editor.getModel().getValueInRange({
                        startLineNumber: position.lineNumber,
                        startColumn: startColumn,
                        endLineNumber: position.lineNumber,
                        endColumn: endColumn
                    });
                    value = oldText !== item.completion.insertText;
                }
                makesTextEdit.set(value);
            }));
            _this._toDispose.add(toDisposable(function () { return makesTextEdit.reset(); }));
            _this._toDispose.add(widget.onDetailsKeyDown(function (e) {
                // cmd + c on macOS, ctrl + c on Win / Linux
                if (e.toKeybinding().equals(new SimpleKeybinding(true, false, false, false, 33 /* KEY_C */)) ||
                    (platform.isMacintosh && e.toKeybinding().equals(new SimpleKeybinding(false, false, false, true, 33 /* KEY_C */)))) {
                    e.stopPropagation();
                    return;
                }
                if (!e.toKeybinding().isModifierKey()) {
                    _this.editor.focus();
                }
            }));
            return widget;
        }));
        this._alternatives = this._toDispose.add(new IdleValue(function () {
            return _this._toDispose.add(new SuggestAlternatives(_this.editor, _this._contextKeyService));
        }));
        this._toDispose.add(_instantiationService.createInstance(WordContextKey, editor));
        this._toDispose.add(this.model.onDidTrigger(function (e) {
            _this.widget.getValue().showTriggered(e.auto, e.shy ? 250 : 50);
            _this._lineSuffix.value = new LineSuffix(_this.editor.getModel(), e.position);
        }));
        this._toDispose.add(this.model.onDidSuggest(function (e) {
            if (!e.shy) {
                var index = _this._memoryService.select(_this.editor.getModel(), _this.editor.getPosition(), e.completionModel.items);
                _this.widget.getValue().showSuggestions(e.completionModel, index, e.isFrozen, e.auto);
            }
        }));
        this._toDispose.add(this.model.onDidCancel(function (e) {
            if (!e.retrigger) {
                _this.widget.getValue().hideWidget();
            }
        }));
        this._toDispose.add(this.editor.onDidBlurEditorWidget(function () {
            if (!_sticky) {
                _this.model.cancel();
                _this.model.clear();
            }
        }));
        // Manage the acceptSuggestionsOnEnter context key
        var acceptSuggestionsOnEnter = SuggestContext.AcceptSuggestionsOnEnter.bindTo(_contextKeyService);
        var updateFromConfig = function () {
            var acceptSuggestionOnEnter = _this.editor.getOption(1 /* acceptSuggestionOnEnter */);
            acceptSuggestionsOnEnter.set(acceptSuggestionOnEnter === 'on' || acceptSuggestionOnEnter === 'smart');
        };
        this._toDispose.add(this.editor.onDidChangeConfiguration(function () { return updateFromConfig(); }));
        updateFromConfig();
        // create range highlighter
        this._toDispose.add(new SuggestRangeHighlighter(this));
    }
    SuggestController.get = function (editor) {
        return editor.getContribution(SuggestController.ID);
    };
    SuggestController.prototype.dispose = function () {
        this._alternatives.dispose();
        this._toDispose.dispose();
        this.widget.dispose();
        this.model.dispose();
        this._lineSuffix.dispose();
    };
    SuggestController.prototype._insertSuggestion = function (event, flags) {
        var _a;
        var _this = this;
        if (!event || !event.item) {
            this._alternatives.getValue().reset();
            this.model.cancel();
            this.model.clear();
            return;
        }
        if (!this.editor.hasModel()) {
            return;
        }
        var model = this.editor.getModel();
        var modelVersionNow = model.getAlternativeVersionId();
        var item = event.item;
        var suggestion = item.completion;
        // pushing undo stops *before* additional text edits and
        // *after* the main edit
        if (!(flags & 1 /* NoBeforeUndoStop */)) {
            this.editor.pushUndoStop();
        }
        // compute overwrite[Before|After] deltas BEFORE applying extra edits
        var info = this.getOverwriteInfo(item, Boolean(flags & 8 /* AlternativeOverwriteConfig */));
        // keep item in memory
        this._memoryService.memorize(model, this.editor.getPosition(), item);
        if (Array.isArray(suggestion.additionalTextEdits)) {
            this.editor.executeEdits('suggestController.additionalTextEdits', suggestion.additionalTextEdits.map(function (edit) { return EditOperation.replace(Range.lift(edit.range), edit.text); }));
        }
        var insertText = suggestion.insertText;
        if (!(suggestion.insertTextRules & 4 /* InsertAsSnippet */)) {
            insertText = SnippetParser.escape(insertText);
        }
        SnippetController2.get(this.editor).insert(insertText, {
            overwriteBefore: info.overwriteBefore,
            overwriteAfter: info.overwriteAfter,
            undoStopBefore: false,
            undoStopAfter: false,
            adjustWhitespace: !(suggestion.insertTextRules & 1 /* KeepWhitespace */)
        });
        if (!(flags & 2 /* NoAfterUndoStop */)) {
            this.editor.pushUndoStop();
        }
        if (!suggestion.command) {
            // done
            this.model.cancel();
            this.model.clear();
        }
        else if (suggestion.command.id === TriggerSuggestAction.id) {
            // retigger
            this.model.trigger({ auto: true, shy: false }, true);
        }
        else {
            // exec command, done
            (_a = this._commandService).executeCommand.apply(_a, __spreadArrays([suggestion.command.id], (suggestion.command.arguments ? __spreadArrays(suggestion.command.arguments) : []))).catch(onUnexpectedError)
                .finally(function () { return _this.model.clear(); }); // <- clear only now, keep commands alive
            this.model.cancel();
        }
        if (flags & 4 /* KeepAlternativeSuggestions */) {
            this._alternatives.getValue().set(event, function (next) {
                // this is not so pretty. when inserting the 'next'
                // suggestion we undo until we are at the state at
                // which we were before inserting the previous suggestion...
                while (model.canUndo()) {
                    if (modelVersionNow !== model.getAlternativeVersionId()) {
                        model.undo();
                    }
                    _this._insertSuggestion(next, 1 /* NoBeforeUndoStop */ | 2 /* NoAfterUndoStop */ | (flags & 8 /* AlternativeOverwriteConfig */ ? 8 /* AlternativeOverwriteConfig */ : 0));
                    break;
                }
            });
        }
        this._alertCompletionItem(event.item);
    };
    SuggestController.prototype.getOverwriteInfo = function (item, toggleMode) {
        assertType(this.editor.hasModel());
        var replace = this.editor.getOption(89 /* suggest */).insertMode === 'replace';
        if (toggleMode) {
            replace = !replace;
        }
        var overwriteBefore = item.position.column - item.editStart.column;
        var overwriteAfter = (replace ? item.editReplaceEnd.column : item.editInsertEnd.column) - item.position.column;
        var columnDelta = this.editor.getPosition().column - item.position.column;
        var suffixDelta = this._lineSuffix.value ? this._lineSuffix.value.delta(this.editor.getPosition()) : 0;
        return {
            overwriteBefore: overwriteBefore + columnDelta,
            overwriteAfter: overwriteAfter + suffixDelta
        };
    };
    SuggestController.prototype._alertCompletionItem = function (_a) {
        var suggestion = _a.completion;
        var textLabel = typeof suggestion.label === 'string' ? suggestion.label : suggestion.label.name;
        if (isNonEmptyArray(suggestion.additionalTextEdits)) {
            var msg = nls.localize('arai.alert.snippet', "Accepting '{0}' made {1} additional edits", textLabel, suggestion.additionalTextEdits.length);
            alert(msg);
        }
    };
    SuggestController.prototype.triggerSuggest = function (onlyFrom) {
        if (this.editor.hasModel()) {
            this.model.trigger({ auto: false, shy: false }, false, onlyFrom);
            this.editor.revealLine(this.editor.getPosition().lineNumber, 0 /* Smooth */);
            this.editor.focus();
        }
    };
    SuggestController.prototype.triggerSuggestAndAcceptBest = function (arg) {
        var _this = this;
        if (!this.editor.hasModel()) {
            return;
        }
        var positionNow = this.editor.getPosition();
        var fallback = function () {
            if (positionNow.equals(_this.editor.getPosition())) {
                _this._commandService.executeCommand(arg.fallback);
            }
        };
        var makesTextEdit = function (item) {
            if (item.completion.insertTextRules & 4 /* InsertAsSnippet */ || item.completion.additionalTextEdits) {
                // snippet, other editor -> makes edit
                return true;
            }
            var position = _this.editor.getPosition();
            var startColumn = item.editStart.column;
            var endColumn = position.column;
            if (endColumn - startColumn !== item.completion.insertText.length) {
                // unequal lengths -> makes edit
                return true;
            }
            var textNow = _this.editor.getModel().getValueInRange({
                startLineNumber: position.lineNumber,
                startColumn: startColumn,
                endLineNumber: position.lineNumber,
                endColumn: endColumn
            });
            // unequal text -> makes edit
            return textNow !== item.completion.insertText;
        };
        Event.once(this.model.onDidTrigger)(function (_) {
            // wait for trigger because only then the cancel-event is trustworthy
            var listener = [];
            Event.any(_this.model.onDidTrigger, _this.model.onDidCancel)(function () {
                // retrigger or cancel -> try to type default text
                dispose(listener);
                fallback();
            }, undefined, listener);
            _this.model.onDidSuggest(function (_a) {
                var completionModel = _a.completionModel;
                dispose(listener);
                if (completionModel.items.length === 0) {
                    fallback();
                    return;
                }
                var index = _this._memoryService.select(_this.editor.getModel(), _this.editor.getPosition(), completionModel.items);
                var item = completionModel.items[index];
                if (!makesTextEdit(item)) {
                    fallback();
                    return;
                }
                _this.editor.pushUndoStop();
                _this._insertSuggestion({ index: index, item: item, model: completionModel }, 4 /* KeepAlternativeSuggestions */ | 1 /* NoBeforeUndoStop */ | 2 /* NoAfterUndoStop */);
            }, undefined, listener);
        });
        this.model.trigger({ auto: false, shy: true });
        this.editor.revealLine(positionNow.lineNumber, 0 /* Smooth */);
        this.editor.focus();
    };
    SuggestController.prototype.acceptSelectedSuggestion = function (keepAlternativeSuggestions, alternativeOverwriteConfig) {
        var item = this.widget.getValue().getFocusedItem();
        var flags = 0;
        if (keepAlternativeSuggestions) {
            flags |= 4 /* KeepAlternativeSuggestions */;
        }
        if (alternativeOverwriteConfig) {
            flags |= 8 /* AlternativeOverwriteConfig */;
        }
        this._insertSuggestion(item, flags);
    };
    SuggestController.prototype.acceptNextSuggestion = function () {
        this._alternatives.getValue().next();
    };
    SuggestController.prototype.acceptPrevSuggestion = function () {
        this._alternatives.getValue().prev();
    };
    SuggestController.prototype.cancelSuggestWidget = function () {
        this.model.cancel();
        this.model.clear();
        this.widget.getValue().hideWidget();
    };
    SuggestController.prototype.selectNextSuggestion = function () {
        this.widget.getValue().selectNext();
    };
    SuggestController.prototype.selectNextPageSuggestion = function () {
        this.widget.getValue().selectNextPage();
    };
    SuggestController.prototype.selectLastSuggestion = function () {
        this.widget.getValue().selectLast();
    };
    SuggestController.prototype.selectPrevSuggestion = function () {
        this.widget.getValue().selectPrevious();
    };
    SuggestController.prototype.selectPrevPageSuggestion = function () {
        this.widget.getValue().selectPreviousPage();
    };
    SuggestController.prototype.selectFirstSuggestion = function () {
        this.widget.getValue().selectFirst();
    };
    SuggestController.prototype.toggleSuggestionDetails = function () {
        this.widget.getValue().toggleDetails();
    };
    SuggestController.prototype.toggleExplainMode = function () {
        this.widget.getValue().toggleExplainMode();
    };
    SuggestController.prototype.toggleSuggestionFocus = function () {
        this.widget.getValue().toggleDetailsFocus();
    };
    SuggestController.ID = 'editor.contrib.suggestController';
    SuggestController = __decorate([
        __param(1, IEditorWorkerService),
        __param(2, ISuggestMemoryService),
        __param(3, ICommandService),
        __param(4, IContextKeyService),
        __param(5, IInstantiationService)
    ], SuggestController);
    return SuggestController;
}());
export { SuggestController };
var TriggerSuggestAction = /** @class */ (function (_super) {
    __extends(TriggerSuggestAction, _super);
    function TriggerSuggestAction() {
        return _super.call(this, {
            id: TriggerSuggestAction.id,
            label: nls.localize('suggest.trigger.label', "Trigger Suggest"),
            alias: 'Trigger Suggest',
            precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasCompletionItemProvider),
            kbOpts: {
                kbExpr: EditorContextKeys.textInputFocus,
                primary: 2048 /* CtrlCmd */ | 10 /* Space */,
                mac: { primary: 256 /* WinCtrl */ | 10 /* Space */, secondary: [512 /* Alt */ | 9 /* Escape */] },
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    TriggerSuggestAction.prototype.run = function (accessor, editor) {
        var controller = SuggestController.get(editor);
        if (!controller) {
            return;
        }
        controller.triggerSuggest();
    };
    TriggerSuggestAction.id = 'editor.action.triggerSuggest';
    return TriggerSuggestAction;
}(EditorAction));
export { TriggerSuggestAction };
registerEditorContribution(SuggestController.ID, SuggestController);
registerEditorAction(TriggerSuggestAction);
var weight = 100 /* EditorContrib */ + 90;
var SuggestCommand = EditorCommand.bindToContribution(SuggestController.get);
registerEditorCommand(new SuggestCommand({
    id: 'acceptSelectedSuggestion',
    precondition: SuggestContext.Visible,
    handler: function (x) {
        x.acceptSelectedSuggestion(true, false);
    }
}));
// normal tab
KeybindingsRegistry.registerKeybindingRule({
    id: 'acceptSelectedSuggestion',
    when: ContextKeyExpr.and(SuggestContext.Visible, EditorContextKeys.textInputFocus),
    primary: 2 /* Tab */,
    weight: weight
});
// accept on enter has special rules
KeybindingsRegistry.registerKeybindingRule({
    id: 'acceptSelectedSuggestion',
    when: ContextKeyExpr.and(SuggestContext.Visible, EditorContextKeys.textInputFocus, SuggestContext.AcceptSuggestionsOnEnter, SuggestContext.MakesTextEdit),
    primary: 3 /* Enter */,
    weight: weight
});
// todo@joh control enablement via context key
// shift+enter and shift+tab use the alternative-flag so that the suggest controller
// is doing the opposite of the editor.suggest.overwriteOnAccept-configuration
registerEditorCommand(new SuggestCommand({
    id: 'acceptAlternativeSelectedSuggestion',
    precondition: ContextKeyExpr.and(SuggestContext.Visible, EditorContextKeys.textInputFocus),
    kbOpts: {
        weight: weight,
        kbExpr: EditorContextKeys.textInputFocus,
        primary: 1024 /* Shift */ | 3 /* Enter */,
        secondary: [1024 /* Shift */ | 2 /* Tab */],
    },
    handler: function (x) {
        x.acceptSelectedSuggestion(false, true);
    },
}));
// continue to support the old command
CommandsRegistry.registerCommandAlias('acceptSelectedSuggestionOnEnter', 'acceptSelectedSuggestion');
registerEditorCommand(new SuggestCommand({
    id: 'hideSuggestWidget',
    precondition: SuggestContext.Visible,
    handler: function (x) { return x.cancelSuggestWidget(); },
    kbOpts: {
        weight: weight,
        kbExpr: EditorContextKeys.textInputFocus,
        primary: 9 /* Escape */,
        secondary: [1024 /* Shift */ | 9 /* Escape */]
    }
}));
registerEditorCommand(new SuggestCommand({
    id: 'selectNextSuggestion',
    precondition: ContextKeyExpr.and(SuggestContext.Visible, SuggestContext.MultipleSuggestions),
    handler: function (c) { return c.selectNextSuggestion(); },
    kbOpts: {
        weight: weight,
        kbExpr: EditorContextKeys.textInputFocus,
        primary: 18 /* DownArrow */,
        secondary: [2048 /* CtrlCmd */ | 18 /* DownArrow */],
        mac: { primary: 18 /* DownArrow */, secondary: [2048 /* CtrlCmd */ | 18 /* DownArrow */, 256 /* WinCtrl */ | 44 /* KEY_N */] }
    }
}));
registerEditorCommand(new SuggestCommand({
    id: 'selectNextPageSuggestion',
    precondition: ContextKeyExpr.and(SuggestContext.Visible, SuggestContext.MultipleSuggestions),
    handler: function (c) { return c.selectNextPageSuggestion(); },
    kbOpts: {
        weight: weight,
        kbExpr: EditorContextKeys.textInputFocus,
        primary: 12 /* PageDown */,
        secondary: [2048 /* CtrlCmd */ | 12 /* PageDown */]
    }
}));
registerEditorCommand(new SuggestCommand({
    id: 'selectLastSuggestion',
    precondition: ContextKeyExpr.and(SuggestContext.Visible, SuggestContext.MultipleSuggestions),
    handler: function (c) { return c.selectLastSuggestion(); }
}));
registerEditorCommand(new SuggestCommand({
    id: 'selectPrevSuggestion',
    precondition: ContextKeyExpr.and(SuggestContext.Visible, SuggestContext.MultipleSuggestions),
    handler: function (c) { return c.selectPrevSuggestion(); },
    kbOpts: {
        weight: weight,
        kbExpr: EditorContextKeys.textInputFocus,
        primary: 16 /* UpArrow */,
        secondary: [2048 /* CtrlCmd */ | 16 /* UpArrow */],
        mac: { primary: 16 /* UpArrow */, secondary: [2048 /* CtrlCmd */ | 16 /* UpArrow */, 256 /* WinCtrl */ | 46 /* KEY_P */] }
    }
}));
registerEditorCommand(new SuggestCommand({
    id: 'selectPrevPageSuggestion',
    precondition: ContextKeyExpr.and(SuggestContext.Visible, SuggestContext.MultipleSuggestions),
    handler: function (c) { return c.selectPrevPageSuggestion(); },
    kbOpts: {
        weight: weight,
        kbExpr: EditorContextKeys.textInputFocus,
        primary: 11 /* PageUp */,
        secondary: [2048 /* CtrlCmd */ | 11 /* PageUp */]
    }
}));
registerEditorCommand(new SuggestCommand({
    id: 'selectFirstSuggestion',
    precondition: ContextKeyExpr.and(SuggestContext.Visible, SuggestContext.MultipleSuggestions),
    handler: function (c) { return c.selectFirstSuggestion(); }
}));
registerEditorCommand(new SuggestCommand({
    id: 'toggleSuggestionDetails',
    precondition: SuggestContext.Visible,
    handler: function (x) { return x.toggleSuggestionDetails(); },
    kbOpts: {
        weight: weight,
        kbExpr: EditorContextKeys.textInputFocus,
        primary: 2048 /* CtrlCmd */ | 10 /* Space */,
        mac: { primary: 256 /* WinCtrl */ | 10 /* Space */ }
    }
}));
registerEditorCommand(new SuggestCommand({
    id: 'toggleExplainMode',
    precondition: SuggestContext.Visible,
    handler: function (x) { return x.toggleExplainMode(); },
    kbOpts: {
        weight: 100 /* EditorContrib */,
        primary: 2048 /* CtrlCmd */ | 85 /* US_SLASH */,
    }
}));
registerEditorCommand(new SuggestCommand({
    id: 'toggleSuggestionFocus',
    precondition: SuggestContext.Visible,
    handler: function (x) { return x.toggleSuggestionFocus(); },
    kbOpts: {
        weight: weight,
        kbExpr: EditorContextKeys.textInputFocus,
        primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 10 /* Space */,
        mac: { primary: 256 /* WinCtrl */ | 512 /* Alt */ | 10 /* Space */ }
    }
}));
//#region tab completions
registerEditorCommand(new SuggestCommand({
    id: 'insertBestCompletion',
    precondition: ContextKeyExpr.and(ContextKeyExpr.equals('config.editor.tabCompletion', 'on'), WordContextKey.AtEnd, SuggestContext.Visible.toNegated(), SuggestAlternatives.OtherSuggestions.toNegated(), SnippetController2.InSnippetMode.toNegated()),
    handler: function (x, arg) {
        x.triggerSuggestAndAcceptBest(isObject(arg) ? __assign({ fallback: 'tab' }, arg) : { fallback: 'tab' });
    },
    kbOpts: {
        weight: weight,
        primary: 2 /* Tab */
    }
}));
registerEditorCommand(new SuggestCommand({
    id: 'insertNextSuggestion',
    precondition: ContextKeyExpr.and(ContextKeyExpr.equals('config.editor.tabCompletion', 'on'), SuggestAlternatives.OtherSuggestions, SuggestContext.Visible.toNegated(), SnippetController2.InSnippetMode.toNegated()),
    handler: function (x) { return x.acceptNextSuggestion(); },
    kbOpts: {
        weight: weight,
        kbExpr: EditorContextKeys.textInputFocus,
        primary: 2 /* Tab */
    }
}));
registerEditorCommand(new SuggestCommand({
    id: 'insertPrevSuggestion',
    precondition: ContextKeyExpr.and(ContextKeyExpr.equals('config.editor.tabCompletion', 'on'), SuggestAlternatives.OtherSuggestions, SuggestContext.Visible.toNegated(), SnippetController2.InSnippetMode.toNegated()),
    handler: function (x) { return x.acceptPrevSuggestion(); },
    kbOpts: {
        weight: weight,
        kbExpr: EditorContextKeys.textInputFocus,
        primary: 1024 /* Shift */ | 2 /* Tab */
    }
}));
