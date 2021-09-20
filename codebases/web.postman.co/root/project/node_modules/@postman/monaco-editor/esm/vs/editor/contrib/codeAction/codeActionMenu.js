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
import { getDomNodePagePosition } from '../../../base/browser/dom.js';
import { Separator } from '../../../base/browser/ui/actionbar/actionbar.js';
import { Action } from '../../../base/common/actions.js';
import { canceled } from '../../../base/common/errors.js';
import { Lazy } from '../../../base/common/lazy.js';
import { Disposable, MutableDisposable } from '../../../base/common/lifecycle.js';
import { Position } from '../../common/core/position.js';
import { CodeActionProviderRegistry } from '../../common/modes.js';
import { codeActionCommandId, fixAllCommandId, organizeImportsCommandId, refactorCommandId, sourceActionCommandId } from './codeAction.js';
import { CodeActionCommandArgs, CodeActionKind } from './types.js';
import { IContextMenuService } from '../../../platform/contextview/browser/contextView.js';
import { IKeybindingService } from '../../../platform/keybinding/common/keybinding.js';
var CodeActionAction = /** @class */ (function (_super) {
    __extends(CodeActionAction, _super);
    function CodeActionAction(action, callback) {
        var _this = _super.call(this, action.command ? action.command.id : action.title, action.title, undefined, !action.disabled, callback) || this;
        _this.action = action;
        return _this;
    }
    return CodeActionAction;
}(Action));
var CodeActionMenu = /** @class */ (function (_super) {
    __extends(CodeActionMenu, _super);
    function CodeActionMenu(_editor, _delegate, _contextMenuService, keybindingService) {
        var _this = _super.call(this) || this;
        _this._editor = _editor;
        _this._delegate = _delegate;
        _this._contextMenuService = _contextMenuService;
        _this._visible = false;
        _this._showingActions = _this._register(new MutableDisposable());
        _this._keybindingResolver = new CodeActionKeybindingResolver({
            getKeybindings: function () { return keybindingService.getKeybindings(); }
        });
        return _this;
    }
    Object.defineProperty(CodeActionMenu.prototype, "isVisible", {
        get: function () {
            return this._visible;
        },
        enumerable: true,
        configurable: true
    });
    CodeActionMenu.prototype.show = function (trigger, codeActions, at, options) {
        return __awaiter(this, void 0, void 0, function () {
            var actionsToShow, menuActions, anchor, resolver;
            var _this = this;
            return __generator(this, function (_a) {
                actionsToShow = options.includeDisabledActions ? codeActions.allActions : codeActions.validActions;
                if (!actionsToShow.length) {
                    this._visible = false;
                    return [2 /*return*/];
                }
                if (!this._editor.getDomNode()) {
                    // cancel when editor went off-dom
                    this._visible = false;
                    throw canceled();
                }
                this._visible = true;
                this._showingActions.value = codeActions;
                menuActions = this.getMenuActions(trigger, actionsToShow);
                anchor = Position.isIPosition(at) ? this._toCoords(at) : at || { x: 0, y: 0 };
                resolver = this._keybindingResolver.getResolver();
                this._contextMenuService.showContextMenu({
                    getAnchor: function () { return anchor; },
                    getActions: function () { return menuActions; },
                    onHide: function () {
                        _this._visible = false;
                        _this._editor.focus();
                    },
                    autoSelectFirstItem: true,
                    getKeyBinding: function (action) { return action instanceof CodeActionAction ? resolver(action.action) : undefined; },
                });
                return [2 /*return*/];
            });
        });
    };
    CodeActionMenu.prototype.getMenuActions = function (trigger, actionsToShow) {
        var _this = this;
        var _a, _b;
        var toCodeActionAction = function (action) { return new CodeActionAction(action, function () { return _this._delegate.onSelectCodeAction(action); }); };
        var result = actionsToShow
            .map(toCodeActionAction);
        var model = this._editor.getModel();
        if (model && result.length) {
            for (var _i = 0, _c = CodeActionProviderRegistry.all(model); _i < _c.length; _i++) {
                var provider = _c[_i];
                if (provider._getAdditionalMenuItems) {
                    var items = provider._getAdditionalMenuItems({ trigger: trigger.type, only: (_b = (_a = trigger.filter) === null || _a === void 0 ? void 0 : _a.include) === null || _b === void 0 ? void 0 : _b.value }, actionsToShow);
                    if (items.length) {
                        result.push.apply(result, __spreadArrays([new Separator()], items.map(function (command) { return toCodeActionAction({
                            title: command.title,
                            command: command,
                        }); })));
                    }
                }
            }
        }
        return result;
    };
    CodeActionMenu.prototype._toCoords = function (position) {
        if (!this._editor.hasModel()) {
            return { x: 0, y: 0 };
        }
        this._editor.revealPosition(position, 1 /* Immediate */);
        this._editor.render();
        // Translate to absolute editor position
        var cursorCoords = this._editor.getScrolledVisiblePosition(position);
        var editorCoords = getDomNodePagePosition(this._editor.getDomNode());
        var x = editorCoords.left + cursorCoords.left;
        var y = editorCoords.top + cursorCoords.top + cursorCoords.height;
        return { x: x, y: y };
    };
    CodeActionMenu = __decorate([
        __param(2, IContextMenuService),
        __param(3, IKeybindingService)
    ], CodeActionMenu);
    return CodeActionMenu;
}(Disposable));
export { CodeActionMenu };
var CodeActionKeybindingResolver = /** @class */ (function () {
    function CodeActionKeybindingResolver(_keybindingProvider) {
        this._keybindingProvider = _keybindingProvider;
    }
    CodeActionKeybindingResolver.prototype.getResolver = function () {
        var _this = this;
        // Lazy since we may not actually ever read the value
        var allCodeActionBindings = new Lazy(function () {
            return _this._keybindingProvider.getKeybindings()
                .filter(function (item) { return CodeActionKeybindingResolver.codeActionCommands.indexOf(item.command) >= 0; })
                .filter(function (item) { return item.resolvedKeybinding; })
                .map(function (item) {
                // Special case these commands since they come built-in with VS Code and don't use 'commandArgs'
                var commandArgs = item.commandArgs;
                if (item.command === organizeImportsCommandId) {
                    commandArgs = { kind: CodeActionKind.SourceOrganizeImports.value };
                }
                else if (item.command === fixAllCommandId) {
                    commandArgs = { kind: CodeActionKind.SourceFixAll.value };
                }
                return __assign({ resolvedKeybinding: item.resolvedKeybinding }, CodeActionCommandArgs.fromUser(commandArgs, {
                    kind: CodeActionKind.None,
                    apply: "never" /* Never */
                }));
            });
        });
        return function (action) {
            if (action.kind) {
                var binding = _this.bestKeybindingForCodeAction(action, allCodeActionBindings.getValue());
                return binding === null || binding === void 0 ? void 0 : binding.resolvedKeybinding;
            }
            return undefined;
        };
    };
    CodeActionKeybindingResolver.prototype.bestKeybindingForCodeAction = function (action, candidates) {
        if (!action.kind) {
            return undefined;
        }
        var kind = new CodeActionKind(action.kind);
        return candidates
            .filter(function (candidate) { return candidate.kind.contains(kind); })
            .filter(function (candidate) {
            if (candidate.preferred) {
                // If the candidate keybinding only applies to preferred actions, the this action must also be preferred
                return action.isPreferred;
            }
            return true;
        })
            .reduceRight(function (currentBest, candidate) {
            if (!currentBest) {
                return candidate;
            }
            // Select the more specific binding
            return currentBest.kind.contains(candidate.kind) ? candidate : currentBest;
        }, undefined);
    };
    CodeActionKeybindingResolver.codeActionCommands = [
        refactorCommandId,
        codeActionCommandId,
        sourceActionCommandId,
        organizeImportsCommandId,
        fixAllCommandId
    ];
    return CodeActionKeybindingResolver;
}());
export { CodeActionKeybindingResolver };
