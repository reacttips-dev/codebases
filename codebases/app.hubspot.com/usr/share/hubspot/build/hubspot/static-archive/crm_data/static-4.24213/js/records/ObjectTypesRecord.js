'use es6';

import { Record } from 'immutable';
import * as ObjectTypesNamespace from 'customer-data-objects/constants/ObjectTypes'; // This is a problematic stop gap to account for the usage of 'ObjectTypes.hasOwnProperty(...)'
// A more robust solution would use an explicit check using the values in ObjectTypes,

var ObjectTypes = Object.assign({}, ObjectTypesNamespace);
var objectTypeFields = {};
Object.keys(ObjectTypes).forEach(function (objectType) {
  objectTypeFields[objectType] = undefined;
});
export default Record(objectTypeFields, 'ObjectTypesRecord');