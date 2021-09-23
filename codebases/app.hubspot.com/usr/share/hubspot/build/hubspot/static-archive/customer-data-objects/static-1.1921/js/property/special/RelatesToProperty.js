'use es6';

import { SELECT } from 'customer-data-objects/property/PropertyFieldTypes';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
/**
 * Associated contact, company, ticket, or deal for a task
 * (which doesn't exist on the backend).
 */

export default PropertyRecord({
  displayOrder: -1,
  externalOptions: true,
  favoritedOrder: -1,
  fieldType: SELECT,
  formField: false,
  groupName: 'task',
  hubspotDefined: true,
  label: 'Associated with',
  mutableDefinitionNotDeletable: true,
  name: 'relatesTo',
  readOnlyDefinition: true,
  readOnlyValue: true,
  type: SELECT
});