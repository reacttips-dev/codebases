'use es6';

import { BIDEN } from '../actions/ActionNamespaces';
import dispatcher from 'dispatcher/dispatcher';
import { fetchByIds } from './api/BidenAPI';
import { defineLazyKeyStore, registerLazyKeyService } from 'crm_data/store/LazyKeyStore';
registerLazyKeyService({
  namespace: BIDEN,
  fetch: fetchByIds
});
export default defineLazyKeyStore({
  namespace: BIDEN,
  idIsValid: function idIsValid(id) {
    return typeof id === 'string';
  }
}).defineName('BidenStore').register(dispatcher);