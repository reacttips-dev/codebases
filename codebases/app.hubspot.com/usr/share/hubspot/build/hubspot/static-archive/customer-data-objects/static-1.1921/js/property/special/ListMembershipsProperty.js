'use es6';

import { RADIO } from 'customer-data-objects/property/PropertyFieldTypes';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import { ENUMERATION } from 'customer-data-objects/property/PropertyTypes';
export default PropertyRecord({
  displayOrder: -1,
  externalOptions: true,
  favoritedOrder: -1,
  fieldType: RADIO,
  groupName: 'contactinformation',
  hubspotDefined: true,
  label: 'List membership',
  name: 'listMemberships.listId',
  readOnlyDefinition: true,
  readOnlyValue: true,
  type: ENUMERATION
});