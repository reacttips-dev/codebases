'use es6';

import { CONTACT_TYPE_ID, COMPANY_TYPE_ID, DEAL_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
export var getInactivePropertyKey = function getInactivePropertyKey(objectTypeId) {
  if ([CONTACT_TYPE_ID, COMPANY_TYPE_ID, DEAL_TYPE_ID].includes(objectTypeId)) {
    return 'notes_last_updated';
  } else if (objectTypeId === TICKET_TYPE_ID) {
    return 'hs_lastactivitydate';
  } // we currently cannot support inactive cards for object types
  // that do not have some kind of a last activity date property


  return null;
}; // if an object doesnt have an inactive property key, it cannot
// use inactive cards

export var getHasInactiveCards = function getHasInactiveCards(objectTypeId) {
  return !!getInactivePropertyKey(objectTypeId);
};