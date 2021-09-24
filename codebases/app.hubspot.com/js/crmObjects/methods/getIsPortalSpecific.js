'use es6';

import { PORTAL_SPECIFIC } from 'customer-data-objects/constants/MetaTypes';
export var getIsPortalSpecific = function getIsPortalSpecific(objectTypeDef) {
  return objectTypeDef.metaTypeId === PORTAL_SPECIFIC;
};