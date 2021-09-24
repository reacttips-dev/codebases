'use es6';

import { CONTACT_TYPE_ID, COMPANY_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
export var isCallableObjectTypeId = function isCallableObjectTypeId(objectTypeId) {
  return [CONTACT_TYPE_ID, COMPANY_TYPE_ID].includes(objectTypeId);
};