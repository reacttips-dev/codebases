'use es6';

import dispatcher from 'dispatcher/dispatcher';
import { DEAL_AUTOMATION } from '../actions/ActionNamespaces';
import { defineLazyKeyStore, registerLazyKeyService } from 'crm_data/store/LazyKeyStore';
import { fetchByUuids } from './DealAutomationAPI';
import { DEAL_AUTOMATION_CREATE_SUCCEEDED } from 'crm_data/actions/ActionTypes';
registerLazyKeyService({
  namespace: DEAL_AUTOMATION,
  fetch: fetchByUuids
});
export default defineLazyKeyStore({
  namespace: DEAL_AUTOMATION,
  idIsValid: function idIsValid(id) {
    return typeof id === 'string';
  }
}).defineResponseTo([DEAL_AUTOMATION_CREATE_SUCCEEDED], function (state, _ref) {
  var flow = _ref.flow;
  var newState = state.set(flow.get('uuid'), flow);
  return newState;
}).defineName('DealAutomationStore').register(dispatcher);