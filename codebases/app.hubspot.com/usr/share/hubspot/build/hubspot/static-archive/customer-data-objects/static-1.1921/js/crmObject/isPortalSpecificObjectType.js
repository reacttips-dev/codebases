'use es6';

import { isObjectTypeId } from 'customer-data-objects/constants/ObjectTypeIds';
/**
 * See backend MetaTypeProto for full list of CrmObject type prefixes
 * https://git.hubteam.com/HubSpotProtected/CrmObjects/blob/master/CrmObjectsBase/src/main/proto/hubspot/crm/objects/crmobjects-core.proto#L414
 *
 */

var isPortalSpecificObjectType = function isPortalSpecificObjectType() {
  var objectType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return isObjectTypeId(objectType) && objectType.startsWith('2-');
};

export default isPortalSpecificObjectType;