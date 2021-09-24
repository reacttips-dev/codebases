'use es6'; // Replicates the logic in https://git.hubteam.com/HubSpot/CRM/blob/e24b3184af74b806e776e3a7c9bf939d77ed1364/crm-index-ui/static/js/lib/internal/properties/defaults.js#L14
// which is used in legacy code to determine the default columns for this type

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
export var getDefaultViewColumnsFromTypeDef = function getDefaultViewColumnsFromTypeDef(typeDef) {
  return _toConsumableArray(new window.Set([typeDef.primaryDisplayLabelPropertyName].concat(_toConsumableArray(typeDef.secondaryDisplayLabelPropertyNames), _toConsumableArray(typeDef.defaultSearchPropertyNames), _toConsumableArray(typeDef.requiredProperties)))).filter(Boolean).map(function (name) {
    return {
      name: name
    };
  });
};