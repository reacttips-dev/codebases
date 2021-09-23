'use es6';

import * as ObjectTypesNamespace from 'customer-data-objects/constants/ObjectTypes';
import Raven from 'Raven';
import protocol from 'transmute/protocol'; // This is a problematic stop gap to account for the usage of 'ObjectTypes.hasOwnProperty(...)'
// A more robust solution would use an explicit check using the values in ObjectTypes,

var ObjectTypes = Object.assign({}, ObjectTypesNamespace); // --- getObjectTypeDefinition ---

export var _getObjectTypeDefinitionFallback = function _getObjectTypeDefinitionFallback(objectType) {
  if (!Object.prototype.hasOwnProperty.call(ObjectTypes, objectType)) {
    Raven.captureMessage('[ObjectType.getObjectTypeDefinition] invalid objectType', {
      extra: {
        objectType: objectType
      }
    });
  }

  return objectType;
};
/**
 * Get CrmObjectType definition or legacy identifier for given objectType string
 *
 * @param {!string} objectType - string objectType identifier
 * @returns {(string|CrmObjectTypeRecord)}
 */

export var getObjectTypeDefinition = protocol({
  name: 'getObjectTypeDefinition',
  args: [protocol.TYPE],
  fallback: _getObjectTypeDefinitionFallback
}); // --- getRequiredProperties ---

export var _getRequiredPropertiesFallback = function _getRequiredPropertiesFallback(objectType) {
  // getRequiredProperties depdends on getObjectTypeDefinition so invoke
  // it here for implementation consistency and to trigger any warnings
  getObjectTypeDefinition(objectType);
  return null;
};
/**
 * Supports legacy `objectType` constants (e.g. CONTACT), preserving backwards
 * compatibility. The CrmObjectTypeRecord implementation is in crm-index-ui
 * since it relies on hydrated data stores. We can adapt that as needed.
 *
 * @summary Get list of minimum properties needed for a functioning UI
 *
 * @param {!(string|CrmObjectTypeRecord)} objectType - string key or instance of CrmObjectTypeRecord
 * @returns {string[]}
 */

export var getRequiredProperties = protocol({
  name: 'getRequiredProperties',
  args: [protocol.TYPE],
  fallback: _getRequiredPropertiesFallback
});