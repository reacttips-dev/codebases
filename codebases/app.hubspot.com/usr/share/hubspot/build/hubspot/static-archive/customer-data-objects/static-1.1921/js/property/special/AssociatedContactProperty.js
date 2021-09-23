'use es6';

import { TEXT } from 'customer-data-objects/property/PropertyFieldTypes';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import { NUMBER } from 'customer-data-objects/property/PropertyTypes';
/**
 * Associated contact property for Deals
 * (which doesn't exist on the backend).
 */

export default PropertyRecord({
  displayOrder: -1,
  externalOptions: true,
  favoritedOrder: -1,
  fieldType: TEXT,
  formField: false,
  groupName: 'dealinformation',
  hubspotDefined: true,
  label: 'Associated contact',
  mutableDefinitionNotDeletable: true,
  name: 'associations.contact',
  readOnlyDefinition: true,
  readOnlyValue: true,
  type: NUMBER
});