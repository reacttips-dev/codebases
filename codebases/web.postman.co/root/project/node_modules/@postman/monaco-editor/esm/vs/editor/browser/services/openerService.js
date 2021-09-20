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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import * as dom from '../../../base/browser/dom.js';
import { LinkedList } from '../../../base/common/linkedList.js';
import { parse } from '../../../base/common/marshalling.js';
import { Schemas } from '../../../base/common/network.js';
import { normalizePath } from '../../../base/common/resources.js';
import { URI } from '../../../base/common/uri.js';
import { ICodeEditorService } from './codeEditorService.js';
import { CommandsRegistry, ICommandService } from '../../../platform/commands/common/commands.js';
import { matchesScheme } from '../../../platform/opener/common/opener.js';
import { EditorOpenContext } from '../../../platform/editor/common/editor.js';
var CommandOpener = /** @class */ (function () {
    function CommandOpener(_commandService) {
        this._commandService = _commandService;
    }
    CommandOpener.prototype.open = function (target) {
        return __awaiter(this, void 0, void 0, function () {
            var args;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!matchesScheme(target, Schemas.command)) {
                            return [2 /*return*/, false];
                        }
                        // run command or bail out if command isn't known
                        if (typeof target === 'string') {
                            target = URI.parse(target);
                        }
                        if (!CommandsRegistry.getCommand(target.path)) {
                            throw new Error("command '" + target.path + "' NOT known");
                        }
                        args = [];
                        try {
                            args = parse(decodeURIComponent(target.query));
                        }
                        catch (_c) {
                            // ignore and retry
                            try {
                                args = parse(target.query);
                            }
                            catch (_d) {
                                // ignore error
                            }
                        }
                        if (!Array.isArray(args)) {
                            args = [args];
                        }
                        return [4 /*yield*/, (_a = this._commandService).executeCommand.apply(_a, __spreadArrays([target.path], args))];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    CommandOpener = __decorate([
        __param(0, ICommandService)
    ], CommandOpener);
    return CommandOpener;
}());
var EditorOpener = /** @class */ (function () {
    function EditorOpener(_editorService) {
        this._editorService = _editorService;
    }
    EditorOpener.prototype.open = function (target, options) {
        return __awaiter(this, void 0, void 0, function () {
            var selection, match;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof target === 'string') {
                            target = URI.parse(target);
                        }
                        selection = undefined;
                        match = /^L?(\d+)(?:,(\d+))?/.exec(target.fragment);
                        if (match) {
                            // support file:///some/file.js#73,84
                            // support file:///some/file.js#L73
                            selection = {
                                startLineNumber: parseInt(match[1]),
                                startColumn: match[2] ? parseInt(match[2]) : 1
                            };
                            // remove fragment
                            target = target.with({ fragment: '' });
                        }
                        if (target.scheme === Schemas.file) {
                            target = normalizePath(target); // workaround for non-normalized paths (https://github.com/Microsoft/vscode/issues/12954)
                        }
                        return [4 /*yield*/, this._editorService.openCodeEditor({ resource: target, options: { selection: selection, context: (options === null || options === void 0 ? void 0 : options.fromUserGesture) ? EditorOpenContext.USER : EditorOpenContext.API } }, this._editorService.getFocusedCodeEditor(), options === null || options === void 0 ? void 0 : options.openToSide)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    EditorOpener = __decorate([
        __param(0, ICodeEditorService)
    ], EditorOpener);
    return EditorOpener;
}());
var OpenerService = /** @class */ (function () {
    function OpenerService(editorService, commandService) {
        var _this = this;
        this._openers = new LinkedList();
        this._validators = new LinkedList();
        this._resolvers = new LinkedList();
        // Default external opener is going through window.open()
        this._externalOpener = {
            openExternal: function (href) {
                dom.windowOpenNoOpener(href);
                return Promise.resolve(true);
            }
        };
        // Default opener: maito, http(s), command, and catch-all-editors
        this._openers.push({
            open: function (target, options) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!((options === null || options === void 0 ? void 0 : options.openExternal) || matchesScheme(target, Schemas.mailto) || matchesScheme(target, Schemas.http) || matchesScheme(target, Schemas.https))) return [3 /*break*/, 2];
                            // open externally
                            return [4 /*yield*/, this._doOpenExternal(target, options)];
                        case 1:
                            // open externally
                            _a.sent();
                            return [2 /*return*/, true];
                        case 2: return [2 /*return*/, false];
                    }
                });
            }); }
        });
        this._openers.push(new CommandOpener(commandService));
        this._openers.push(new EditorOpener(editorService));
    }
    OpenerService.prototype.open = function (target, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, validator, _b, _c, opener_1, handled;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _i = 0, _a = this._validators.toArray();
                        _d.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        validator = _a[_i];
                        return [4 /*yield*/, validator.shouldOpen(target)];
                    case 2:
                        if (!(_d.sent())) {
                            return [2 /*return*/, false];
                        }
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        _b = 0, _c = this._openers.toArray();
                        _d.label = 5;
                    case 5:
                        if (!(_b < _c.length)) return [3 /*break*/, 8];
                        opener_1 = _c[_b];
                        return [4 /*yield*/, opener_1.open(target, options)];
                    case 6:
                        handled = _d.sent();
                        if (handled) {
                            return [2 /*return*/, true];
                        }
                        _d.label = 7;
                    case 7:
                        _b++;
                        return [3 /*break*/, 5];
                    case 8: return [2 /*return*/, false];
                }
            });
        });
    };
    OpenerService.prototype.resolveExternalUri = function (resource, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, resolver, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = this._resolvers.toArray();
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        resolver = _a[_i];
                        return [4 /*yield*/, resolver.resolveExternalUri(resource, options)];
                    case 2:
                        result = _b.sent();
                        if (result) {
                            return [2 /*return*/, result];
                        }
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, { resolved: resource, dispose: function () { } }];
                }
            });
        });
    };
    OpenerService.prototype._doOpenExternal = function (resource, options) {
        return __awaiter(this, void 0, void 0, function () {
            var uri, resolved;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uri = typeof resource === 'string' ? URI.parse(resource) : resource;
                        return [4 /*yield*/, this.resolveExternalUri(uri, options)];
                    case 1:
                        resolved = (_a.sent()).resolved;
                        if (typeof resource === 'string' && uri.toString() === resolved.toString()) {
                            // open the url-string AS IS
                            return [2 /*return*/, this._externalOpener.openExternal(resource)];
                        }
                        else {
                            // open URI using the toString(noEncode)+encodeURI-trick
                            return [2 /*return*/, this._externalOpener.openExternal(encodeURI(resolved.toString(true)))];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    OpenerService.prototype.dispose = function () {
        this._validators.clear();
    };
    OpenerService = __decorate([
        __param(0, ICodeEditorService),
        __param(1, ICommandService)
    ], OpenerService);
    return OpenerService;
}());
export { OpenerService };
