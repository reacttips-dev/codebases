'use es6';

import dispatcher from 'dispatcher/dispatcher';
import makeBatch from 'crm_data/api/makeBatch';
import { fetchAssociationDefinitionsByObjectTypeId } from '../api/AssociationsAPI';
import { ASSOCIATIONS_DEFINITIONS } from 'crm_data/actions/ActionNamespaces';
import { defineLazyKeyStore, registerLazyKeyService } from 'crm_data/store/LazyKeyStore';
import { isObjectTypeId } from 'customer-data-objects/constants/ObjectTypeIds';
var batchFetch = makeBatch(fetchAssociationDefinitionsByObjectTypeId, 'AssociationDefinitionStore.fetch');
registerLazyKeyService({
  namespace: ASSOCIATIONS_DEFINITIONS,
  fetch: batchFetch
});
export default defineLazyKeyStore({
  namespace: ASSOCIATIONS_DEFINITIONS,
  idIsValid: isObjectTypeId
}).register(dispatcher);