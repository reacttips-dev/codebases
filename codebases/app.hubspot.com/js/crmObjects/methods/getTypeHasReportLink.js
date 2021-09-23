'use es6';

import { ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds';
var SUPPORTED_TYPES = [ObjectTypesToIds.CONTACT, ObjectTypesToIds.COMPANY, ObjectTypesToIds.DEAL, ObjectTypesToIds.TICKET];
export var getTypeHasReportLink = function getTypeHasReportLink(objectTypeDef) {
  return SUPPORTED_TYPES.includes(objectTypeDef.objectTypeId);
};