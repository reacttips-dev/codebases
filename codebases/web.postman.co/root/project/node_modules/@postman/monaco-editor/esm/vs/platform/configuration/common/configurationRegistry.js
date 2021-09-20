/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as nls from '../../../nls.js';
import { Emitter } from '../../../base/common/event.js';
import { Registry } from '../../registry/common/platform.js';
import * as types from '../../../base/common/types.js';
import { Extensions as JSONExtensions } from '../../jsonschemas/common/jsonContributionRegistry.js';
import { values } from '../../../base/common/map.js';
export var Extensions = {
    Configuration: 'base.contributions.configuration'
};
export var allSettings = { properties: {}, patternProperties: {} };
export var applicationSettings = { properties: {}, patternProperties: {} };
export var machineSettings = { properties: {}, patternProperties: {} };
export var machineOverridableSettings = { properties: {}, patternProperties: {} };
export var windowSettings = { properties: {}, patternProperties: {} };
export var resourceSettings = { properties: {}, patternProperties: {} };
export var resourceLanguageSettingsSchemaId = 'vscode://schemas/settings/resourceLanguage';
var contributionRegistry = Registry.as(JSONExtensions.JSONContribution);
var ConfigurationRegistry = /** @class */ (function () {
    function ConfigurationRegistry() {
        this.overrideIdentifiers = new Set();
        this._onDidSchemaChange = new Emitter();
        this._onDidUpdateConfiguration = new Emitter();
        this.defaultOverridesConfigurationNode = {
            id: 'defaultOverrides',
            title: nls.localize('defaultConfigurations.title', "Default Configuration Overrides"),
            properties: {}
        };
        this.configurationContributors = [this.defaultOverridesConfigurationNode];
        this.resourceLanguageSettingsSchema = { properties: {}, patternProperties: {}, additionalProperties: false, errorMessage: 'Unknown editor configuration setting', allowTrailingCommas: true, allowComments: true };
        this.configurationProperties = {};
        this.excludedConfigurationProperties = {};
        contributionRegistry.registerSchema(resourceLanguageSettingsSchemaId, this.resourceLanguageSettingsSchema);
    }
    ConfigurationRegistry.prototype.registerConfiguration = function (configuration, validate) {
        if (validate === void 0) { validate = true; }
        this.registerConfigurations([configuration], validate);
    };
    ConfigurationRegistry.prototype.registerConfigurations = function (configurations, validate) {
        var _this = this;
        if (validate === void 0) { validate = true; }
        var properties = [];
        configurations.forEach(function (configuration) {
            properties.push.apply(properties, _this.validateAndRegisterProperties(configuration, validate)); // fills in defaults
            _this.configurationContributors.push(configuration);
            _this.registerJSONConfiguration(configuration);
        });
        contributionRegistry.registerSchema(resourceLanguageSettingsSchemaId, this.resourceLanguageSettingsSchema);
        this._onDidSchemaChange.fire();
        this._onDidUpdateConfiguration.fire(properties);
    };
    ConfigurationRegistry.prototype.registerOverrideIdentifiers = function (overrideIdentifiers) {
        for (var _i = 0, overrideIdentifiers_1 = overrideIdentifiers; _i < overrideIdentifiers_1.length; _i++) {
            var overrideIdentifier = overrideIdentifiers_1[_i];
            this.overrideIdentifiers.add(overrideIdentifier);
        }
        this.updateOverridePropertyPatternKey();
    };
    ConfigurationRegistry.prototype.validateAndRegisterProperties = function (configuration, validate, scope) {
        if (validate === void 0) { validate = true; }
        if (scope === void 0) { scope = 3 /* WINDOW */; }
        scope = types.isUndefinedOrNull(configuration.scope) ? scope : configuration.scope;
        var propertyKeys = [];
        var properties = configuration.properties;
        if (properties) {
            for (var key in properties) {
                if (validate && validateProperty(key)) {
                    delete properties[key];
                    continue;
                }
                // fill in default values
                var property = properties[key];
                var defaultValue = property.default;
                if (types.isUndefined(defaultValue)) {
                    property.default = getDefaultValue(property.type);
                }
                if (OVERRIDE_PROPERTY_PATTERN.test(key)) {
                    property.scope = undefined; // No scope for overridable properties `[${identifier}]`
                }
                else {
                    property.scope = types.isUndefinedOrNull(property.scope) ? scope : property.scope;
                }
                // Add to properties maps
                // Property is included by default if 'included' is unspecified
                if (properties[key].hasOwnProperty('included') && !properties[key].included) {
                    this.excludedConfigurationProperties[key] = properties[key];
                    delete properties[key];
                    continue;
                }
                else {
                    this.configurationProperties[key] = properties[key];
                }
                propertyKeys.push(key);
            }
        }
        var subNodes = configuration.allOf;
        if (subNodes) {
            for (var _i = 0, subNodes_1 = subNodes; _i < subNodes_1.length; _i++) {
                var node = subNodes_1[_i];
                propertyKeys.push.apply(propertyKeys, this.validateAndRegisterProperties(node, validate, scope));
            }
        }
        return propertyKeys;
    };
    ConfigurationRegistry.prototype.getConfigurationProperties = function () {
        return this.configurationProperties;
    };
    ConfigurationRegistry.prototype.registerJSONConfiguration = function (configuration) {
        var _this = this;
        var register = function (configuration) {
            var properties = configuration.properties;
            if (properties) {
                for (var key in properties) {
                    allSettings.properties[key] = properties[key];
                    switch (properties[key].scope) {
                        case 1 /* APPLICATION */:
                            applicationSettings.properties[key] = properties[key];
                            break;
                        case 2 /* MACHINE */:
                            machineSettings.properties[key] = properties[key];
                            break;
                        case 6 /* MACHINE_OVERRIDABLE */:
                            machineOverridableSettings.properties[key] = properties[key];
                            break;
                        case 3 /* WINDOW */:
                            windowSettings.properties[key] = properties[key];
                            break;
                        case 4 /* RESOURCE */:
                            resourceSettings.properties[key] = properties[key];
                            break;
                        case 5 /* LANGUAGE_OVERRIDABLE */:
                            resourceSettings.properties[key] = properties[key];
                            _this.resourceLanguageSettingsSchema.properties[key] = properties[key];
                            break;
                    }
                }
            }
            var subNodes = configuration.allOf;
            if (subNodes) {
                subNodes.forEach(register);
            }
        };
        register(configuration);
    };
    ConfigurationRegistry.prototype.updateOverridePropertyPatternKey = function () {
        var _a;
        for (var _i = 0, _b = values(this.overrideIdentifiers); _i < _b.length; _i++) {
            var overrideIdentifier = _b[_i];
            var overrideIdentifierProperty = "[" + overrideIdentifier + "]";
            var resourceLanguagePropertiesSchema = {
                type: 'object',
                description: nls.localize('overrideSettings.defaultDescription', "Configure editor settings to be overridden for a language."),
                errorMessage: nls.localize('overrideSettings.errorMessage', "This setting does not support per-language configuration."),
                $ref: resourceLanguageSettingsSchemaId,
                default: (_a = this.defaultOverridesConfigurationNode.properties[overrideIdentifierProperty]) === null || _a === void 0 ? void 0 : _a.default
            };
            allSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
            applicationSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
            machineSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
            machineOverridableSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
            windowSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
            resourceSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
        }
        this._onDidSchemaChange.fire();
    };
    return ConfigurationRegistry;
}());
var OVERRIDE_PROPERTY = '\\[.*\\]$';
export var OVERRIDE_PROPERTY_PATTERN = new RegExp(OVERRIDE_PROPERTY);
export function getDefaultValue(type) {
    var t = Array.isArray(type) ? type[0] : type;
    switch (t) {
        case 'boolean':
            return false;
        case 'integer':
        case 'number':
            return 0;
        case 'string':
            return '';
        case 'array':
            return [];
        case 'object':
            return {};
        default:
            return null;
    }
}
var configurationRegistry = new ConfigurationRegistry();
Registry.add(Extensions.Configuration, configurationRegistry);
export function validateProperty(property) {
    if (OVERRIDE_PROPERTY_PATTERN.test(property)) {
        return nls.localize('config.property.languageDefault', "Cannot register '{0}'. This matches property pattern '\\\\[.*\\\\]$' for describing language specific editor settings. Use 'configurationDefaults' contribution.", property);
    }
    if (configurationRegistry.getConfigurationProperties()[property] !== undefined) {
        return nls.localize('config.property.duplicate', "Cannot register '{0}'. This property is already registered.", property);
    }
    return null;
}
