'use es6';

import { ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds'; // This was duplicated to gridStateLocalStorage.js in crm_ui as part of https://git.hubteam.com/HubSpot/CRM/pull/22295
// If you make changes here, please go make them there as well!

export var normalizeTypeId = function normalizeTypeId(objectType) {
  return ObjectTypesToIds[objectType] || objectType;
};