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
import './bracketMatching.css';
import * as nls from '../../../nls.js';
import { RunOnceScheduler } from '../../../base/common/async.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { EditorAction, registerEditorAction, registerEditorContribution } from '../../browser/editorExtensions.js';
import { Position } from '../../common/core/position.js';
import { Range } from '../../common/core/range.js';
import { Selection } from '../../common/core/selection.js';
import { EditorContextKeys } from '../../common/editorContextKeys.js';
import { OverviewRulerLane } from '../../common/model.js';
import { ModelDecorationOptions } from '../../common/model/textModel.js';
import { editorBracketMatchBackground, editorBracketMatchBorder } from '../../common/view/editorColorRegistry.js';
import { registerColor } from '../../../platform/theme/common/colorRegistry.js';
import { registerThemingParticipant, themeColorFromId } from '../../../platform/theme/common/themeService.js';
import { MenuRegistry } from '../../../platform/actions/common/actions.js';
var overviewRulerBracketMatchForeground = registerColor('editorOverviewRuler.bracketMatchForeground', { dark: '#A0A0A0', light: '#A0A0A0', hc: '#A0A0A0' }, nls.localize('overviewRulerBracketMatchForeground', 'Overview ruler marker color for matching brackets.'));
var JumpToBracketAction = /** @class */ (function (_super) {
    __extends(JumpToBracketAction, _super);
    function JumpToBracketAction() {
        return _super.call(this, {
            id: 'editor.action.jumpToBracket',
            label: nls.localize('smartSelect.jumpBracket', "Go to Bracket"),
            alias: 'Go to Bracket',
            precondition: undefined,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 88 /* US_BACKSLASH */,
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    JumpToBracketAction.prototype.run = function (accessor, editor) {
        var controller = BracketMatchingController.get(editor);
        if (!controller) {
            return;
        }
        controller.jumpToBracket();
    };
    return JumpToBracketAction;
}(EditorAction));
var SelectToBracketAction = /** @class */ (function (_super) {
    __extends(SelectToBracketAction, _super);
    function SelectToBracketAction() {
        return _super.call(this, {
            id: 'editor.action.selectToBracket',
            label: nls.localize('smartSelect.selectToBracket', "Select to Bracket"),
            alias: 'Select to Bracket',
            precondition: undefined,
            description: {
                description: "Select to Bracket",
                args: [{
                        name: 'args',
                        schema: {
                            type: 'object',
                            properties: {
                                'selectBrackets': {
                                    type: 'boolean',
                                    default: true
                                }
                            },
                        }
                    }]
            }
        }) || this;
    }
    SelectToBracketAction.prototype.run = function (accessor, editor, args) {
        var controller = BracketMatchingController.get(editor);
        if (!controller) {
            return;
        }
        var selectBrackets = true;
        if (args && args.selectBrackets === false) {
            selectBrackets = false;
        }
        controller.selectToBracket(selectBrackets);
    };
    return SelectToBracketAction;
}(EditorAction));
var BracketsData = /** @class */ (function () {
    function BracketsData(position, brackets, options) {
        this.position = position;
        this.brackets = brackets;
        this.options = options;
    }
    return BracketsData;
}());
var BracketMatchingController = /** @class */ (function (_super) {
    __extends(BracketMatchingController, _super);
    function BracketMatchingController(editor) {
        var _this = _super.call(this) || this;
        _this._editor = editor;
        _this._lastBracketsData = [];
        _this._lastVersionId = 0;
        _this._decorations = [];
        _this._updateBracketsSoon = _this._register(new RunOnceScheduler(function () { return _this._updateBrackets(); }, 50));
        _this._matchBrackets = _this._editor.getOption(53 /* matchBrackets */);
        _this._updateBracketsSoon.schedule();
        _this._register(editor.onDidChangeCursorPosition(function (e) {
            if (_this._matchBrackets === 'never') {
                // Early exit if nothing needs to be done!
                // Leave some form of early exit check here if you wish to continue being a cursor position change listener ;)
                return;
            }
            _this._updateBracketsSoon.schedule();
        }));
        _this._register(editor.onDidChangeModelContent(function (e) {
            _this._updateBracketsSoon.schedule();
        }));
        _this._register(editor.onDidChangeModel(function (e) {
            _this._lastBracketsData = [];
            _this._decorations = [];
            _this._updateBracketsSoon.schedule();
        }));
        _this._register(editor.onDidChangeModelLanguageConfiguration(function (e) {
            _this._lastBracketsData = [];
            _this._updateBracketsSoon.schedule();
        }));
        _this._register(editor.onDidChangeConfiguration(function (e) {
            if (e.hasChanged(53 /* matchBrackets */)) {
                _this._matchBrackets = _this._editor.getOption(53 /* matchBrackets */);
                _this._decorations = _this._editor.deltaDecorations(_this._decorations, []);
                _this._lastBracketsData = [];
                _this._lastVersionId = 0;
                _this._updateBracketsSoon.schedule();
            }
        }));
        return _this;
    }
    BracketMatchingController.get = function (editor) {
        return editor.getContribution(BracketMatchingController.ID);
    };
    BracketMatchingController.prototype.jumpToBracket = function () {
        if (!this._editor.hasModel()) {
            return;
        }
        var model = this._editor.getModel();
        var newSelections = this._editor.getSelections().map(function (selection) {
            var position = selection.getStartPosition();
            // find matching brackets if position is on a bracket
            var brackets = model.matchBracket(position);
            var newCursorPosition = null;
            if (brackets) {
                if (brackets[0].containsPosition(position)) {
                    newCursorPosition = brackets[1].getStartPosition();
                }
                else if (brackets[1].containsPosition(position)) {
                    newCursorPosition = brackets[0].getStartPosition();
                }
            }
            else {
                // find the enclosing brackets if the position isn't on a matching bracket
                var enclosingBrackets = model.findEnclosingBrackets(position);
                if (enclosingBrackets) {
                    newCursorPosition = enclosingBrackets[0].getStartPosition();
                }
                else {
                    // no enclosing brackets, try the very first next bracket
                    var nextBracket = model.findNextBracket(position);
                    if (nextBracket && nextBracket.range) {
                        newCursorPosition = nextBracket.range.getStartPosition();
                    }
                }
            }
            if (newCursorPosition) {
                return new Selection(newCursorPosition.lineNumber, newCursorPosition.column, newCursorPosition.lineNumber, newCursorPosition.column);
            }
            return new Selection(position.lineNumber, position.column, position.lineNumber, position.column);
        });
        this._editor.setSelections(newSelections);
        this._editor.revealRange(newSelections[0]);
    };
    BracketMatchingController.prototype.selectToBracket = function (selectBrackets) {
        if (!this._editor.hasModel()) {
            return;
        }
        var model = this._editor.getModel();
        var newSelections = [];
        this._editor.getSelections().forEach(function (selection) {
            var position = selection.getStartPosition();
            var brackets = model.matchBracket(position);
            if (!brackets) {
                brackets = model.findEnclosingBrackets(position);
                if (!brackets) {
                    var nextBracket = model.findNextBracket(position);
                    if (nextBracket && nextBracket.range) {
                        brackets = model.matchBracket(nextBracket.range.getStartPosition());
                    }
                }
            }
            var selectFrom = null;
            var selectTo = null;
            if (brackets) {
                brackets.sort(Range.compareRangesUsingStarts);
                var open_1 = brackets[0], close_1 = brackets[1];
                selectFrom = selectBrackets ? open_1.getStartPosition() : open_1.getEndPosition();
                selectTo = selectBrackets ? close_1.getEndPosition() : close_1.getStartPosition();
            }
            if (selectFrom && selectTo) {
                newSelections.push(new Selection(selectFrom.lineNumber, selectFrom.column, selectTo.lineNumber, selectTo.column));
            }
        });
        if (newSelections.length > 0) {
            this._editor.setSelections(newSelections);
            this._editor.revealRange(newSelections[0]);
        }
    };
    BracketMatchingController.prototype._updateBrackets = function () {
        if (this._matchBrackets === 'never') {
            return;
        }
        this._recomputeBrackets();
        var newDecorations = [], newDecorationsLen = 0;
        for (var _i = 0, _a = this._lastBracketsData; _i < _a.length; _i++) {
            var bracketData = _a[_i];
            var brackets = bracketData.brackets;
            if (brackets) {
                newDecorations[newDecorationsLen++] = { range: brackets[0], options: bracketData.options };
                newDecorations[newDecorationsLen++] = { range: brackets[1], options: bracketData.options };
            }
        }
        this._decorations = this._editor.deltaDecorations(this._decorations, newDecorations);
    };
    BracketMatchingController.prototype._recomputeBrackets = function () {
        if (!this._editor.hasModel()) {
            // no model => no brackets!
            this._lastBracketsData = [];
            this._lastVersionId = 0;
            return;
        }
        var selections = this._editor.getSelections();
        if (selections.length > 100) {
            // no bracket matching for high numbers of selections
            this._lastBracketsData = [];
            this._lastVersionId = 0;
            return;
        }
        var model = this._editor.getModel();
        var versionId = model.getVersionId();
        var previousData = [];
        if (this._lastVersionId === versionId) {
            // use the previous data only if the model is at the same version id
            previousData = this._lastBracketsData;
        }
        var positions = [], positionsLen = 0;
        for (var i = 0, len = selections.length; i < len; i++) {
            var selection = selections[i];
            if (selection.isEmpty()) {
                // will bracket match a cursor only if the selection is collapsed
                positions[positionsLen++] = selection.getStartPosition();
            }
        }
        // sort positions for `previousData` cache hits
        if (positions.length > 1) {
            positions.sort(Position.compare);
        }
        var newData = [], newDataLen = 0;
        var previousIndex = 0, previousLen = previousData.length;
        for (var i = 0, len = positions.length; i < len; i++) {
            var position = positions[i];
            while (previousIndex < previousLen && previousData[previousIndex].position.isBefore(position)) {
                previousIndex++;
            }
            if (previousIndex < previousLen && previousData[previousIndex].position.equals(position)) {
                newData[newDataLen++] = previousData[previousIndex];
            }
            else {
                var brackets = model.matchBracket(position);
                var options = BracketMatchingController._DECORATION_OPTIONS_WITH_OVERVIEW_RULER;
                if (!brackets && this._matchBrackets === 'always') {
                    brackets = model.findEnclosingBrackets(position, 20 /* give at most 20ms to compute */);
                    options = BracketMatchingController._DECORATION_OPTIONS_WITHOUT_OVERVIEW_RULER;
                }
                newData[newDataLen++] = new BracketsData(position, brackets, options);
            }
        }
        this._lastBracketsData = newData;
        this._lastVersionId = versionId;
    };
    BracketMatchingController.ID = 'editor.contrib.bracketMatchingController';
    BracketMatchingController._DECORATION_OPTIONS_WITH_OVERVIEW_RULER = ModelDecorationOptions.register({
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */,
        className: 'bracket-match',
        overviewRuler: {
            color: themeColorFromId(overviewRulerBracketMatchForeground),
            position: OverviewRulerLane.Center
        }
    });
    BracketMatchingController._DECORATION_OPTIONS_WITHOUT_OVERVIEW_RULER = ModelDecorationOptions.register({
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */,
        className: 'bracket-match'
    });
    return BracketMatchingController;
}(Disposable));
export { BracketMatchingController };
registerEditorContribution(BracketMatchingController.ID, BracketMatchingController);
registerEditorAction(SelectToBracketAction);
registerEditorAction(JumpToBracketAction);
registerThemingParticipant(function (theme, collector) {
    var bracketMatchBackground = theme.getColor(editorBracketMatchBackground);
    if (bracketMatchBackground) {
        collector.addRule(".monaco-editor .bracket-match { background-color: " + bracketMatchBackground + "; }");
    }
    var bracketMatchBorder = theme.getColor(editorBracketMatchBorder);
    if (bracketMatchBorder) {
        collector.addRule(".monaco-editor .bracket-match { border: 1px solid " + bracketMatchBorder + "; }");
    }
});
// Go to menu
MenuRegistry.appendMenuItem(19 /* MenubarGoMenu */, {
    group: '5_infile_nav',
    command: {
        id: 'editor.action.jumpToBracket',
        title: nls.localize({ key: 'miGoToBracket', comment: ['&& denotes a mnemonic'] }, "Go to &&Bracket")
    },
    order: 2
});
