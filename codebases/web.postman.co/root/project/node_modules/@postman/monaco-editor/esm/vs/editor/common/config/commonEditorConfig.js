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
import * as nls from '../../../nls.js';
import { Emitter } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import * as objects from '../../../base/common/objects.js';
import * as arrays from '../../../base/common/arrays.js';
import { editorOptionsRegistry, ValidatedEditorOptions, ConfigurationChangedEvent, EDITOR_MODEL_DEFAULTS } from './editorOptions.js';
import { EditorZoom } from './editorZoom.js';
import { BareFontInfo } from './fontInfo.js';
import { Extensions } from '../../../platform/configuration/common/configurationRegistry.js';
import { Registry } from '../../../platform/registry/common/platform.js';
import { forEach } from '../../../base/common/collections.js';
export var TabFocus = new /** @class */ (function () {
    function class_1() {
        this._tabFocus = false;
        this._onDidChangeTabFocus = new Emitter();
        this.onDidChangeTabFocus = this._onDidChangeTabFocus.event;
    }
    class_1.prototype.getTabFocusMode = function () {
        return this._tabFocus;
    };
    class_1.prototype.setTabFocusMode = function (tabFocusMode) {
        if (this._tabFocus === tabFocusMode) {
            return;
        }
        this._tabFocus = tabFocusMode;
        this._onDidChangeTabFocus.fire(this._tabFocus);
    };
    return class_1;
}());
var hasOwnProperty = Object.hasOwnProperty;
var ComputedEditorOptions = /** @class */ (function () {
    function ComputedEditorOptions() {
        this._values = [];
    }
    ComputedEditorOptions.prototype._read = function (id) {
        return this._values[id];
    };
    ComputedEditorOptions.prototype.get = function (id) {
        return this._values[id];
    };
    ComputedEditorOptions.prototype._write = function (id, value) {
        this._values[id] = value;
    };
    return ComputedEditorOptions;
}());
export { ComputedEditorOptions };
var RawEditorOptions = /** @class */ (function () {
    function RawEditorOptions() {
        this._values = [];
    }
    RawEditorOptions.prototype._read = function (id) {
        return this._values[id];
    };
    RawEditorOptions.prototype._write = function (id, value) {
        this._values[id] = value;
    };
    return RawEditorOptions;
}());
var EditorConfiguration2 = /** @class */ (function () {
    function EditorConfiguration2() {
    }
    EditorConfiguration2.readOptions = function (_options) {
        var options = _options;
        var result = new RawEditorOptions();
        for (var _i = 0, editorOptionsRegistry_2 = editorOptionsRegistry; _i < editorOptionsRegistry_2.length; _i++) {
            var editorOption = editorOptionsRegistry_2[_i];
            var value = (editorOption.name === '_never_' ? undefined : options[editorOption.name]);
            result._write(editorOption.id, value);
        }
        return result;
    };
    EditorConfiguration2.validateOptions = function (options) {
        var result = new ValidatedEditorOptions();
        for (var _i = 0, editorOptionsRegistry_3 = editorOptionsRegistry; _i < editorOptionsRegistry_3.length; _i++) {
            var editorOption = editorOptionsRegistry_3[_i];
            result._write(editorOption.id, editorOption.validate(options._read(editorOption.id)));
        }
        return result;
    };
    EditorConfiguration2.computeOptions = function (options, env) {
        var result = new ComputedEditorOptions();
        for (var _i = 0, editorOptionsRegistry_4 = editorOptionsRegistry; _i < editorOptionsRegistry_4.length; _i++) {
            var editorOption = editorOptionsRegistry_4[_i];
            result._write(editorOption.id, editorOption.compute(env, result, options._read(editorOption.id)));
        }
        return result;
    };
    EditorConfiguration2._deepEquals = function (a, b) {
        if (typeof a !== 'object' || typeof b !== 'object') {
            return (a === b);
        }
        if (Array.isArray(a) || Array.isArray(b)) {
            return (Array.isArray(a) && Array.isArray(b) ? arrays.equals(a, b) : false);
        }
        for (var key in a) {
            if (!EditorConfiguration2._deepEquals(a[key], b[key])) {
                return false;
            }
        }
        return true;
    };
    EditorConfiguration2.checkEquals = function (a, b) {
        var result = [];
        var somethingChanged = false;
        for (var _i = 0, editorOptionsRegistry_5 = editorOptionsRegistry; _i < editorOptionsRegistry_5.length; _i++) {
            var editorOption = editorOptionsRegistry_5[_i];
            var changed = !EditorConfiguration2._deepEquals(a._read(editorOption.id), b._read(editorOption.id));
            result[editorOption.id] = changed;
            if (changed) {
                somethingChanged = true;
            }
        }
        return (somethingChanged ? new ConfigurationChangedEvent(result) : null);
    };
    return EditorConfiguration2;
}());
/**
 * Compatibility with old options
 */
function migrateOptions(options) {
    var wordWrap = options.wordWrap;
    if (wordWrap === true) {
        options.wordWrap = 'on';
    }
    else if (wordWrap === false) {
        options.wordWrap = 'off';
    }
    var lineNumbers = options.lineNumbers;
    if (lineNumbers === true) {
        options.lineNumbers = 'on';
    }
    else if (lineNumbers === false) {
        options.lineNumbers = 'off';
    }
    var autoClosingBrackets = options.autoClosingBrackets;
    if (autoClosingBrackets === false) {
        options.autoClosingBrackets = 'never';
        options.autoClosingQuotes = 'never';
        options.autoSurround = 'never';
    }
    var cursorBlinking = options.cursorBlinking;
    if (cursorBlinking === 'visible') {
        options.cursorBlinking = 'solid';
    }
    var renderWhitespace = options.renderWhitespace;
    if (renderWhitespace === true) {
        options.renderWhitespace = 'boundary';
    }
    else if (renderWhitespace === false) {
        options.renderWhitespace = 'none';
    }
    var renderLineHighlight = options.renderLineHighlight;
    if (renderLineHighlight === true) {
        options.renderLineHighlight = 'line';
    }
    else if (renderLineHighlight === false) {
        options.renderLineHighlight = 'none';
    }
    var acceptSuggestionOnEnter = options.acceptSuggestionOnEnter;
    if (acceptSuggestionOnEnter === true) {
        options.acceptSuggestionOnEnter = 'on';
    }
    else if (acceptSuggestionOnEnter === false) {
        options.acceptSuggestionOnEnter = 'off';
    }
    var tabCompletion = options.tabCompletion;
    if (tabCompletion === false) {
        options.tabCompletion = 'off';
    }
    else if (tabCompletion === true) {
        options.tabCompletion = 'onlySnippets';
    }
    var suggest = options.suggest;
    if (suggest && typeof suggest.filteredTypes === 'object' && suggest.filteredTypes) {
        var mapping = {};
        mapping['method'] = 'showMethods';
        mapping['function'] = 'showFunctions';
        mapping['constructor'] = 'showConstructors';
        mapping['field'] = 'showFields';
        mapping['variable'] = 'showVariables';
        mapping['class'] = 'showClasses';
        mapping['struct'] = 'showStructs';
        mapping['interface'] = 'showInterfaces';
        mapping['module'] = 'showModules';
        mapping['property'] = 'showProperties';
        mapping['event'] = 'showEvents';
        mapping['operator'] = 'showOperators';
        mapping['unit'] = 'showUnits';
        mapping['value'] = 'showValues';
        mapping['constant'] = 'showConstants';
        mapping['enum'] = 'showEnums';
        mapping['enumMember'] = 'showEnumMembers';
        mapping['keyword'] = 'showKeywords';
        mapping['text'] = 'showWords';
        mapping['color'] = 'showColors';
        mapping['file'] = 'showFiles';
        mapping['reference'] = 'showReferences';
        mapping['folder'] = 'showFolders';
        mapping['typeParameter'] = 'showTypeParameters';
        mapping['snippet'] = 'showSnippets';
        forEach(mapping, function (entry) {
            var value = suggest.filteredTypes[entry.key];
            if (value === false) {
                suggest[entry.value] = value;
            }
        });
        // delete (<any>suggest).filteredTypes;
    }
    var hover = options.hover;
    if (hover === true) {
        options.hover = {
            enabled: true
        };
    }
    else if (hover === false) {
        options.hover = {
            enabled: false
        };
    }
    var parameterHints = options.parameterHints;
    if (parameterHints === true) {
        options.parameterHints = {
            enabled: true
        };
    }
    else if (parameterHints === false) {
        options.parameterHints = {
            enabled: false
        };
    }
    var autoIndent = options.autoIndent;
    if (autoIndent === true) {
        options.autoIndent = 'full';
    }
    else if (autoIndent === false) {
        options.autoIndent = 'advanced';
    }
    var matchBrackets = options.matchBrackets;
    if (matchBrackets === true) {
        options.matchBrackets = 'always';
    }
    else if (matchBrackets === false) {
        options.matchBrackets = 'never';
    }
}
function deepCloneAndMigrateOptions(_options) {
    var options = objects.deepClone(_options);
    migrateOptions(options);
    return options;
}
var CommonEditorConfiguration = /** @class */ (function (_super) {
    __extends(CommonEditorConfiguration, _super);
    function CommonEditorConfiguration(isSimpleWidget, _options) {
        var _this = _super.call(this) || this;
        _this._onDidChange = _this._register(new Emitter());
        _this.onDidChange = _this._onDidChange.event;
        _this.isSimpleWidget = isSimpleWidget;
        _this._isDominatedByLongLines = false;
        _this._lineNumbersDigitCount = 1;
        _this._rawOptions = deepCloneAndMigrateOptions(_options);
        _this._readOptions = EditorConfiguration2.readOptions(_this._rawOptions);
        _this._validatedOptions = EditorConfiguration2.validateOptions(_this._readOptions);
        _this._register(EditorZoom.onDidChangeZoomLevel(function (_) { return _this._recomputeOptions(); }));
        _this._register(TabFocus.onDidChangeTabFocus(function (_) { return _this._recomputeOptions(); }));
        return _this;
    }
    CommonEditorConfiguration.prototype.observeReferenceElement = function (dimension) {
    };
    CommonEditorConfiguration.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
    };
    CommonEditorConfiguration.prototype._recomputeOptions = function () {
        var oldOptions = this.options;
        var newOptions = this._computeInternalOptions();
        if (!oldOptions) {
            this.options = newOptions;
        }
        else {
            var changeEvent = EditorConfiguration2.checkEquals(oldOptions, newOptions);
            if (changeEvent === null) {
                // nothing changed!
                return;
            }
            this.options = newOptions;
            this._onDidChange.fire(changeEvent);
        }
    };
    CommonEditorConfiguration.prototype.getRawOptions = function () {
        return this._rawOptions;
    };
    CommonEditorConfiguration.prototype._computeInternalOptions = function () {
        var partialEnv = this._getEnvConfiguration();
        var bareFontInfo = BareFontInfo.createFromValidatedSettings(this._validatedOptions, partialEnv.zoomLevel, this.isSimpleWidget);
        var env = {
            outerWidth: partialEnv.outerWidth,
            outerHeight: partialEnv.outerHeight,
            fontInfo: this.readConfiguration(bareFontInfo),
            extraEditorClassName: partialEnv.extraEditorClassName,
            isDominatedByLongLines: this._isDominatedByLongLines,
            lineNumbersDigitCount: this._lineNumbersDigitCount,
            emptySelectionClipboard: partialEnv.emptySelectionClipboard,
            pixelRatio: partialEnv.pixelRatio,
            tabFocusMode: TabFocus.getTabFocusMode(),
            accessibilitySupport: partialEnv.accessibilitySupport
        };
        return EditorConfiguration2.computeOptions(this._validatedOptions, env);
    };
    CommonEditorConfiguration._subsetEquals = function (base, subset) {
        for (var key in subset) {
            if (hasOwnProperty.call(subset, key)) {
                var subsetValue = subset[key];
                var baseValue = base[key];
                if (baseValue === subsetValue) {
                    continue;
                }
                if (Array.isArray(baseValue) && Array.isArray(subsetValue)) {
                    if (!arrays.equals(baseValue, subsetValue)) {
                        return false;
                    }
                    continue;
                }
                if (typeof baseValue === 'object' && typeof subsetValue === 'object') {
                    if (!this._subsetEquals(baseValue, subsetValue)) {
                        return false;
                    }
                    continue;
                }
                return false;
            }
        }
        return true;
    };
    CommonEditorConfiguration.prototype.updateOptions = function (_newOptions) {
        if (typeof _newOptions === 'undefined') {
            return;
        }
        var newOptions = deepCloneAndMigrateOptions(_newOptions);
        if (CommonEditorConfiguration._subsetEquals(this._rawOptions, newOptions)) {
            return;
        }
        this._rawOptions = objects.mixin(this._rawOptions, newOptions || {});
        this._readOptions = EditorConfiguration2.readOptions(this._rawOptions);
        this._validatedOptions = EditorConfiguration2.validateOptions(this._readOptions);
        this._recomputeOptions();
    };
    CommonEditorConfiguration.prototype.setIsDominatedByLongLines = function (isDominatedByLongLines) {
        this._isDominatedByLongLines = isDominatedByLongLines;
        this._recomputeOptions();
    };
    CommonEditorConfiguration.prototype.setMaxLineNumber = function (maxLineNumber) {
        var digitCount = CommonEditorConfiguration._digitCount(maxLineNumber);
        if (this._lineNumbersDigitCount === digitCount) {
            return;
        }
        this._lineNumbersDigitCount = digitCount;
        this._recomputeOptions();
    };
    CommonEditorConfiguration._digitCount = function (n) {
        var r = 0;
        while (n) {
            n = Math.floor(n / 10);
            r++;
        }
        return r ? r : 1;
    };
    return CommonEditorConfiguration;
}(Disposable));
export { CommonEditorConfiguration };
export var editorConfigurationBaseNode = Object.freeze({
    id: 'editor',
    order: 5,
    type: 'object',
    title: nls.localize('editorConfigurationTitle', "Editor"),
    scope: 5 /* LANGUAGE_OVERRIDABLE */,
});
var configurationRegistry = Registry.as(Extensions.Configuration);
var editorConfiguration = __assign(__assign({}, editorConfigurationBaseNode), { properties: {
        'editor.tabSize': {
            type: 'number',
            default: EDITOR_MODEL_DEFAULTS.tabSize,
            minimum: 1,
            markdownDescription: nls.localize('tabSize', "The number of spaces a tab is equal to. This setting is overridden based on the file contents when `#editor.detectIndentation#` is on.")
        },
        // 'editor.indentSize': {
        // 	'anyOf': [
        // 		{
        // 			type: 'string',
        // 			enum: ['tabSize']
        // 		},
        // 		{
        // 			type: 'number',
        // 			minimum: 1
        // 		}
        // 	],
        // 	default: 'tabSize',
        // 	markdownDescription: nls.localize('indentSize', "The number of spaces used for indentation or 'tabSize' to use the value from `#editor.tabSize#`. This setting is overridden based on the file contents when `#editor.detectIndentation#` is on.")
        // },
        'editor.insertSpaces': {
            type: 'boolean',
            default: EDITOR_MODEL_DEFAULTS.insertSpaces,
            markdownDescription: nls.localize('insertSpaces', "Insert spaces when pressing `Tab`. This setting is overridden based on the file contents when `#editor.detectIndentation#` is on.")
        },
        'editor.detectIndentation': {
            type: 'boolean',
            default: EDITOR_MODEL_DEFAULTS.detectIndentation,
            markdownDescription: nls.localize('detectIndentation', "Controls whether `#editor.tabSize#` and `#editor.insertSpaces#` will be automatically detected when a file is opened based on the file contents.")
        },
        'editor.trimAutoWhitespace': {
            type: 'boolean',
            default: EDITOR_MODEL_DEFAULTS.trimAutoWhitespace,
            description: nls.localize('trimAutoWhitespace', "Remove trailing auto inserted whitespace.")
        },
        'editor.largeFileOptimizations': {
            type: 'boolean',
            default: EDITOR_MODEL_DEFAULTS.largeFileOptimizations,
            description: nls.localize('largeFileOptimizations', "Special handling for large files to disable certain memory intensive features.")
        },
        'editor.wordBasedSuggestions': {
            type: 'boolean',
            default: true,
            description: nls.localize('wordBasedSuggestions', "Controls whether completions should be computed based on words in the document.")
        },
        'editor.semanticHighlighting.enabled': {
            type: 'boolean',
            default: false,
            description: nls.localize('semanticHighlighting.enabled', "Controls whether the semanticHighlighting is shown for the languages that support it.")
        },
        'editor.stablePeek': {
            type: 'boolean',
            default: false,
            markdownDescription: nls.localize('stablePeek', "Keep peek editors open even when double clicking their content or when hitting `Escape`.")
        },
        'editor.maxTokenizationLineLength': {
            type: 'integer',
            default: 20000,
            description: nls.localize('maxTokenizationLineLength', "Lines above this length will not be tokenized for performance reasons")
        },
        'diffEditor.maxComputationTime': {
            type: 'number',
            default: 5000,
            description: nls.localize('maxComputationTime', "Timeout in milliseconds after which diff computation is cancelled. Use 0 for no timeout.")
        },
        'diffEditor.renderSideBySide': {
            type: 'boolean',
            default: true,
            description: nls.localize('sideBySide', "Controls whether the diff editor shows the diff side by side or inline.")
        },
        'diffEditor.ignoreTrimWhitespace': {
            type: 'boolean',
            default: true,
            description: nls.localize('ignoreTrimWhitespace', "Controls whether the diff editor shows changes in leading or trailing whitespace as diffs.")
        },
        'diffEditor.renderIndicators': {
            type: 'boolean',
            default: true,
            description: nls.localize('renderIndicators', "Controls whether the diff editor shows +/- indicators for added/removed changes.")
        }
    } });
function isConfigurationPropertySchema(x) {
    return (typeof x.type !== 'undefined' || typeof x.anyOf !== 'undefined');
}
// Add properties from the Editor Option Registry
for (var _i = 0, editorOptionsRegistry_1 = editorOptionsRegistry; _i < editorOptionsRegistry_1.length; _i++) {
    var editorOption = editorOptionsRegistry_1[_i];
    var schema = editorOption.schema;
    if (typeof schema !== 'undefined') {
        if (isConfigurationPropertySchema(schema)) {
            // This is a single schema contribution
            editorConfiguration.properties["editor." + editorOption.name] = schema;
        }
        else {
            for (var key in schema) {
                if (hasOwnProperty.call(schema, key)) {
                    editorConfiguration.properties[key] = schema[key];
                }
            }
        }
    }
}
var cachedEditorConfigurationKeys = null;
function getEditorConfigurationKeys() {
    if (cachedEditorConfigurationKeys === null) {
        cachedEditorConfigurationKeys = Object.create(null);
        Object.keys(editorConfiguration.properties).forEach(function (prop) {
            cachedEditorConfigurationKeys[prop] = true;
        });
    }
    return cachedEditorConfigurationKeys;
}
export function isEditorConfigurationKey(key) {
    var editorConfigurationKeys = getEditorConfigurationKeys();
    return (editorConfigurationKeys["editor." + key] || false);
}
export function isDiffEditorConfigurationKey(key) {
    var editorConfigurationKeys = getEditorConfigurationKeys();
    return (editorConfigurationKeys["diffEditor." + key] || false);
}
configurationRegistry.registerConfiguration(editorConfiguration);
