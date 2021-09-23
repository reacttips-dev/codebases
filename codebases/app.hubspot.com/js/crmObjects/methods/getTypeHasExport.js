'use es6';

import { CALL_TYPE_ID, COMPANY_TYPE_ID, CONTACT_TYPE_ID, DEAL_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import { getIsPortalSpecific } from './getIsPortalSpecific'; // We do not support VISIT (prospect) exports in the redesign, so I dropped
// the constant from this file.

var SUPPORTED_TYPES = [CONTACT_TYPE_ID, COMPANY_TYPE_ID, DEAL_TYPE_ID, TICKET_TYPE_ID, CALL_TYPE_ID];
export var getTypeHasExport = function getTypeHasExport(objectTypeDef) {
  return SUPPORTED_TYPES.includes(objectTypeDef.objectTypeId) || getIsPortalSpecific(objectTypeDef);
};