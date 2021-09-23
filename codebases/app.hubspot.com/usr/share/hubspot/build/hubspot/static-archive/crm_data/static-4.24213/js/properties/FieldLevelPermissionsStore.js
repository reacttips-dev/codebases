'use es6';

import dispatcher from 'dispatcher/dispatcher';
import { FIELD_LEVEL_PERMISSIONS } from '../actions/ActionNamespaces';
import { defineLazyKeyStore } from '../store/LazyKeyStore';
import isLegacyHubSpotObject from 'customer-data-objects/crmObject/isLegacyHubSpotObject';
import { isObjectTypeId } from 'customer-data-objects/constants/ObjectTypeIds';
import { registerLazyKeyService } from '../store/LazyKeyStore';
import { batchFetchFieldLevelPermissions } from './FieldLevelPermissionsAPI';
registerLazyKeyService({
  namespace: FIELD_LEVEL_PERMISSIONS,
  fetch: function fetch(objectTypes) {
    return batchFetchFieldLevelPermissions(objectTypes);
  }
});
var FieldLevelPermissionsStore = defineLazyKeyStore({
  namespace: FIELD_LEVEL_PERMISSIONS,
  idIsValid: function idIsValid(objectTypeOrId) {
    return isLegacyHubSpotObject(objectTypeOrId) || isObjectTypeId(objectTypeOrId);
  }
}).defineName('FieldLevelPermissionsStore').register(dispatcher);
export default FieldLevelPermissionsStore;