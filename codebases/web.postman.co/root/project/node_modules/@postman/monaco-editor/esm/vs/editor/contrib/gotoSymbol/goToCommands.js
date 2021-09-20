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
var _a, _b, _c, _d, _e, _f, _g, _h;
import { alert } from '../../../base/browser/ui/aria/aria.js';
import { createCancelablePromise, raceCancellation } from '../../../base/common/async.js';
import { KeyChord } from '../../../base/common/keyCodes.js';
import { isWeb } from '../../../base/common/platform.js';
import { isCodeEditor } from '../../browser/editorBrowser.js';
import { EditorAction, registerEditorAction } from '../../browser/editorExtensions.js';
import { ICodeEditorService } from '../../browser/services/codeEditorService.js';
import * as corePosition from '../../common/core/position.js';
import { Range } from '../../common/core/range.js';
import { EditorContextKeys } from '../../common/editorContextKeys.js';
import { isLocationLink } from '../../common/modes.js';
import { MessageController } from '../message/messageController.js';
import { PeekContext } from '../peekView/peekView.js';
import { ReferencesController } from './peek/referencesController.js';
import { ReferencesModel } from './referencesModel.js';
import * as nls from '../../../nls.js';
import { MenuRegistry } from '../../../platform/actions/common/actions.js';
import { ContextKeyExpr } from '../../../platform/contextkey/common/contextkey.js';
import { INotificationService } from '../../../platform/notification/common/notification.js';
import { IEditorProgressService } from '../../../platform/progress/common/progress.js';
import { getDefinitionsAtPosition, getImplementationsAtPosition, getTypeDefinitionsAtPosition, getDeclarationsAtPosition, getReferencesAtPosition } from './goToSymbol.js';
import { CommandsRegistry, ICommandService } from '../../../platform/commands/common/commands.js';
import { EditorStateCancellationTokenSource } from '../../browser/core/editorState.js';
import { ISymbolNavigationService } from './symbolNavigation.js';
import { isStandalone } from '../../../base/browser/browser.js';
import { URI } from '../../../base/common/uri.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { assertType } from '../../../base/common/types.js';
import { EmbeddedCodeEditorWidget } from '../../browser/widget/embeddedCodeEditorWidget.js';
MenuRegistry.appendMenuItem(7 /* EditorContext */, {
    submenu: 8 /* EditorContextPeek */,
    title: nls.localize('peek.submenu', "Peek"),
    group: 'navigation',
    order: 100
});
var SymbolNavigationAction = /** @class */ (function (_super) {
    __extends(SymbolNavigationAction, _super);
    function SymbolNavigationAction(configuration, opts) {
        var _this = _super.call(this, opts) || this;
        _this._configuration = configuration;
        return _this;
    }
    SymbolNavigationAction.prototype.run = function (accessor, editor) {
        var _this = this;
        if (!editor.hasModel()) {
            return Promise.resolve(undefined);
        }
        var notificationService = accessor.get(INotificationService);
        var editorService = accessor.get(ICodeEditorService);
        var progressService = accessor.get(IEditorProgressService);
        var symbolNavService = accessor.get(ISymbolNavigationService);
        var model = editor.getModel();
        var pos = editor.getPosition();
        var cts = new EditorStateCancellationTokenSource(editor, 1 /* Value */ | 4 /* Position */);
        var promise = raceCancellation(this._getLocationModel(model, pos, cts.token), cts.token).then(function (references) { return __awaiter(_this, void 0, void 0, function () {
            var altAction, altActionId, referenceCount, info;
            return __generator(this, function (_a) {
                if (!references || cts.token.isCancellationRequested) {
                    return [2 /*return*/];
                }
                alert(references.ariaMessage);
                if (references.referenceAt(model.uri, pos)) {
                    altActionId = this._getAlternativeCommand(editor);
                    if (altActionId !== this.id) {
                        altAction = editor.getAction(altActionId);
                    }
                }
                referenceCount = references.references.length;
                if (referenceCount === 0) {
                    // no result -> show message
                    if (!this._configuration.muteMessage) {
                        info = model.getWordAtPosition(pos);
                        MessageController.get(editor).showMessage(this._getNoResultFoundMessage(info), pos);
                    }
                }
                else if (referenceCount === 1 && altAction) {
                    // already at the only result, run alternative
                    altAction.run();
                }
                else {
                    // normal results handling
                    return [2 /*return*/, this._onResult(editorService, symbolNavService, editor, references)];
                }
                return [2 /*return*/];
            });
        }); }, function (err) {
            // report an error
            notificationService.error(err);
        }).finally(function () {
            cts.dispose();
        });
        progressService.showWhile(promise, 250);
        return promise;
    };
    SymbolNavigationAction.prototype._onResult = function (editorService, symbolNavService, editor, model) {
        return __awaiter(this, void 0, void 0, function () {
            var gotoLocation, next, peek, targetEditor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        gotoLocation = this._getGoToPreference(editor);
                        if (!(!(editor instanceof EmbeddedCodeEditorWidget) && (this._configuration.openInPeek || (gotoLocation === 'peek' && model.references.length > 1)))) return [3 /*break*/, 1];
                        this._openInPeek(editor, model);
                        return [3 /*break*/, 3];
                    case 1:
                        next = model.firstReference();
                        peek = model.references.length > 1 && gotoLocation === 'gotoAndPeek';
                        return [4 /*yield*/, this._openReference(editor, editorService, next, this._configuration.openToSide, !peek)];
                    case 2:
                        targetEditor = _a.sent();
                        if (peek && targetEditor) {
                            this._openInPeek(targetEditor, model);
                        }
                        else {
                            model.dispose();
                        }
                        // keep remaining locations around when using
                        // 'goto'-mode
                        if (gotoLocation === 'goto') {
                            symbolNavService.put(next);
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SymbolNavigationAction.prototype._openReference = function (editor, editorService, reference, sideBySide, highlight) {
        return __awaiter(this, void 0, void 0, function () {
            var range, targetEditor, modelNow_1, ids_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        range = undefined;
                        if (isLocationLink(reference)) {
                            range = reference.targetSelectionRange;
                        }
                        if (!range) {
                            range = reference.range;
                        }
                        return [4 /*yield*/, editorService.openCodeEditor({
                                resource: reference.uri,
                                options: {
                                    selection: Range.collapseToStart(range),
                                    revealInCenterIfOutsideViewport: true
                                }
                            }, editor, sideBySide)];
                    case 1:
                        targetEditor = _a.sent();
                        if (!targetEditor) {
                            return [2 /*return*/, undefined];
                        }
                        if (highlight) {
                            modelNow_1 = targetEditor.getModel();
                            ids_1 = targetEditor.deltaDecorations([], [{ range: range, options: { className: 'symbolHighlight' } }]);
                            setTimeout(function () {
                                if (targetEditor.getModel() === modelNow_1) {
                                    targetEditor.deltaDecorations(ids_1, []);
                                }
                            }, 350);
                        }
                        return [2 /*return*/, targetEditor];
                }
            });
        });
    };
    SymbolNavigationAction.prototype._openInPeek = function (target, model) {
        var controller = ReferencesController.get(target);
        if (controller && target.hasModel()) {
            controller.toggleWidget(target.getSelection(), createCancelablePromise(function (_) { return Promise.resolve(model); }), this._configuration.openInPeek);
        }
        else {
            model.dispose();
        }
    };
    return SymbolNavigationAction;
}(EditorAction));
//#region --- DEFINITION
var DefinitionAction = /** @class */ (function (_super) {
    __extends(DefinitionAction, _super);
    function DefinitionAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefinitionAction.prototype._getLocationModel = function (model, position, token) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = ReferencesModel.bind;
                        return [4 /*yield*/, getDefinitionsAtPosition(model, position, token)];
                    case 1: return [2 /*return*/, new (_a.apply(ReferencesModel, [void 0, _b.sent(), nls.localize('def.title', 'Definitions')]))()];
                }
            });
        });
    };
    DefinitionAction.prototype._getNoResultFoundMessage = function (info) {
        return info && info.word
            ? nls.localize('noResultWord', "No definition found for '{0}'", info.word)
            : nls.localize('generic.noResults', "No definition found");
    };
    DefinitionAction.prototype._getAlternativeCommand = function (editor) {
        return editor.getOption(41 /* gotoLocation */).alternativeDefinitionCommand;
    };
    DefinitionAction.prototype._getGoToPreference = function (editor) {
        return editor.getOption(41 /* gotoLocation */).multipleDefinitions;
    };
    return DefinitionAction;
}(SymbolNavigationAction));
export { DefinitionAction };
var goToDefinitionKb = isWeb && !isStandalone
    ? 2048 /* CtrlCmd */ | 70 /* F12 */
    : 70 /* F12 */;
registerEditorAction((_a = /** @class */ (function (_super) {
        __extends(GoToDefinitionAction, _super);
        function GoToDefinitionAction() {
            var _this = _super.call(this, {
                openToSide: false,
                openInPeek: false,
                muteMessage: false
            }, {
                id: GoToDefinitionAction.id,
                label: nls.localize('actions.goToDecl.label', "Go to Definition"),
                alias: 'Go to Definition',
                precondition: ContextKeyExpr.and(EditorContextKeys.hasDefinitionProvider, EditorContextKeys.isInEmbeddedEditor.toNegated()),
                kbOpts: {
                    kbExpr: EditorContextKeys.editorTextFocus,
                    primary: goToDefinitionKb,
                    weight: 100 /* EditorContrib */
                },
                contextMenuOpts: {
                    group: 'navigation',
                    order: 1.1
                },
                menuOpts: {
                    menuId: 19 /* MenubarGoMenu */,
                    group: '4_symbol_nav',
                    order: 2,
                    title: nls.localize({ key: 'miGotoDefinition', comment: ['&& denotes a mnemonic'] }, "Go to &&Definition")
                }
            }) || this;
            CommandsRegistry.registerCommandAlias('editor.action.goToDeclaration', GoToDefinitionAction.id);
            return _this;
        }
        return GoToDefinitionAction;
    }(DefinitionAction)),
    _a.id = 'editor.action.revealDefinition',
    _a));
registerEditorAction((_b = /** @class */ (function (_super) {
        __extends(OpenDefinitionToSideAction, _super);
        function OpenDefinitionToSideAction() {
            var _this = _super.call(this, {
                openToSide: true,
                openInPeek: false,
                muteMessage: false
            }, {
                id: OpenDefinitionToSideAction.id,
                label: nls.localize('actions.goToDeclToSide.label', "Open Definition to the Side"),
                alias: 'Open Definition to the Side',
                precondition: ContextKeyExpr.and(EditorContextKeys.hasDefinitionProvider, EditorContextKeys.isInEmbeddedEditor.toNegated()),
                kbOpts: {
                    kbExpr: EditorContextKeys.editorTextFocus,
                    primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, goToDefinitionKb),
                    weight: 100 /* EditorContrib */
                }
            }) || this;
            CommandsRegistry.registerCommandAlias('editor.action.openDeclarationToTheSide', OpenDefinitionToSideAction.id);
            return _this;
        }
        return OpenDefinitionToSideAction;
    }(DefinitionAction)),
    _b.id = 'editor.action.revealDefinitionAside',
    _b));
registerEditorAction((_c = /** @class */ (function (_super) {
        __extends(PeekDefinitionAction, _super);
        function PeekDefinitionAction() {
            var _this = _super.call(this, {
                openToSide: false,
                openInPeek: true,
                muteMessage: false
            }, {
                id: PeekDefinitionAction.id,
                label: nls.localize('actions.previewDecl.label', "Peek Definition"),
                alias: 'Peek Definition',
                precondition: ContextKeyExpr.and(EditorContextKeys.hasDefinitionProvider, PeekContext.notInPeekEditor, EditorContextKeys.isInEmbeddedEditor.toNegated()),
                kbOpts: {
                    kbExpr: EditorContextKeys.editorTextFocus,
                    primary: 512 /* Alt */ | 70 /* F12 */,
                    linux: { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 68 /* F10 */ },
                    weight: 100 /* EditorContrib */
                },
                contextMenuOpts: {
                    menuId: 8 /* EditorContextPeek */,
                    group: 'peek',
                    order: 2
                }
            }) || this;
            CommandsRegistry.registerCommandAlias('editor.action.previewDeclaration', PeekDefinitionAction.id);
            return _this;
        }
        return PeekDefinitionAction;
    }(DefinitionAction)),
    _c.id = 'editor.action.peekDefinition',
    _c));
//#endregion
//#region --- DECLARATION
var DeclarationAction = /** @class */ (function (_super) {
    __extends(DeclarationAction, _super);
    function DeclarationAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeclarationAction.prototype._getLocationModel = function (model, position, token) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = ReferencesModel.bind;
                        return [4 /*yield*/, getDeclarationsAtPosition(model, position, token)];
                    case 1: return [2 /*return*/, new (_a.apply(ReferencesModel, [void 0, _b.sent(), nls.localize('decl.title', 'Declarations')]))()];
                }
            });
        });
    };
    DeclarationAction.prototype._getNoResultFoundMessage = function (info) {
        return info && info.word
            ? nls.localize('decl.noResultWord', "No declaration found for '{0}'", info.word)
            : nls.localize('decl.generic.noResults', "No declaration found");
    };
    DeclarationAction.prototype._getAlternativeCommand = function (editor) {
        return editor.getOption(41 /* gotoLocation */).alternativeDeclarationCommand;
    };
    DeclarationAction.prototype._getGoToPreference = function (editor) {
        return editor.getOption(41 /* gotoLocation */).multipleDeclarations;
    };
    return DeclarationAction;
}(SymbolNavigationAction));
registerEditorAction((_d = /** @class */ (function (_super) {
        __extends(GoToDeclarationAction, _super);
        function GoToDeclarationAction() {
            return _super.call(this, {
                openToSide: false,
                openInPeek: false,
                muteMessage: false
            }, {
                id: GoToDeclarationAction.id,
                label: nls.localize('actions.goToDeclaration.label', "Go to Declaration"),
                alias: 'Go to Declaration',
                precondition: ContextKeyExpr.and(EditorContextKeys.hasDeclarationProvider, EditorContextKeys.isInEmbeddedEditor.toNegated()),
                contextMenuOpts: {
                    group: 'navigation',
                    order: 1.3
                },
                menuOpts: {
                    menuId: 19 /* MenubarGoMenu */,
                    group: '4_symbol_nav',
                    order: 3,
                    title: nls.localize({ key: 'miGotoDeclaration', comment: ['&& denotes a mnemonic'] }, "Go to &&Declaration")
                },
            }) || this;
        }
        GoToDeclarationAction.prototype._getNoResultFoundMessage = function (info) {
            return info && info.word
                ? nls.localize('decl.noResultWord', "No declaration found for '{0}'", info.word)
                : nls.localize('decl.generic.noResults', "No declaration found");
        };
        return GoToDeclarationAction;
    }(DeclarationAction)),
    _d.id = 'editor.action.revealDeclaration',
    _d));
registerEditorAction(/** @class */ (function (_super) {
    __extends(PeekDeclarationAction, _super);
    function PeekDeclarationAction() {
        return _super.call(this, {
            openToSide: false,
            openInPeek: true,
            muteMessage: false
        }, {
            id: 'editor.action.peekDeclaration',
            label: nls.localize('actions.peekDecl.label', "Peek Declaration"),
            alias: 'Peek Declaration',
            precondition: ContextKeyExpr.and(EditorContextKeys.hasDeclarationProvider, PeekContext.notInPeekEditor, EditorContextKeys.isInEmbeddedEditor.toNegated()),
            contextMenuOpts: {
                menuId: 8 /* EditorContextPeek */,
                group: 'peek',
                order: 3
            }
        }) || this;
    }
    return PeekDeclarationAction;
}(DeclarationAction)));
//#endregion
//#region --- TYPE DEFINITION
var TypeDefinitionAction = /** @class */ (function (_super) {
    __extends(TypeDefinitionAction, _super);
    function TypeDefinitionAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TypeDefinitionAction.prototype._getLocationModel = function (model, position, token) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = ReferencesModel.bind;
                        return [4 /*yield*/, getTypeDefinitionsAtPosition(model, position, token)];
                    case 1: return [2 /*return*/, new (_a.apply(ReferencesModel, [void 0, _b.sent(), nls.localize('typedef.title', 'Type Definitions')]))()];
                }
            });
        });
    };
    TypeDefinitionAction.prototype._getNoResultFoundMessage = function (info) {
        return info && info.word
            ? nls.localize('goToTypeDefinition.noResultWord', "No type definition found for '{0}'", info.word)
            : nls.localize('goToTypeDefinition.generic.noResults', "No type definition found");
    };
    TypeDefinitionAction.prototype._getAlternativeCommand = function (editor) {
        return editor.getOption(41 /* gotoLocation */).alternativeTypeDefinitionCommand;
    };
    TypeDefinitionAction.prototype._getGoToPreference = function (editor) {
        return editor.getOption(41 /* gotoLocation */).multipleTypeDefinitions;
    };
    return TypeDefinitionAction;
}(SymbolNavigationAction));
registerEditorAction((_e = /** @class */ (function (_super) {
        __extends(GoToTypeDefinitionAction, _super);
        function GoToTypeDefinitionAction() {
            return _super.call(this, {
                openToSide: false,
                openInPeek: false,
                muteMessage: false
            }, {
                id: GoToTypeDefinitionAction.ID,
                label: nls.localize('actions.goToTypeDefinition.label', "Go to Type Definition"),
                alias: 'Go to Type Definition',
                precondition: ContextKeyExpr.and(EditorContextKeys.hasTypeDefinitionProvider, EditorContextKeys.isInEmbeddedEditor.toNegated()),
                kbOpts: {
                    kbExpr: EditorContextKeys.editorTextFocus,
                    primary: 0,
                    weight: 100 /* EditorContrib */
                },
                contextMenuOpts: {
                    group: 'navigation',
                    order: 1.4
                },
                menuOpts: {
                    menuId: 19 /* MenubarGoMenu */,
                    group: '4_symbol_nav',
                    order: 3,
                    title: nls.localize({ key: 'miGotoTypeDefinition', comment: ['&& denotes a mnemonic'] }, "Go to &&Type Definition")
                }
            }) || this;
        }
        return GoToTypeDefinitionAction;
    }(TypeDefinitionAction)),
    _e.ID = 'editor.action.goToTypeDefinition',
    _e));
registerEditorAction((_f = /** @class */ (function (_super) {
        __extends(PeekTypeDefinitionAction, _super);
        function PeekTypeDefinitionAction() {
            return _super.call(this, {
                openToSide: false,
                openInPeek: true,
                muteMessage: false
            }, {
                id: PeekTypeDefinitionAction.ID,
                label: nls.localize('actions.peekTypeDefinition.label', "Peek Type Definition"),
                alias: 'Peek Type Definition',
                precondition: ContextKeyExpr.and(EditorContextKeys.hasTypeDefinitionProvider, PeekContext.notInPeekEditor, EditorContextKeys.isInEmbeddedEditor.toNegated()),
                contextMenuOpts: {
                    menuId: 8 /* EditorContextPeek */,
                    group: 'peek',
                    order: 4
                }
            }) || this;
        }
        return PeekTypeDefinitionAction;
    }(TypeDefinitionAction)),
    _f.ID = 'editor.action.peekTypeDefinition',
    _f));
//#endregion
//#region --- IMPLEMENTATION
var ImplementationAction = /** @class */ (function (_super) {
    __extends(ImplementationAction, _super);
    function ImplementationAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImplementationAction.prototype._getLocationModel = function (model, position, token) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = ReferencesModel.bind;
                        return [4 /*yield*/, getImplementationsAtPosition(model, position, token)];
                    case 1: return [2 /*return*/, new (_a.apply(ReferencesModel, [void 0, _b.sent(), nls.localize('impl.title', 'Implementations')]))()];
                }
            });
        });
    };
    ImplementationAction.prototype._getNoResultFoundMessage = function (info) {
        return info && info.word
            ? nls.localize('goToImplementation.noResultWord', "No implementation found for '{0}'", info.word)
            : nls.localize('goToImplementation.generic.noResults', "No implementation found");
    };
    ImplementationAction.prototype._getAlternativeCommand = function (editor) {
        return editor.getOption(41 /* gotoLocation */).alternativeImplementationCommand;
    };
    ImplementationAction.prototype._getGoToPreference = function (editor) {
        return editor.getOption(41 /* gotoLocation */).multipleImplementations;
    };
    return ImplementationAction;
}(SymbolNavigationAction));
registerEditorAction((_g = /** @class */ (function (_super) {
        __extends(GoToImplementationAction, _super);
        function GoToImplementationAction() {
            return _super.call(this, {
                openToSide: false,
                openInPeek: false,
                muteMessage: false
            }, {
                id: GoToImplementationAction.ID,
                label: nls.localize('actions.goToImplementation.label', "Go to Implementations"),
                alias: 'Go to Implementations',
                precondition: ContextKeyExpr.and(EditorContextKeys.hasImplementationProvider, EditorContextKeys.isInEmbeddedEditor.toNegated()),
                kbOpts: {
                    kbExpr: EditorContextKeys.editorTextFocus,
                    primary: 2048 /* CtrlCmd */ | 70 /* F12 */,
                    weight: 100 /* EditorContrib */
                },
                menuOpts: {
                    menuId: 19 /* MenubarGoMenu */,
                    group: '4_symbol_nav',
                    order: 4,
                    title: nls.localize({ key: 'miGotoImplementation', comment: ['&& denotes a mnemonic'] }, "Go to &&Implementations")
                },
                contextMenuOpts: {
                    group: 'navigation',
                    order: 1.45
                }
            }) || this;
        }
        return GoToImplementationAction;
    }(ImplementationAction)),
    _g.ID = 'editor.action.goToImplementation',
    _g));
registerEditorAction((_h = /** @class */ (function (_super) {
        __extends(PeekImplementationAction, _super);
        function PeekImplementationAction() {
            return _super.call(this, {
                openToSide: false,
                openInPeek: true,
                muteMessage: false
            }, {
                id: PeekImplementationAction.ID,
                label: nls.localize('actions.peekImplementation.label', "Peek Implementations"),
                alias: 'Peek Implementations',
                precondition: ContextKeyExpr.and(EditorContextKeys.hasImplementationProvider, PeekContext.notInPeekEditor, EditorContextKeys.isInEmbeddedEditor.toNegated()),
                kbOpts: {
                    kbExpr: EditorContextKeys.editorTextFocus,
                    primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 70 /* F12 */,
                    weight: 100 /* EditorContrib */
                },
                contextMenuOpts: {
                    menuId: 8 /* EditorContextPeek */,
                    group: 'peek',
                    order: 5
                }
            }) || this;
        }
        return PeekImplementationAction;
    }(ImplementationAction)),
    _h.ID = 'editor.action.peekImplementation',
    _h));
//#endregion
//#region --- REFERENCES
var ReferencesAction = /** @class */ (function (_super) {
    __extends(ReferencesAction, _super);
    function ReferencesAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReferencesAction.prototype._getNoResultFoundMessage = function (info) {
        return info
            ? nls.localize('references.no', "No references found for '{0}'", info.word)
            : nls.localize('references.noGeneric', "No references found");
    };
    ReferencesAction.prototype._getAlternativeCommand = function (editor) {
        return editor.getOption(41 /* gotoLocation */).alternativeReferenceCommand;
    };
    ReferencesAction.prototype._getGoToPreference = function (editor) {
        return editor.getOption(41 /* gotoLocation */).multipleReferences;
    };
    return ReferencesAction;
}(SymbolNavigationAction));
registerEditorAction(/** @class */ (function (_super) {
    __extends(GoToReferencesAction, _super);
    function GoToReferencesAction() {
        return _super.call(this, {
            openToSide: false,
            openInPeek: false,
            muteMessage: false
        }, {
            id: 'editor.action.goToReferences',
            label: nls.localize('goToReferences.label', "Go to References"),
            alias: 'Go to References',
            precondition: ContextKeyExpr.and(EditorContextKeys.hasReferenceProvider, PeekContext.notInPeekEditor, EditorContextKeys.isInEmbeddedEditor.toNegated()),
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 1024 /* Shift */ | 70 /* F12 */,
                weight: 100 /* EditorContrib */
            },
            contextMenuOpts: {
                group: 'navigation',
                order: 1.45
            },
            menuOpts: {
                menuId: 19 /* MenubarGoMenu */,
                group: '4_symbol_nav',
                order: 5,
                title: nls.localize({ key: 'miGotoReference', comment: ['&& denotes a mnemonic'] }, "Go to &&References")
            },
        }) || this;
    }
    GoToReferencesAction.prototype._getLocationModel = function (model, position, token) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = ReferencesModel.bind;
                        return [4 /*yield*/, getReferencesAtPosition(model, position, true, token)];
                    case 1: return [2 /*return*/, new (_a.apply(ReferencesModel, [void 0, _b.sent(), nls.localize('ref.title', 'References')]))()];
                }
            });
        });
    };
    return GoToReferencesAction;
}(ReferencesAction)));
registerEditorAction(/** @class */ (function (_super) {
    __extends(PeekReferencesAction, _super);
    function PeekReferencesAction() {
        return _super.call(this, {
            openToSide: false,
            openInPeek: true,
            muteMessage: false
        }, {
            id: 'editor.action.referenceSearch.trigger',
            label: nls.localize('references.action.label', "Peek References"),
            alias: 'Peek References',
            precondition: ContextKeyExpr.and(EditorContextKeys.hasReferenceProvider, PeekContext.notInPeekEditor, EditorContextKeys.isInEmbeddedEditor.toNegated()),
            contextMenuOpts: {
                menuId: 8 /* EditorContextPeek */,
                group: 'peek',
                order: 6
            }
        }) || this;
    }
    PeekReferencesAction.prototype._getLocationModel = function (model, position, token) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = ReferencesModel.bind;
                        return [4 /*yield*/, getReferencesAtPosition(model, position, false, token)];
                    case 1: return [2 /*return*/, new (_a.apply(ReferencesModel, [void 0, _b.sent(), nls.localize('ref.title', 'References')]))()];
                }
            });
        });
    };
    return PeekReferencesAction;
}(ReferencesAction)));
//#endregion
//#region --- GENERIC goto symbols command
var GenericGoToLocationAction = /** @class */ (function (_super) {
    __extends(GenericGoToLocationAction, _super);
    function GenericGoToLocationAction(config, _references, _gotoMultipleBehaviour) {
        var _this = _super.call(this, config, {
            id: 'editor.action.goToLocation',
            label: nls.localize('label.generic', "Go To Any Symbol"),
            alias: 'Go To Any Symbol',
            precondition: ContextKeyExpr.and(PeekContext.notInPeekEditor, EditorContextKeys.isInEmbeddedEditor.toNegated()),
        }) || this;
        _this._references = _references;
        _this._gotoMultipleBehaviour = _gotoMultipleBehaviour;
        return _this;
    }
    GenericGoToLocationAction.prototype._getLocationModel = function (_model, _position, _token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new ReferencesModel(this._references, nls.localize('generic.title', 'Locations'))];
            });
        });
    };
    GenericGoToLocationAction.prototype._getNoResultFoundMessage = function (info) {
        return info && nls.localize('generic.noResult', "No results for '{0}'", info.word) || '';
    };
    GenericGoToLocationAction.prototype._getGoToPreference = function (editor) {
        var _a;
        return (_a = this._gotoMultipleBehaviour) !== null && _a !== void 0 ? _a : editor.getOption(41 /* gotoLocation */).multipleReferences;
    };
    GenericGoToLocationAction.prototype._getAlternativeCommand = function () { return ''; };
    return GenericGoToLocationAction;
}(SymbolNavigationAction));
CommandsRegistry.registerCommand({
    id: 'editor.action.goToLocations',
    description: {
        description: 'Go to locations from a position in a file',
        args: [
            { name: 'uri', description: 'The text document in which to start', constraint: URI },
            { name: 'position', description: 'The position at which to start', constraint: corePosition.Position.isIPosition },
            { name: 'locations', description: 'An array of locations.', constraint: Array },
            { name: 'multiple', description: 'Define what to do when having multiple results, either `peek`, `gotoAndPeek`, or `goto' },
        ]
    },
    handler: function (accessor, resource, position, references, multiple, openInPeek) { return __awaiter(void 0, void 0, void 0, function () {
        var editorService, editor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assertType(URI.isUri(resource));
                    assertType(corePosition.Position.isIPosition(position));
                    assertType(Array.isArray(references));
                    assertType(typeof multiple === 'undefined' || typeof multiple === 'string');
                    assertType(typeof openInPeek === 'undefined' || typeof openInPeek === 'boolean');
                    editorService = accessor.get(ICodeEditorService);
                    return [4 /*yield*/, editorService.openCodeEditor({ resource: resource }, editorService.getFocusedCodeEditor())];
                case 1:
                    editor = _a.sent();
                    if (isCodeEditor(editor)) {
                        editor.setPosition(position);
                        editor.revealPositionInCenterIfOutsideViewport(position, 0 /* Smooth */);
                        return [2 /*return*/, editor.invokeWithinContext(function (accessor) {
                                var command = new GenericGoToLocationAction({ muteMessage: true, openInPeek: Boolean(openInPeek), openToSide: false }, references, multiple);
                                accessor.get(IInstantiationService).invokeFunction(command.run.bind(command), editor);
                            })];
                    }
                    return [2 /*return*/];
            }
        });
    }); }
});
CommandsRegistry.registerCommand({
    id: 'editor.action.peekLocations',
    description: {
        description: 'Peek locations from a position in a file',
        args: [
            { name: 'uri', description: 'The text document in which to start', constraint: URI },
            { name: 'position', description: 'The position at which to start', constraint: corePosition.Position.isIPosition },
            { name: 'locations', description: 'An array of locations.', constraint: Array },
            { name: 'multiple', description: 'Define what to do when having multiple results, either `peek`, `gotoAndPeek`, or `goto' },
        ]
    },
    handler: function (accessor, resource, position, references, multiple) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            accessor.get(ICommandService).executeCommand('editor.action.goToLocations', resource, position, references, multiple, true);
            return [2 /*return*/];
        });
    }); }
});
//#endregion
//#region --- REFERENCE search special commands
CommandsRegistry.registerCommand({
    id: 'editor.action.findReferences',
    handler: function (accessor, resource, position) {
        assertType(URI.isUri(resource));
        assertType(corePosition.Position.isIPosition(position));
        var codeEditorService = accessor.get(ICodeEditorService);
        return codeEditorService.openCodeEditor({ resource: resource }, codeEditorService.getFocusedCodeEditor()).then(function (control) {
            if (!isCodeEditor(control) || !control.hasModel()) {
                return undefined;
            }
            var controller = ReferencesController.get(control);
            if (!controller) {
                return undefined;
            }
            var references = createCancelablePromise(function (token) { return getReferencesAtPosition(control.getModel(), corePosition.Position.lift(position), false, token).then(function (references) { return new ReferencesModel(references, nls.localize('ref.title', 'References')); }); });
            var range = new Range(position.lineNumber, position.column, position.lineNumber, position.column);
            return Promise.resolve(controller.toggleWidget(range, references, false));
        });
    }
});
// use NEW command
CommandsRegistry.registerCommandAlias('editor.action.showReferences', 'editor.action.peekLocations');
//#endregion
