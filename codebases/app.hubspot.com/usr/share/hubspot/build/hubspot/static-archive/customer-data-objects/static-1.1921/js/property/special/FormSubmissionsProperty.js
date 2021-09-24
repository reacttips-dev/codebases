'use es6';

import { RADIO } from 'customer-data-objects/property/PropertyFieldTypes';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import { ENUMERATION } from 'customer-data-objects/property/PropertyTypes';
export default PropertyRecord({
  displayOrder: -1,
  externalOptions: true,
  favoritedOrder: -1,
  fieldType: RADIO,
  formField: true,
  groupName: 'contactinformation',
  hidden: false,
  hubspotDefined: true,
  label: 'Form submission',
  name: 'formSubmissions.formId',
  readOnlyDefinition: true,
  readOnlyValue: true,
  type: ENUMERATION
});