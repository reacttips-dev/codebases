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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as nls from '../../../../nls.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { dispose, DisposableStore } from '../../../../base/common/lifecycle.js';
import { ICodeEditorService } from '../../../browser/services/codeEditorService.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IContextKeyService, RawContextKey, ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { OneReference } from '../referencesModel.js';
import { ReferenceWidget, LayoutData } from './referencesWidget.js';
import { Range } from '../../../common/core/range.js';
import { Position } from '../../../common/core/position.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { createCancelablePromise } from '../../../../base/common/async.js';
import { getOuterEditor, PeekContext } from '../../peekView/peekView.js';
import { IListService, WorkbenchListFocusContextKey } from '../../../../platform/list/browser/listService.js';
import { KeybindingsRegistry } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { KeyChord } from '../../../../base/common/keyCodes.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
export var ctxReferenceSearchVisible = new RawContextKey('referenceSearchVisible', false);
var ReferencesController = /** @class */ (function () {
    function ReferencesController(_defaultTreeKeyboardSupport, _editor, contextKeyService, _editorService, _notificationService, _instantiationService, _storageService, _configurationService) {
        this._defaultTreeKeyboardSupport = _defaultTreeKeyboardSupport;
        this._editor = _editor;
        this._editorService = _editorService;
        this._notificationService = _notificationService;
        this._instantiationService = _instantiationService;
        this._storageService = _storageService;
        this._configurationService = _configurationService;
        this._disposables = new DisposableStore();
        this._requestIdPool = 0;
        this._ignoreModelChangeEvent = false;
        this._referenceSearchVisible = ctxReferenceSearchVisible.bindTo(contextKeyService);
    }
    ReferencesController.get = function (editor) {
        return editor.getContribution(ReferencesController.ID);
    };
    ReferencesController.prototype.dispose = function () {
        this._referenceSearchVisible.reset();
        this._disposables.dispose();
        dispose(this._widget);
        dispose(this._model);
        this._widget = undefined;
        this._model = undefined;
    };
    ReferencesController.prototype.toggleWidget = function (range, modelPromise, peekMode) {
        var _this = this;
        // close current widget and return early is position didn't change
        var widgetPosition;
        if (this._widget) {
            widgetPosition = this._widget.position;
        }
        this.closeWidget();
        if (!!widgetPosition && range.containsPosition(widgetPosition)) {
            return;
        }
        this._peekMode = peekMode;
        this._referenceSearchVisible.set(true);
        // close the widget on model/mode changes
        this._disposables.add(this._editor.onDidChangeModelLanguage(function () { _this.closeWidget(); }));
        this._disposables.add(this._editor.onDidChangeModel(function () {
            if (!_this._ignoreModelChangeEvent) {
                _this.closeWidget();
            }
        }));
        var storageKey = 'peekViewLayout';
        var data = LayoutData.fromJSON(this._storageService.get(storageKey, 0 /* GLOBAL */, '{}'));
        this._widget = this._instantiationService.createInstance(ReferenceWidget, this._editor, this._defaultTreeKeyboardSupport, data);
        this._widget.setTitle(nls.localize('labelLoading', "Loading..."));
        this._widget.show(range);
        this._disposables.add(this._widget.onDidClose(function () {
            modelPromise.cancel();
            if (_this._widget) {
                _this._storageService.store(storageKey, JSON.stringify(_this._widget.layoutData), 0 /* GLOBAL */);
                _this._widget = undefined;
            }
            _this.closeWidget();
        }));
        this._disposables.add(this._widget.onDidSelectReference(function (event) {
            var element = event.element, kind = event.kind;
            if (!element) {
                return;
            }
            switch (kind) {
                case 'open':
                    if (event.source !== 'editor' || !_this._configurationService.getValue('editor.stablePeek')) {
                        // when stable peek is configured we don't close
                        // the peek window on selecting the editor
                        _this.openReference(element, false);
                    }
                    break;
                case 'side':
                    _this.openReference(element, true);
                    break;
                case 'goto':
                    if (peekMode) {
                        _this._gotoReference(element);
                    }
                    else {
                        _this.openReference(element, false);
                    }
                    break;
            }
        }));
        var requestId = ++this._requestIdPool;
        modelPromise.then(function (model) {
            // still current request? widget still open?
            if (requestId !== _this._requestIdPool || !_this._widget) {
                return undefined;
            }
            if (_this._model) {
                _this._model.dispose();
            }
            _this._model = model;
            // show widget
            return _this._widget.setModel(_this._model).then(function () {
                if (_this._widget && _this._model && _this._editor.hasModel()) { // might have been closed
                    // set title
                    if (!_this._model.isEmpty) {
                        _this._widget.setMetaTitle(nls.localize('metaTitle.N', "{0} ({1})", _this._model.title, _this._model.references.length));
                    }
                    else {
                        _this._widget.setMetaTitle('');
                    }
                    // set 'best' selection
                    var uri = _this._editor.getModel().uri;
                    var pos = new Position(range.startLineNumber, range.startColumn);
                    var selection = _this._model.nearestReference(uri, pos);
                    if (selection) {
                        return _this._widget.setSelection(selection).then(function () {
                            if (_this._widget && _this._editor.getOption(65 /* peekWidgetDefaultFocus */) === 'editor') {
                                _this._widget.focusOnPreviewEditor();
                            }
                        });
                    }
                }
                return undefined;
            });
        }, function (error) {
            _this._notificationService.error(error);
        });
    };
    ReferencesController.prototype.changeFocusBetweenPreviewAndReferences = function () {
        if (!this._widget) {
            // can be called while still resolving...
            return;
        }
        if (this._widget.isPreviewEditorFocused()) {
            this._widget.focusOnReferenceTree();
        }
        else {
            this._widget.focusOnPreviewEditor();
        }
    };
    ReferencesController.prototype.goToNextOrPreviousReference = function (fwd) {
        return __awaiter(this, void 0, void 0, function () {
            var currentPosition, source, target, editorFocus, previewEditorFocus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._editor.hasModel() || !this._model || !this._widget) {
                            // can be called while still resolving...
                            return [2 /*return*/];
                        }
                        currentPosition = this._widget.position;
                        if (!currentPosition) {
                            return [2 /*return*/];
                        }
                        source = this._model.nearestReference(this._editor.getModel().uri, currentPosition);
                        if (!source) {
                            return [2 /*return*/];
                        }
                        target = this._model.nextOrPreviousReference(source, fwd);
                        editorFocus = this._editor.hasTextFocus();
                        previewEditorFocus = this._widget.isPreviewEditorFocused();
                        return [4 /*yield*/, this._widget.setSelection(target)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this._gotoReference(target)];
                    case 2:
                        _a.sent();
                        if (editorFocus) {
                            this._editor.focus();
                        }
                        else if (this._widget && previewEditorFocus) {
                            this._widget.focusOnPreviewEditor();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ReferencesController.prototype.closeWidget = function (focusEditor) {
        if (focusEditor === void 0) { focusEditor = true; }
        this._referenceSearchVisible.reset();
        this._disposables.clear();
        dispose(this._widget);
        dispose(this._model);
        this._widget = undefined;
        this._model = undefined;
        if (focusEditor) {
            this._editor.focus();
        }
        this._requestIdPool += 1; // Cancel pending requests
    };
    ReferencesController.prototype._gotoReference = function (ref) {
        var _this = this;
        if (this._widget) {
            this._widget.hide();
        }
        this._ignoreModelChangeEvent = true;
        var range = Range.lift(ref.range).collapseToStart();
        return this._editorService.openCodeEditor({
            resource: ref.uri,
            options: { selection: range }
        }, this._editor).then(function (openedEditor) {
            var _a;
            _this._ignoreModelChangeEvent = false;
            if (!openedEditor || !_this._widget) {
                // something went wrong...
                _this.closeWidget();
                return;
            }
            if (_this._editor === openedEditor) {
                //
                _this._widget.show(range);
                _this._widget.focusOnReferenceTree();
            }
            else {
                // we opened a different editor instance which means a different controller instance.
                // therefore we stop with this controller and continue with the other
                var other = ReferencesController.get(openedEditor);
                var model_1 = _this._model.clone();
                _this.closeWidget();
                openedEditor.focus();
                other.toggleWidget(range, createCancelablePromise(function (_) { return Promise.resolve(model_1); }), (_a = _this._peekMode) !== null && _a !== void 0 ? _a : false);
            }
        }, function (err) {
            _this._ignoreModelChangeEvent = false;
            onUnexpectedError(err);
        });
    };
    ReferencesController.prototype.openReference = function (ref, sideBySide) {
        // clear stage
        if (!sideBySide) {
            this.closeWidget();
        }
        var uri = ref.uri, range = ref.range;
        this._editorService.openCodeEditor({
            resource: uri,
            options: { selection: range }
        }, this._editor, sideBySide);
    };
    ReferencesController.ID = 'editor.contrib.referencesController';
    ReferencesController = __decorate([
        __param(2, IContextKeyService),
        __param(3, ICodeEditorService),
        __param(4, INotificationService),
        __param(5, IInstantiationService),
        __param(6, IStorageService),
        __param(7, IConfigurationService)
    ], ReferencesController);
    return ReferencesController;
}());
export { ReferencesController };
function withController(accessor, fn) {
    var outerEditor = getOuterEditor(accessor);
    if (!outerEditor) {
        return;
    }
    var controller = ReferencesController.get(outerEditor);
    if (controller) {
        fn(controller);
    }
}
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'togglePeekWidgetFocus',
    weight: 100 /* EditorContrib */,
    primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 60 /* F2 */),
    when: ContextKeyExpr.or(ctxReferenceSearchVisible, PeekContext.inPeekEditor),
    handler: function (accessor) {
        withController(accessor, function (controller) {
            controller.changeFocusBetweenPreviewAndReferences();
        });
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'goToNextReference',
    weight: 100 /* EditorContrib */ - 10,
    primary: 62 /* F4 */,
    secondary: [70 /* F12 */],
    when: ContextKeyExpr.or(ctxReferenceSearchVisible, PeekContext.inPeekEditor),
    handler: function (accessor) {
        withController(accessor, function (controller) {
            controller.goToNextOrPreviousReference(true);
        });
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'goToPreviousReference',
    weight: 100 /* EditorContrib */ - 10,
    primary: 1024 /* Shift */ | 62 /* F4 */,
    secondary: [1024 /* Shift */ | 70 /* F12 */],
    when: ContextKeyExpr.or(ctxReferenceSearchVisible, PeekContext.inPeekEditor),
    handler: function (accessor) {
        withController(accessor, function (controller) {
            controller.goToNextOrPreviousReference(false);
        });
    }
});
// commands that aren't needed anymore because there is now ContextKeyExpr.OR
CommandsRegistry.registerCommandAlias('goToNextReferenceFromEmbeddedEditor', 'goToNextReference');
CommandsRegistry.registerCommandAlias('goToPreviousReferenceFromEmbeddedEditor', 'goToPreviousReference');
// close
CommandsRegistry.registerCommandAlias('closeReferenceSearchEditor', 'closeReferenceSearch');
CommandsRegistry.registerCommand('closeReferenceSearch', function (accessor) { return withController(accessor, function (controller) { return controller.closeWidget(); }); });
KeybindingsRegistry.registerKeybindingRule({
    id: 'closeReferenceSearch',
    weight: 100 /* EditorContrib */ - 101,
    primary: 9 /* Escape */,
    secondary: [1024 /* Shift */ | 9 /* Escape */],
    when: ContextKeyExpr.and(PeekContext.inPeekEditor, ContextKeyExpr.not('config.editor.stablePeek'))
});
KeybindingsRegistry.registerKeybindingRule({
    id: 'closeReferenceSearch',
    weight: 200 /* WorkbenchContrib */ + 50,
    primary: 9 /* Escape */,
    secondary: [1024 /* Shift */ | 9 /* Escape */],
    when: ContextKeyExpr.and(ctxReferenceSearchVisible, ContextKeyExpr.not('config.editor.stablePeek'))
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'openReferenceToSide',
    weight: 100 /* EditorContrib */,
    primary: 2048 /* CtrlCmd */ | 3 /* Enter */,
    mac: {
        primary: 256 /* WinCtrl */ | 3 /* Enter */
    },
    when: ContextKeyExpr.and(ctxReferenceSearchVisible, WorkbenchListFocusContextKey),
    handler: function (accessor) {
        var _a;
        var listService = accessor.get(IListService);
        var focus = (_a = listService.lastFocusedList) === null || _a === void 0 ? void 0 : _a.getFocus();
        if (Array.isArray(focus) && focus[0] instanceof OneReference) {
            withController(accessor, function (controller) { return controller.openReference(focus[0], true); });
        }
    }
});
CommandsRegistry.registerCommand('openReference', function (accessor) {
    var _a;
    var listService = accessor.get(IListService);
    var focus = (_a = listService.lastFocusedList) === null || _a === void 0 ? void 0 : _a.getFocus();
    if (Array.isArray(focus) && focus[0] instanceof OneReference) {
        withController(accessor, function (controller) { return controller.openReference(focus[0], false); });
    }
});
