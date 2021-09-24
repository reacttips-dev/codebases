'use es6';

import { getFromBatch } from 'crm_data/settings/LocalSettings';
import { defineLazyKeyStore, registerLazyKeyService } from 'crm_data/store/LazyKeyStore';
import dispatcher from 'dispatcher/dispatcher';
import { LOCALSETTINGS } from 'crm_data/actions/ActionNamespaces';
registerLazyKeyService({
  namespace: LOCALSETTINGS,
  fetch: function fetch(ids) {
    var results = getFromBatch(localStorage, ids);
    return Promise.resolve(results);
  }
});
export default defineLazyKeyStore({
  idIsValid: function idIsValid(str) {
    return str && str.length > 1;
  },
  namespace: LOCALSETTINGS
}).defineName('LocalSettingsStore').defineResponseTo(LOCALSETTINGS + "_UPDATE_SUCCEEDED", function (state, updates) {
  return state.merge(updates);
}).defineResponseTo(LOCALSETTINGS + "_UPDATE_FAILED", function (state) {
  return state;
}).register(dispatcher);