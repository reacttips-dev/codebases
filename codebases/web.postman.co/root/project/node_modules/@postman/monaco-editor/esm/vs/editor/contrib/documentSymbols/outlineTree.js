import './media/outlineTree.css';
import './media/symbol-icons.css';
import { localize } from '../../../nls.js';
import { registerThemingParticipant } from '../../../platform/theme/common/themeService.js';
import { registerColor, foreground } from '../../../platform/theme/common/colorRegistry.js';
export var SYMBOL_ICON_ARRAY_FOREGROUND = registerColor('symbolIcon.arrayForeground', {
    dark: foreground,
    light: foreground,
    hc: foreground
}, localize('symbolIcon.arrayForeground', 'The foreground color for array symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_BOOLEAN_FOREGROUND = registerColor('symbolIcon.booleanForeground', {
    dark: foreground,
    light: foreground,
    hc: foreground
}, localize('symbolIcon.booleanForeground', 'The foreground color for boolean symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_CLASS_FOREGROUND = registerColor('symbolIcon.classForeground', {
    dark: '#EE9D28',
    light: '#D67E00',
    hc: '#EE9D28'
}, localize('symbolIcon.classForeground', 'The foreground color for class symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_COLOR_FOREGROUND = registerColor('symbolIcon.colorForeground', {
    dark: foreground,
    light: foreground,
    hc: foreground
}, localize('symbolIcon.colorForeground', 'The foreground color for color symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_CONSTANT_FOREGROUND = registerColor('symbolIcon.constantForeground', {
    dark: foreground,
    light: foreground,
    hc: foreground
}, localize('symbolIcon.constantForeground', 'The foreground color for constant symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_CONSTRUCTOR_FOREGROUND = registerColor('symbolIcon.constructorForeground', {
    dark: '#B180D7',
    light: '#652D90',
    hc: '#B180D7'
}, localize('symbolIcon.constructorForeground', 'The foreground color for constructor symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_ENUMERATOR_FOREGROUND = registerColor('symbolIcon.enumeratorForeground', {
    dark: '#EE9D28',
    light: '#D67E00',
    hc: '#EE9D28'
}, localize('symbolIcon.enumeratorForeground', 'The foreground color for enumerator symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_ENUMERATOR_MEMBER_FOREGROUND = registerColor('symbolIcon.enumeratorMemberForeground', {
    dark: '#75BEFF',
    light: '#007ACC',
    hc: '#75BEFF'
}, localize('symbolIcon.enumeratorMemberForeground', 'The foreground color for enumerator member symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_EVENT_FOREGROUND = registerColor('symbolIcon.eventForeground', {
    dark: '#EE9D28',
    light: '#D67E00',
    hc: '#EE9D28'
}, localize('symbolIcon.eventForeground', 'The foreground color for event symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_FIELD_FOREGROUND = registerColor('symbolIcon.fieldForeground', {
    dark: '#75BEFF',
    light: '#007ACC',
    hc: '#75BEFF'
}, localize('symbolIcon.fieldForeground', 'The foreground color for field symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_FILE_FOREGROUND = registerColor('symbolIcon.fileForeground', {
    dark: foreground,
    light: foreground,
    hc: foreground
}, localize('symbolIcon.fileForeground', 'The foreground color for file symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_FOLDER_FOREGROUND = registerColor('symbolIcon.folderForeground', {
    dark: foreground,
    light: foreground,
    hc: foreground
}, localize('symbolIcon.folderForeground', 'The foreground color for folder symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_FUNCTION_FOREGROUND = registerColor('symbolIcon.functionForeground', {
    dark: '#B180D7',
    light: '#652D90',
    hc: '#B180D7'
}, localize('symbolIcon.functionForeground', 'The foreground color for function symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_INTERFACE_FOREGROUND = registerColor('symbolIcon.interfaceForeground', {
    dark: '#75BEFF',
    light: '#007ACC',
    hc: '#75BEFF'
}, localize('symbolIcon.interfaceForeground', 'The foreground color for interface symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_KEY_FOREGROUND = registerColor('symbolIcon.keyForeground', {
    dark: foreground,
    light: foreground,
    hc: foreground
}, localize('symbolIcon.keyForeground', 'The foreground color for key symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_KEYWORD_FOREGROUND = registerColor('symbolIcon.keywordForeground', {
    dark: foreground,
    light: foreground,
    hc: foreground
}, localize('symbolIcon.keywordForeground', 'The foreground color for keyword symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_METHOD_FOREGROUND = registerColor('symbolIcon.methodForeground', {
    dark: '#B180D7',
    light: '#652D90',
    hc: '#B180D7'
}, localize('symbolIcon.methodForeground', 'The foreground color for method symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_MODULE_FOREGROUND = registerColor('symbolIcon.moduleForeground', {
    dark: foreground,
    light: foreground,
    hc: foreground
}, localize('symbolIcon.moduleForeground', 'The foreground color for module symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_NAMESPACE_FOREGROUND = registerColor('symbolIcon.namespaceForeground', {
    dark: foreground,
    light: foreground,
    hc: foreground
}, localize('symbolIcon.namespaceForeground', 'The foreground color for namespace symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_NULL_FOREGROUND = registerColor('symbolIcon.nullForeground', {
    dark: foreground,
    light: foreground,
    hc: foreground
}, localize('symbolIcon.nullForeground', 'The foreground color for null symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_NUMBER_FOREGROUND = registerColor('symbolIcon.numberForeground', {
    dark: foreground,
    light: foreground,
    hc: foreground
}, localize('symbolIcon.numberForeground', 'The foreground color for number symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_OBJECT_FOREGROUND = registerColor('symbolIcon.objectForeground', {
    dark: foreground,
    light: foreground,
    hc: foreground
}, localize('symbolIcon.objectForeground', 'The foreground color for object symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_OPERATOR_FOREGROUND = registerColor('symbolIcon.operatorForeground', {
    dark: foreground,
    light: foreground,
    hc: foreground
}, localize('symbolIcon.operatorForeground', 'The foreground color for operator symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_PACKAGE_FOREGROUND = registerColor('symbolIcon.packageForeground', {
    dark: foreground,
    light: foreground,
    hc: foreground
}, localize('symbolIcon.packageForeground', 'The foreground color for package symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_PROPERTY_FOREGROUND = registerColor('symbolIcon.propertyForeground', {
    dark: foreground,
    light: foreground,
    hc: foreground
}, localize('symbolIcon.propertyForeground', 'The foreground color for property symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_REFERENCE_FOREGROUND = registerColor('symbolIcon.referenceForeground', {
    dark: foreground,
    light: foreground,
    hc: foreground
}, localize('symbolIcon.referenceForeground', 'The foreground color for reference symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_SNIPPET_FOREGROUND = registerColor('symbolIcon.snippetForeground', {
    dark: foreground,
    light: foreground,
    hc: foreground
}, localize('symbolIcon.snippetForeground', 'The foreground color for snippet symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_STRING_FOREGROUND = registerColor('symbolIcon.stringForeground', {
    dark: foreground,
    light: foreground,
    hc: foreground
}, localize('symbolIcon.stringForeground', 'The foreground color for string symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_STRUCT_FOREGROUND = registerColor('symbolIcon.structForeground', {
    dark: foreground,
    light: foreground,
    hc: foreground
}, localize('symbolIcon.structForeground', 'The foreground color for struct symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_TEXT_FOREGROUND = registerColor('symbolIcon.textForeground', {
    dark: foreground,
    light: foreground,
    hc: foreground
}, localize('symbolIcon.textForeground', 'The foreground color for text symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_TYPEPARAMETER_FOREGROUND = registerColor('symbolIcon.typeParameterForeground', {
    dark: foreground,
    light: foreground,
    hc: foreground
}, localize('symbolIcon.typeParameterForeground', 'The foreground color for type parameter symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_UNIT_FOREGROUND = registerColor('symbolIcon.unitForeground', {
    dark: foreground,
    light: foreground,
    hc: foreground
}, localize('symbolIcon.unitForeground', 'The foreground color for unit symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
export var SYMBOL_ICON_VARIABLE_FOREGROUND = registerColor('symbolIcon.variableForeground', {
    dark: '#75BEFF',
    light: '#007ACC',
    hc: '#75BEFF'
}, localize('symbolIcon.variableForeground', 'The foreground color for variable symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
registerThemingParticipant(function (theme, collector) {
    var symbolIconArrayColor = theme.getColor(SYMBOL_ICON_ARRAY_FOREGROUND);
    if (symbolIconArrayColor) {
        collector.addRule(".codicon-symbol-array { color: " + symbolIconArrayColor + " !important; }");
    }
    var symbolIconBooleanColor = theme.getColor(SYMBOL_ICON_BOOLEAN_FOREGROUND);
    if (symbolIconBooleanColor) {
        collector.addRule(".codicon-symbol-boolean { color: " + symbolIconBooleanColor + " !important; }");
    }
    var symbolIconClassColor = theme.getColor(SYMBOL_ICON_CLASS_FOREGROUND);
    if (symbolIconClassColor) {
        collector.addRule(".codicon-symbol-class { color: " + symbolIconClassColor + " !important; }");
    }
    var symbolIconMethodColor = theme.getColor(SYMBOL_ICON_METHOD_FOREGROUND);
    if (symbolIconMethodColor) {
        collector.addRule(".codicon-symbol-method { color: " + symbolIconMethodColor + " !important; }");
    }
    var symbolIconColorColor = theme.getColor(SYMBOL_ICON_COLOR_FOREGROUND);
    if (symbolIconColorColor) {
        collector.addRule(".codicon-symbol-color { color: " + symbolIconColorColor + " !important; }");
    }
    var symbolIconConstantColor = theme.getColor(SYMBOL_ICON_CONSTANT_FOREGROUND);
    if (symbolIconConstantColor) {
        collector.addRule(".codicon-symbol-constant { color: " + symbolIconConstantColor + " !important; }");
    }
    var symbolIconConstructorColor = theme.getColor(SYMBOL_ICON_CONSTRUCTOR_FOREGROUND);
    if (symbolIconConstructorColor) {
        collector.addRule(".codicon-symbol-constructor { color: " + symbolIconConstructorColor + " !important; }");
    }
    var symbolIconEnumeratorColor = theme.getColor(SYMBOL_ICON_ENUMERATOR_FOREGROUND);
    if (symbolIconEnumeratorColor) {
        collector.addRule("\n\t\t\t.codicon-symbol-value,.codicon-symbol-enum { color: " + symbolIconEnumeratorColor + " !important; }");
    }
    var symbolIconEnumeratorMemberColor = theme.getColor(SYMBOL_ICON_ENUMERATOR_MEMBER_FOREGROUND);
    if (symbolIconEnumeratorMemberColor) {
        collector.addRule(".codicon-symbol-enum-member { color: " + symbolIconEnumeratorMemberColor + " !important; }");
    }
    var symbolIconEventColor = theme.getColor(SYMBOL_ICON_EVENT_FOREGROUND);
    if (symbolIconEventColor) {
        collector.addRule(".codicon-symbol-event { color: " + symbolIconEventColor + " !important; }");
    }
    var symbolIconFieldColor = theme.getColor(SYMBOL_ICON_FIELD_FOREGROUND);
    if (symbolIconFieldColor) {
        collector.addRule(".codicon-symbol-field { color: " + symbolIconFieldColor + " !important; }");
    }
    var symbolIconFileColor = theme.getColor(SYMBOL_ICON_FILE_FOREGROUND);
    if (symbolIconFileColor) {
        collector.addRule(".codicon-symbol-file { color: " + symbolIconFileColor + " !important; }");
    }
    var symbolIconFolderColor = theme.getColor(SYMBOL_ICON_FOLDER_FOREGROUND);
    if (symbolIconFolderColor) {
        collector.addRule(".codicon-symbol-folder { color: " + symbolIconFolderColor + " !important; }");
    }
    var symbolIconFunctionColor = theme.getColor(SYMBOL_ICON_FUNCTION_FOREGROUND);
    if (symbolIconFunctionColor) {
        collector.addRule(".codicon-symbol-function { color: " + symbolIconFunctionColor + " !important; }");
    }
    var symbolIconInterfaceColor = theme.getColor(SYMBOL_ICON_INTERFACE_FOREGROUND);
    if (symbolIconInterfaceColor) {
        collector.addRule(".codicon-symbol-interface { color: " + symbolIconInterfaceColor + " !important; }");
    }
    var symbolIconKeyColor = theme.getColor(SYMBOL_ICON_KEY_FOREGROUND);
    if (symbolIconKeyColor) {
        collector.addRule(".codicon-symbol-key { color: " + symbolIconKeyColor + " !important; }");
    }
    var symbolIconKeywordColor = theme.getColor(SYMBOL_ICON_KEYWORD_FOREGROUND);
    if (symbolIconKeywordColor) {
        collector.addRule(".codicon-symbol-keyword { color: " + symbolIconKeywordColor + " !important; }");
    }
    var symbolIconModuleColor = theme.getColor(SYMBOL_ICON_MODULE_FOREGROUND);
    if (symbolIconModuleColor) {
        collector.addRule(".codicon-symbol-module { color: " + symbolIconModuleColor + " !important; }");
    }
    var outlineNamespaceColor = theme.getColor(SYMBOL_ICON_NAMESPACE_FOREGROUND);
    if (outlineNamespaceColor) {
        collector.addRule(".codicon-symbol-namespace { color: " + outlineNamespaceColor + " !important; }");
    }
    var symbolIconNullColor = theme.getColor(SYMBOL_ICON_NULL_FOREGROUND);
    if (symbolIconNullColor) {
        collector.addRule(".codicon-symbol-null { color: " + symbolIconNullColor + " !important; }");
    }
    var symbolIconNumberColor = theme.getColor(SYMBOL_ICON_NUMBER_FOREGROUND);
    if (symbolIconNumberColor) {
        collector.addRule(".codicon-symbol-number { color: " + symbolIconNumberColor + " !important; }");
    }
    var symbolIconObjectColor = theme.getColor(SYMBOL_ICON_OBJECT_FOREGROUND);
    if (symbolIconObjectColor) {
        collector.addRule(".codicon-symbol-object { color: " + symbolIconObjectColor + " !important; }");
    }
    var symbolIconOperatorColor = theme.getColor(SYMBOL_ICON_OPERATOR_FOREGROUND);
    if (symbolIconOperatorColor) {
        collector.addRule(".codicon-symbol-operator { color: " + symbolIconOperatorColor + " !important; }");
    }
    var symbolIconPackageColor = theme.getColor(SYMBOL_ICON_PACKAGE_FOREGROUND);
    if (symbolIconPackageColor) {
        collector.addRule(".codicon-symbol-package { color: " + symbolIconPackageColor + " !important; }");
    }
    var symbolIconPropertyColor = theme.getColor(SYMBOL_ICON_PROPERTY_FOREGROUND);
    if (symbolIconPropertyColor) {
        collector.addRule(".codicon-symbol-property { color: " + symbolIconPropertyColor + " !important; }");
    }
    var symbolIconReferenceColor = theme.getColor(SYMBOL_ICON_REFERENCE_FOREGROUND);
    if (symbolIconReferenceColor) {
        collector.addRule(".codicon-symbol-reference { color: " + symbolIconReferenceColor + " !important; }");
    }
    var symbolIconSnippetColor = theme.getColor(SYMBOL_ICON_SNIPPET_FOREGROUND);
    if (symbolIconSnippetColor) {
        collector.addRule(".codicon-symbol-snippet { color: " + symbolIconSnippetColor + " !important; }");
    }
    var symbolIconStringColor = theme.getColor(SYMBOL_ICON_STRING_FOREGROUND);
    if (symbolIconStringColor) {
        collector.addRule(".codicon-symbol-string { color: " + symbolIconStringColor + " !important; }");
    }
    var symbolIconStructColor = theme.getColor(SYMBOL_ICON_STRUCT_FOREGROUND);
    if (symbolIconStructColor) {
        collector.addRule(".codicon-symbol-struct { color: " + symbolIconStructColor + " !important; }");
    }
    var symbolIconTextColor = theme.getColor(SYMBOL_ICON_TEXT_FOREGROUND);
    if (symbolIconTextColor) {
        collector.addRule(".codicon-symbol-text { color: " + symbolIconTextColor + " !important; }");
    }
    var symbolIconTypeParameterColor = theme.getColor(SYMBOL_ICON_TYPEPARAMETER_FOREGROUND);
    if (symbolIconTypeParameterColor) {
        collector.addRule(".codicon-symbol-type-parameter { color: " + symbolIconTypeParameterColor + " !important; }");
    }
    var symbolIconUnitColor = theme.getColor(SYMBOL_ICON_UNIT_FOREGROUND);
    if (symbolIconUnitColor) {
        collector.addRule(".codicon-symbol-unit { color: " + symbolIconUnitColor + " !important; }");
    }
    var symbolIconVariableColor = theme.getColor(SYMBOL_ICON_VARIABLE_FOREGROUND);
    if (symbolIconVariableColor) {
        collector.addRule(".codicon-symbol-variable { color: " + symbolIconVariableColor + " !important; }");
    }
});
