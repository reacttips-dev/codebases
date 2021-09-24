'use es6';

import { DEAL_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
export var getHasAssociationsAndPriority = function getHasAssociationsAndPriority(objectTypeId) {
  return [DEAL_TYPE_ID, TICKET_TYPE_ID].includes(objectTypeId);
};