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
import { Emitter } from '../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../base/common/lifecycle.js';
import * as platform from '../../../base/common/platform.js';
import * as errors from '../../../base/common/errors.js';
import { EDITOR_MODEL_DEFAULTS } from '../config/editorOptions.js';
import { TextModel } from '../model/textModel.js';
import { DocumentSemanticTokensProviderRegistry, TokenMetadata } from '../modes.js';
import { PLAINTEXT_LANGUAGE_IDENTIFIER } from '../modes/modesRegistry.js';
import { ITextResourcePropertiesService } from './textResourceConfigurationService.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { RunOnceScheduler } from '../../../base/common/async.js';
import { CancellationTokenSource } from '../../../base/common/cancellation.js';
import { SparseEncodedTokens, MultilineTokens2 } from '../model/tokensStore.js';
import { IThemeService } from '../../../platform/theme/common/themeService.js';
import { ILogService, LogLevel } from '../../../platform/log/common/log.js';
function MODEL_ID(resource) {
    return resource.toString();
}
var ModelData = /** @class */ (function () {
    function ModelData(model, onWillDispose, onDidChangeLanguage) {
        this._modelEventListeners = new DisposableStore();
        this.model = model;
        this._languageSelection = null;
        this._languageSelectionListener = null;
        this._modelEventListeners.add(model.onWillDispose(function () { return onWillDispose(model); }));
        this._modelEventListeners.add(model.onDidChangeLanguage(function (e) { return onDidChangeLanguage(model, e); }));
    }
    ModelData.prototype._disposeLanguageSelection = function () {
        if (this._languageSelectionListener) {
            this._languageSelectionListener.dispose();
            this._languageSelectionListener = null;
        }
        if (this._languageSelection) {
            this._languageSelection.dispose();
            this._languageSelection = null;
        }
    };
    ModelData.prototype.dispose = function () {
        this._modelEventListeners.dispose();
        this._disposeLanguageSelection();
    };
    ModelData.prototype.setLanguage = function (languageSelection) {
        var _this = this;
        this._disposeLanguageSelection();
        this._languageSelection = languageSelection;
        this._languageSelectionListener = this._languageSelection.onDidChange(function () { return _this.model.setMode(languageSelection.languageIdentifier); });
        this.model.setMode(languageSelection.languageIdentifier);
    };
    return ModelData;
}());
var DEFAULT_EOL = (platform.isLinux || platform.isMacintosh) ? 1 /* LF */ : 2 /* CRLF */;
var ModelServiceImpl = /** @class */ (function (_super) {
    __extends(ModelServiceImpl, _super);
    function ModelServiceImpl(configurationService, resourcePropertiesService, themeService, logService) {
        var _this = _super.call(this) || this;
        _this._onModelAdded = _this._register(new Emitter());
        _this.onModelAdded = _this._onModelAdded.event;
        _this._onModelRemoved = _this._register(new Emitter());
        _this.onModelRemoved = _this._onModelRemoved.event;
        _this._onModelModeChanged = _this._register(new Emitter());
        _this.onModelModeChanged = _this._onModelModeChanged.event;
        _this._configurationService = configurationService;
        _this._resourcePropertiesService = resourcePropertiesService;
        _this._models = {};
        _this._modelCreationOptionsByLanguageAndResource = Object.create(null);
        _this._configurationServiceSubscription = _this._configurationService.onDidChangeConfiguration(function (e) { return _this._updateModelOptions(); });
        _this._updateModelOptions();
        _this._register(new SemanticColoringFeature(_this, themeService, configurationService, logService));
        return _this;
    }
    ModelServiceImpl._readModelOptions = function (config, isForSimpleWidget) {
        var tabSize = EDITOR_MODEL_DEFAULTS.tabSize;
        if (config.editor && typeof config.editor.tabSize !== 'undefined') {
            var parsedTabSize = parseInt(config.editor.tabSize, 10);
            if (!isNaN(parsedTabSize)) {
                tabSize = parsedTabSize;
            }
            if (tabSize < 1) {
                tabSize = 1;
            }
        }
        var indentSize = tabSize;
        if (config.editor && typeof config.editor.indentSize !== 'undefined' && config.editor.indentSize !== 'tabSize') {
            var parsedIndentSize = parseInt(config.editor.indentSize, 10);
            if (!isNaN(parsedIndentSize)) {
                indentSize = parsedIndentSize;
            }
            if (indentSize < 1) {
                indentSize = 1;
            }
        }
        var insertSpaces = EDITOR_MODEL_DEFAULTS.insertSpaces;
        if (config.editor && typeof config.editor.insertSpaces !== 'undefined') {
            insertSpaces = (config.editor.insertSpaces === 'false' ? false : Boolean(config.editor.insertSpaces));
        }
        var newDefaultEOL = DEFAULT_EOL;
        var eol = config.eol;
        if (eol === '\r\n') {
            newDefaultEOL = 2 /* CRLF */;
        }
        else if (eol === '\n') {
            newDefaultEOL = 1 /* LF */;
        }
        var trimAutoWhitespace = EDITOR_MODEL_DEFAULTS.trimAutoWhitespace;
        if (config.editor && typeof config.editor.trimAutoWhitespace !== 'undefined') {
            trimAutoWhitespace = (config.editor.trimAutoWhitespace === 'false' ? false : Boolean(config.editor.trimAutoWhitespace));
        }
        var detectIndentation = EDITOR_MODEL_DEFAULTS.detectIndentation;
        if (config.editor && typeof config.editor.detectIndentation !== 'undefined') {
            detectIndentation = (config.editor.detectIndentation === 'false' ? false : Boolean(config.editor.detectIndentation));
        }
        var largeFileOptimizations = EDITOR_MODEL_DEFAULTS.largeFileOptimizations;
        if (config.editor && typeof config.editor.largeFileOptimizations !== 'undefined') {
            largeFileOptimizations = (config.editor.largeFileOptimizations === 'false' ? false : Boolean(config.editor.largeFileOptimizations));
        }
        return {
            isForSimpleWidget: isForSimpleWidget,
            tabSize: tabSize,
            indentSize: indentSize,
            insertSpaces: insertSpaces,
            detectIndentation: detectIndentation,
            defaultEOL: newDefaultEOL,
            trimAutoWhitespace: trimAutoWhitespace,
            largeFileOptimizations: largeFileOptimizations
        };
    };
    ModelServiceImpl.prototype.getCreationOptions = function (language, resource, isForSimpleWidget) {
        var creationOptions = this._modelCreationOptionsByLanguageAndResource[language + resource];
        if (!creationOptions) {
            var editor = this._configurationService.getValue('editor', { overrideIdentifier: language, resource: resource });
            var eol = this._resourcePropertiesService.getEOL(resource, language);
            creationOptions = ModelServiceImpl._readModelOptions({ editor: editor, eol: eol }, isForSimpleWidget);
            this._modelCreationOptionsByLanguageAndResource[language + resource] = creationOptions;
        }
        return creationOptions;
    };
    ModelServiceImpl.prototype._updateModelOptions = function () {
        var oldOptionsByLanguageAndResource = this._modelCreationOptionsByLanguageAndResource;
        this._modelCreationOptionsByLanguageAndResource = Object.create(null);
        // Update options on all models
        var keys = Object.keys(this._models);
        for (var i = 0, len = keys.length; i < len; i++) {
            var modelId = keys[i];
            var modelData = this._models[modelId];
            var language = modelData.model.getLanguageIdentifier().language;
            var uri = modelData.model.uri;
            var oldOptions = oldOptionsByLanguageAndResource[language + uri];
            var newOptions = this.getCreationOptions(language, uri, modelData.model.isForSimpleWidget);
            ModelServiceImpl._setModelOptionsForModel(modelData.model, newOptions, oldOptions);
        }
    };
    ModelServiceImpl._setModelOptionsForModel = function (model, newOptions, currentOptions) {
        if (currentOptions && currentOptions.defaultEOL !== newOptions.defaultEOL && model.getLineCount() === 1) {
            model.setEOL(newOptions.defaultEOL === 1 /* LF */ ? 0 /* LF */ : 1 /* CRLF */);
        }
        if (currentOptions
            && (currentOptions.detectIndentation === newOptions.detectIndentation)
            && (currentOptions.insertSpaces === newOptions.insertSpaces)
            && (currentOptions.tabSize === newOptions.tabSize)
            && (currentOptions.indentSize === newOptions.indentSize)
            && (currentOptions.trimAutoWhitespace === newOptions.trimAutoWhitespace)) {
            // Same indent opts, no need to touch the model
            return;
        }
        if (newOptions.detectIndentation) {
            model.detectIndentation(newOptions.insertSpaces, newOptions.tabSize);
            model.updateOptions({
                trimAutoWhitespace: newOptions.trimAutoWhitespace
            });
        }
        else {
            model.updateOptions({
                insertSpaces: newOptions.insertSpaces,
                tabSize: newOptions.tabSize,
                indentSize: newOptions.indentSize,
                trimAutoWhitespace: newOptions.trimAutoWhitespace
            });
        }
    };
    ModelServiceImpl.prototype.dispose = function () {
        this._configurationServiceSubscription.dispose();
        _super.prototype.dispose.call(this);
    };
    // --- begin IModelService
    ModelServiceImpl.prototype._createModelData = function (value, languageIdentifier, resource, isForSimpleWidget) {
        var _this = this;
        // create & save the model
        var options = this.getCreationOptions(languageIdentifier.language, resource, isForSimpleWidget);
        var model = new TextModel(value, options, languageIdentifier, resource);
        var modelId = MODEL_ID(model.uri);
        if (this._models[modelId]) {
            // There already exists a model with this id => this is a programmer error
            throw new Error('ModelService: Cannot add model because it already exists!');
        }
        var modelData = new ModelData(model, function (model) { return _this._onWillDispose(model); }, function (model, e) { return _this._onDidChangeLanguage(model, e); });
        this._models[modelId] = modelData;
        return modelData;
    };
    ModelServiceImpl.prototype.createModel = function (value, languageSelection, resource, isForSimpleWidget) {
        if (isForSimpleWidget === void 0) { isForSimpleWidget = false; }
        var modelData;
        if (languageSelection) {
            modelData = this._createModelData(value, languageSelection.languageIdentifier, resource, isForSimpleWidget);
            this.setMode(modelData.model, languageSelection);
        }
        else {
            modelData = this._createModelData(value, PLAINTEXT_LANGUAGE_IDENTIFIER, resource, isForSimpleWidget);
        }
        this._onModelAdded.fire(modelData.model);
        return modelData.model;
    };
    ModelServiceImpl.prototype.setMode = function (model, languageSelection) {
        if (!languageSelection) {
            return;
        }
        var modelData = this._models[MODEL_ID(model.uri)];
        if (!modelData) {
            return;
        }
        modelData.setLanguage(languageSelection);
    };
    ModelServiceImpl.prototype.getModels = function () {
        var ret = [];
        var keys = Object.keys(this._models);
        for (var i = 0, len = keys.length; i < len; i++) {
            var modelId = keys[i];
            ret.push(this._models[modelId].model);
        }
        return ret;
    };
    ModelServiceImpl.prototype.getModel = function (resource) {
        var modelId = MODEL_ID(resource);
        var modelData = this._models[modelId];
        if (!modelData) {
            return null;
        }
        return modelData.model;
    };
    // --- end IModelService
    ModelServiceImpl.prototype._onWillDispose = function (model) {
        var modelId = MODEL_ID(model.uri);
        var modelData = this._models[modelId];
        delete this._models[modelId];
        modelData.dispose();
        // clean up cache
        delete this._modelCreationOptionsByLanguageAndResource[model.getLanguageIdentifier().language + model.uri];
        this._onModelRemoved.fire(model);
    };
    ModelServiceImpl.prototype._onDidChangeLanguage = function (model, e) {
        var oldModeId = e.oldLanguage;
        var newModeId = model.getLanguageIdentifier().language;
        var oldOptions = this.getCreationOptions(oldModeId, model.uri, model.isForSimpleWidget);
        var newOptions = this.getCreationOptions(newModeId, model.uri, model.isForSimpleWidget);
        ModelServiceImpl._setModelOptionsForModel(model, newOptions, oldOptions);
        this._onModelModeChanged.fire({ model: model, oldModeId: oldModeId });
    };
    ModelServiceImpl = __decorate([
        __param(0, IConfigurationService),
        __param(1, ITextResourcePropertiesService),
        __param(2, IThemeService),
        __param(3, ILogService)
    ], ModelServiceImpl);
    return ModelServiceImpl;
}(Disposable));
export { ModelServiceImpl };
var SemanticColoringFeature = /** @class */ (function (_super) {
    __extends(SemanticColoringFeature, _super);
    function SemanticColoringFeature(modelService, themeService, configurationService, logService) {
        var _this = _super.call(this) || this;
        _this._configurationService = configurationService;
        _this._watchers = Object.create(null);
        _this._semanticStyling = _this._register(new SemanticStyling(themeService, logService));
        var isSemanticColoringEnabled = function (model) {
            var options = configurationService.getValue(SemanticColoringFeature.SETTING_ID, { overrideIdentifier: model.getLanguageIdentifier().language, resource: model.uri });
            return options && options.enabled;
        };
        var register = function (model) {
            _this._watchers[model.uri.toString()] = new ModelSemanticColoring(model, themeService, _this._semanticStyling);
        };
        var deregister = function (model, modelSemanticColoring) {
            modelSemanticColoring.dispose();
            delete _this._watchers[model.uri.toString()];
        };
        _this._register(modelService.onModelAdded(function (model) {
            if (isSemanticColoringEnabled(model)) {
                register(model);
            }
        }));
        _this._register(modelService.onModelRemoved(function (model) {
            var curr = _this._watchers[model.uri.toString()];
            if (curr) {
                deregister(model, curr);
            }
        }));
        _this._configurationService.onDidChangeConfiguration(function (e) {
            if (e.affectsConfiguration(SemanticColoringFeature.SETTING_ID)) {
                for (var _i = 0, _a = modelService.getModels(); _i < _a.length; _i++) {
                    var model = _a[_i];
                    var curr = _this._watchers[model.uri.toString()];
                    if (isSemanticColoringEnabled(model)) {
                        if (!curr) {
                            register(model);
                        }
                    }
                    else {
                        if (curr) {
                            deregister(model, curr);
                        }
                    }
                }
            }
        });
        return _this;
    }
    SemanticColoringFeature.SETTING_ID = 'editor.semanticHighlighting';
    return SemanticColoringFeature;
}(Disposable));
var SemanticStyling = /** @class */ (function (_super) {
    __extends(SemanticStyling, _super);
    function SemanticStyling(_themeService, _logService) {
        var _this = _super.call(this) || this;
        _this._themeService = _themeService;
        _this._logService = _logService;
        _this._caches = new WeakMap();
        if (_this._themeService) {
            // workaround for tests which use undefined... :/
            _this._register(_this._themeService.onThemeChange(function () {
                _this._caches = new WeakMap();
            }));
        }
        return _this;
    }
    SemanticStyling.prototype.get = function (provider) {
        if (!this._caches.has(provider)) {
            this._caches.set(provider, new SemanticColoringProviderStyling(provider.getLegend(), this._themeService, this._logService));
        }
        return this._caches.get(provider);
    };
    return SemanticStyling;
}(Disposable));
var HashTableEntry = /** @class */ (function () {
    function HashTableEntry(tokenTypeIndex, tokenModifierSet, metadata) {
        this.tokenTypeIndex = tokenTypeIndex;
        this.tokenModifierSet = tokenModifierSet;
        this.metadata = metadata;
        this.next = null;
    }
    return HashTableEntry;
}());
var HashTable = /** @class */ (function () {
    function HashTable() {
        this._elementsCount = 0;
        this._currentLengthIndex = 0;
        this._currentLength = HashTable._SIZES[this._currentLengthIndex];
        this._growCount = Math.round(this._currentLengthIndex + 1 < HashTable._SIZES.length ? 2 / 3 * this._currentLength : 0);
        this._elements = [];
        HashTable._nullOutEntries(this._elements, this._currentLength);
    }
    HashTable._nullOutEntries = function (entries, length) {
        for (var i = 0; i < length; i++) {
            entries[i] = null;
        }
    };
    HashTable.prototype._hashFunc = function (tokenTypeIndex, tokenModifierSet) {
        return ((((tokenTypeIndex << 5) - tokenTypeIndex) + tokenModifierSet) | 0) % this._currentLength; // tokenTypeIndex * 31 + tokenModifierSet, keep as int32
    };
    HashTable.prototype.get = function (tokenTypeIndex, tokenModifierSet) {
        var hash = this._hashFunc(tokenTypeIndex, tokenModifierSet);
        var p = this._elements[hash];
        while (p) {
            if (p.tokenTypeIndex === tokenTypeIndex && p.tokenModifierSet === tokenModifierSet) {
                return p;
            }
            p = p.next;
        }
        return null;
    };
    HashTable.prototype.add = function (tokenTypeIndex, tokenModifierSet, metadata) {
        this._elementsCount++;
        if (this._growCount !== 0 && this._elementsCount >= this._growCount) {
            // expand!
            var oldElements = this._elements;
            this._currentLengthIndex++;
            this._currentLength = HashTable._SIZES[this._currentLengthIndex];
            this._growCount = Math.round(this._currentLengthIndex + 1 < HashTable._SIZES.length ? 2 / 3 * this._currentLength : 0);
            this._elements = [];
            HashTable._nullOutEntries(this._elements, this._currentLength);
            for (var _i = 0, oldElements_1 = oldElements; _i < oldElements_1.length; _i++) {
                var first = oldElements_1[_i];
                var p = first;
                while (p) {
                    var oldNext = p.next;
                    p.next = null;
                    this._add(p);
                    p = oldNext;
                }
            }
        }
        this._add(new HashTableEntry(tokenTypeIndex, tokenModifierSet, metadata));
    };
    HashTable.prototype._add = function (element) {
        var hash = this._hashFunc(element.tokenTypeIndex, element.tokenModifierSet);
        element.next = this._elements[hash];
        this._elements[hash] = element;
    };
    HashTable._SIZES = [3, 7, 13, 31, 61, 127, 251, 509, 1021, 2039, 4093, 8191, 16381, 32749, 65521, 131071, 262139, 524287, 1048573, 2097143];
    return HashTable;
}());
var SemanticColoringProviderStyling = /** @class */ (function () {
    function SemanticColoringProviderStyling(_legend, _themeService, _logService) {
        this._legend = _legend;
        this._themeService = _themeService;
        this._logService = _logService;
        this._hashTable = new HashTable();
    }
    SemanticColoringProviderStyling.prototype.getMetadata = function (tokenTypeIndex, tokenModifierSet) {
        var entry = this._hashTable.get(tokenTypeIndex, tokenModifierSet);
        var metadata;
        if (entry) {
            metadata = entry.metadata;
        }
        else {
            var tokenType = this._legend.tokenTypes[tokenTypeIndex];
            var tokenModifiers = [];
            var modifierSet = tokenModifierSet;
            for (var modifierIndex = 0; modifierSet > 0 && modifierIndex < this._legend.tokenModifiers.length; modifierIndex++) {
                if (modifierSet & 1) {
                    tokenModifiers.push(this._legend.tokenModifiers[modifierIndex]);
                }
                modifierSet = modifierSet >> 1;
            }
            var tokenStyle = this._themeService.getTheme().getTokenStyleMetadata(tokenType, tokenModifiers);
            if (typeof tokenStyle === 'undefined') {
                metadata = 2147483647 /* NO_STYLING */;
            }
            else {
                metadata = 0;
                if (typeof tokenStyle.italic !== 'undefined') {
                    var italicBit = (tokenStyle.italic ? 1 /* Italic */ : 0) << 11 /* FONT_STYLE_OFFSET */;
                    metadata |= italicBit | 1 /* SEMANTIC_USE_ITALIC */;
                }
                if (typeof tokenStyle.bold !== 'undefined') {
                    var boldBit = (tokenStyle.bold ? 2 /* Bold */ : 0) << 11 /* FONT_STYLE_OFFSET */;
                    metadata |= boldBit | 2 /* SEMANTIC_USE_BOLD */;
                }
                if (typeof tokenStyle.underline !== 'undefined') {
                    var underlineBit = (tokenStyle.underline ? 4 /* Underline */ : 0) << 11 /* FONT_STYLE_OFFSET */;
                    metadata |= underlineBit | 4 /* SEMANTIC_USE_UNDERLINE */;
                }
                if (tokenStyle.foreground) {
                    var foregroundBits = (tokenStyle.foreground) << 14 /* FOREGROUND_OFFSET */;
                    metadata |= foregroundBits | 8 /* SEMANTIC_USE_FOREGROUND */;
                }
                if (metadata === 0) {
                    // Nothing!
                    metadata = 2147483647 /* NO_STYLING */;
                }
            }
            this._hashTable.add(tokenTypeIndex, tokenModifierSet, metadata);
        }
        if (this._logService.getLevel() === LogLevel.Trace) {
            var type = this._legend.tokenTypes[tokenTypeIndex];
            var modifiers = tokenModifierSet ? ' ' + this._legend.tokenModifiers.filter(function (_, i) { return tokenModifierSet & (1 << i); }).join(' ') : '';
            this._logService.trace("tokenStyleMetadata " + (entry ? '[CACHED] ' : '') + type + modifiers + ": foreground " + TokenMetadata.getForeground(metadata) + ", fontStyle " + TokenMetadata.getFontStyle(metadata).toString(2));
        }
        return metadata;
    };
    return SemanticColoringProviderStyling;
}());
var SemanticTokensResponse = /** @class */ (function () {
    function SemanticTokensResponse(_provider, resultId, data) {
        this._provider = _provider;
        this.resultId = resultId;
        this.data = data;
    }
    SemanticTokensResponse.prototype.dispose = function () {
        this._provider.releaseDocumentSemanticTokens(this.resultId);
    };
    return SemanticTokensResponse;
}());
var ModelSemanticColoring = /** @class */ (function (_super) {
    __extends(ModelSemanticColoring, _super);
    function ModelSemanticColoring(model, themeService, stylingProvider) {
        var _this = _super.call(this) || this;
        _this._isDisposed = false;
        _this._model = model;
        _this._semanticStyling = stylingProvider;
        _this._fetchSemanticTokens = _this._register(new RunOnceScheduler(function () { return _this._fetchSemanticTokensNow(); }, 300));
        _this._currentResponse = null;
        _this._currentRequestCancellationTokenSource = null;
        _this._register(_this._model.onDidChangeContent(function (e) {
            if (!_this._fetchSemanticTokens.isScheduled()) {
                _this._fetchSemanticTokens.schedule();
            }
        }));
        _this._register(DocumentSemanticTokensProviderRegistry.onDidChange(function (e) { return _this._fetchSemanticTokens.schedule(); }));
        if (themeService) {
            // workaround for tests which use undefined... :/
            _this._register(themeService.onThemeChange(function (_) {
                // clear out existing tokens
                _this._setSemanticTokens(null, null, null, []);
                _this._fetchSemanticTokens.schedule();
            }));
        }
        _this._fetchSemanticTokens.schedule(0);
        return _this;
    }
    ModelSemanticColoring.prototype.dispose = function () {
        if (this._currentResponse) {
            this._currentResponse.dispose();
            this._currentResponse = null;
        }
        if (this._currentRequestCancellationTokenSource) {
            this._currentRequestCancellationTokenSource.cancel();
            this._currentRequestCancellationTokenSource = null;
        }
        this._setSemanticTokens(null, null, null, []);
        this._isDisposed = true;
        _super.prototype.dispose.call(this);
    };
    ModelSemanticColoring.prototype._fetchSemanticTokensNow = function () {
        var _this = this;
        if (this._currentRequestCancellationTokenSource) {
            // there is already a request running, let it finish...
            return;
        }
        var provider = this._getSemanticColoringProvider();
        if (!provider) {
            return;
        }
        this._currentRequestCancellationTokenSource = new CancellationTokenSource();
        var pendingChanges = [];
        var contentChangeListener = this._model.onDidChangeContent(function (e) {
            pendingChanges.push(e);
        });
        var styling = this._semanticStyling.get(provider);
        var lastResultId = this._currentResponse ? this._currentResponse.resultId || null : null;
        var request = Promise.resolve(provider.provideDocumentSemanticTokens(this._model, lastResultId, this._currentRequestCancellationTokenSource.token));
        request.then(function (res) {
            _this._currentRequestCancellationTokenSource = null;
            contentChangeListener.dispose();
            _this._setSemanticTokens(provider, res || null, styling, pendingChanges);
        }, function (err) {
            if (!err || typeof err.message !== 'string' || err.message.indexOf('busy') === -1) {
                errors.onUnexpectedError(err);
            }
            // Semantic tokens eats up all errors and considers errors to mean that the result is temporarily not available
            // The API does not have a special error kind to express this...
            _this._currentRequestCancellationTokenSource = null;
            contentChangeListener.dispose();
            if (pendingChanges.length > 0) {
                // More changes occurred while the request was running
                if (!_this._fetchSemanticTokens.isScheduled()) {
                    _this._fetchSemanticTokens.schedule();
                }
            }
        });
    };
    ModelSemanticColoring._isSemanticTokens = function (v) {
        return v && !!(v.data);
    };
    ModelSemanticColoring._isSemanticTokensEdits = function (v) {
        return v && Array.isArray(v.edits);
    };
    ModelSemanticColoring._copy = function (src, srcOffset, dest, destOffset, length) {
        for (var i = 0; i < length; i++) {
            dest[destOffset + i] = src[srcOffset + i];
        }
    };
    ModelSemanticColoring.prototype._setSemanticTokens = function (provider, tokens, styling, pendingChanges) {
        var currentResponse = this._currentResponse;
        if (this._currentResponse) {
            this._currentResponse.dispose();
            this._currentResponse = null;
        }
        if (this._isDisposed) {
            // disposed!
            if (provider && tokens) {
                provider.releaseDocumentSemanticTokens(tokens.resultId);
            }
            return;
        }
        if (!provider || !tokens || !styling) {
            this._model.setSemanticTokens(null);
            return;
        }
        if (ModelSemanticColoring._isSemanticTokensEdits(tokens)) {
            if (!currentResponse) {
                // not possible!
                this._model.setSemanticTokens(null);
                return;
            }
            if (tokens.edits.length === 0) {
                // nothing to do!
                tokens = {
                    resultId: tokens.resultId,
                    data: currentResponse.data
                };
            }
            else {
                var deltaLength = 0;
                for (var _i = 0, _a = tokens.edits; _i < _a.length; _i++) {
                    var edit = _a[_i];
                    deltaLength += (edit.data ? edit.data.length : 0) - edit.deleteCount;
                }
                var srcData = currentResponse.data;
                var destData = new Uint32Array(srcData.length + deltaLength);
                var srcLastStart = srcData.length;
                var destLastStart = destData.length;
                for (var i = tokens.edits.length - 1; i >= 0; i--) {
                    var edit = tokens.edits[i];
                    var copyCount = srcLastStart - (edit.start + edit.deleteCount);
                    if (copyCount > 0) {
                        ModelSemanticColoring._copy(srcData, srcLastStart - copyCount, destData, destLastStart - copyCount, copyCount);
                        destLastStart -= copyCount;
                    }
                    if (edit.data) {
                        ModelSemanticColoring._copy(edit.data, 0, destData, destLastStart - edit.data.length, edit.data.length);
                        destLastStart -= edit.data.length;
                    }
                    srcLastStart = edit.start;
                }
                if (srcLastStart > 0) {
                    ModelSemanticColoring._copy(srcData, 0, destData, 0, srcLastStart);
                }
                tokens = {
                    resultId: tokens.resultId,
                    data: destData
                };
            }
        }
        if (ModelSemanticColoring._isSemanticTokens(tokens)) {
            this._currentResponse = new SemanticTokensResponse(provider, tokens.resultId, tokens.data);
            var srcData = tokens.data;
            var tokenCount = (tokens.data.length / 5) | 0;
            var tokensPerArea = Math.max(Math.ceil(tokenCount / 1024 /* DesiredMaxAreas */), 400 /* DesiredTokensPerArea */);
            var result = [];
            var tokenIndex = 0;
            var lastLineNumber = 1;
            var lastStartCharacter = 0;
            while (tokenIndex < tokenCount) {
                var tokenStartIndex = tokenIndex;
                var tokenEndIndex = Math.min(tokenStartIndex + tokensPerArea, tokenCount);
                // Keep tokens on the same line in the same area...
                if (tokenEndIndex < tokenCount) {
                    var smallTokenEndIndex = tokenEndIndex;
                    while (smallTokenEndIndex - 1 > tokenStartIndex && srcData[5 * smallTokenEndIndex] === 0) {
                        smallTokenEndIndex--;
                    }
                    if (smallTokenEndIndex - 1 === tokenStartIndex) {
                        // there are so many tokens on this line that our area would be empty, we must now go right
                        var bigTokenEndIndex = tokenEndIndex;
                        while (bigTokenEndIndex + 1 < tokenCount && srcData[5 * bigTokenEndIndex] === 0) {
                            bigTokenEndIndex++;
                        }
                        tokenEndIndex = bigTokenEndIndex;
                    }
                    else {
                        tokenEndIndex = smallTokenEndIndex;
                    }
                }
                var destData = new Uint32Array((tokenEndIndex - tokenStartIndex) * 4);
                var destOffset = 0;
                var areaLine = 0;
                while (tokenIndex < tokenEndIndex) {
                    var srcOffset = 5 * tokenIndex;
                    var deltaLine = srcData[srcOffset];
                    var deltaCharacter = srcData[srcOffset + 1];
                    var lineNumber = lastLineNumber + deltaLine;
                    var startCharacter = (deltaLine === 0 ? lastStartCharacter + deltaCharacter : deltaCharacter);
                    var length_1 = srcData[srcOffset + 2];
                    var tokenTypeIndex = srcData[srcOffset + 3];
                    var tokenModifierSet = srcData[srcOffset + 4];
                    var metadata = styling.getMetadata(tokenTypeIndex, tokenModifierSet);
                    if (metadata !== 2147483647 /* NO_STYLING */) {
                        if (areaLine === 0) {
                            areaLine = lineNumber;
                        }
                        destData[destOffset] = lineNumber - areaLine;
                        destData[destOffset + 1] = startCharacter;
                        destData[destOffset + 2] = startCharacter + length_1;
                        destData[destOffset + 3] = metadata;
                        destOffset += 4;
                    }
                    lastLineNumber = lineNumber;
                    lastStartCharacter = startCharacter;
                    tokenIndex++;
                }
                if (destOffset !== destData.length) {
                    destData = destData.subarray(0, destOffset);
                }
                var tokens_1 = new MultilineTokens2(areaLine, new SparseEncodedTokens(destData));
                result.push(tokens_1);
            }
            // Adjust incoming semantic tokens
            if (pendingChanges.length > 0) {
                // More changes occurred while the request was running
                // We need to:
                // 1. Adjust incoming semantic tokens
                // 2. Request them again
                for (var _b = 0, pendingChanges_1 = pendingChanges; _b < pendingChanges_1.length; _b++) {
                    var change = pendingChanges_1[_b];
                    for (var _c = 0, result_1 = result; _c < result_1.length; _c++) {
                        var area = result_1[_c];
                        for (var _d = 0, _e = change.changes; _d < _e.length; _d++) {
                            var singleChange = _e[_d];
                            area.applyEdit(singleChange.range, singleChange.text);
                        }
                    }
                }
                if (!this._fetchSemanticTokens.isScheduled()) {
                    this._fetchSemanticTokens.schedule();
                }
            }
            this._model.setSemanticTokens(result);
            return;
        }
        this._model.setSemanticTokens(null);
    };
    ModelSemanticColoring.prototype._getSemanticColoringProvider = function () {
        var result = DocumentSemanticTokensProviderRegistry.ordered(this._model);
        return (result.length > 0 ? result[0] : null);
    };
    return ModelSemanticColoring;
}(Disposable));
