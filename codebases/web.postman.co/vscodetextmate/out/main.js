"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
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
Object.defineProperty(exports, "__esModule", { value: true });
var registry_1 = require("./registry");
var grammarReader = require("./grammarReader");
var theme_1 = require("./theme");
var grammar_1 = require("./grammar");
/**
 * The registry that will hold all grammars.
 */
var Registry = /** @class */ (function () {
    function Registry(options) {
        this._options = options;
        this._syncRegistry = new registry_1.SyncRegistry(theme_1.Theme.createFromRawTheme(options.theme, options.colorMap), options.onigLib);
        this._ensureGrammarCache = new Map();
    }
    Registry.prototype.dispose = function () {
        this._syncRegistry.dispose();
    };
    /**
     * Change the theme. Once called, no previous `ruleStack` should be used anymore.
     */
    Registry.prototype.setTheme = function (theme, colorMap) {
        this._syncRegistry.setTheme(theme_1.Theme.createFromRawTheme(theme, colorMap));
    };
    /**
     * Returns a lookup array for color ids.
     */
    Registry.prototype.getColorMap = function () {
        return this._syncRegistry.getColorMap();
    };
    /**
     * Load the grammar for `scopeName` and all referenced included grammars asynchronously.
     * Please do not use language id 0.
     */
    Registry.prototype.loadGrammarWithEmbeddedLanguages = function (initialScopeName, initialLanguage, embeddedLanguages) {
        return this.loadGrammarWithConfiguration(initialScopeName, initialLanguage, { embeddedLanguages: embeddedLanguages });
    };
    /**
     * Load the grammar for `scopeName` and all referenced included grammars asynchronously.
     * Please do not use language id 0.
     */
    Registry.prototype.loadGrammarWithConfiguration = function (initialScopeName, initialLanguage, configuration) {
        return this._loadGrammar(initialScopeName, initialLanguage, configuration.embeddedLanguages, configuration.tokenTypes);
    };
    /**
     * Load the grammar for `scopeName` and all referenced included grammars asynchronously.
     */
    Registry.prototype.loadGrammar = function (initialScopeName) {
        return this._loadGrammar(initialScopeName, 0, null, null);
    };
    Registry.prototype._doLoadSingleGrammar = function (scopeName) {
        return __awaiter(this, void 0, void 0, function () {
            var grammar, injections;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._options.loadGrammar(scopeName)];
                    case 1:
                        grammar = _a.sent();
                        if (grammar) {
                            injections = (typeof this._options.getInjections === 'function' ? this._options.getInjections(scopeName) : undefined);
                            this._syncRegistry.addGrammar(grammar, injections);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Registry.prototype._loadSingleGrammar = function (scopeName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this._ensureGrammarCache.has(scopeName)) {
                    this._ensureGrammarCache.set(scopeName, this._doLoadSingleGrammar(scopeName));
                }
                return [2 /*return*/, this._ensureGrammarCache.get(scopeName)];
            });
        });
    };
    Registry.prototype._collectDependenciesForDep = function (initialScopeName, result, dep) {
        var grammar = this._syncRegistry.lookup(dep.scopeName);
        if (!grammar) {
            if (dep.scopeName === initialScopeName) {
                throw new Error("No grammar provided for <" + initialScopeName + ">");
            }
            return;
        }
        if (dep instanceof grammar_1.FullScopeDependency) {
            grammar_1.collectDependencies(result, this._syncRegistry.lookup(initialScopeName), grammar);
        }
        else {
            grammar_1.collectSpecificDependencies(result, this._syncRegistry.lookup(initialScopeName), grammar, dep.include);
        }
        var injections = this._syncRegistry.injections(dep.scopeName);
        if (injections) {
            for (var _i = 0, injections_1 = injections; _i < injections_1.length; _i++) {
                var injection = injections_1[_i];
                result.add(new grammar_1.FullScopeDependency(injection));
            }
        }
    };
    Registry.prototype._loadGrammar = function (initialScopeName, initialLanguage, embeddedLanguages, tokenTypes) {
        return __awaiter(this, void 0, void 0, function () {
            var seenFullScopeRequests, seenPartialScopeRequests, Q, q, deps, _i, q_1, dep, _a, _b, dep, _c, _d, dep;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        seenFullScopeRequests = new Set();
                        seenPartialScopeRequests = new Set();
                        seenFullScopeRequests.add(initialScopeName);
                        Q = [new grammar_1.FullScopeDependency(initialScopeName)];
                        _e.label = 1;
                    case 1:
                        if (!(Q.length > 0)) return [3 /*break*/, 3];
                        q = Q;
                        Q = [];
                        return [4 /*yield*/, Promise.all(q.map(function (request) { return _this._loadSingleGrammar(request.scopeName); }))];
                    case 2:
                        _e.sent();
                        deps = new grammar_1.ScopeDependencyCollector();
                        for (_i = 0, q_1 = q; _i < q_1.length; _i++) {
                            dep = q_1[_i];
                            this._collectDependenciesForDep(initialScopeName, deps, dep);
                        }
                        for (_a = 0, _b = deps.full; _a < _b.length; _a++) {
                            dep = _b[_a];
                            if (seenFullScopeRequests.has(dep.scopeName)) {
                                // already processed
                                continue;
                            }
                            seenFullScopeRequests.add(dep.scopeName);
                            Q.push(dep);
                        }
                        for (_c = 0, _d = deps.partial; _c < _d.length; _c++) {
                            dep = _d[_c];
                            if (seenFullScopeRequests.has(dep.scopeName)) {
                                // already processed in full
                                continue;
                            }
                            if (seenPartialScopeRequests.has(dep.toKey())) {
                                // already processed
                                continue;
                            }
                            seenPartialScopeRequests.add(dep.toKey());
                            Q.push(dep);
                        }
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/, this.grammarForScopeName(initialScopeName, initialLanguage, embeddedLanguages, tokenTypes)];
                }
            });
        });
    };
    /**
     * Adds a rawGrammar.
     */
    Registry.prototype.addGrammar = function (rawGrammar, injections, initialLanguage, embeddedLanguages) {
        if (injections === void 0) { injections = []; }
        if (initialLanguage === void 0) { initialLanguage = 0; }
        if (embeddedLanguages === void 0) { embeddedLanguages = null; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._syncRegistry.addGrammar(rawGrammar, injections);
                        return [4 /*yield*/, this.grammarForScopeName(rawGrammar.scopeName, initialLanguage, embeddedLanguages)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    /**
     * Get the grammar for `scopeName`. The grammar must first be created via `loadGrammar` or `addGrammar`.
     */
    Registry.prototype.grammarForScopeName = function (scopeName, initialLanguage, embeddedLanguages, tokenTypes) {
        if (initialLanguage === void 0) { initialLanguage = 0; }
        if (embeddedLanguages === void 0) { embeddedLanguages = null; }
        if (tokenTypes === void 0) { tokenTypes = null; }
        return this._syncRegistry.grammarForScopeName(scopeName, initialLanguage, embeddedLanguages, tokenTypes);
    };
    return Registry;
}());
exports.Registry = Registry;
exports.INITIAL = grammar_1.StackElement.NULL;
exports.parseRawGrammar = grammarReader.parseRawGrammar;
//# sourceMappingURL=main.js.map