'use es6';

import dispatcher from 'dispatcher/dispatcher';
import { Map as ImmutableMap } from 'immutable';
import { DEFAULT_VIEW_UPDATED, VIEW_DELETED } from '../actions/ActionTypes';
import { defineLazyKeyStore, registerLazyKeyService } from 'crm_data/store/LazyKeyStore';
import makeBatch from 'crm_data/api/makeBatch';
import { getDefaultView } from './DefaultViewAPI';
import { TASK, VISIT } from 'customer-data-objects/constants/ObjectTypes';

function getInitialState() {
  return ImmutableMap();
}

function viewUpdated(state, _ref) {
  var objectType = _ref.objectType,
      viewId = _ref.viewId;
  return state.set(objectType, String(viewId));
}

function viewDeleted(state, _ref2) {
  var objectType = _ref2.objectType,
      viewId = _ref2.viewId;

  if (state.get(objectType) === viewId) {
    state = state.set(objectType, null);
  }

  return state;
}

export var getShouldFetchDefaultView = function getShouldFetchDefaultView(objectType) {
  return ![VISIT, TASK].includes(objectType);
};
export var fetch = function fetch(objectType) {
  if (getShouldFetchDefaultView(objectType)) {
    return getDefaultView(objectType);
  } // This returns a promise that will never resolve, because otherwise
  // LazyKeyStore wipes out the value that's set


  return new Promise(function () {});
};
var batchFetch = makeBatch(fetch, 'DefaultViewStore.fetch');
registerLazyKeyService({
  namespace: 'DEFAULT_VIEW_STORE',
  fetch: batchFetch,
  unstable_enableCache: true
});
export default defineLazyKeyStore({
  namespace: 'DEFAULT_VIEW_STORE',
  idIsValid: function idIsValid() {
    return true;
  },
  unstable_enableCache: true
}).defineName('DefaultViewStore').defineGetInitialState(getInitialState).defineResponseTo(DEFAULT_VIEW_UPDATED, viewUpdated).defineResponseTo(VIEW_DELETED, viewDeleted).register(dispatcher);