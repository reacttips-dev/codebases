/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { isObject } from '../../base/common/types.js';
import { URI } from '../../base/common/uri.js';
import { Range } from './core/range.js';
import { LanguageFeatureRegistry } from './modes/languageFeatureRegistry.js';
import { TokenizationRegistryImpl } from './modes/tokenizationRegistry.js';
/**
 * @internal
 */
var LanguageIdentifier = /** @class */ (function () {
    function LanguageIdentifier(language, id) {
        this.language = language;
        this.id = id;
    }
    return LanguageIdentifier;
}());
export { LanguageIdentifier };
/**
 * @internal
 */
var TokenMetadata = /** @class */ (function () {
    function TokenMetadata() {
    }
    TokenMetadata.getLanguageId = function (metadata) {
        return (metadata & 255 /* LANGUAGEID_MASK */) >>> 0 /* LANGUAGEID_OFFSET */;
    };
    TokenMetadata.getTokenType = function (metadata) {
        return (metadata & 1792 /* TOKEN_TYPE_MASK */) >>> 8 /* TOKEN_TYPE_OFFSET */;
    };
    TokenMetadata.getFontStyle = function (metadata) {
        return (metadata & 14336 /* FONT_STYLE_MASK */) >>> 11 /* FONT_STYLE_OFFSET */;
    };
    TokenMetadata.getForeground = function (metadata) {
        return (metadata & 8372224 /* FOREGROUND_MASK */) >>> 14 /* FOREGROUND_OFFSET */;
    };
    TokenMetadata.getBackground = function (metadata) {
        return (metadata & 4286578688 /* BACKGROUND_MASK */) >>> 23 /* BACKGROUND_OFFSET */;
    };
    TokenMetadata.getClassNameFromMetadata = function (metadata) {
        var foreground = this.getForeground(metadata);
        var className = 'mtk' + foreground;
        var fontStyle = this.getFontStyle(metadata);
        if (fontStyle & 1 /* Italic */) {
            className += ' mtki';
        }
        if (fontStyle & 2 /* Bold */) {
            className += ' mtkb';
        }
        if (fontStyle & 4 /* Underline */) {
            className += ' mtku';
        }
        return className;
    };
    TokenMetadata.getInlineStyleFromMetadata = function (metadata, colorMap) {
        var foreground = this.getForeground(metadata);
        var fontStyle = this.getFontStyle(metadata);
        var result = "color: " + colorMap[foreground] + ";";
        if (fontStyle & 1 /* Italic */) {
            result += 'font-style: italic;';
        }
        if (fontStyle & 2 /* Bold */) {
            result += 'font-weight: bold;';
        }
        if (fontStyle & 4 /* Underline */) {
            result += 'text-decoration: underline;';
        }
        return result;
    };
    return TokenMetadata;
}());
export { TokenMetadata };
/**
 * @internal
 */
export var completionKindToCssClass = (function () {
    var data = Object.create(null);
    data[0 /* Method */] = 'method';
    data[1 /* Function */] = 'function';
    data[2 /* Constructor */] = 'constructor';
    data[3 /* Field */] = 'field';
    data[4 /* Variable */] = 'variable';
    data[5 /* Class */] = 'class';
    data[6 /* Struct */] = 'struct';
    data[7 /* Interface */] = 'interface';
    data[8 /* Module */] = 'module';
    data[9 /* Property */] = 'property';
    data[10 /* Event */] = 'event';
    data[11 /* Operator */] = 'operator';
    data[12 /* Unit */] = 'unit';
    data[13 /* Value */] = 'value';
    data[14 /* Constant */] = 'constant';
    data[15 /* Enum */] = 'enum';
    data[16 /* EnumMember */] = 'enum-member';
    data[17 /* Keyword */] = 'keyword';
    data[25 /* Snippet */] = 'snippet';
    data[18 /* Text */] = 'text';
    data[19 /* Color */] = 'color';
    data[20 /* File */] = 'file';
    data[21 /* Reference */] = 'reference';
    data[22 /* Customcolor */] = 'customcolor';
    data[23 /* Folder */] = 'folder';
    data[24 /* TypeParameter */] = 'type-parameter';
    return function (kind) {
        return data[kind] || 'property';
    };
})();
/**
 * @internal
 */
export var completionKindFromString = (function () {
    var data = Object.create(null);
    data['method'] = 0 /* Method */;
    data['function'] = 1 /* Function */;
    data['constructor'] = 2 /* Constructor */;
    data['field'] = 3 /* Field */;
    data['variable'] = 4 /* Variable */;
    data['class'] = 5 /* Class */;
    data['struct'] = 6 /* Struct */;
    data['interface'] = 7 /* Interface */;
    data['module'] = 8 /* Module */;
    data['property'] = 9 /* Property */;
    data['event'] = 10 /* Event */;
    data['operator'] = 11 /* Operator */;
    data['unit'] = 12 /* Unit */;
    data['value'] = 13 /* Value */;
    data['constant'] = 14 /* Constant */;
    data['enum'] = 15 /* Enum */;
    data['enum-member'] = 16 /* EnumMember */;
    data['enumMember'] = 16 /* EnumMember */;
    data['keyword'] = 17 /* Keyword */;
    data['snippet'] = 25 /* Snippet */;
    data['text'] = 18 /* Text */;
    data['color'] = 19 /* Color */;
    data['file'] = 20 /* File */;
    data['reference'] = 21 /* Reference */;
    data['customcolor'] = 22 /* Customcolor */;
    data['folder'] = 23 /* Folder */;
    data['type-parameter'] = 24 /* TypeParameter */;
    data['typeParameter'] = 24 /* TypeParameter */;
    return function (value, strict) {
        var res = data[value];
        if (typeof res === 'undefined' && !strict) {
            res = 9 /* Property */;
        }
        return res;
    };
})();
export var SignatureHelpTriggerKind;
(function (SignatureHelpTriggerKind) {
    SignatureHelpTriggerKind[SignatureHelpTriggerKind["Invoke"] = 1] = "Invoke";
    SignatureHelpTriggerKind[SignatureHelpTriggerKind["TriggerCharacter"] = 2] = "TriggerCharacter";
    SignatureHelpTriggerKind[SignatureHelpTriggerKind["ContentChange"] = 3] = "ContentChange";
})(SignatureHelpTriggerKind || (SignatureHelpTriggerKind = {}));
/**
 * A document highlight kind.
 */
export var DocumentHighlightKind;
(function (DocumentHighlightKind) {
    /**
     * A textual occurrence.
     */
    DocumentHighlightKind[DocumentHighlightKind["Text"] = 0] = "Text";
    /**
     * Read-access of a symbol, like reading a variable.
     */
    DocumentHighlightKind[DocumentHighlightKind["Read"] = 1] = "Read";
    /**
     * Write-access of a symbol, like writing to a variable.
     */
    DocumentHighlightKind[DocumentHighlightKind["Write"] = 2] = "Write";
})(DocumentHighlightKind || (DocumentHighlightKind = {}));
/**
 * @internal
 */
export function isLocationLink(thing) {
    return thing
        && URI.isUri(thing.uri)
        && Range.isIRange(thing.range)
        && (Range.isIRange(thing.originSelectionRange) || Range.isIRange(thing.targetSelectionRange));
}
/**
 * @internal
 */
export var SymbolKinds;
(function (SymbolKinds) {
    var byName = new Map();
    byName.set('file', 0 /* File */);
    byName.set('module', 1 /* Module */);
    byName.set('namespace', 2 /* Namespace */);
    byName.set('package', 3 /* Package */);
    byName.set('class', 4 /* Class */);
    byName.set('method', 5 /* Method */);
    byName.set('property', 6 /* Property */);
    byName.set('field', 7 /* Field */);
    byName.set('constructor', 8 /* Constructor */);
    byName.set('enum', 9 /* Enum */);
    byName.set('interface', 10 /* Interface */);
    byName.set('function', 11 /* Function */);
    byName.set('variable', 12 /* Variable */);
    byName.set('constant', 13 /* Constant */);
    byName.set('string', 14 /* String */);
    byName.set('number', 15 /* Number */);
    byName.set('boolean', 16 /* Boolean */);
    byName.set('array', 17 /* Array */);
    byName.set('object', 18 /* Object */);
    byName.set('key', 19 /* Key */);
    byName.set('null', 20 /* Null */);
    byName.set('enum-member', 21 /* EnumMember */);
    byName.set('struct', 22 /* Struct */);
    byName.set('event', 23 /* Event */);
    byName.set('operator', 24 /* Operator */);
    byName.set('type-parameter', 25 /* TypeParameter */);
    var byKind = new Map();
    byKind.set(0 /* File */, 'file');
    byKind.set(1 /* Module */, 'module');
    byKind.set(2 /* Namespace */, 'namespace');
    byKind.set(3 /* Package */, 'package');
    byKind.set(4 /* Class */, 'class');
    byKind.set(5 /* Method */, 'method');
    byKind.set(6 /* Property */, 'property');
    byKind.set(7 /* Field */, 'field');
    byKind.set(8 /* Constructor */, 'constructor');
    byKind.set(9 /* Enum */, 'enum');
    byKind.set(10 /* Interface */, 'interface');
    byKind.set(11 /* Function */, 'function');
    byKind.set(12 /* Variable */, 'variable');
    byKind.set(13 /* Constant */, 'constant');
    byKind.set(14 /* String */, 'string');
    byKind.set(15 /* Number */, 'number');
    byKind.set(16 /* Boolean */, 'boolean');
    byKind.set(17 /* Array */, 'array');
    byKind.set(18 /* Object */, 'object');
    byKind.set(19 /* Key */, 'key');
    byKind.set(20 /* Null */, 'null');
    byKind.set(21 /* EnumMember */, 'enum-member');
    byKind.set(22 /* Struct */, 'struct');
    byKind.set(23 /* Event */, 'event');
    byKind.set(24 /* Operator */, 'operator');
    byKind.set(25 /* TypeParameter */, 'type-parameter');
    /**
     * @internal
     */
    function fromString(value) {
        return byName.get(value);
    }
    SymbolKinds.fromString = fromString;
    /**
     * @internal
     */
    function toString(kind) {
        return byKind.get(kind);
    }
    SymbolKinds.toString = toString;
    /**
     * @internal
     */
    function toCssClassName(kind, inline) {
        return "codicon " + (inline ? 'inline' : 'block') + " codicon-symbol-" + (byKind.get(kind) || 'property');
    }
    SymbolKinds.toCssClassName = toCssClassName;
})(SymbolKinds || (SymbolKinds = {}));
var FoldingRangeKind = /** @class */ (function () {
    /**
     * Creates a new [FoldingRangeKind](#FoldingRangeKind).
     *
     * @param value of the kind.
     */
    function FoldingRangeKind(value) {
        this.value = value;
    }
    /**
     * Kind for folding range representing a comment. The value of the kind is 'comment'.
     */
    FoldingRangeKind.Comment = new FoldingRangeKind('comment');
    /**
     * Kind for folding range representing a import. The value of the kind is 'imports'.
     */
    FoldingRangeKind.Imports = new FoldingRangeKind('imports');
    /**
     * Kind for folding range representing regions (for example marked by `#region`, `#endregion`).
     * The value of the kind is 'region'.
     */
    FoldingRangeKind.Region = new FoldingRangeKind('region');
    return FoldingRangeKind;
}());
export { FoldingRangeKind };
/**
 * @internal
 */
export var WorkspaceFileEdit;
(function (WorkspaceFileEdit) {
    /**
     * @internal
     */
    function is(thing) {
        return isObject(thing) && (Boolean(thing.newUri) || Boolean(thing.oldUri));
    }
    WorkspaceFileEdit.is = is;
})(WorkspaceFileEdit || (WorkspaceFileEdit = {}));
/**
 * @internal
 */
export var WorkspaceTextEdit;
(function (WorkspaceTextEdit) {
    /**
     * @internal
     */
    function is(thing) {
        return isObject(thing) && URI.isUri(thing.resource) && isObject(thing.edit);
    }
    WorkspaceTextEdit.is = is;
})(WorkspaceTextEdit || (WorkspaceTextEdit = {}));
// --- feature registries ------
/**
 * @internal
 */
export var ReferenceProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var RenameProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var CompletionProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var SignatureHelpProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var HoverProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var DocumentSymbolProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var DocumentHighlightProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var DefinitionProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var DeclarationProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var ImplementationProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var TypeDefinitionProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var CodeLensProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var CodeActionProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var DocumentFormattingEditProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var DocumentRangeFormattingEditProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var OnTypeFormattingEditProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var LinkProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var ColorProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var SelectionRangeRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var FoldingRangeProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var DocumentSemanticTokensProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var DocumentRangeSemanticTokensProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var TokenizationRegistry = new TokenizationRegistryImpl();
