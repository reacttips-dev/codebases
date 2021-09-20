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
import { createCancelablePromise, Delayer } from '../../../base/common/async.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { Emitter } from '../../../base/common/event.js';
import { Disposable, MutableDisposable } from '../../../base/common/lifecycle.js';
import { CharacterSet } from '../../common/core/characterClassifier.js';
import * as modes from '../../common/modes.js';
import { provideSignatureHelp } from './provideSignatureHelp.js';
var ParameterHintState;
(function (ParameterHintState) {
    ParameterHintState.Default = { type: 0 /* Default */ };
    var Pending = /** @class */ (function () {
        function Pending(request) {
            this.request = request;
            this.type = 2 /* Pending */;
        }
        return Pending;
    }());
    ParameterHintState.Pending = Pending;
    var Active = /** @class */ (function () {
        function Active(hints) {
            this.hints = hints;
            this.type = 1 /* Active */;
        }
        return Active;
    }());
    ParameterHintState.Active = Active;
})(ParameterHintState || (ParameterHintState = {}));
var ParameterHintsModel = /** @class */ (function (_super) {
    __extends(ParameterHintsModel, _super);
    function ParameterHintsModel(editor, delay) {
        if (delay === void 0) { delay = ParameterHintsModel.DEFAULT_DELAY; }
        var _this = _super.call(this) || this;
        _this._onChangedHints = _this._register(new Emitter());
        _this.onChangedHints = _this._onChangedHints.event;
        _this.triggerOnType = false;
        _this._state = ParameterHintState.Default;
        _this._pendingTriggers = [];
        _this._lastSignatureHelpResult = _this._register(new MutableDisposable());
        _this.triggerChars = new CharacterSet();
        _this.retriggerChars = new CharacterSet();
        _this.triggerId = 0;
        _this.editor = editor;
        _this.throttledDelayer = new Delayer(delay);
        _this._register(_this.editor.onDidChangeConfiguration(function () { return _this.onEditorConfigurationChange(); }));
        _this._register(_this.editor.onDidChangeModel(function (e) { return _this.onModelChanged(); }));
        _this._register(_this.editor.onDidChangeModelLanguage(function (_) { return _this.onModelChanged(); }));
        _this._register(_this.editor.onDidChangeCursorSelection(function (e) { return _this.onCursorChange(e); }));
        _this._register(_this.editor.onDidChangeModelContent(function (e) { return _this.onModelContentChange(); }));
        _this._register(modes.SignatureHelpProviderRegistry.onDidChange(_this.onModelChanged, _this));
        _this._register(_this.editor.onDidType(function (text) { return _this.onDidType(text); }));
        _this.onEditorConfigurationChange();
        _this.onModelChanged();
        return _this;
    }
    Object.defineProperty(ParameterHintsModel.prototype, "state", {
        get: function () { return this._state; },
        set: function (value) {
            if (this._state.type === 2 /* Pending */) {
                this._state.request.cancel();
            }
            this._state = value;
        },
        enumerable: true,
        configurable: true
    });
    ParameterHintsModel.prototype.cancel = function (silent) {
        if (silent === void 0) { silent = false; }
        this.state = ParameterHintState.Default;
        this.throttledDelayer.cancel();
        if (!silent) {
            this._onChangedHints.fire(undefined);
        }
    };
    ParameterHintsModel.prototype.trigger = function (context, delay) {
        var _this = this;
        var model = this.editor.getModel();
        if (!model || !modes.SignatureHelpProviderRegistry.has(model)) {
            return;
        }
        var triggerId = ++this.triggerId;
        this._pendingTriggers.push(context);
        this.throttledDelayer.trigger(function () {
            return _this.doTrigger(triggerId);
        }, delay)
            .catch(onUnexpectedError);
    };
    ParameterHintsModel.prototype.next = function () {
        if (this.state.type !== 1 /* Active */) {
            return;
        }
        var length = this.state.hints.signatures.length;
        var activeSignature = this.state.hints.activeSignature;
        var last = (activeSignature % length) === (length - 1);
        var cycle = this.editor.getOption(64 /* parameterHints */).cycle;
        // If there is only one signature, or we're on last signature of list
        if ((length < 2 || last) && !cycle) {
            this.cancel();
            return;
        }
        this.updateActiveSignature(last && cycle ? 0 : activeSignature + 1);
    };
    ParameterHintsModel.prototype.previous = function () {
        if (this.state.type !== 1 /* Active */) {
            return;
        }
        var length = this.state.hints.signatures.length;
        var activeSignature = this.state.hints.activeSignature;
        var first = activeSignature === 0;
        var cycle = this.editor.getOption(64 /* parameterHints */).cycle;
        // If there is only one signature, or we're on first signature of list
        if ((length < 2 || first) && !cycle) {
            this.cancel();
            return;
        }
        this.updateActiveSignature(first && cycle ? length - 1 : activeSignature - 1);
    };
    ParameterHintsModel.prototype.updateActiveSignature = function (activeSignature) {
        if (this.state.type !== 1 /* Active */) {
            return;
        }
        this.state = new ParameterHintState.Active(__assign(__assign({}, this.state.hints), { activeSignature: activeSignature }));
        this._onChangedHints.fire(this.state.hints);
    };
    ParameterHintsModel.prototype.doTrigger = function (triggerId) {
        return __awaiter(this, void 0, void 0, function () {
            var isRetrigger, activeSignatureHelp, context, triggerContext, model, position, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isRetrigger = this.state.type === 1 /* Active */ || this.state.type === 2 /* Pending */;
                        activeSignatureHelp = this.state.type === 1 /* Active */ ? this.state.hints : undefined;
                        this.cancel(true);
                        if (this._pendingTriggers.length === 0) {
                            return [2 /*return*/, false];
                        }
                        context = this._pendingTriggers.reduce(mergeTriggerContexts);
                        this._pendingTriggers = [];
                        triggerContext = {
                            triggerKind: context.triggerKind,
                            triggerCharacter: context.triggerCharacter,
                            isRetrigger: isRetrigger,
                            activeSignatureHelp: activeSignatureHelp
                        };
                        if (!this.editor.hasModel()) {
                            return [2 /*return*/, false];
                        }
                        model = this.editor.getModel();
                        position = this.editor.getPosition();
                        this.state = new ParameterHintState.Pending(createCancelablePromise(function (token) {
                            return provideSignatureHelp(model, position, triggerContext, token);
                        }));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.state.request];
                    case 2:
                        result = _a.sent();
                        // Check that we are still resolving the correct signature help
                        if (triggerId !== this.triggerId) {
                            result === null || result === void 0 ? void 0 : result.dispose();
                            return [2 /*return*/, false];
                        }
                        if (!result || !result.value.signatures || result.value.signatures.length === 0) {
                            result === null || result === void 0 ? void 0 : result.dispose();
                            this._lastSignatureHelpResult.clear();
                            this.cancel();
                            return [2 /*return*/, false];
                        }
                        else {
                            this.state = new ParameterHintState.Active(result.value);
                            this._lastSignatureHelpResult.value = result;
                            this._onChangedHints.fire(this.state.hints);
                            return [2 /*return*/, true];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        if (triggerId === this.triggerId) {
                            this.state = ParameterHintState.Default;
                        }
                        onUnexpectedError(error_1);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(ParameterHintsModel.prototype, "isTriggered", {
        get: function () {
            return this.state.type === 1 /* Active */
                || this.state.type === 2 /* Pending */
                || this.throttledDelayer.isTriggered();
        },
        enumerable: true,
        configurable: true
    });
    ParameterHintsModel.prototype.onModelChanged = function () {
        this.cancel();
        // Update trigger characters
        this.triggerChars = new CharacterSet();
        this.retriggerChars = new CharacterSet();
        var model = this.editor.getModel();
        if (!model) {
            return;
        }
        for (var _i = 0, _a = modes.SignatureHelpProviderRegistry.ordered(model); _i < _a.length; _i++) {
            var support = _a[_i];
            for (var _b = 0, _c = support.signatureHelpTriggerCharacters || []; _b < _c.length; _b++) {
                var ch = _c[_b];
                this.triggerChars.add(ch.charCodeAt(0));
                // All trigger characters are also considered retrigger characters
                this.retriggerChars.add(ch.charCodeAt(0));
            }
            for (var _d = 0, _e = support.signatureHelpRetriggerCharacters || []; _d < _e.length; _d++) {
                var ch = _e[_d];
                this.retriggerChars.add(ch.charCodeAt(0));
            }
        }
    };
    ParameterHintsModel.prototype.onDidType = function (text) {
        if (!this.triggerOnType) {
            return;
        }
        var lastCharIndex = text.length - 1;
        var triggerCharCode = text.charCodeAt(lastCharIndex);
        if (this.triggerChars.has(triggerCharCode) || this.isTriggered && this.retriggerChars.has(triggerCharCode)) {
            this.trigger({
                triggerKind: modes.SignatureHelpTriggerKind.TriggerCharacter,
                triggerCharacter: text.charAt(lastCharIndex),
            });
        }
    };
    ParameterHintsModel.prototype.onCursorChange = function (e) {
        if (e.source === 'mouse') {
            this.cancel();
        }
        else if (this.isTriggered) {
            this.trigger({ triggerKind: modes.SignatureHelpTriggerKind.ContentChange });
        }
    };
    ParameterHintsModel.prototype.onModelContentChange = function () {
        if (this.isTriggered) {
            this.trigger({ triggerKind: modes.SignatureHelpTriggerKind.ContentChange });
        }
    };
    ParameterHintsModel.prototype.onEditorConfigurationChange = function () {
        this.triggerOnType = this.editor.getOption(64 /* parameterHints */).enabled;
        if (!this.triggerOnType) {
            this.cancel();
        }
    };
    ParameterHintsModel.prototype.dispose = function () {
        this.cancel(true);
        _super.prototype.dispose.call(this);
    };
    ParameterHintsModel.DEFAULT_DELAY = 120; // ms
    return ParameterHintsModel;
}(Disposable));
export { ParameterHintsModel };
function mergeTriggerContexts(previous, current) {
    switch (current.triggerKind) {
        case modes.SignatureHelpTriggerKind.Invoke:
            // Invoke overrides previous triggers.
            return current;
        case modes.SignatureHelpTriggerKind.ContentChange:
            // Ignore content changes triggers
            return previous;
        case modes.SignatureHelpTriggerKind.TriggerCharacter:
        default:
            return current;
    }
}
