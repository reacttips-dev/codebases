'use es6';

import { ENUMERATION } from '../PropertyTypes';
import { INBOUND_DB_IMPORT } from '../ExternalOptionTypes';
import { RADIO } from '../PropertyFieldTypes';
import PropertyRecord from '../PropertyRecord';
export default PropertyRecord({
  displayOrder: -1,
  externalOptions: true,
  favoritedOrder: -1,
  fieldType: RADIO,
  formField: true,
  groupName: 'contactinformation',
  hidden: false,
  hubspotDefined: true,
  label: 'Import',
  name: '_inbounddbio.importid_',
  readOnlyDefinition: true,
  readOnlyValue: true,
  referencedObjectType: INBOUND_DB_IMPORT,
  type: ENUMERATION
});