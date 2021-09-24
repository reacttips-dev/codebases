import { ObjectTypeFromIds } from '../constants/ObjectTypeIds';
import { isLegacyObjectType } from '../types/LegacyObjectType';

//NOTE: "legacy" object types that were supported by the CRM before the
// introduction of the shared/standard crmObject

/**
 * @deprecated Please prefer the typesafe utilities in `customer-data-objects/constants/LegacyObjectType`
 */
var isLegacyHubSpotObject = function isLegacyHubSpotObject(objectType) {
  if (!objectType) return false;
  return isLegacyObjectType(ObjectTypeFromIds[objectType] || objectType);
};

export default isLegacyHubSpotObject;