'use es6';

import * as fieldTypes from 'customer-data-objects/property/PropertyFieldTypes';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import { NUMBER } from 'customer-data-objects/property/PropertyTypes';
export default PropertyRecord({
  displayOrder: -1,
  externalOptions: true,
  favoritedOrder: -1,
  fieldType: fieldTypes.NUMBER,
  formField: true,
  groupName: 'dealinformation',
  hidden: false,
  hubspotDefined: true,
  label: 'Deal Stage Probability',
  name: 'dealstage.probability',
  readOnlyDefinition: true,
  readOnlyValue: true,
  type: NUMBER
});