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
import * as platform from '../../../base/common/platform.js';
import { USUAL_WORD_SEPARATORS } from '../model/wordHelper.js';
/**
 * @internal
 * The width of the minimap gutter, in pixels.
 */
export var MINIMAP_GUTTER_WIDTH = 8;
//#endregion
/**
 * An event describing that the configuration of the editor has changed.
 */
var ConfigurationChangedEvent = /** @class */ (function () {
    /**
     * @internal
     */
    function ConfigurationChangedEvent(values) {
        this._values = values;
    }
    ConfigurationChangedEvent.prototype.hasChanged = function (id) {
        return this._values[id];
    };
    return ConfigurationChangedEvent;
}());
export { ConfigurationChangedEvent };
/**
 * @internal
 */
var ValidatedEditorOptions = /** @class */ (function () {
    function ValidatedEditorOptions() {
        this._values = [];
    }
    ValidatedEditorOptions.prototype._read = function (option) {
        return this._values[option];
    };
    ValidatedEditorOptions.prototype.get = function (id) {
        return this._values[id];
    };
    ValidatedEditorOptions.prototype._write = function (option, value) {
        this._values[option] = value;
    };
    return ValidatedEditorOptions;
}());
export { ValidatedEditorOptions };
/**
 * @internal
 */
var BaseEditorOption = /** @class */ (function () {
    function BaseEditorOption(id, name, defaultValue, schema) {
        this.id = id;
        this.name = name;
        this.defaultValue = defaultValue;
        this.schema = schema;
    }
    BaseEditorOption.prototype.compute = function (env, options, value) {
        return value;
    };
    return BaseEditorOption;
}());
/**
 * @internal
 */
var ComputedEditorOption = /** @class */ (function () {
    function ComputedEditorOption(id, deps) {
        if (deps === void 0) { deps = null; }
        this.schema = undefined;
        this.id = id;
        this.name = '_never_';
        this.defaultValue = undefined;
        this.deps = deps;
    }
    ComputedEditorOption.prototype.validate = function (input) {
        return this.defaultValue;
    };
    return ComputedEditorOption;
}());
var SimpleEditorOption = /** @class */ (function () {
    function SimpleEditorOption(id, name, defaultValue, schema) {
        this.id = id;
        this.name = name;
        this.defaultValue = defaultValue;
        this.schema = schema;
    }
    SimpleEditorOption.prototype.validate = function (input) {
        if (typeof input === 'undefined') {
            return this.defaultValue;
        }
        return input;
    };
    SimpleEditorOption.prototype.compute = function (env, options, value) {
        return value;
    };
    return SimpleEditorOption;
}());
var EditorBooleanOption = /** @class */ (function (_super) {
    __extends(EditorBooleanOption, _super);
    function EditorBooleanOption(id, name, defaultValue, schema) {
        if (schema === void 0) { schema = undefined; }
        var _this = this;
        if (typeof schema !== 'undefined') {
            schema.type = 'boolean';
            schema.default = defaultValue;
        }
        _this = _super.call(this, id, name, defaultValue, schema) || this;
        return _this;
    }
    EditorBooleanOption.boolean = function (value, defaultValue) {
        if (typeof value === 'undefined') {
            return defaultValue;
        }
        if (value === 'false') {
            // treat the string 'false' as false
            return false;
        }
        return Boolean(value);
    };
    EditorBooleanOption.prototype.validate = function (input) {
        return EditorBooleanOption.boolean(input, this.defaultValue);
    };
    return EditorBooleanOption;
}(SimpleEditorOption));
var EditorIntOption = /** @class */ (function (_super) {
    __extends(EditorIntOption, _super);
    function EditorIntOption(id, name, defaultValue, minimum, maximum, schema) {
        if (schema === void 0) { schema = undefined; }
        var _this = this;
        if (typeof schema !== 'undefined') {
            schema.type = 'integer';
            schema.default = defaultValue;
            schema.minimum = minimum;
            schema.maximum = maximum;
        }
        _this = _super.call(this, id, name, defaultValue, schema) || this;
        _this.minimum = minimum;
        _this.maximum = maximum;
        return _this;
    }
    EditorIntOption.clampedInt = function (value, defaultValue, minimum, maximum) {
        var r;
        if (typeof value === 'undefined') {
            r = defaultValue;
        }
        else {
            r = parseInt(value, 10);
            if (isNaN(r)) {
                r = defaultValue;
            }
        }
        r = Math.max(minimum, r);
        r = Math.min(maximum, r);
        return r | 0;
    };
    EditorIntOption.prototype.validate = function (input) {
        return EditorIntOption.clampedInt(input, this.defaultValue, this.minimum, this.maximum);
    };
    return EditorIntOption;
}(SimpleEditorOption));
var EditorFloatOption = /** @class */ (function (_super) {
    __extends(EditorFloatOption, _super);
    function EditorFloatOption(id, name, defaultValue, validationFn, schema) {
        var _this = this;
        if (typeof schema !== 'undefined') {
            schema.type = 'number';
            schema.default = defaultValue;
        }
        _this = _super.call(this, id, name, defaultValue, schema) || this;
        _this.validationFn = validationFn;
        return _this;
    }
    EditorFloatOption.clamp = function (n, min, max) {
        if (n < min) {
            return min;
        }
        if (n > max) {
            return max;
        }
        return n;
    };
    EditorFloatOption.float = function (value, defaultValue) {
        if (typeof value === 'number') {
            return value;
        }
        if (typeof value === 'undefined') {
            return defaultValue;
        }
        var r = parseFloat(value);
        return (isNaN(r) ? defaultValue : r);
    };
    EditorFloatOption.prototype.validate = function (input) {
        return this.validationFn(EditorFloatOption.float(input, this.defaultValue));
    };
    return EditorFloatOption;
}(SimpleEditorOption));
var EditorStringOption = /** @class */ (function (_super) {
    __extends(EditorStringOption, _super);
    function EditorStringOption(id, name, defaultValue, schema) {
        if (schema === void 0) { schema = undefined; }
        var _this = this;
        if (typeof schema !== 'undefined') {
            schema.type = 'string';
            schema.default = defaultValue;
        }
        _this = _super.call(this, id, name, defaultValue, schema) || this;
        return _this;
    }
    EditorStringOption.string = function (value, defaultValue) {
        if (typeof value !== 'string') {
            return defaultValue;
        }
        return value;
    };
    EditorStringOption.prototype.validate = function (input) {
        return EditorStringOption.string(input, this.defaultValue);
    };
    return EditorStringOption;
}(SimpleEditorOption));
var EditorStringEnumOption = /** @class */ (function (_super) {
    __extends(EditorStringEnumOption, _super);
    function EditorStringEnumOption(id, name, defaultValue, allowedValues, schema) {
        if (schema === void 0) { schema = undefined; }
        var _this = this;
        if (typeof schema !== 'undefined') {
            schema.type = 'string';
            schema.enum = allowedValues;
            schema.default = defaultValue;
        }
        _this = _super.call(this, id, name, defaultValue, schema) || this;
        _this._allowedValues = allowedValues;
        return _this;
    }
    EditorStringEnumOption.stringSet = function (value, defaultValue, allowedValues) {
        if (typeof value !== 'string') {
            return defaultValue;
        }
        if (allowedValues.indexOf(value) === -1) {
            return defaultValue;
        }
        return value;
    };
    EditorStringEnumOption.prototype.validate = function (input) {
        return EditorStringEnumOption.stringSet(input, this.defaultValue, this._allowedValues);
    };
    return EditorStringEnumOption;
}(SimpleEditorOption));
var EditorEnumOption = /** @class */ (function (_super) {
    __extends(EditorEnumOption, _super);
    function EditorEnumOption(id, name, defaultValue, defaultStringValue, allowedValues, convert, schema) {
        if (schema === void 0) { schema = undefined; }
        var _this = this;
        if (typeof schema !== 'undefined') {
            schema.type = 'string';
            schema.enum = allowedValues;
            schema.default = defaultStringValue;
        }
        _this = _super.call(this, id, name, defaultValue, schema) || this;
        _this._allowedValues = allowedValues;
        _this._convert = convert;
        return _this;
    }
    EditorEnumOption.prototype.validate = function (input) {
        if (typeof input !== 'string') {
            return this.defaultValue;
        }
        if (this._allowedValues.indexOf(input) === -1) {
            return this.defaultValue;
        }
        return this._convert(input);
    };
    return EditorEnumOption;
}(BaseEditorOption));
//#endregion
//#region autoIndent
function _autoIndentFromString(autoIndent) {
    switch (autoIndent) {
        case 'none': return 0 /* None */;
        case 'keep': return 1 /* Keep */;
        case 'brackets': return 2 /* Brackets */;
        case 'advanced': return 3 /* Advanced */;
        case 'full': return 4 /* Full */;
    }
}
//#endregion
//#region accessibilitySupport
var EditorAccessibilitySupport = /** @class */ (function (_super) {
    __extends(EditorAccessibilitySupport, _super);
    function EditorAccessibilitySupport() {
        return _super.call(this, 2 /* accessibilitySupport */, 'accessibilitySupport', 0 /* Unknown */, {
            type: 'string',
            enum: ['auto', 'on', 'off'],
            enumDescriptions: [
                nls.localize('accessibilitySupport.auto', "The editor will use platform APIs to detect when a Screen Reader is attached."),
                nls.localize('accessibilitySupport.on', "The editor will be permanently optimized for usage with a Screen Reader."),
                nls.localize('accessibilitySupport.off', "The editor will never be optimized for usage with a Screen Reader."),
            ],
            default: 'auto',
            description: nls.localize('accessibilitySupport', "Controls whether the editor should run in a mode where it is optimized for screen readers.")
        }) || this;
    }
    EditorAccessibilitySupport.prototype.validate = function (input) {
        switch (input) {
            case 'auto': return 0 /* Unknown */;
            case 'off': return 1 /* Disabled */;
            case 'on': return 2 /* Enabled */;
        }
        return this.defaultValue;
    };
    EditorAccessibilitySupport.prototype.compute = function (env, options, value) {
        if (value === 0 /* Unknown */) {
            // The editor reads the `accessibilitySupport` from the environment
            return env.accessibilitySupport;
        }
        return value;
    };
    return EditorAccessibilitySupport;
}(BaseEditorOption));
var EditorComments = /** @class */ (function (_super) {
    __extends(EditorComments, _super);
    function EditorComments() {
        var _this = this;
        var defaults = {
            insertSpace: true,
        };
        _this = _super.call(this, 13 /* comments */, 'comments', defaults, {
            'editor.comments.insertSpace': {
                type: 'boolean',
                default: defaults.insertSpace,
                description: nls.localize('comments.insertSpace', "Controls whether a space character is inserted when commenting.")
            },
        }) || this;
        return _this;
    }
    EditorComments.prototype.validate = function (_input) {
        if (typeof _input !== 'object') {
            return this.defaultValue;
        }
        var input = _input;
        return {
            insertSpace: EditorBooleanOption.boolean(input.insertSpace, this.defaultValue.insertSpace),
        };
    };
    return EditorComments;
}(BaseEditorOption));
function _cursorBlinkingStyleFromString(cursorBlinkingStyle) {
    switch (cursorBlinkingStyle) {
        case 'blink': return 1 /* Blink */;
        case 'smooth': return 2 /* Smooth */;
        case 'phase': return 3 /* Phase */;
        case 'expand': return 4 /* Expand */;
        case 'solid': return 5 /* Solid */;
    }
}
//#endregion
//#region cursorStyle
/**
 * The style in which the editor's cursor should be rendered.
 */
export var TextEditorCursorStyle;
(function (TextEditorCursorStyle) {
    /**
     * As a vertical line (sitting between two characters).
     */
    TextEditorCursorStyle[TextEditorCursorStyle["Line"] = 1] = "Line";
    /**
     * As a block (sitting on top of a character).
     */
    TextEditorCursorStyle[TextEditorCursorStyle["Block"] = 2] = "Block";
    /**
     * As a horizontal line (sitting under a character).
     */
    TextEditorCursorStyle[TextEditorCursorStyle["Underline"] = 3] = "Underline";
    /**
     * As a thin vertical line (sitting between two characters).
     */
    TextEditorCursorStyle[TextEditorCursorStyle["LineThin"] = 4] = "LineThin";
    /**
     * As an outlined block (sitting on top of a character).
     */
    TextEditorCursorStyle[TextEditorCursorStyle["BlockOutline"] = 5] = "BlockOutline";
    /**
     * As a thin horizontal line (sitting under a character).
     */
    TextEditorCursorStyle[TextEditorCursorStyle["UnderlineThin"] = 6] = "UnderlineThin";
})(TextEditorCursorStyle || (TextEditorCursorStyle = {}));
function _cursorStyleFromString(cursorStyle) {
    switch (cursorStyle) {
        case 'line': return TextEditorCursorStyle.Line;
        case 'block': return TextEditorCursorStyle.Block;
        case 'underline': return TextEditorCursorStyle.Underline;
        case 'line-thin': return TextEditorCursorStyle.LineThin;
        case 'block-outline': return TextEditorCursorStyle.BlockOutline;
        case 'underline-thin': return TextEditorCursorStyle.UnderlineThin;
    }
}
//#endregion
//#region editorClassName
var EditorClassName = /** @class */ (function (_super) {
    __extends(EditorClassName, _super);
    function EditorClassName() {
        return _super.call(this, 104 /* editorClassName */, [55 /* mouseStyle */, 26 /* extraEditorClassName */]) || this;
    }
    EditorClassName.prototype.compute = function (env, options, _) {
        var className = 'monaco-editor';
        if (options.get(26 /* extraEditorClassName */)) {
            className += ' ' + options.get(26 /* extraEditorClassName */);
        }
        if (env.extraEditorClassName) {
            className += ' ' + env.extraEditorClassName;
        }
        if (options.get(55 /* mouseStyle */) === 'default') {
            className += ' mouse-default';
        }
        else if (options.get(55 /* mouseStyle */) === 'copy') {
            className += ' mouse-copy';
        }
        if (options.get(85 /* showUnused */)) {
            className += ' showUnused';
        }
        return className;
    };
    return EditorClassName;
}(ComputedEditorOption));
//#endregion
//#region emptySelectionClipboard
var EditorEmptySelectionClipboard = /** @class */ (function (_super) {
    __extends(EditorEmptySelectionClipboard, _super);
    function EditorEmptySelectionClipboard() {
        return _super.call(this, 25 /* emptySelectionClipboard */, 'emptySelectionClipboard', true, { description: nls.localize('emptySelectionClipboard', "Controls whether copying without a selection copies the current line.") }) || this;
    }
    EditorEmptySelectionClipboard.prototype.compute = function (env, options, value) {
        return value && env.emptySelectionClipboard;
    };
    return EditorEmptySelectionClipboard;
}(EditorBooleanOption));
var EditorFind = /** @class */ (function (_super) {
    __extends(EditorFind, _super);
    function EditorFind() {
        var _this = this;
        var defaults = {
            seedSearchStringFromSelection: true,
            autoFindInSelection: 'never',
            globalFindClipboard: false,
            addExtraSpaceOnTop: true
        };
        _this = _super.call(this, 28 /* find */, 'find', defaults, {
            'editor.find.seedSearchStringFromSelection': {
                type: 'boolean',
                default: defaults.seedSearchStringFromSelection,
                description: nls.localize('find.seedSearchStringFromSelection', "Controls whether the search string in the Find Widget is seeded from the editor selection.")
            },
            'editor.find.autoFindInSelection': {
                type: 'string',
                enum: ['never', 'always', 'multiline'],
                default: defaults.autoFindInSelection,
                enumDescriptions: [
                    nls.localize('editor.find.autoFindInSelection.never', 'Never turn on Find in selection automatically (default)'),
                    nls.localize('editor.find.autoFindInSelection.always', 'Always turn on Find in selection automatically'),
                    nls.localize('editor.find.autoFindInSelection.multiline', 'Turn on Find in selection automatically when multiple lines of content are selected.')
                ],
                description: nls.localize('find.autoFindInSelection', "Controls whether the find operation is carried out on selected text or the entire file in the editor.")
            },
            'editor.find.globalFindClipboard': {
                type: 'boolean',
                default: defaults.globalFindClipboard,
                description: nls.localize('find.globalFindClipboard', "Controls whether the Find Widget should read or modify the shared find clipboard on macOS."),
                included: platform.isMacintosh
            },
            'editor.find.addExtraSpaceOnTop': {
                type: 'boolean',
                default: defaults.addExtraSpaceOnTop,
                description: nls.localize('find.addExtraSpaceOnTop', "Controls whether the Find Widget should add extra lines on top of the editor. When true, you can scroll beyond the first line when the Find Widget is visible.")
            }
        }) || this;
        return _this;
    }
    EditorFind.prototype.validate = function (_input) {
        if (typeof _input !== 'object') {
            return this.defaultValue;
        }
        var input = _input;
        return {
            seedSearchStringFromSelection: EditorBooleanOption.boolean(input.seedSearchStringFromSelection, this.defaultValue.seedSearchStringFromSelection),
            autoFindInSelection: typeof _input.autoFindInSelection === 'boolean'
                ? (_input.autoFindInSelection ? 'always' : 'never')
                : EditorStringEnumOption.stringSet(input.autoFindInSelection, this.defaultValue.autoFindInSelection, ['never', 'always', 'multiline']),
            globalFindClipboard: EditorBooleanOption.boolean(input.globalFindClipboard, this.defaultValue.globalFindClipboard),
            addExtraSpaceOnTop: EditorBooleanOption.boolean(input.addExtraSpaceOnTop, this.defaultValue.addExtraSpaceOnTop)
        };
    };
    return EditorFind;
}(BaseEditorOption));
//#endregion
//#region fontLigatures
/**
 * @internal
 */
var EditorFontLigatures = /** @class */ (function (_super) {
    __extends(EditorFontLigatures, _super);
    function EditorFontLigatures() {
        return _super.call(this, 35 /* fontLigatures */, 'fontLigatures', EditorFontLigatures.OFF, {
            anyOf: [
                {
                    type: 'boolean',
                    description: nls.localize('fontLigatures', "Enables/Disables font ligatures."),
                },
                {
                    type: 'string',
                    description: nls.localize('fontFeatureSettings', "Explicit font-feature-settings.")
                }
            ],
            description: nls.localize('fontLigaturesGeneral', "Configures font ligatures."),
            default: false
        }) || this;
    }
    EditorFontLigatures.prototype.validate = function (input) {
        if (typeof input === 'undefined') {
            return this.defaultValue;
        }
        if (typeof input === 'string') {
            if (input === 'false') {
                return EditorFontLigatures.OFF;
            }
            if (input === 'true') {
                return EditorFontLigatures.ON;
            }
            return input;
        }
        if (Boolean(input)) {
            return EditorFontLigatures.ON;
        }
        return EditorFontLigatures.OFF;
    };
    EditorFontLigatures.OFF = '"liga" off, "calt" off';
    EditorFontLigatures.ON = '"liga" on, "calt" on';
    return EditorFontLigatures;
}(BaseEditorOption));
export { EditorFontLigatures };
//#endregion
//#region fontInfo
var EditorFontInfo = /** @class */ (function (_super) {
    __extends(EditorFontInfo, _super);
    function EditorFontInfo() {
        return _super.call(this, 34 /* fontInfo */) || this;
    }
    EditorFontInfo.prototype.compute = function (env, options, _) {
        return env.fontInfo;
    };
    return EditorFontInfo;
}(ComputedEditorOption));
//#endregion
//#region fontSize
var EditorFontSize = /** @class */ (function (_super) {
    __extends(EditorFontSize, _super);
    function EditorFontSize() {
        return _super.call(this, 36 /* fontSize */, 'fontSize', EDITOR_FONT_DEFAULTS.fontSize, {
            type: 'number',
            minimum: 6,
            maximum: 100,
            default: EDITOR_FONT_DEFAULTS.fontSize,
            description: nls.localize('fontSize', "Controls the font size in pixels.")
        }) || this;
    }
    EditorFontSize.prototype.validate = function (input) {
        var r = EditorFloatOption.float(input, this.defaultValue);
        if (r === 0) {
            return EDITOR_FONT_DEFAULTS.fontSize;
        }
        return EditorFloatOption.clamp(r, 6, 100);
    };
    EditorFontSize.prototype.compute = function (env, options, value) {
        // The final fontSize respects the editor zoom level.
        // So take the result from env.fontInfo
        return env.fontInfo.fontSize;
    };
    return EditorFontSize;
}(SimpleEditorOption));
var EditorGoToLocation = /** @class */ (function (_super) {
    __extends(EditorGoToLocation, _super);
    function EditorGoToLocation() {
        var _this = this;
        var defaults = {
            multiple: 'peek',
            multipleDefinitions: 'peek',
            multipleTypeDefinitions: 'peek',
            multipleDeclarations: 'peek',
            multipleImplementations: 'peek',
            multipleReferences: 'peek',
            alternativeDefinitionCommand: 'editor.action.goToReferences',
            alternativeTypeDefinitionCommand: 'editor.action.goToReferences',
            alternativeDeclarationCommand: 'editor.action.goToReferences',
            alternativeImplementationCommand: '',
            alternativeReferenceCommand: '',
        };
        var jsonSubset = {
            type: 'string',
            enum: ['peek', 'gotoAndPeek', 'goto'],
            default: defaults.multiple,
            enumDescriptions: [
                nls.localize('editor.gotoLocation.multiple.peek', 'Show peek view of the results (default)'),
                nls.localize('editor.gotoLocation.multiple.gotoAndPeek', 'Go to the primary result and show a peek view'),
                nls.localize('editor.gotoLocation.multiple.goto', 'Go to the primary result and enable peek-less navigation to others')
            ]
        };
        _this = _super.call(this, 41 /* gotoLocation */, 'gotoLocation', defaults, {
            'editor.gotoLocation.multiple': {
                deprecationMessage: nls.localize('editor.gotoLocation.multiple.deprecated', "This setting is deprecated, please use separate settings like 'editor.editor.gotoLocation.multipleDefinitions' or 'editor.editor.gotoLocation.multipleImplementations' instead."),
            },
            'editor.gotoLocation.multipleDefinitions': __assign({ description: nls.localize('editor.editor.gotoLocation.multipleDefinitions', "Controls the behavior the 'Go to Definition'-command when multiple target locations exist.") }, jsonSubset),
            'editor.gotoLocation.multipleTypeDefinitions': __assign({ description: nls.localize('editor.editor.gotoLocation.multipleTypeDefinitions', "Controls the behavior the 'Go to Type Definition'-command when multiple target locations exist.") }, jsonSubset),
            'editor.gotoLocation.multipleDeclarations': __assign({ description: nls.localize('editor.editor.gotoLocation.multipleDeclarations', "Controls the behavior the 'Go to Declaration'-command when multiple target locations exist.") }, jsonSubset),
            'editor.gotoLocation.multipleImplementations': __assign({ description: nls.localize('editor.editor.gotoLocation.multipleImplemenattions', "Controls the behavior the 'Go to Implementations'-command when multiple target locations exist.") }, jsonSubset),
            'editor.gotoLocation.multipleReferences': __assign({ description: nls.localize('editor.editor.gotoLocation.multipleReferences', "Controls the behavior the 'Go to References'-command when multiple target locations exist.") }, jsonSubset),
            'editor.gotoLocation.alternativeDefinitionCommand': {
                type: 'string',
                default: defaults.alternativeDefinitionCommand,
                description: nls.localize('alternativeDefinitionCommand', "Alternative command id that is being executed when the result of 'Go to Definition' is the current location.")
            },
            'editor.gotoLocation.alternativeTypeDefinitionCommand': {
                type: 'string',
                default: defaults.alternativeTypeDefinitionCommand,
                description: nls.localize('alternativeTypeDefinitionCommand', "Alternative command id that is being executed when the result of 'Go to Type Definition' is the current location.")
            },
            'editor.gotoLocation.alternativeDeclarationCommand': {
                type: 'string',
                default: defaults.alternativeDeclarationCommand,
                description: nls.localize('alternativeDeclarationCommand', "Alternative command id that is being executed when the result of 'Go to Declaration' is the current location.")
            },
            'editor.gotoLocation.alternativeImplementationCommand': {
                type: 'string',
                default: defaults.alternativeImplementationCommand,
                description: nls.localize('alternativeImplementationCommand', "Alternative command id that is being executed when the result of 'Go to Implementation' is the current location.")
            },
            'editor.gotoLocation.alternativeReferenceCommand': {
                type: 'string',
                default: defaults.alternativeReferenceCommand,
                description: nls.localize('alternativeReferenceCommand', "Alternative command id that is being executed when the result of 'Go to Reference' is the current location.")
            },
        }) || this;
        return _this;
    }
    EditorGoToLocation.prototype.validate = function (_input) {
        var _a, _b, _c, _d, _e;
        if (typeof _input !== 'object') {
            return this.defaultValue;
        }
        var input = _input;
        return {
            multiple: EditorStringEnumOption.stringSet(input.multiple, this.defaultValue.multiple, ['peek', 'gotoAndPeek', 'goto']),
            multipleDefinitions: (_a = input.multipleDefinitions) !== null && _a !== void 0 ? _a : EditorStringEnumOption.stringSet(input.multipleDefinitions, 'peek', ['peek', 'gotoAndPeek', 'goto']),
            multipleTypeDefinitions: (_b = input.multipleTypeDefinitions) !== null && _b !== void 0 ? _b : EditorStringEnumOption.stringSet(input.multipleTypeDefinitions, 'peek', ['peek', 'gotoAndPeek', 'goto']),
            multipleDeclarations: (_c = input.multipleDeclarations) !== null && _c !== void 0 ? _c : EditorStringEnumOption.stringSet(input.multipleDeclarations, 'peek', ['peek', 'gotoAndPeek', 'goto']),
            multipleImplementations: (_d = input.multipleImplementations) !== null && _d !== void 0 ? _d : EditorStringEnumOption.stringSet(input.multipleImplementations, 'peek', ['peek', 'gotoAndPeek', 'goto']),
            multipleReferences: (_e = input.multipleReferences) !== null && _e !== void 0 ? _e : EditorStringEnumOption.stringSet(input.multipleReferences, 'peek', ['peek', 'gotoAndPeek', 'goto']),
            alternativeDefinitionCommand: EditorStringOption.string(input.alternativeDefinitionCommand, this.defaultValue.alternativeDefinitionCommand),
            alternativeTypeDefinitionCommand: EditorStringOption.string(input.alternativeTypeDefinitionCommand, this.defaultValue.alternativeTypeDefinitionCommand),
            alternativeDeclarationCommand: EditorStringOption.string(input.alternativeDeclarationCommand, this.defaultValue.alternativeDeclarationCommand),
            alternativeImplementationCommand: EditorStringOption.string(input.alternativeImplementationCommand, this.defaultValue.alternativeImplementationCommand),
            alternativeReferenceCommand: EditorStringOption.string(input.alternativeReferenceCommand, this.defaultValue.alternativeReferenceCommand),
        };
    };
    return EditorGoToLocation;
}(BaseEditorOption));
var EditorHover = /** @class */ (function (_super) {
    __extends(EditorHover, _super);
    function EditorHover() {
        var _this = this;
        var defaults = {
            enabled: true,
            delay: 300,
            sticky: true
        };
        _this = _super.call(this, 44 /* hover */, 'hover', defaults, {
            'editor.hover.enabled': {
                type: 'boolean',
                default: defaults.enabled,
                description: nls.localize('hover.enabled', "Controls whether the hover is shown.")
            },
            'editor.hover.delay': {
                type: 'number',
                default: defaults.delay,
                description: nls.localize('hover.delay', "Controls the delay in milliseconds after which the hover is shown.")
            },
            'editor.hover.sticky': {
                type: 'boolean',
                default: defaults.sticky,
                description: nls.localize('hover.sticky', "Controls whether the hover should remain visible when mouse is moved over it.")
            },
        }) || this;
        return _this;
    }
    EditorHover.prototype.validate = function (_input) {
        if (typeof _input !== 'object') {
            return this.defaultValue;
        }
        var input = _input;
        return {
            enabled: EditorBooleanOption.boolean(input.enabled, this.defaultValue.enabled),
            delay: EditorIntOption.clampedInt(input.delay, this.defaultValue.delay, 0, 10000),
            sticky: EditorBooleanOption.boolean(input.sticky, this.defaultValue.sticky)
        };
    };
    return EditorHover;
}(BaseEditorOption));
/**
 * @internal
 */
var EditorLayoutInfoComputer = /** @class */ (function (_super) {
    __extends(EditorLayoutInfoComputer, _super);
    function EditorLayoutInfoComputer() {
        return _super.call(this, 107 /* layoutInfo */, [40 /* glyphMargin */, 48 /* lineDecorationsWidth */, 30 /* folding */, 54 /* minimap */, 78 /* scrollbar */, 50 /* lineNumbers */]) || this;
    }
    EditorLayoutInfoComputer.prototype.compute = function (env, options, _) {
        return EditorLayoutInfoComputer.computeLayout(options, {
            outerWidth: env.outerWidth,
            outerHeight: env.outerHeight,
            lineHeight: env.fontInfo.lineHeight,
            lineNumbersDigitCount: env.lineNumbersDigitCount,
            typicalHalfwidthCharacterWidth: env.fontInfo.typicalHalfwidthCharacterWidth,
            maxDigitWidth: env.fontInfo.maxDigitWidth,
            pixelRatio: env.pixelRatio
        });
    };
    EditorLayoutInfoComputer.computeLayout = function (options, env) {
        var outerWidth = env.outerWidth | 0;
        var outerHeight = env.outerHeight | 0;
        var lineHeight = env.lineHeight | 0;
        var lineNumbersDigitCount = env.lineNumbersDigitCount | 0;
        var typicalHalfwidthCharacterWidth = env.typicalHalfwidthCharacterWidth;
        var maxDigitWidth = env.maxDigitWidth;
        var pixelRatio = env.pixelRatio;
        var showGlyphMargin = options.get(40 /* glyphMargin */);
        var showLineNumbers = (options.get(50 /* lineNumbers */).renderType !== 0 /* Off */);
        var lineNumbersMinChars = options.get(51 /* lineNumbersMinChars */) | 0;
        var minimap = options.get(54 /* minimap */);
        var minimapEnabled = minimap.enabled;
        var minimapSide = minimap.side;
        var minimapRenderCharacters = minimap.renderCharacters;
        var minimapScale = (pixelRatio >= 2 ? Math.round(minimap.scale * 2) : minimap.scale);
        var minimapMaxColumn = minimap.maxColumn | 0;
        var scrollbar = options.get(78 /* scrollbar */);
        var verticalScrollbarWidth = scrollbar.verticalScrollbarSize | 0;
        var verticalScrollbarHasArrows = scrollbar.verticalHasArrows;
        var scrollbarArrowSize = scrollbar.arrowSize | 0;
        var horizontalScrollbarHeight = scrollbar.horizontalScrollbarSize | 0;
        var rawLineDecorationsWidth = options.get(48 /* lineDecorationsWidth */);
        var folding = options.get(30 /* folding */);
        var lineDecorationsWidth;
        if (typeof rawLineDecorationsWidth === 'string' && /^\d+(\.\d+)?ch$/.test(rawLineDecorationsWidth)) {
            var multiple = parseFloat(rawLineDecorationsWidth.substr(0, rawLineDecorationsWidth.length - 2));
            lineDecorationsWidth = EditorIntOption.clampedInt(multiple * typicalHalfwidthCharacterWidth, 0, 0, 1000);
        }
        else {
            lineDecorationsWidth = EditorIntOption.clampedInt(rawLineDecorationsWidth, 0, 0, 1000);
        }
        if (folding) {
            lineDecorationsWidth += 16;
        }
        var lineNumbersWidth = 0;
        if (showLineNumbers) {
            var digitCount = Math.max(lineNumbersDigitCount, lineNumbersMinChars);
            lineNumbersWidth = Math.round(digitCount * maxDigitWidth);
        }
        var glyphMarginWidth = 0;
        if (showGlyphMargin) {
            glyphMarginWidth = lineHeight;
        }
        var glyphMarginLeft = 0;
        var lineNumbersLeft = glyphMarginLeft + glyphMarginWidth;
        var decorationsLeft = lineNumbersLeft + lineNumbersWidth;
        var contentLeft = decorationsLeft + lineDecorationsWidth;
        var remainingWidth = outerWidth - glyphMarginWidth - lineNumbersWidth - lineDecorationsWidth;
        var renderMinimap;
        var minimapLeft;
        var minimapWidth;
        var contentWidth;
        if (!minimapEnabled) {
            minimapLeft = 0;
            minimapWidth = 0;
            renderMinimap = 0 /* None */;
            contentWidth = remainingWidth;
        }
        else {
            // The minimapScale is also the pixel width of each character. Adjust
            // for the pixel ratio of the screen.
            var minimapCharWidth = minimapScale / pixelRatio;
            renderMinimap = minimapRenderCharacters ? 1 /* Text */ : 2 /* Blocks */;
            // Given:
            // (leaving 2px for the cursor to have space after the last character)
            // viewportColumn = (contentWidth - verticalScrollbarWidth - 2) / typicalHalfwidthCharacterWidth
            // minimapWidth = viewportColumn * minimapCharWidth
            // contentWidth = remainingWidth - minimapWidth
            // What are good values for contentWidth and minimapWidth ?
            // minimapWidth = ((contentWidth - verticalScrollbarWidth - 2) / typicalHalfwidthCharacterWidth) * minimapCharWidth
            // typicalHalfwidthCharacterWidth * minimapWidth = (contentWidth - verticalScrollbarWidth - 2) * minimapCharWidth
            // typicalHalfwidthCharacterWidth * minimapWidth = (remainingWidth - minimapWidth - verticalScrollbarWidth - 2) * minimapCharWidth
            // (typicalHalfwidthCharacterWidth + minimapCharWidth) * minimapWidth = (remainingWidth - verticalScrollbarWidth - 2) * minimapCharWidth
            // minimapWidth = ((remainingWidth - verticalScrollbarWidth - 2) * minimapCharWidth) / (typicalHalfwidthCharacterWidth + minimapCharWidth)
            minimapWidth = Math.max(0, Math.floor(((remainingWidth - verticalScrollbarWidth - 2) * minimapCharWidth) / (typicalHalfwidthCharacterWidth + minimapCharWidth))) + MINIMAP_GUTTER_WIDTH;
            var minimapColumns = minimapWidth / minimapCharWidth;
            if (minimapColumns > minimapMaxColumn) {
                minimapWidth = Math.floor(minimapMaxColumn * minimapCharWidth);
            }
            contentWidth = remainingWidth - minimapWidth;
            if (minimapSide === 'left') {
                minimapLeft = 0;
                glyphMarginLeft += minimapWidth;
                lineNumbersLeft += minimapWidth;
                decorationsLeft += minimapWidth;
                contentLeft += minimapWidth;
            }
            else {
                minimapLeft = outerWidth - minimapWidth - verticalScrollbarWidth;
            }
        }
        // (leaving 2px for the cursor to have space after the last character)
        var viewportColumn = Math.max(1, Math.floor((contentWidth - verticalScrollbarWidth - 2) / typicalHalfwidthCharacterWidth));
        var verticalArrowSize = (verticalScrollbarHasArrows ? scrollbarArrowSize : 0);
        return {
            width: outerWidth,
            height: outerHeight,
            glyphMarginLeft: glyphMarginLeft,
            glyphMarginWidth: glyphMarginWidth,
            lineNumbersLeft: lineNumbersLeft,
            lineNumbersWidth: lineNumbersWidth,
            decorationsLeft: decorationsLeft,
            decorationsWidth: lineDecorationsWidth,
            contentLeft: contentLeft,
            contentWidth: contentWidth,
            renderMinimap: renderMinimap,
            minimapLeft: minimapLeft,
            minimapWidth: minimapWidth,
            viewportColumn: viewportColumn,
            verticalScrollbarWidth: verticalScrollbarWidth,
            horizontalScrollbarHeight: horizontalScrollbarHeight,
            overviewRuler: {
                top: verticalArrowSize,
                width: verticalScrollbarWidth,
                height: (outerHeight - 2 * verticalArrowSize),
                right: 0
            }
        };
    };
    return EditorLayoutInfoComputer;
}(ComputedEditorOption));
export { EditorLayoutInfoComputer };
var EditorLightbulb = /** @class */ (function (_super) {
    __extends(EditorLightbulb, _super);
    function EditorLightbulb() {
        var _this = this;
        var defaults = { enabled: true };
        _this = _super.call(this, 47 /* lightbulb */, 'lightbulb', defaults, {
            'editor.lightbulb.enabled': {
                type: 'boolean',
                default: defaults.enabled,
                description: nls.localize('codeActions', "Enables the code action lightbulb in the editor.")
            },
        }) || this;
        return _this;
    }
    EditorLightbulb.prototype.validate = function (_input) {
        if (typeof _input !== 'object') {
            return this.defaultValue;
        }
        var input = _input;
        return {
            enabled: EditorBooleanOption.boolean(input.enabled, this.defaultValue.enabled)
        };
    };
    return EditorLightbulb;
}(BaseEditorOption));
//#endregion
//#region lineHeight
var EditorLineHeight = /** @class */ (function (_super) {
    __extends(EditorLineHeight, _super);
    function EditorLineHeight() {
        return _super.call(this, 49 /* lineHeight */, 'lineHeight', EDITOR_FONT_DEFAULTS.lineHeight, 0, 150, { description: nls.localize('lineHeight', "Controls the line height. Use 0 to compute the line height from the font size.") }) || this;
    }
    EditorLineHeight.prototype.compute = function (env, options, value) {
        // The lineHeight is computed from the fontSize if it is 0.
        // Moreover, the final lineHeight respects the editor zoom level.
        // So take the result from env.fontInfo
        return env.fontInfo.lineHeight;
    };
    return EditorLineHeight;
}(EditorIntOption));
var EditorMinimap = /** @class */ (function (_super) {
    __extends(EditorMinimap, _super);
    function EditorMinimap() {
        var _this = this;
        var defaults = {
            enabled: true,
            side: 'right',
            showSlider: 'mouseover',
            renderCharacters: true,
            maxColumn: 120,
            scale: 1,
        };
        _this = _super.call(this, 54 /* minimap */, 'minimap', defaults, {
            'editor.minimap.enabled': {
                type: 'boolean',
                default: defaults.enabled,
                description: nls.localize('minimap.enabled', "Controls whether the minimap is shown.")
            },
            'editor.minimap.side': {
                type: 'string',
                enum: ['left', 'right'],
                default: defaults.side,
                description: nls.localize('minimap.side', "Controls the side where to render the minimap.")
            },
            'editor.minimap.showSlider': {
                type: 'string',
                enum: ['always', 'mouseover'],
                default: defaults.showSlider,
                description: nls.localize('minimap.showSlider', "Controls when the minimap slider is shown.")
            },
            'editor.minimap.scale': {
                type: 'number',
                default: defaults.scale,
                minimum: 1,
                maximum: 3,
                description: nls.localize('minimap.scale', "Scale of content drawn in the minimap.")
            },
            'editor.minimap.renderCharacters': {
                type: 'boolean',
                default: defaults.renderCharacters,
                description: nls.localize('minimap.renderCharacters', "Render the actual characters on a line as opposed to color blocks.")
            },
            'editor.minimap.maxColumn': {
                type: 'number',
                default: defaults.maxColumn,
                description: nls.localize('minimap.maxColumn', "Limit the width of the minimap to render at most a certain number of columns.")
            },
        }) || this;
        return _this;
    }
    EditorMinimap.prototype.validate = function (_input) {
        if (typeof _input !== 'object') {
            return this.defaultValue;
        }
        var input = _input;
        return {
            enabled: EditorBooleanOption.boolean(input.enabled, this.defaultValue.enabled),
            side: EditorStringEnumOption.stringSet(input.side, this.defaultValue.side, ['right', 'left']),
            showSlider: EditorStringEnumOption.stringSet(input.showSlider, this.defaultValue.showSlider, ['always', 'mouseover']),
            renderCharacters: EditorBooleanOption.boolean(input.renderCharacters, this.defaultValue.renderCharacters),
            scale: EditorIntOption.clampedInt(input.scale, 1, 1, 3),
            maxColumn: EditorIntOption.clampedInt(input.maxColumn, this.defaultValue.maxColumn, 1, 10000),
        };
    };
    return EditorMinimap;
}(BaseEditorOption));
//#endregion
//#region multiCursorModifier
function _multiCursorModifierFromString(multiCursorModifier) {
    if (multiCursorModifier === 'ctrlCmd') {
        return (platform.isMacintosh ? 'metaKey' : 'ctrlKey');
    }
    return 'altKey';
}
var EditorParameterHints = /** @class */ (function (_super) {
    __extends(EditorParameterHints, _super);
    function EditorParameterHints() {
        var _this = this;
        var defaults = {
            enabled: true,
            cycle: false
        };
        _this = _super.call(this, 64 /* parameterHints */, 'parameterHints', defaults, {
            'editor.parameterHints.enabled': {
                type: 'boolean',
                default: defaults.enabled,
                description: nls.localize('parameterHints.enabled', "Enables a pop-up that shows parameter documentation and type information as you type.")
            },
            'editor.parameterHints.cycle': {
                type: 'boolean',
                default: defaults.cycle,
                description: nls.localize('parameterHints.cycle', "Controls whether the parameter hints menu cycles or closes when reaching the end of the list.")
            },
        }) || this;
        return _this;
    }
    EditorParameterHints.prototype.validate = function (_input) {
        if (typeof _input !== 'object') {
            return this.defaultValue;
        }
        var input = _input;
        return {
            enabled: EditorBooleanOption.boolean(input.enabled, this.defaultValue.enabled),
            cycle: EditorBooleanOption.boolean(input.cycle, this.defaultValue.cycle)
        };
    };
    return EditorParameterHints;
}(BaseEditorOption));
//#endregion
//#region pixelRatio
var EditorPixelRatio = /** @class */ (function (_super) {
    __extends(EditorPixelRatio, _super);
    function EditorPixelRatio() {
        return _super.call(this, 105 /* pixelRatio */) || this;
    }
    EditorPixelRatio.prototype.compute = function (env, options, _) {
        return env.pixelRatio;
    };
    return EditorPixelRatio;
}(ComputedEditorOption));
var EditorQuickSuggestions = /** @class */ (function (_super) {
    __extends(EditorQuickSuggestions, _super);
    function EditorQuickSuggestions() {
        var _this = this;
        var defaults = {
            other: true,
            comments: false,
            strings: false
        };
        _this = _super.call(this, 66 /* quickSuggestions */, 'quickSuggestions', defaults, {
            anyOf: [
                {
                    type: 'boolean',
                },
                {
                    type: 'object',
                    properties: {
                        strings: {
                            type: 'boolean',
                            default: defaults.strings,
                            description: nls.localize('quickSuggestions.strings', "Enable quick suggestions inside strings.")
                        },
                        comments: {
                            type: 'boolean',
                            default: defaults.comments,
                            description: nls.localize('quickSuggestions.comments', "Enable quick suggestions inside comments.")
                        },
                        other: {
                            type: 'boolean',
                            default: defaults.other,
                            description: nls.localize('quickSuggestions.other', "Enable quick suggestions outside of strings and comments.")
                        },
                    }
                }
            ],
            default: defaults,
            description: nls.localize('quickSuggestions', "Controls whether suggestions should automatically show up while typing.")
        }) || this;
        _this.defaultValue = defaults;
        return _this;
    }
    EditorQuickSuggestions.prototype.validate = function (_input) {
        if (typeof _input === 'boolean') {
            return _input;
        }
        if (typeof _input === 'object') {
            var input = _input;
            var opts = {
                other: EditorBooleanOption.boolean(input.other, this.defaultValue.other),
                comments: EditorBooleanOption.boolean(input.comments, this.defaultValue.comments),
                strings: EditorBooleanOption.boolean(input.strings, this.defaultValue.strings),
            };
            if (opts.other && opts.comments && opts.strings) {
                return true; // all on
            }
            else if (!opts.other && !opts.comments && !opts.strings) {
                return false; // all off
            }
            else {
                return opts;
            }
        }
        return this.defaultValue;
    };
    return EditorQuickSuggestions;
}(BaseEditorOption));
var EditorRenderLineNumbersOption = /** @class */ (function (_super) {
    __extends(EditorRenderLineNumbersOption, _super);
    function EditorRenderLineNumbersOption() {
        return _super.call(this, 50 /* lineNumbers */, 'lineNumbers', { renderType: 1 /* On */, renderFn: null }, {
            type: 'string',
            enum: ['off', 'on', 'relative', 'interval'],
            enumDescriptions: [
                nls.localize('lineNumbers.off', "Line numbers are not rendered."),
                nls.localize('lineNumbers.on', "Line numbers are rendered as absolute number."),
                nls.localize('lineNumbers.relative', "Line numbers are rendered as distance in lines to cursor position."),
                nls.localize('lineNumbers.interval', "Line numbers are rendered every 10 lines.")
            ],
            default: 'on',
            description: nls.localize('lineNumbers', "Controls the display of line numbers.")
        }) || this;
    }
    EditorRenderLineNumbersOption.prototype.validate = function (lineNumbers) {
        var renderType = this.defaultValue.renderType;
        var renderFn = this.defaultValue.renderFn;
        if (typeof lineNumbers !== 'undefined') {
            if (typeof lineNumbers === 'function') {
                renderType = 4 /* Custom */;
                renderFn = lineNumbers;
            }
            else if (lineNumbers === 'interval') {
                renderType = 3 /* Interval */;
            }
            else if (lineNumbers === 'relative') {
                renderType = 2 /* Relative */;
            }
            else if (lineNumbers === 'on') {
                renderType = 1 /* On */;
            }
            else {
                renderType = 0 /* Off */;
            }
        }
        return {
            renderType: renderType,
            renderFn: renderFn
        };
    };
    return EditorRenderLineNumbersOption;
}(BaseEditorOption));
//#endregion
//#region renderValidationDecorations
/**
 * @internal
 */
export function filterValidationDecorations(options) {
    var renderValidationDecorations = options.get(73 /* renderValidationDecorations */);
    if (renderValidationDecorations === 'editable') {
        return options.get(68 /* readOnly */);
    }
    return renderValidationDecorations === 'on' ? false : true;
}
//#endregion
//#region rulers
var EditorRulers = /** @class */ (function (_super) {
    __extends(EditorRulers, _super);
    function EditorRulers() {
        var _this = this;
        var defaults = [];
        _this = _super.call(this, 77 /* rulers */, 'rulers', defaults, {
            type: 'array',
            items: {
                type: 'number'
            },
            default: defaults,
            description: nls.localize('rulers', "Render vertical rulers after a certain number of monospace characters. Use multiple values for multiple rulers. No rulers are drawn if array is empty.")
        }) || this;
        return _this;
    }
    EditorRulers.prototype.validate = function (input) {
        if (Array.isArray(input)) {
            var rulers = [];
            for (var _i = 0, input_1 = input; _i < input_1.length; _i++) {
                var value = input_1[_i];
                rulers.push(EditorIntOption.clampedInt(value, 0, 0, 10000));
            }
            rulers.sort(function (a, b) { return a - b; });
            return rulers;
        }
        return this.defaultValue;
    };
    return EditorRulers;
}(SimpleEditorOption));
function _scrollbarVisibilityFromString(visibility, defaultValue) {
    if (typeof visibility !== 'string') {
        return defaultValue;
    }
    switch (visibility) {
        case 'hidden': return 2 /* Hidden */;
        case 'visible': return 3 /* Visible */;
        default: return 1 /* Auto */;
    }
}
var EditorScrollbar = /** @class */ (function (_super) {
    __extends(EditorScrollbar, _super);
    function EditorScrollbar() {
        return _super.call(this, 78 /* scrollbar */, 'scrollbar', {
            vertical: 1 /* Auto */,
            horizontal: 1 /* Auto */,
            arrowSize: 11,
            useShadows: true,
            verticalHasArrows: false,
            horizontalHasArrows: false,
            horizontalScrollbarSize: 10,
            horizontalSliderSize: 10,
            verticalScrollbarSize: 14,
            verticalSliderSize: 14,
            handleMouseWheel: true,
            alwaysConsumeMouseWheel: true
        }) || this;
    }
    EditorScrollbar.prototype.validate = function (_input) {
        if (typeof _input !== 'object') {
            return this.defaultValue;
        }
        var input = _input;
        var horizontalScrollbarSize = EditorIntOption.clampedInt(input.horizontalScrollbarSize, this.defaultValue.horizontalScrollbarSize, 0, 1000);
        var verticalScrollbarSize = EditorIntOption.clampedInt(input.verticalScrollbarSize, this.defaultValue.verticalScrollbarSize, 0, 1000);
        return {
            arrowSize: EditorIntOption.clampedInt(input.arrowSize, this.defaultValue.arrowSize, 0, 1000),
            vertical: _scrollbarVisibilityFromString(input.vertical, this.defaultValue.vertical),
            horizontal: _scrollbarVisibilityFromString(input.horizontal, this.defaultValue.horizontal),
            useShadows: EditorBooleanOption.boolean(input.useShadows, this.defaultValue.useShadows),
            verticalHasArrows: EditorBooleanOption.boolean(input.verticalHasArrows, this.defaultValue.verticalHasArrows),
            horizontalHasArrows: EditorBooleanOption.boolean(input.horizontalHasArrows, this.defaultValue.horizontalHasArrows),
            handleMouseWheel: EditorBooleanOption.boolean(input.handleMouseWheel, this.defaultValue.handleMouseWheel),
            alwaysConsumeMouseWheel: EditorBooleanOption.boolean(input.alwaysConsumeMouseWheel, this.defaultValue.alwaysConsumeMouseWheel),
            horizontalScrollbarSize: horizontalScrollbarSize,
            horizontalSliderSize: EditorIntOption.clampedInt(input.horizontalSliderSize, horizontalScrollbarSize, 0, 1000),
            verticalScrollbarSize: verticalScrollbarSize,
            verticalSliderSize: EditorIntOption.clampedInt(input.verticalSliderSize, verticalScrollbarSize, 0, 1000),
        };
    };
    return EditorScrollbar;
}(BaseEditorOption));
var EditorSuggest = /** @class */ (function (_super) {
    __extends(EditorSuggest, _super);
    function EditorSuggest() {
        var _this = this;
        var defaults = {
            insertMode: 'insert',
            insertHighlight: false,
            filterGraceful: true,
            snippetsPreventQuickSuggestions: true,
            localityBonus: false,
            shareSuggestSelections: false,
            showIcons: true,
            maxVisibleSuggestions: 12,
            showMethods: true,
            showFunctions: true,
            showConstructors: true,
            showFields: true,
            showVariables: true,
            showClasses: true,
            showStructs: true,
            showInterfaces: true,
            showModules: true,
            showProperties: true,
            showEvents: true,
            showOperators: true,
            showUnits: true,
            showValues: true,
            showConstants: true,
            showEnums: true,
            showEnumMembers: true,
            showKeywords: true,
            showWords: true,
            showColors: true,
            showFiles: true,
            showReferences: true,
            showFolders: true,
            showTypeParameters: true,
            showSnippets: true,
            hideStatusBar: true
        };
        _this = _super.call(this, 89 /* suggest */, 'suggest', defaults, {
            'editor.suggest.insertMode': {
                type: 'string',
                enum: ['insert', 'replace'],
                enumDescriptions: [
                    nls.localize('suggest.insertMode.insert', "Insert suggestion without overwriting text right of the cursor."),
                    nls.localize('suggest.insertMode.replace', "Insert suggestion and overwrite text right of the cursor."),
                ],
                default: defaults.insertMode,
                description: nls.localize('suggest.insertMode', "Controls whether words are overwritten when accepting completions. Note that this depends on extensions opting into this feature.")
            },
            'editor.suggest.insertHighlight': {
                type: 'boolean',
                default: defaults.insertHighlight,
                description: nls.localize('suggest.insertHighlight', "Controls whether unexpected text modifications while accepting completions should be highlighted, e.g `insertMode` is `replace` but the completion only supports `insert`.")
            },
            'editor.suggest.filterGraceful': {
                type: 'boolean',
                default: defaults.filterGraceful,
                description: nls.localize('suggest.filterGraceful', "Controls whether filtering and sorting suggestions accounts for small typos.")
            },
            'editor.suggest.localityBonus': {
                type: 'boolean',
                default: defaults.localityBonus,
                description: nls.localize('suggest.localityBonus', "Controls whether sorting favours words that appear close to the cursor.")
            },
            'editor.suggest.shareSuggestSelections': {
                type: 'boolean',
                default: defaults.shareSuggestSelections,
                markdownDescription: nls.localize('suggest.shareSuggestSelections', "Controls whether remembered suggestion selections are shared between multiple workspaces and windows (needs `#editor.suggestSelection#`).")
            },
            'editor.suggest.snippetsPreventQuickSuggestions': {
                type: 'boolean',
                default: defaults.snippetsPreventQuickSuggestions,
                description: nls.localize('suggest.snippetsPreventQuickSuggestions', "Controls whether an active snippet prevents quick suggestions.")
            },
            'editor.suggest.showIcons': {
                type: 'boolean',
                default: defaults.showIcons,
                description: nls.localize('suggest.showIcons', "Controls whether to show or hide icons in suggestions.")
            },
            'editor.suggest.maxVisibleSuggestions': {
                type: 'number',
                default: defaults.maxVisibleSuggestions,
                minimum: 1,
                maximum: 15,
                description: nls.localize('suggest.maxVisibleSuggestions', "Controls how many suggestions IntelliSense will show before showing a scrollbar (maximum 15).")
            },
            'editor.suggest.filteredTypes': {
                type: 'object',
                deprecationMessage: nls.localize('deprecated', "This setting is deprecated, please use separate settings like 'editor.suggest.showKeywords' or 'editor.suggest.showSnippets' instead.")
            },
            'editor.suggest.showMethods': {
                type: 'boolean',
                default: true,
                markdownDescription: nls.localize('editor.suggest.showMethods', "When enabled IntelliSense shows `method`-suggestions.")
            },
            'editor.suggest.showFunctions': {
                type: 'boolean',
                default: true,
                markdownDescription: nls.localize('editor.suggest.showFunctions', "When enabled IntelliSense shows `function`-suggestions.")
            },
            'editor.suggest.showConstructors': {
                type: 'boolean',
                default: true,
                markdownDescription: nls.localize('editor.suggest.showConstructors', "When enabled IntelliSense shows `constructor`-suggestions.")
            },
            'editor.suggest.showFields': {
                type: 'boolean',
                default: true,
                markdownDescription: nls.localize('editor.suggest.showFields', "When enabled IntelliSense shows `field`-suggestions.")
            },
            'editor.suggest.showVariables': {
                type: 'boolean',
                default: true,
                markdownDescription: nls.localize('editor.suggest.showVariables', "When enabled IntelliSense shows `variable`-suggestions.")
            },
            'editor.suggest.showClasses': {
                type: 'boolean',
                default: true,
                markdownDescription: nls.localize('editor.suggest.showClasss', "When enabled IntelliSense shows `class`-suggestions.")
            },
            'editor.suggest.showStructs': {
                type: 'boolean',
                default: true,
                markdownDescription: nls.localize('editor.suggest.showStructs', "When enabled IntelliSense shows `struct`-suggestions.")
            },
            'editor.suggest.showInterfaces': {
                type: 'boolean',
                default: true,
                markdownDescription: nls.localize('editor.suggest.showInterfaces', "When enabled IntelliSense shows `interface`-suggestions.")
            },
            'editor.suggest.showModules': {
                type: 'boolean',
                default: true,
                markdownDescription: nls.localize('editor.suggest.showModules', "When enabled IntelliSense shows `module`-suggestions.")
            },
            'editor.suggest.showProperties': {
                type: 'boolean',
                default: true,
                markdownDescription: nls.localize('editor.suggest.showPropertys', "When enabled IntelliSense shows `property`-suggestions.")
            },
            'editor.suggest.showEvents': {
                type: 'boolean',
                default: true,
                markdownDescription: nls.localize('editor.suggest.showEvents', "When enabled IntelliSense shows `event`-suggestions.")
            },
            'editor.suggest.showOperators': {
                type: 'boolean',
                default: true,
                markdownDescription: nls.localize('editor.suggest.showOperators', "When enabled IntelliSense shows `operator`-suggestions.")
            },
            'editor.suggest.showUnits': {
                type: 'boolean',
                default: true,
                markdownDescription: nls.localize('editor.suggest.showUnits', "When enabled IntelliSense shows `unit`-suggestions.")
            },
            'editor.suggest.showValues': {
                type: 'boolean',
                default: true,
                markdownDescription: nls.localize('editor.suggest.showValues', "When enabled IntelliSense shows `value`-suggestions.")
            },
            'editor.suggest.showConstants': {
                type: 'boolean',
                default: true,
                markdownDescription: nls.localize('editor.suggest.showConstants', "When enabled IntelliSense shows `constant`-suggestions.")
            },
            'editor.suggest.showEnums': {
                type: 'boolean',
                default: true,
                markdownDescription: nls.localize('editor.suggest.showEnums', "When enabled IntelliSense shows `enum`-suggestions.")
            },
            'editor.suggest.showEnumMembers': {
                type: 'boolean',
                default: true,
                markdownDescription: nls.localize('editor.suggest.showEnumMembers', "When enabled IntelliSense shows `enumMember`-suggestions.")
            },
            'editor.suggest.showKeywords': {
                type: 'boolean',
                default: true,
                markdownDescription: nls.localize('editor.suggest.showKeywords', "When enabled IntelliSense shows `keyword`-suggestions.")
            },
            'editor.suggest.showWords': {
                type: 'boolean',
                default: true,
                markdownDescription: nls.localize('editor.suggest.showTexts', "When enabled IntelliSense shows `text`-suggestions.")
            },
            'editor.suggest.showColors': {
                type: 'boolean',
                default: true,
                markdownDescription: nls.localize('editor.suggest.showColors', "When enabled IntelliSense shows `color`-suggestions.")
            },
            'editor.suggest.showFiles': {
                type: 'boolean',
                default: true,
                markdownDescription: nls.localize('editor.suggest.showFiles', "When enabled IntelliSense shows `file`-suggestions.")
            },
            'editor.suggest.showReferences': {
                type: 'boolean',
                default: true,
                markdownDescription: nls.localize('editor.suggest.showReferences', "When enabled IntelliSense shows `reference`-suggestions.")
            },
            'editor.suggest.showCustomcolors': {
                type: 'boolean',
                default: true,
                markdownDescription: nls.localize('editor.suggest.showCustomcolors', "When enabled IntelliSense shows `customcolor`-suggestions.")
            },
            'editor.suggest.showFolders': {
                type: 'boolean',
                default: true,
                markdownDescription: nls.localize('editor.suggest.showFolders', "When enabled IntelliSense shows `folder`-suggestions.")
            },
            'editor.suggest.showTypeParameters': {
                type: 'boolean',
                default: true,
                markdownDescription: nls.localize('editor.suggest.showTypeParameters', "When enabled IntelliSense shows `typeParameter`-suggestions.")
            },
            'editor.suggest.showSnippets': {
                type: 'boolean',
                default: true,
                markdownDescription: nls.localize('editor.suggest.showSnippets', "When enabled IntelliSense shows `snippet`-suggestions.")
            },
            'editor.suggest.hideStatusBar': {
                type: 'boolean',
                default: true,
                markdownDescription: nls.localize('editor.suggest.hideStatusBar', "Controls the visibility of the status bar at the bottom of the suggest widget.")
            }
        }) || this;
        return _this;
    }
    EditorSuggest.prototype.validate = function (_input) {
        if (typeof _input !== 'object') {
            return this.defaultValue;
        }
        var input = _input;
        return {
            insertMode: EditorStringEnumOption.stringSet(input.insertMode, this.defaultValue.insertMode, ['insert', 'replace']),
            insertHighlight: EditorBooleanOption.boolean(input.insertHighlight, this.defaultValue.insertHighlight),
            filterGraceful: EditorBooleanOption.boolean(input.filterGraceful, this.defaultValue.filterGraceful),
            snippetsPreventQuickSuggestions: EditorBooleanOption.boolean(input.snippetsPreventQuickSuggestions, this.defaultValue.filterGraceful),
            localityBonus: EditorBooleanOption.boolean(input.localityBonus, this.defaultValue.localityBonus),
            shareSuggestSelections: EditorBooleanOption.boolean(input.shareSuggestSelections, this.defaultValue.shareSuggestSelections),
            showIcons: EditorBooleanOption.boolean(input.showIcons, this.defaultValue.showIcons),
            maxVisibleSuggestions: EditorIntOption.clampedInt(input.maxVisibleSuggestions, this.defaultValue.maxVisibleSuggestions, 1, 15),
            showMethods: EditorBooleanOption.boolean(input.showMethods, this.defaultValue.showMethods),
            showFunctions: EditorBooleanOption.boolean(input.showFunctions, this.defaultValue.showFunctions),
            showConstructors: EditorBooleanOption.boolean(input.showConstructors, this.defaultValue.showConstructors),
            showFields: EditorBooleanOption.boolean(input.showFields, this.defaultValue.showFields),
            showVariables: EditorBooleanOption.boolean(input.showVariables, this.defaultValue.showVariables),
            showClasses: EditorBooleanOption.boolean(input.showClasses, this.defaultValue.showClasses),
            showStructs: EditorBooleanOption.boolean(input.showStructs, this.defaultValue.showStructs),
            showInterfaces: EditorBooleanOption.boolean(input.showInterfaces, this.defaultValue.showInterfaces),
            showModules: EditorBooleanOption.boolean(input.showModules, this.defaultValue.showModules),
            showProperties: EditorBooleanOption.boolean(input.showProperties, this.defaultValue.showProperties),
            showEvents: EditorBooleanOption.boolean(input.showEvents, this.defaultValue.showEvents),
            showOperators: EditorBooleanOption.boolean(input.showOperators, this.defaultValue.showOperators),
            showUnits: EditorBooleanOption.boolean(input.showUnits, this.defaultValue.showUnits),
            showValues: EditorBooleanOption.boolean(input.showValues, this.defaultValue.showValues),
            showConstants: EditorBooleanOption.boolean(input.showConstants, this.defaultValue.showConstants),
            showEnums: EditorBooleanOption.boolean(input.showEnums, this.defaultValue.showEnums),
            showEnumMembers: EditorBooleanOption.boolean(input.showEnumMembers, this.defaultValue.showEnumMembers),
            showKeywords: EditorBooleanOption.boolean(input.showKeywords, this.defaultValue.showKeywords),
            showWords: EditorBooleanOption.boolean(input.showWords, this.defaultValue.showWords),
            showColors: EditorBooleanOption.boolean(input.showColors, this.defaultValue.showColors),
            showFiles: EditorBooleanOption.boolean(input.showFiles, this.defaultValue.showFiles),
            showReferences: EditorBooleanOption.boolean(input.showReferences, this.defaultValue.showReferences),
            showFolders: EditorBooleanOption.boolean(input.showFolders, this.defaultValue.showFolders),
            showTypeParameters: EditorBooleanOption.boolean(input.showTypeParameters, this.defaultValue.showTypeParameters),
            showSnippets: EditorBooleanOption.boolean(input.showSnippets, this.defaultValue.showSnippets),
            hideStatusBar: EditorBooleanOption.boolean(input.hideStatusBar, this.defaultValue.hideStatusBar),
        };
    };
    return EditorSuggest;
}(BaseEditorOption));
//#endregion
//#region tabFocusMode
var EditorTabFocusMode = /** @class */ (function (_super) {
    __extends(EditorTabFocusMode, _super);
    function EditorTabFocusMode() {
        return _super.call(this, 106 /* tabFocusMode */, [68 /* readOnly */]) || this;
    }
    EditorTabFocusMode.prototype.compute = function (env, options, _) {
        var readOnly = options.get(68 /* readOnly */);
        return (readOnly ? true : env.tabFocusMode);
    };
    return EditorTabFocusMode;
}(ComputedEditorOption));
function _wrappingIndentFromString(wrappingIndent) {
    switch (wrappingIndent) {
        case 'none': return 0 /* None */;
        case 'same': return 1 /* Same */;
        case 'indent': return 2 /* Indent */;
        case 'deepIndent': return 3 /* DeepIndent */;
    }
}
var EditorWrappingInfoComputer = /** @class */ (function (_super) {
    __extends(EditorWrappingInfoComputer, _super);
    function EditorWrappingInfoComputer() {
        return _super.call(this, 108 /* wrappingInfo */, [97 /* wordWrap */, 100 /* wordWrapColumn */, 101 /* wordWrapMinified */, 107 /* layoutInfo */, 2 /* accessibilitySupport */]) || this;
    }
    EditorWrappingInfoComputer.prototype.compute = function (env, options, _) {
        var wordWrap = options.get(97 /* wordWrap */);
        var wordWrapColumn = options.get(100 /* wordWrapColumn */);
        var wordWrapMinified = options.get(101 /* wordWrapMinified */);
        var layoutInfo = options.get(107 /* layoutInfo */);
        var accessibilitySupport = options.get(2 /* accessibilitySupport */);
        var bareWrappingInfo = null;
        {
            if (accessibilitySupport === 2 /* Enabled */) {
                // See https://github.com/Microsoft/vscode/issues/27766
                // Never enable wrapping when a screen reader is attached
                // because arrow down etc. will not move the cursor in the way
                // a screen reader expects.
                bareWrappingInfo = {
                    isWordWrapMinified: false,
                    isViewportWrapping: false,
                    wrappingColumn: -1
                };
            }
            else if (wordWrapMinified && env.isDominatedByLongLines) {
                // Force viewport width wrapping if model is dominated by long lines
                bareWrappingInfo = {
                    isWordWrapMinified: true,
                    isViewportWrapping: true,
                    wrappingColumn: Math.max(1, layoutInfo.viewportColumn)
                };
            }
            else if (wordWrap === 'on') {
                bareWrappingInfo = {
                    isWordWrapMinified: false,
                    isViewportWrapping: true,
                    wrappingColumn: Math.max(1, layoutInfo.viewportColumn)
                };
            }
            else if (wordWrap === 'bounded') {
                bareWrappingInfo = {
                    isWordWrapMinified: false,
                    isViewportWrapping: true,
                    wrappingColumn: Math.min(Math.max(1, layoutInfo.viewportColumn), wordWrapColumn)
                };
            }
            else if (wordWrap === 'wordWrapColumn') {
                bareWrappingInfo = {
                    isWordWrapMinified: false,
                    isViewportWrapping: false,
                    wrappingColumn: wordWrapColumn
                };
            }
            else {
                bareWrappingInfo = {
                    isWordWrapMinified: false,
                    isViewportWrapping: false,
                    wrappingColumn: -1
                };
            }
        }
        return {
            isDominatedByLongLines: env.isDominatedByLongLines,
            isWordWrapMinified: bareWrappingInfo.isWordWrapMinified,
            isViewportWrapping: bareWrappingInfo.isViewportWrapping,
            wrappingColumn: bareWrappingInfo.wrappingColumn,
        };
    };
    return EditorWrappingInfoComputer;
}(ComputedEditorOption));
//#endregion
var DEFAULT_WINDOWS_FONT_FAMILY = 'Consolas, \'Courier New\', monospace';
var DEFAULT_MAC_FONT_FAMILY = 'Menlo, Monaco, \'Courier New\', monospace';
var DEFAULT_LINUX_FONT_FAMILY = '\'Droid Sans Mono\', \'monospace\', monospace, \'Droid Sans Fallback\'';
/**
 * @internal
 */
export var EDITOR_FONT_DEFAULTS = {
    fontFamily: (platform.isMacintosh ? DEFAULT_MAC_FONT_FAMILY : (platform.isLinux ? DEFAULT_LINUX_FONT_FAMILY : DEFAULT_WINDOWS_FONT_FAMILY)),
    fontWeight: 'normal',
    fontSize: (platform.isMacintosh ? 12 : 14),
    lineHeight: 0,
    letterSpacing: 0,
};
/**
 * @internal
 */
export var EDITOR_MODEL_DEFAULTS = {
    tabSize: 4,
    indentSize: 4,
    insertSpaces: true,
    detectIndentation: true,
    trimAutoWhitespace: true,
    largeFileOptimizations: true
};
/**
 * @internal
 */
export var editorOptionsRegistry = [];
function register(option) {
    editorOptionsRegistry[option.id] = option;
    return option;
}
/**
 * WORKAROUND: TS emits "any" for complex editor options values (anything except string, bool, enum, etc. ends up being "any")
 * @monacodtsreplace
 * /accessibilitySupport, any/accessibilitySupport, AccessibilitySupport/
 * /comments, any/comments, EditorCommentsOptions/
 * /find, any/find, EditorFindOptions/
 * /fontInfo, any/fontInfo, FontInfo/
 * /gotoLocation, any/gotoLocation, GoToLocationOptions/
 * /hover, any/hover, EditorHoverOptions/
 * /lightbulb, any/lightbulb, EditorLightbulbOptions/
 * /minimap, any/minimap, EditorMinimapOptions/
 * /parameterHints, any/parameterHints, InternalParameterHintOptions/
 * /quickSuggestions, any/quickSuggestions, ValidQuickSuggestionsOptions/
 * /suggest, any/suggest, InternalSuggestOptions/
 */
export var EditorOptions = {
    acceptSuggestionOnCommitCharacter: register(new EditorBooleanOption(0 /* acceptSuggestionOnCommitCharacter */, 'acceptSuggestionOnCommitCharacter', true, { markdownDescription: nls.localize('acceptSuggestionOnCommitCharacter', "Controls whether suggestions should be accepted on commit characters. For example, in JavaScript, the semi-colon (`;`) can be a commit character that accepts a suggestion and types that character.") })),
    acceptSuggestionOnEnter: register(new EditorStringEnumOption(1 /* acceptSuggestionOnEnter */, 'acceptSuggestionOnEnter', 'on', ['on', 'smart', 'off'], {
        markdownEnumDescriptions: [
            '',
            nls.localize('acceptSuggestionOnEnterSmart', "Only accept a suggestion with `Enter` when it makes a textual change."),
            ''
        ],
        markdownDescription: nls.localize('acceptSuggestionOnEnter', "Controls whether suggestions should be accepted on `Enter`, in addition to `Tab`. Helps to avoid ambiguity between inserting new lines or accepting suggestions.")
    })),
    accessibilitySupport: register(new EditorAccessibilitySupport()),
    accessibilityPageSize: register(new EditorIntOption(3 /* accessibilityPageSize */, 'accessibilityPageSize', 10, 1, 1073741824 /* MAX_SAFE_SMALL_INTEGER */, { description: nls.localize('accessibilityPageSize', "Controls the number of lines in the editor that can be read out by a screen reader. Warning: this has a performance implication for numbers larger than the default.") })),
    ariaLabel: register(new EditorStringOption(4 /* ariaLabel */, 'ariaLabel', nls.localize('editorViewAccessibleLabel', "Editor content"))),
    autoClosingBrackets: register(new EditorStringEnumOption(5 /* autoClosingBrackets */, 'autoClosingBrackets', 'languageDefined', ['always', 'languageDefined', 'beforeWhitespace', 'never'], {
        enumDescriptions: [
            '',
            nls.localize('editor.autoClosingBrackets.languageDefined', "Use language configurations to determine when to autoclose brackets."),
            nls.localize('editor.autoClosingBrackets.beforeWhitespace', "Autoclose brackets only when the cursor is to the left of whitespace."),
            '',
        ],
        description: nls.localize('autoClosingBrackets', "Controls whether the editor should automatically close brackets after the user adds an opening bracket.")
    })),
    autoClosingOvertype: register(new EditorStringEnumOption(6 /* autoClosingOvertype */, 'autoClosingOvertype', 'auto', ['always', 'auto', 'never'], {
        enumDescriptions: [
            '',
            nls.localize('editor.autoClosingOvertype.auto', "Type over closing quotes or brackets only if they were automatically inserted."),
            '',
        ],
        description: nls.localize('autoClosingOvertype', "Controls whether the editor should type over closing quotes or brackets.")
    })),
    autoClosingQuotes: register(new EditorStringEnumOption(7 /* autoClosingQuotes */, 'autoClosingQuotes', 'languageDefined', ['always', 'languageDefined', 'beforeWhitespace', 'never'], {
        enumDescriptions: [
            '',
            nls.localize('editor.autoClosingQuotes.languageDefined', "Use language configurations to determine when to autoclose quotes."),
            nls.localize('editor.autoClosingQuotes.beforeWhitespace', "Autoclose quotes only when the cursor is to the left of whitespace."),
            '',
        ],
        description: nls.localize('autoClosingQuotes', "Controls whether the editor should automatically close quotes after the user adds an opening quote.")
    })),
    autoIndent: register(new EditorEnumOption(8 /* autoIndent */, 'autoIndent', 4 /* Full */, 'full', ['none', 'keep', 'brackets', 'advanced', 'full'], _autoIndentFromString, {
        enumDescriptions: [
            nls.localize('editor.autoIndent.none', "The editor will not insert indentation automatically."),
            nls.localize('editor.autoIndent.keep', "The editor will keep the current line's indentation."),
            nls.localize('editor.autoIndent.brackets', "The editor will keep the current line's indentation and honor language defined brackets."),
            nls.localize('editor.autoIndent.advanced', "The editor will keep the current line's indentation, honor language defined brackets and invoke special onEnterRules defined by languages."),
            nls.localize('editor.autoIndent.full', "The editor will keep the current line's indentation, honor language defined brackets, invoke special onEnterRules defined by languages, and honor indentationRules defined by languages."),
        ],
        description: nls.localize('autoIndent', "Controls whether the editor should automatically adjust the indentation when users type, paste, move or indent lines.")
    })),
    automaticLayout: register(new EditorBooleanOption(9 /* automaticLayout */, 'automaticLayout', false)),
    autoSurround: register(new EditorStringEnumOption(10 /* autoSurround */, 'autoSurround', 'languageDefined', ['languageDefined', 'quotes', 'brackets', 'never'], {
        enumDescriptions: [
            nls.localize('editor.autoSurround.languageDefined', "Use language configurations to determine when to automatically surround selections."),
            nls.localize('editor.autoSurround.quotes', "Surround with quotes but not brackets."),
            nls.localize('editor.autoSurround.brackets', "Surround with brackets but not quotes."),
            ''
        ],
        description: nls.localize('autoSurround', "Controls whether the editor should automatically surround selections.")
    })),
    codeLens: register(new EditorBooleanOption(11 /* codeLens */, 'codeLens', true, { description: nls.localize('codeLens', "Controls whether the editor shows CodeLens.") })),
    colorDecorators: register(new EditorBooleanOption(12 /* colorDecorators */, 'colorDecorators', true, { description: nls.localize('colorDecorators', "Controls whether the editor should render the inline color decorators and color picker.") })),
    comments: register(new EditorComments()),
    contextmenu: register(new EditorBooleanOption(14 /* contextmenu */, 'contextmenu', true)),
    copyWithSyntaxHighlighting: register(new EditorBooleanOption(15 /* copyWithSyntaxHighlighting */, 'copyWithSyntaxHighlighting', true, { description: nls.localize('copyWithSyntaxHighlighting', "Controls whether syntax highlighting should be copied into the clipboard.") })),
    cursorBlinking: register(new EditorEnumOption(16 /* cursorBlinking */, 'cursorBlinking', 1 /* Blink */, 'blink', ['blink', 'smooth', 'phase', 'expand', 'solid'], _cursorBlinkingStyleFromString, { description: nls.localize('cursorBlinking', "Control the cursor animation style.") })),
    cursorSmoothCaretAnimation: register(new EditorBooleanOption(17 /* cursorSmoothCaretAnimation */, 'cursorSmoothCaretAnimation', false, { description: nls.localize('cursorSmoothCaretAnimation', "Controls whether the smooth caret animation should be enabled.") })),
    cursorStyle: register(new EditorEnumOption(18 /* cursorStyle */, 'cursorStyle', TextEditorCursorStyle.Line, 'line', ['line', 'block', 'underline', 'line-thin', 'block-outline', 'underline-thin'], _cursorStyleFromString, { description: nls.localize('cursorStyle', "Controls the cursor style.") })),
    cursorSurroundingLines: register(new EditorIntOption(19 /* cursorSurroundingLines */, 'cursorSurroundingLines', 0, 0, 1073741824 /* MAX_SAFE_SMALL_INTEGER */, { description: nls.localize('cursorSurroundingLines', "Controls the minimal number of visible leading and trailing lines surrounding the cursor. Known as 'scrollOff' or `scrollOffset` in some other editors.") })),
    cursorSurroundingLinesStyle: register(new EditorStringEnumOption(20 /* cursorSurroundingLinesStyle */, 'cursorSurroundingLinesStyle', 'default', ['default', 'all'], {
        enumDescriptions: [
            nls.localize('cursorSurroundingLinesStyle.default', "`cursorSurroundingLines` is enforced only when triggered via the keyboard or API."),
            nls.localize('cursorSurroundingLinesStyle.all', "`cursorSurroundingLines` is enforced always.")
        ],
        description: nls.localize('cursorSurroundingLinesStyle', "Controls when `cursorSurroundingLines` should be enforced.")
    })),
    cursorWidth: register(new EditorIntOption(21 /* cursorWidth */, 'cursorWidth', 0, 0, 1073741824 /* MAX_SAFE_SMALL_INTEGER */, { markdownDescription: nls.localize('cursorWidth', "Controls the width of the cursor when `#editor.cursorStyle#` is set to `line`.") })),
    disableLayerHinting: register(new EditorBooleanOption(22 /* disableLayerHinting */, 'disableLayerHinting', false)),
    disableMonospaceOptimizations: register(new EditorBooleanOption(23 /* disableMonospaceOptimizations */, 'disableMonospaceOptimizations', false)),
    dragAndDrop: register(new EditorBooleanOption(24 /* dragAndDrop */, 'dragAndDrop', true, { description: nls.localize('dragAndDrop', "Controls whether the editor should allow moving selections via drag and drop.") })),
    emptySelectionClipboard: register(new EditorEmptySelectionClipboard()),
    extraEditorClassName: register(new EditorStringOption(26 /* extraEditorClassName */, 'extraEditorClassName', '')),
    fastScrollSensitivity: register(new EditorFloatOption(27 /* fastScrollSensitivity */, 'fastScrollSensitivity', 5, function (x) { return (x <= 0 ? 5 : x); }, { markdownDescription: nls.localize('fastScrollSensitivity', "Scrolling speed multiplier when pressing `Alt`.") })),
    find: register(new EditorFind()),
    fixedOverflowWidgets: register(new EditorBooleanOption(29 /* fixedOverflowWidgets */, 'fixedOverflowWidgets', false)),
    folding: register(new EditorBooleanOption(30 /* folding */, 'folding', true, { description: nls.localize('folding', "Controls whether the editor has code folding enabled.") })),
    foldingStrategy: register(new EditorStringEnumOption(31 /* foldingStrategy */, 'foldingStrategy', 'auto', ['auto', 'indentation'], { markdownDescription: nls.localize('foldingStrategy', "Controls the strategy for computing folding ranges. `auto` uses a language specific folding strategy, if available. `indentation` uses the indentation based folding strategy.") })),
    foldingHighlight: register(new EditorBooleanOption(32 /* foldingHighlight */, 'foldingHighlight', true, { description: nls.localize('foldingHighlight', "Controls whether the editor should highlight folded ranges.") })),
    fontFamily: register(new EditorStringOption(33 /* fontFamily */, 'fontFamily', EDITOR_FONT_DEFAULTS.fontFamily, { description: nls.localize('fontFamily', "Controls the font family.") })),
    fontInfo: register(new EditorFontInfo()),
    fontLigatures2: register(new EditorFontLigatures()),
    fontSize: register(new EditorFontSize()),
    fontWeight: register(new EditorStringOption(37 /* fontWeight */, 'fontWeight', EDITOR_FONT_DEFAULTS.fontWeight, {
        enum: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
        description: nls.localize('fontWeight', "Controls the font weight.")
    })),
    formatOnPaste: register(new EditorBooleanOption(38 /* formatOnPaste */, 'formatOnPaste', false, { description: nls.localize('formatOnPaste', "Controls whether the editor should automatically format the pasted content. A formatter must be available and the formatter should be able to format a range in a document.") })),
    formatOnType: register(new EditorBooleanOption(39 /* formatOnType */, 'formatOnType', false, { description: nls.localize('formatOnType', "Controls whether the editor should automatically format the line after typing.") })),
    glyphMargin: register(new EditorBooleanOption(40 /* glyphMargin */, 'glyphMargin', true, { description: nls.localize('glyphMargin', "Controls whether the editor should render the vertical glyph margin. Glyph margin is mostly used for debugging.") })),
    gotoLocation: register(new EditorGoToLocation()),
    hideCursorInOverviewRuler: register(new EditorBooleanOption(42 /* hideCursorInOverviewRuler */, 'hideCursorInOverviewRuler', false, { description: nls.localize('hideCursorInOverviewRuler', "Controls whether the cursor should be hidden in the overview ruler.") })),
    highlightActiveIndentGuide: register(new EditorBooleanOption(43 /* highlightActiveIndentGuide */, 'highlightActiveIndentGuide', true, { description: nls.localize('highlightActiveIndentGuide', "Controls whether the editor should highlight the active indent guide.") })),
    hover: register(new EditorHover()),
    inDiffEditor: register(new EditorBooleanOption(45 /* inDiffEditor */, 'inDiffEditor', false)),
    letterSpacing: register(new EditorFloatOption(46 /* letterSpacing */, 'letterSpacing', EDITOR_FONT_DEFAULTS.letterSpacing, function (x) { return EditorFloatOption.clamp(x, -5, 20); }, { description: nls.localize('letterSpacing', "Controls the letter spacing in pixels.") })),
    lightbulb: register(new EditorLightbulb()),
    lineDecorationsWidth: register(new SimpleEditorOption(48 /* lineDecorationsWidth */, 'lineDecorationsWidth', 10)),
    lineHeight: register(new EditorLineHeight()),
    lineNumbers: register(new EditorRenderLineNumbersOption()),
    lineNumbersMinChars: register(new EditorIntOption(51 /* lineNumbersMinChars */, 'lineNumbersMinChars', 5, 1, 300)),
    links: register(new EditorBooleanOption(52 /* links */, 'links', true, { description: nls.localize('links', "Controls whether the editor should detect links and make them clickable.") })),
    matchBrackets: register(new EditorStringEnumOption(53 /* matchBrackets */, 'matchBrackets', 'always', ['always', 'near', 'never'], { description: nls.localize('matchBrackets', "Highlight matching brackets.") })),
    minimap: register(new EditorMinimap()),
    mouseStyle: register(new EditorStringEnumOption(55 /* mouseStyle */, 'mouseStyle', 'text', ['text', 'default', 'copy'])),
    mouseWheelScrollSensitivity: register(new EditorFloatOption(56 /* mouseWheelScrollSensitivity */, 'mouseWheelScrollSensitivity', 1, function (x) { return (x === 0 ? 1 : x); }, { markdownDescription: nls.localize('mouseWheelScrollSensitivity', "A multiplier to be used on the `deltaX` and `deltaY` of mouse wheel scroll events.") })),
    mouseWheelZoom: register(new EditorBooleanOption(57 /* mouseWheelZoom */, 'mouseWheelZoom', false, { markdownDescription: nls.localize('mouseWheelZoom', "Zoom the font of the editor when using mouse wheel and holding `Ctrl`.") })),
    multiCursorMergeOverlapping: register(new EditorBooleanOption(58 /* multiCursorMergeOverlapping */, 'multiCursorMergeOverlapping', true, { description: nls.localize('multiCursorMergeOverlapping', "Merge multiple cursors when they are overlapping.") })),
    multiCursorModifier: register(new EditorEnumOption(59 /* multiCursorModifier */, 'multiCursorModifier', 'altKey', 'alt', ['ctrlCmd', 'alt'], _multiCursorModifierFromString, {
        markdownEnumDescriptions: [
            nls.localize('multiCursorModifier.ctrlCmd', "Maps to `Control` on Windows and Linux and to `Command` on macOS."),
            nls.localize('multiCursorModifier.alt', "Maps to `Alt` on Windows and Linux and to `Option` on macOS.")
        ],
        markdownDescription: nls.localize({
            key: 'multiCursorModifier',
            comment: [
                '- `ctrlCmd` refers to a value the setting can take and should not be localized.',
                '- `Control` and `Command` refer to the modifier keys Ctrl or Cmd on the keyboard and can be localized.'
            ]
        }, "The modifier to be used to add multiple cursors with the mouse. The Go To Definition and Open Link mouse gestures will adapt such that they do not conflict with the multicursor modifier. [Read more](https://code.visualstudio.com/docs/editor/codebasics#_multicursor-modifier).")
    })),
    multiCursorPaste: register(new EditorStringEnumOption(60 /* multiCursorPaste */, 'multiCursorPaste', 'spread', ['spread', 'full'], {
        markdownEnumDescriptions: [
            nls.localize('multiCursorPaste.spread', "Each cursor pastes a single line of the text."),
            nls.localize('multiCursorPaste.full', "Each cursor pastes the full text.")
        ],
        markdownDescription: nls.localize('multiCursorPaste', "Controls pasting when the line count of the pasted text matches the cursor count.")
    })),
    occurrencesHighlight: register(new EditorBooleanOption(61 /* occurrencesHighlight */, 'occurrencesHighlight', true, { description: nls.localize('occurrencesHighlight', "Controls whether the editor should highlight semantic symbol occurrences.") })),
    overviewRulerBorder: register(new EditorBooleanOption(62 /* overviewRulerBorder */, 'overviewRulerBorder', true, { description: nls.localize('overviewRulerBorder', "Controls whether a border should be drawn around the overview ruler.") })),
    overviewRulerLanes: register(new EditorIntOption(63 /* overviewRulerLanes */, 'overviewRulerLanes', 3, 0, 3)),
    parameterHints: register(new EditorParameterHints()),
    peekWidgetDefaultFocus: register(new EditorStringEnumOption(65 /* peekWidgetDefaultFocus */, 'peekWidgetDefaultFocus', 'tree', ['tree', 'editor'], {
        enumDescriptions: [
            nls.localize('peekWidgetDefaultFocus.tree', "Focus the tree when opening peek"),
            nls.localize('peekWidgetDefaultFocus.editor', "Focus the editor when opening peek")
        ],
        description: nls.localize('peekWidgetDefaultFocus', "Controls whether to focus the inline editor or the tree in the peek widget.")
    })),
    quickSuggestions: register(new EditorQuickSuggestions()),
    quickSuggestionsDelay: register(new EditorIntOption(67 /* quickSuggestionsDelay */, 'quickSuggestionsDelay', 10, 0, 1073741824 /* MAX_SAFE_SMALL_INTEGER */, { description: nls.localize('quickSuggestionsDelay', "Controls the delay in milliseconds after which quick suggestions will show up.") })),
    readOnly: register(new EditorBooleanOption(68 /* readOnly */, 'readOnly', false)),
    renderControlCharacters: register(new EditorBooleanOption(69 /* renderControlCharacters */, 'renderControlCharacters', false, { description: nls.localize('renderControlCharacters', "Controls whether the editor should render control characters.") })),
    renderIndentGuides: register(new EditorBooleanOption(70 /* renderIndentGuides */, 'renderIndentGuides', true, { description: nls.localize('renderIndentGuides', "Controls whether the editor should render indent guides.") })),
    renderFinalNewline: register(new EditorBooleanOption(71 /* renderFinalNewline */, 'renderFinalNewline', true, { description: nls.localize('renderFinalNewline', "Render last line number when the file ends with a newline.") })),
    renderLineHighlight: register(new EditorStringEnumOption(72 /* renderLineHighlight */, 'renderLineHighlight', 'line', ['none', 'gutter', 'line', 'all'], {
        enumDescriptions: [
            '',
            '',
            '',
            nls.localize('renderLineHighlight.all', "Highlights both the gutter and the current line."),
        ],
        description: nls.localize('renderLineHighlight', "Controls how the editor should render the current line highlight.")
    })),
    renderValidationDecorations: register(new EditorStringEnumOption(73 /* renderValidationDecorations */, 'renderValidationDecorations', 'editable', ['editable', 'on', 'off'])),
    renderWhitespace: register(new EditorStringEnumOption(74 /* renderWhitespace */, 'renderWhitespace', 'none', ['none', 'boundary', 'selection', 'all'], {
        enumDescriptions: [
            '',
            nls.localize('renderWhitespace.boundary', "Render whitespace characters except for single spaces between words."),
            nls.localize('renderWhitespace.selection', "Render whitespace characters only on selected text."),
            ''
        ],
        description: nls.localize('renderWhitespace', "Controls how the editor should render whitespace characters.")
    })),
    revealHorizontalRightPadding: register(new EditorIntOption(75 /* revealHorizontalRightPadding */, 'revealHorizontalRightPadding', 30, 0, 1000)),
    roundedSelection: register(new EditorBooleanOption(76 /* roundedSelection */, 'roundedSelection', true, { description: nls.localize('roundedSelection', "Controls whether selections should have rounded corners.") })),
    rulers: register(new EditorRulers()),
    scrollbar: register(new EditorScrollbar()),
    scrollBeyondLastColumn: register(new EditorIntOption(79 /* scrollBeyondLastColumn */, 'scrollBeyondLastColumn', 5, 0, 1073741824 /* MAX_SAFE_SMALL_INTEGER */, { description: nls.localize('scrollBeyondLastColumn', "Controls the number of extra characters beyond which the editor will scroll horizontally.") })),
    scrollBeyondLastLine: register(new EditorBooleanOption(80 /* scrollBeyondLastLine */, 'scrollBeyondLastLine', true, { description: nls.localize('scrollBeyondLastLine', "Controls whether the editor will scroll beyond the last line.") })),
    selectionClipboard: register(new EditorBooleanOption(81 /* selectionClipboard */, 'selectionClipboard', true, {
        description: nls.localize('selectionClipboard', "Controls whether the Linux primary clipboard should be supported."),
        included: platform.isLinux
    })),
    selectionHighlight: register(new EditorBooleanOption(82 /* selectionHighlight */, 'selectionHighlight', true, { description: nls.localize('selectionHighlight', "Controls whether the editor should highlight matches similar to the selection.") })),
    selectOnLineNumbers: register(new EditorBooleanOption(83 /* selectOnLineNumbers */, 'selectOnLineNumbers', true)),
    showFoldingControls: register(new EditorStringEnumOption(84 /* showFoldingControls */, 'showFoldingControls', 'mouseover', ['always', 'mouseover'], { description: nls.localize('showFoldingControls', "Controls whether the fold controls on the gutter are automatically hidden.") })),
    showUnused: register(new EditorBooleanOption(85 /* showUnused */, 'showUnused', true, { description: nls.localize('showUnused', "Controls fading out of unused code.") })),
    snippetSuggestions: register(new EditorStringEnumOption(86 /* snippetSuggestions */, 'snippetSuggestions', 'inline', ['top', 'bottom', 'inline', 'none'], {
        enumDescriptions: [
            nls.localize('snippetSuggestions.top', "Show snippet suggestions on top of other suggestions."),
            nls.localize('snippetSuggestions.bottom', "Show snippet suggestions below other suggestions."),
            nls.localize('snippetSuggestions.inline', "Show snippets suggestions with other suggestions."),
            nls.localize('snippetSuggestions.none', "Do not show snippet suggestions."),
        ],
        description: nls.localize('snippetSuggestions', "Controls whether snippets are shown with other suggestions and how they are sorted.")
    })),
    smoothScrolling: register(new EditorBooleanOption(87 /* smoothScrolling */, 'smoothScrolling', false, { description: nls.localize('smoothScrolling', "Controls whether the editor will scroll using an animation.") })),
    stopRenderingLineAfter: register(new EditorIntOption(88 /* stopRenderingLineAfter */, 'stopRenderingLineAfter', 10000, -1, 1073741824 /* MAX_SAFE_SMALL_INTEGER */)),
    suggest: register(new EditorSuggest()),
    suggestFontSize: register(new EditorIntOption(90 /* suggestFontSize */, 'suggestFontSize', 0, 0, 1000, { markdownDescription: nls.localize('suggestFontSize', "Font size for the suggest widget. When set to `0`, the value of `#editor.fontSize#` is used.") })),
    suggestLineHeight: register(new EditorIntOption(91 /* suggestLineHeight */, 'suggestLineHeight', 0, 0, 1000, { markdownDescription: nls.localize('suggestLineHeight', "Line height for the suggest widget. When set to `0`, the value of `#editor.lineHeight#` is used.") })),
    suggestOnTriggerCharacters: register(new EditorBooleanOption(92 /* suggestOnTriggerCharacters */, 'suggestOnTriggerCharacters', true, { description: nls.localize('suggestOnTriggerCharacters', "Controls whether suggestions should automatically show up when typing trigger characters.") })),
    suggestSelection: register(new EditorStringEnumOption(93 /* suggestSelection */, 'suggestSelection', 'recentlyUsed', ['first', 'recentlyUsed', 'recentlyUsedByPrefix'], {
        markdownEnumDescriptions: [
            nls.localize('suggestSelection.first', "Always select the first suggestion."),
            nls.localize('suggestSelection.recentlyUsed', "Select recent suggestions unless further typing selects one, e.g. `console.| -> console.log` because `log` has been completed recently."),
            nls.localize('suggestSelection.recentlyUsedByPrefix', "Select suggestions based on previous prefixes that have completed those suggestions, e.g. `co -> console` and `con -> const`."),
        ],
        description: nls.localize('suggestSelection', "Controls how suggestions are pre-selected when showing the suggest list.")
    })),
    tabCompletion: register(new EditorStringEnumOption(94 /* tabCompletion */, 'tabCompletion', 'off', ['on', 'off', 'onlySnippets'], {
        enumDescriptions: [
            nls.localize('tabCompletion.on', "Tab complete will insert the best matching suggestion when pressing tab."),
            nls.localize('tabCompletion.off', "Disable tab completions."),
            nls.localize('tabCompletion.onlySnippets', "Tab complete snippets when their prefix match. Works best when 'quickSuggestions' aren't enabled."),
        ],
        description: nls.localize('tabCompletion', "Enables tab completions.")
    })),
    useTabStops: register(new EditorBooleanOption(95 /* useTabStops */, 'useTabStops', true, { description: nls.localize('useTabStops', "Inserting and deleting whitespace follows tab stops.") })),
    wordSeparators: register(new EditorStringOption(96 /* wordSeparators */, 'wordSeparators', USUAL_WORD_SEPARATORS, { description: nls.localize('wordSeparators', "Characters that will be used as word separators when doing word related navigations or operations.") })),
    wordWrap: register(new EditorStringEnumOption(97 /* wordWrap */, 'wordWrap', 'off', ['off', 'on', 'wordWrapColumn', 'bounded'], {
        markdownEnumDescriptions: [
            nls.localize('wordWrap.off', "Lines will never wrap."),
            nls.localize('wordWrap.on', "Lines will wrap at the viewport width."),
            nls.localize({
                key: 'wordWrap.wordWrapColumn',
                comment: [
                    '- `editor.wordWrapColumn` refers to a different setting and should not be localized.'
                ]
            }, "Lines will wrap at `#editor.wordWrapColumn#`."),
            nls.localize({
                key: 'wordWrap.bounded',
                comment: [
                    '- viewport means the edge of the visible window size.',
                    '- `editor.wordWrapColumn` refers to a different setting and should not be localized.'
                ]
            }, "Lines will wrap at the minimum of viewport and `#editor.wordWrapColumn#`."),
        ],
        description: nls.localize({
            key: 'wordWrap',
            comment: [
                '- \'off\', \'on\', \'wordWrapColumn\' and \'bounded\' refer to values the setting can take and should not be localized.',
                '- `editor.wordWrapColumn` refers to a different setting and should not be localized.'
            ]
        }, "Controls how lines should wrap.")
    })),
    wordWrapBreakAfterCharacters: register(new EditorStringOption(98 /* wordWrapBreakAfterCharacters */, 'wordWrapBreakAfterCharacters', ' \t})]?|/&.,;¢°′″‰℃、。｡､￠，．：；？！％・･ゝゞヽヾーァィゥェォッャュョヮヵヶぁぃぅぇぉっゃゅょゎゕゖㇰㇱㇲㇳㇴㇵㇶㇷㇸㇹㇺㇻㇼㇽㇾㇿ々〻ｧｨｩｪｫｬｭｮｯｰ”〉》」』】〕）］｝｣')),
    wordWrapBreakBeforeCharacters: register(new EditorStringOption(99 /* wordWrapBreakBeforeCharacters */, 'wordWrapBreakBeforeCharacters', '([{‘“〈《「『【〔（［｛｢£¥＄￡￥+＋')),
    wordWrapColumn: register(new EditorIntOption(100 /* wordWrapColumn */, 'wordWrapColumn', 80, 1, 1073741824 /* MAX_SAFE_SMALL_INTEGER */, {
        markdownDescription: nls.localize({
            key: 'wordWrapColumn',
            comment: [
                '- `editor.wordWrap` refers to a different setting and should not be localized.',
                '- \'wordWrapColumn\' and \'bounded\' refer to values the different setting can take and should not be localized.'
            ]
        }, "Controls the wrapping column of the editor when `#editor.wordWrap#` is `wordWrapColumn` or `bounded`.")
    })),
    wordWrapMinified: register(new EditorBooleanOption(101 /* wordWrapMinified */, 'wordWrapMinified', true)),
    wrappingIndent: register(new EditorEnumOption(102 /* wrappingIndent */, 'wrappingIndent', 1 /* Same */, 'same', ['none', 'same', 'indent', 'deepIndent'], _wrappingIndentFromString, {
        enumDescriptions: [
            nls.localize('wrappingIndent.none', "No indentation. Wrapped lines begin at column 1."),
            nls.localize('wrappingIndent.same', "Wrapped lines get the same indentation as the parent."),
            nls.localize('wrappingIndent.indent', "Wrapped lines get +1 indentation toward the parent."),
            nls.localize('wrappingIndent.deepIndent', "Wrapped lines get +2 indentation toward the parent."),
        ],
        description: nls.localize('wrappingIndent', "Controls the indentation of wrapped lines."),
    })),
    wrappingStrategy: register(new EditorStringEnumOption(103 /* wrappingStrategy */, 'wrappingStrategy', 'simple', ['simple', 'advanced'], {
        enumDescriptions: [
            nls.localize('wrappingStrategy.simple', "Assumes that all characters are of the same width. This is a fast algorithm that works correctly for monospace fonts and certain scripts (like Latin characters) where glyphs are of equal width."),
            nls.localize('wrappingStrategy.advanced', "Delegates wrapping points computation to the browser. This is a slow algorithm, that might cause freezes for large files, but it works correctly in all cases.")
        ],
        description: nls.localize('wrappingStrategy', "Controls the algorithm that computes wrapping points.")
    })),
    // Leave these at the end (because they have dependencies!)
    editorClassName: register(new EditorClassName()),
    pixelRatio: register(new EditorPixelRatio()),
    tabFocusMode: register(new EditorTabFocusMode()),
    layoutInfo: register(new EditorLayoutInfoComputer()),
    wrappingInfo: register(new EditorWrappingInfoComputer())
};
