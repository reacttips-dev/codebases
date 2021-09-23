'use es6';

import dispatcher from 'dispatcher/dispatcher';
import { defineLazyKeyStore } from '../store/LazyKeyStore';
import isLegacyHubSpotObject from 'customer-data-objects/crmObject/isLegacyHubSpotObject';
import { isObjectTypeId } from 'customer-data-objects/constants/ObjectTypeIds';
import { registerLazyKeyService } from '../store/LazyKeyStore';
import makeBatch from 'crm_data/api/makeBatch';
import { fetchPipelinePermissions } from './PipelinePermissionsAPI';
export var PIPELINE_PERMISSIONS_NAMESPACE = 'PIPELINE_PERMISSIONS';
registerLazyKeyService({
  namespace: PIPELINE_PERMISSIONS_NAMESPACE,
  fetch: makeBatch(fetchPipelinePermissions)
});
var PipelinePermissionsStore = defineLazyKeyStore({
  namespace: PIPELINE_PERMISSIONS_NAMESPACE,
  idIsValid: function idIsValid(objectTypeOrId) {
    return isLegacyHubSpotObject(objectTypeOrId) || isObjectTypeId(objectTypeOrId);
  }
}).defineName('PipelinePermissionsStore').register(dispatcher);
export default PipelinePermissionsStore;