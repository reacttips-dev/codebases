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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { Lazy } from '../../../base/common/lazy.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { escapeRegExpCharacters } from '../../../base/common/strings.js';
import { EditorAction, EditorCommand } from '../../browser/editorExtensions.js';
import { IBulkEditService } from '../../browser/services/bulkEditService.js';
import { EditorContextKeys } from '../../common/editorContextKeys.js';
import { codeActionCommandId, fixAllCommandId, organizeImportsCommandId, refactorCommandId, sourceActionCommandId } from './codeAction.js';
import { CodeActionUi } from './codeActionUi.js';
import { MessageController } from '../message/messageController.js';
import * as nls from '../../../nls.js';
import { ICommandService } from '../../../platform/commands/common/commands.js';
import { ContextKeyExpr, IContextKeyService } from '../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { IMarkerService } from '../../../platform/markers/common/markers.js';
import { INotificationService } from '../../../platform/notification/common/notification.js';
import { IEditorProgressService } from '../../../platform/progress/common/progress.js';
import { ITelemetryService } from '../../../platform/telemetry/common/telemetry.js';
import { CodeActionModel, SUPPORTED_CODE_ACTIONS } from './codeActionModel.js';
import { CodeActionCommandArgs, CodeActionKind } from './types.js';
function contextKeyForSupportedActions(kind) {
    return ContextKeyExpr.regex(SUPPORTED_CODE_ACTIONS.keys()[0], new RegExp('(\\s|^)' + escapeRegExpCharacters(kind.value) + '\\b'));
}
var argsSchema = {
    type: 'object',
    required: ['kind'],
    defaultSnippets: [{ body: { kind: '' } }],
    properties: {
        'kind': {
            type: 'string',
            description: nls.localize('args.schema.kind', "Kind of the code action to run."),
        },
        'apply': {
            type: 'string',
            description: nls.localize('args.schema.apply', "Controls when the returned actions are applied."),
            default: "ifSingle" /* IfSingle */,
            enum: ["first" /* First */, "ifSingle" /* IfSingle */, "never" /* Never */],
            enumDescriptions: [
                nls.localize('args.schema.apply.first', "Always apply the first returned code action."),
                nls.localize('args.schema.apply.ifSingle', "Apply the first returned code action if it is the only one."),
                nls.localize('args.schema.apply.never', "Do not apply the returned code actions."),
            ]
        },
        'preferred': {
            type: 'boolean',
            default: false,
            description: nls.localize('args.schema.preferred', "Controls if only preferred code actions should be returned."),
        }
    }
};
var QuickFixController = /** @class */ (function (_super) {
    __extends(QuickFixController, _super);
    function QuickFixController(editor, markerService, contextKeyService, progressService, _instantiationService) {
        var _this = _super.call(this) || this;
        _this._instantiationService = _instantiationService;
        _this._editor = editor;
        _this._model = _this._register(new CodeActionModel(_this._editor, markerService, contextKeyService, progressService));
        _this._register(_this._model.onDidChangeState(function (newState) { return _this.update(newState); }));
        _this._ui = new Lazy(function () {
            return _this._register(new CodeActionUi(editor, QuickFixAction.Id, AutoFixAction.Id, {
                applyCodeAction: function (action, retrigger) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, , 2, 3]);
                                return [4 /*yield*/, this._applyCodeAction(action)];
                            case 1:
                                _a.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                if (retrigger) {
                                    this._trigger({ type: 1 /* Auto */, filter: {} });
                                }
                                return [7 /*endfinally*/];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); }
            }, _this._instantiationService));
        });
        return _this;
    }
    QuickFixController.get = function (editor) {
        return editor.getContribution(QuickFixController.ID);
    };
    QuickFixController.prototype.update = function (newState) {
        this._ui.getValue().update(newState);
    };
    QuickFixController.prototype.showCodeActions = function (trigger, actions, at) {
        return this._ui.getValue().showCodeActionList(trigger, actions, at, { includeDisabledActions: false });
    };
    QuickFixController.prototype.manualTriggerAtCurrentPosition = function (notAvailableMessage, filter, autoApply) {
        if (!this._editor.hasModel()) {
            return;
        }
        MessageController.get(this._editor).closeMessage();
        var triggerPosition = this._editor.getPosition();
        this._trigger({ type: 2 /* Manual */, filter: filter, autoApply: autoApply, context: { notAvailableMessage: notAvailableMessage, position: triggerPosition } });
    };
    QuickFixController.prototype._trigger = function (trigger) {
        return this._model.trigger(trigger);
    };
    QuickFixController.prototype._applyCodeAction = function (action) {
        return this._instantiationService.invokeFunction(applyCodeAction, action, this._editor);
    };
    QuickFixController.ID = 'editor.contrib.quickFixController';
    QuickFixController = __decorate([
        __param(1, IMarkerService),
        __param(2, IContextKeyService),
        __param(3, IEditorProgressService),
        __param(4, IInstantiationService)
    ], QuickFixController);
    return QuickFixController;
}(Disposable));
export { QuickFixController };
export function applyCodeAction(accessor, action, editor) {
    return __awaiter(this, void 0, void 0, function () {
        var bulkEditService, commandService, telemetryService, notificationService, err_1, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bulkEditService = accessor.get(IBulkEditService);
                    commandService = accessor.get(ICommandService);
                    telemetryService = accessor.get(ITelemetryService);
                    notificationService = accessor.get(INotificationService);
                    telemetryService.publicLog2('codeAction.applyCodeAction', {
                        codeActionTitle: action.title,
                        codeActionKind: action.kind,
                        codeActionIsPreferred: !!action.isPreferred,
                    });
                    if (!action.edit) return [3 /*break*/, 2];
                    return [4 /*yield*/, bulkEditService.apply(action.edit, { editor: editor })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (!action.command) return [3 /*break*/, 6];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, commandService.executeCommand.apply(commandService, __spreadArrays([action.command.id], (action.command.arguments || [])))];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    message = asMessage(err_1);
                    notificationService.error(typeof message === 'string'
                        ? message
                        : nls.localize('applyCodeActionFailed', "An unknown error occurred while applying the code action"));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function asMessage(err) {
    if (typeof err === 'string') {
        return err;
    }
    else if (err instanceof Error && typeof err.message === 'string') {
        return err.message;
    }
    else {
        return undefined;
    }
}
function triggerCodeActionsForEditorSelection(editor, notAvailableMessage, filter, autoApply) {
    if (editor.hasModel()) {
        var controller = QuickFixController.get(editor);
        if (controller) {
            controller.manualTriggerAtCurrentPosition(notAvailableMessage, filter, autoApply);
        }
    }
}
var QuickFixAction = /** @class */ (function (_super) {
    __extends(QuickFixAction, _super);
    function QuickFixAction() {
        return _super.call(this, {
            id: QuickFixAction.Id,
            label: nls.localize('quickfix.trigger.label', "Quick Fix..."),
            alias: 'Quick Fix...',
            precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasCodeActionsProvider),
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 2048 /* CtrlCmd */ | 84 /* US_DOT */,
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    QuickFixAction.prototype.run = function (_accessor, editor) {
        return triggerCodeActionsForEditorSelection(editor, nls.localize('editor.action.quickFix.noneMessage', "No code actions available"), undefined, undefined);
    };
    QuickFixAction.Id = 'editor.action.quickFix';
    return QuickFixAction;
}(EditorAction));
export { QuickFixAction };
var CodeActionCommand = /** @class */ (function (_super) {
    __extends(CodeActionCommand, _super);
    function CodeActionCommand() {
        return _super.call(this, {
            id: codeActionCommandId,
            precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasCodeActionsProvider),
            description: {
                description: 'Trigger a code action',
                args: [{ name: 'args', schema: argsSchema, }]
            }
        }) || this;
    }
    CodeActionCommand.prototype.runEditorCommand = function (_accessor, editor, userArgs) {
        var args = CodeActionCommandArgs.fromUser(userArgs, {
            kind: CodeActionKind.Empty,
            apply: "ifSingle" /* IfSingle */,
        });
        return triggerCodeActionsForEditorSelection(editor, typeof (userArgs === null || userArgs === void 0 ? void 0 : userArgs.kind) === 'string'
            ? args.preferred
                ? nls.localize('editor.action.codeAction.noneMessage.preferred.kind', "No preferred code actions for '{0}' available", userArgs.kind)
                : nls.localize('editor.action.codeAction.noneMessage.kind', "No code actions for '{0}' available", userArgs.kind)
            : args.preferred
                ? nls.localize('editor.action.codeAction.noneMessage.preferred', "No preferred code actions available")
                : nls.localize('editor.action.codeAction.noneMessage', "No code actions available"), {
            include: args.kind,
            includeSourceActions: true,
            onlyIncludePreferredActions: args.preferred,
        }, args.apply);
    };
    return CodeActionCommand;
}(EditorCommand));
export { CodeActionCommand };
var RefactorAction = /** @class */ (function (_super) {
    __extends(RefactorAction, _super);
    function RefactorAction() {
        return _super.call(this, {
            id: refactorCommandId,
            label: nls.localize('refactor.label', "Refactor..."),
            alias: 'Refactor...',
            precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasCodeActionsProvider),
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 48 /* KEY_R */,
                mac: {
                    primary: 256 /* WinCtrl */ | 1024 /* Shift */ | 48 /* KEY_R */
                },
                weight: 100 /* EditorContrib */
            },
            contextMenuOpts: {
                group: '1_modification',
                order: 2,
                when: ContextKeyExpr.and(EditorContextKeys.writable, contextKeyForSupportedActions(CodeActionKind.Refactor)),
            },
            description: {
                description: 'Refactor...',
                args: [{ name: 'args', schema: argsSchema }]
            }
        }) || this;
    }
    RefactorAction.prototype.run = function (_accessor, editor, userArgs) {
        var args = CodeActionCommandArgs.fromUser(userArgs, {
            kind: CodeActionKind.Refactor,
            apply: "never" /* Never */
        });
        return triggerCodeActionsForEditorSelection(editor, typeof (userArgs === null || userArgs === void 0 ? void 0 : userArgs.kind) === 'string'
            ? args.preferred
                ? nls.localize('editor.action.refactor.noneMessage.preferred.kind', "No preferred refactorings for '{0}' available", userArgs.kind)
                : nls.localize('editor.action.refactor.noneMessage.kind', "No refactorings for '{0}' available", userArgs.kind)
            : args.preferred
                ? nls.localize('editor.action.refactor.noneMessage.preferred', "No preferred refactorings available")
                : nls.localize('editor.action.refactor.noneMessage', "No refactorings available"), {
            include: CodeActionKind.Refactor.contains(args.kind) ? args.kind : CodeActionKind.None,
            onlyIncludePreferredActions: args.preferred,
        }, args.apply);
    };
    return RefactorAction;
}(EditorAction));
export { RefactorAction };
var SourceAction = /** @class */ (function (_super) {
    __extends(SourceAction, _super);
    function SourceAction() {
        return _super.call(this, {
            id: sourceActionCommandId,
            label: nls.localize('source.label', "Source Action..."),
            alias: 'Source Action...',
            precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasCodeActionsProvider),
            contextMenuOpts: {
                group: '1_modification',
                order: 2.1,
                when: ContextKeyExpr.and(EditorContextKeys.writable, contextKeyForSupportedActions(CodeActionKind.Source)),
            },
            description: {
                description: 'Source Action...',
                args: [{ name: 'args', schema: argsSchema }]
            }
        }) || this;
    }
    SourceAction.prototype.run = function (_accessor, editor, userArgs) {
        var args = CodeActionCommandArgs.fromUser(userArgs, {
            kind: CodeActionKind.Source,
            apply: "never" /* Never */
        });
        return triggerCodeActionsForEditorSelection(editor, typeof (userArgs === null || userArgs === void 0 ? void 0 : userArgs.kind) === 'string'
            ? args.preferred
                ? nls.localize('editor.action.source.noneMessage.preferred.kind', "No preferred source actions for '{0}' available", userArgs.kind)
                : nls.localize('editor.action.source.noneMessage.kind', "No source actions for '{0}' available", userArgs.kind)
            : args.preferred
                ? nls.localize('editor.action.source.noneMessage.preferred', "No preferred source actions available")
                : nls.localize('editor.action.source.noneMessage', "No source actions available"), {
            include: CodeActionKind.Source.contains(args.kind) ? args.kind : CodeActionKind.None,
            includeSourceActions: true,
            onlyIncludePreferredActions: args.preferred,
        }, args.apply);
    };
    return SourceAction;
}(EditorAction));
export { SourceAction };
var OrganizeImportsAction = /** @class */ (function (_super) {
    __extends(OrganizeImportsAction, _super);
    function OrganizeImportsAction() {
        return _super.call(this, {
            id: organizeImportsCommandId,
            label: nls.localize('organizeImports.label', "Organize Imports"),
            alias: 'Organize Imports',
            precondition: ContextKeyExpr.and(EditorContextKeys.writable, contextKeyForSupportedActions(CodeActionKind.SourceOrganizeImports)),
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 1024 /* Shift */ | 512 /* Alt */ | 45 /* KEY_O */,
                weight: 100 /* EditorContrib */
            },
        }) || this;
    }
    OrganizeImportsAction.prototype.run = function (_accessor, editor) {
        return triggerCodeActionsForEditorSelection(editor, nls.localize('editor.action.organize.noneMessage', "No organize imports action available"), { include: CodeActionKind.SourceOrganizeImports, includeSourceActions: true }, "ifSingle" /* IfSingle */);
    };
    return OrganizeImportsAction;
}(EditorAction));
export { OrganizeImportsAction };
var FixAllAction = /** @class */ (function (_super) {
    __extends(FixAllAction, _super);
    function FixAllAction() {
        return _super.call(this, {
            id: fixAllCommandId,
            label: nls.localize('fixAll.label', "Fix All"),
            alias: 'Fix All',
            precondition: ContextKeyExpr.and(EditorContextKeys.writable, contextKeyForSupportedActions(CodeActionKind.SourceFixAll))
        }) || this;
    }
    FixAllAction.prototype.run = function (_accessor, editor) {
        return triggerCodeActionsForEditorSelection(editor, nls.localize('fixAll.noneMessage', "No fix all action available"), { include: CodeActionKind.SourceFixAll, includeSourceActions: true }, "ifSingle" /* IfSingle */);
    };
    return FixAllAction;
}(EditorAction));
export { FixAllAction };
var AutoFixAction = /** @class */ (function (_super) {
    __extends(AutoFixAction, _super);
    function AutoFixAction() {
        return _super.call(this, {
            id: AutoFixAction.Id,
            label: nls.localize('autoFix.label', "Auto Fix..."),
            alias: 'Auto Fix...',
            precondition: ContextKeyExpr.and(EditorContextKeys.writable, contextKeyForSupportedActions(CodeActionKind.QuickFix)),
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 512 /* Alt */ | 1024 /* Shift */ | 84 /* US_DOT */,
                mac: {
                    primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 84 /* US_DOT */
                },
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    AutoFixAction.prototype.run = function (_accessor, editor) {
        return triggerCodeActionsForEditorSelection(editor, nls.localize('editor.action.autoFix.noneMessage', "No auto fixes available"), {
            include: CodeActionKind.QuickFix,
            onlyIncludePreferredActions: true
        }, "ifSingle" /* IfSingle */);
    };
    AutoFixAction.Id = 'editor.action.autoFix';
    return AutoFixAction;
}(EditorAction));
export { AutoFixAction };
