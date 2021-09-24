'use es6';

import { PROPERTIES } from '../actions/ActionNamespaces';
import identity from 'transmute/identity';
import { registerLazyKeyService } from '../store/LazyKeyStore';
import { fetchPropertyGroupsBatch, normalizePropertyGroupsImmutable } from './PropertiesAPI';
export default registerLazyKeyService({
  namespace: PROPERTIES,
  fetch: fetchPropertyGroupsBatch,
  idTransform: identity,
  deserializeData: normalizePropertyGroupsImmutable,
  unstable_enableCache: true
});