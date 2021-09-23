'use es6';

import dispatcher from 'dispatcher/dispatcher';
import { TICKET_AUTOMATION } from '../actions/ActionNamespaces';
import { defineLazyKeyStore, registerLazyKeyService } from 'crm_data/store/LazyKeyStore';
import { fetchByUuids } from './TicketAutomationAPI';
import { TICKET_AUTOMATION_CREATE_SUCCEEDED } from 'crm_data/actions/ActionTypes';
registerLazyKeyService({
  namespace: TICKET_AUTOMATION,
  fetch: fetchByUuids
});
export default defineLazyKeyStore({
  namespace: TICKET_AUTOMATION,
  idIsValid: function idIsValid(id) {
    return typeof id === 'string';
  }
}).defineResponseTo([TICKET_AUTOMATION_CREATE_SUCCEEDED], function (state, _ref) {
  var flow = _ref.flow;
  var newState = state.set(flow.get('uuid'), flow);
  return newState;
}).defineName('TicketAutomationStore').register(dispatcher);