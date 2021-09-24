'use es6';

import Raven from 'Raven';
import { COMPANY, CONTACT, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { isEmpty, isLoading } from 'crm_data/flux/LoadingStatus';
import { getObjectTypeDefinition, _getObjectTypeDefinitionFallback as fallback } from 'crm_data/crmObjectTypes/ObjectType';
import { isObjectTypeId, ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds';
import CrmObjectTypeStore from 'crm_data/crmObjectTypes/CrmObjectTypeStore'; // These types have a `LegacyCrmObjectType` record subclass declared
// for them in order to support protocol extensions.
// See `CrmObjectTypeRecords.getRecordType`

var OBJECT_TYPES_WITH_LEGACY_CRM_OBJECT_TYPE_RECORD = [TICKET, CONTACT, COMPANY, DEAL];
getObjectTypeDefinition.implement(String, function (objectType) {
  var useLegacyRecord = OBJECT_TYPES_WITH_LEGACY_CRM_OBJECT_TYPE_RECORD.includes(objectType);

  if (!isObjectTypeId(objectType) && !useLegacyRecord) {
    return fallback(objectType);
  }

  var identifier = objectType;

  if (useLegacyRecord) {
    identifier = ObjectTypesToIds[objectType];
  }

  var objectTypeDef = CrmObjectTypeStore.get(identifier); // HACK: These instant try/catch blocks are intentional! We're using them to
  // capture a stack trace so that we can figure out where and how these are being called.
  // Please do not remove them!

  if (isLoading(objectTypeDef)) {
    try {
      throw new Error('[getObjectTypeDefinition] object types not loaded!');
    } catch (error) {
      Raven.captureException(error, {
        extra: {
          objectType: objectType,
          identifier: identifier
        }
      });
    }
  }

  if (isEmpty(objectTypeDef)) {
    try {
      throw new Error('[getObjectTypeDefinition] objectType not found');
    } catch (error) {
      Raven.captureException(error, {
        extra: {
          objectType: objectType,
          identifier: identifier
        }
      });
    }
  }

  return objectTypeDef;
});
export default getObjectTypeDefinition;