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
import { find } from '../../../base/common/arrays.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { Lazy } from '../../../base/common/lazy.js';
import { Disposable, MutableDisposable } from '../../../base/common/lifecycle.js';
import { MessageController } from '../message/messageController.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { CodeActionMenu } from './codeActionMenu.js';
import { LightBulbWidget } from './lightBulbWidget.js';
var CodeActionUi = /** @class */ (function (_super) {
    __extends(CodeActionUi, _super);
    function CodeActionUi(_editor, quickFixActionId, preferredFixActionId, delegate, instantiationService) {
        var _this = _super.call(this) || this;
        _this._editor = _editor;
        _this.delegate = delegate;
        _this._activeCodeActions = _this._register(new MutableDisposable());
        _this._codeActionWidget = new Lazy(function () {
            return _this._register(instantiationService.createInstance(CodeActionMenu, _this._editor, {
                onSelectCodeAction: function (action) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        this.delegate.applyCodeAction(action, /* retrigger */ true);
                        return [2 /*return*/];
                    });
                }); }
            }));
        });
        _this._lightBulbWidget = new Lazy(function () {
            var widget = _this._register(instantiationService.createInstance(LightBulbWidget, _this._editor, quickFixActionId, preferredFixActionId));
            _this._register(widget.onClick(function (e) { return _this.showCodeActionList(e.trigger, e.actions, e, { includeDisabledActions: false }); }));
            return widget;
        });
        return _this;
    }
    CodeActionUi.prototype.update = function (newState) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var actions, e_1, validActionToApply, invalidAction, includeDisabledActions;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (newState.type !== 1 /* Triggered */) {
                            (_a = this._lightBulbWidget.rawValue) === null || _a === void 0 ? void 0 : _a.hide();
                            return [2 /*return*/];
                        }
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, newState.actions];
                    case 2:
                        actions = _d.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _d.sent();
                        onUnexpectedError(e_1);
                        return [2 /*return*/];
                    case 4:
                        this._lightBulbWidget.getValue().update(actions, newState.trigger, newState.position);
                        if (!(newState.trigger.type === 2 /* Manual */)) return [3 /*break*/, 11];
                        if (!((_b = newState.trigger.filter) === null || _b === void 0 ? void 0 : _b.include)) return [3 /*break*/, 10];
                        validActionToApply = this.tryGetValidActionToApply(newState.trigger, actions);
                        if (!validActionToApply) return [3 /*break*/, 9];
                        _d.label = 5;
                    case 5:
                        _d.trys.push([5, , 7, 8]);
                        return [4 /*yield*/, this.delegate.applyCodeAction(validActionToApply, false)];
                    case 6:
                        _d.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        actions.dispose();
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                    case 9:
                        // Check to see if there is an action that we would have applied were it not invalid
                        if (newState.trigger.context) {
                            invalidAction = this.getInvalidActionThatWouldHaveBeenApplied(newState.trigger, actions);
                            if (invalidAction && invalidAction.disabled) {
                                MessageController.get(this._editor).showMessage(invalidAction.disabled, newState.trigger.context.position);
                                actions.dispose();
                                return [2 /*return*/];
                            }
                        }
                        _d.label = 10;
                    case 10:
                        includeDisabledActions = !!((_c = newState.trigger.filter) === null || _c === void 0 ? void 0 : _c.include);
                        if (newState.trigger.context) {
                            if (!actions.allActions.length || !includeDisabledActions && !actions.validActions.length) {
                                MessageController.get(this._editor).showMessage(newState.trigger.context.notAvailableMessage, newState.trigger.context.position);
                                this._activeCodeActions.value = actions;
                                actions.dispose();
                                return [2 /*return*/];
                            }
                        }
                        this._activeCodeActions.value = actions;
                        this._codeActionWidget.getValue().show(newState.trigger, actions, newState.position, { includeDisabledActions: includeDisabledActions });
                        return [3 /*break*/, 12];
                    case 11:
                        // auto magically triggered
                        if (this._codeActionWidget.getValue().isVisible) {
                            // TODO: Figure out if we should update the showing menu?
                            actions.dispose();
                        }
                        else {
                            this._activeCodeActions.value = actions;
                        }
                        _d.label = 12;
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    CodeActionUi.prototype.getInvalidActionThatWouldHaveBeenApplied = function (trigger, actions) {
        if (!actions.allActions.length) {
            return undefined;
        }
        if ((trigger.autoApply === "first" /* First */ && actions.validActions.length === 0)
            || (trigger.autoApply === "ifSingle" /* IfSingle */ && actions.allActions.length === 1)) {
            return find(actions.allActions, function (action) { return action.disabled; });
        }
        return undefined;
    };
    CodeActionUi.prototype.tryGetValidActionToApply = function (trigger, actions) {
        if (!actions.validActions.length) {
            return undefined;
        }
        if ((trigger.autoApply === "first" /* First */ && actions.validActions.length > 0)
            || (trigger.autoApply === "ifSingle" /* IfSingle */ && actions.validActions.length === 1)) {
            return actions.validActions[0];
        }
        return undefined;
    };
    CodeActionUi.prototype.showCodeActionList = function (trigger, actions, at, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._codeActionWidget.getValue().show(trigger, actions, at, options);
                return [2 /*return*/];
            });
        });
    };
    CodeActionUi = __decorate([
        __param(4, IInstantiationService)
    ], CodeActionUi);
    return CodeActionUi;
}(Disposable));
export { CodeActionUi };
