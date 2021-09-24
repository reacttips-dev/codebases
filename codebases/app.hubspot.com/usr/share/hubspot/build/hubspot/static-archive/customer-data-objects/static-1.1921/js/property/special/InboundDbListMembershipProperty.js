'use es6';

import { RADIO } from 'customer-data-objects/property/PropertyFieldTypes';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import { ENUMERATION } from 'customer-data-objects/property/PropertyTypes';
import { INBOUND_DB_LIST } from '../ExternalOptionTypes';
export default PropertyRecord({
  displayOrder: -1,
  externalOptions: true,
  favoritedOrder: -1,
  fieldType: RADIO,
  groupName: 'listmembership',
  hubspotDefined: true,
  label: 'List membership',
  name: 'ilsListMemberships.listId',
  readOnlyDefinition: true,
  readOnlyValue: true,
  referencedObjectType: INBOUND_DB_LIST,
  type: ENUMERATION
});