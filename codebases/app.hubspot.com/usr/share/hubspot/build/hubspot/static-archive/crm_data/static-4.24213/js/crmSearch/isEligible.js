'use es6';

import { COMPANY, CONTACT, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import withGateOverride from 'crm_data/gates/withGateOverride';
import IsUngatedStore from 'crm_data/gates/IsUngatedStore'; // Follow the comments in this file for a ContactsSearch > CrmSearch migration. All comments are in that context.
// Add an object type to this array to mark it as eligible

var SUPPORTED_OBJECT_TYPES = [COMPANY, CONTACT, DEAL, TICKET];

var isObjectTypeSupported = function isObjectTypeSupported(objectType) {
  return SUPPORTED_OBJECT_TYPES.includes(objectType);
}; // Add a key:value pair to this object to set the gate that is being used
// the format should be objectType: 'gateName', for example
// [COMPANY]: 'CRM:CrmSearch:Companies


var GATES_BY_TYPE = {}; // Add a type to this array when the migration to CrmSearch is complete
// so that we can keep this migration infrastructure around until all types are migrated.

var MIGRATED_TYPES = [COMPANY, CONTACT, DEAL, TICKET];

var isUngated = function isUngated(objectType) {
  var isMigrated = MIGRATED_TYPES.includes(objectType);
  return isMigrated || GATES_BY_TYPE[objectType] && withGateOverride(GATES_BY_TYPE[objectType], IsUngatedStore.get(GATES_BY_TYPE[objectType]));
};

export var isEligible = function isEligible(objectType, isCrmObject) {
  if (isCrmObject) {
    return true;
  }

  return isObjectTypeSupported(objectType) && isUngated(objectType);
};