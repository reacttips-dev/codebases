'use es6';

import { ObjectTypeFromIds } from 'customer-data-objects/constants/ObjectTypeIds';
export var denormalizeTypeId = function denormalizeTypeId(objectTypeId) {
  return ObjectTypeFromIds[objectTypeId] || objectTypeId;
};