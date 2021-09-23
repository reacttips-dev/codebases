'use es6';

import { fromJS } from 'immutable';
import { TICKET_STAGE_PROPERTIES } from '../actions/ActionNamespaces';
import dispatcher from 'dispatcher/dispatcher';
import { fetch } from './api/TicketStagePropertiesAPI';
import { defineLazyValueStore } from 'crm_data/store/LazyValueStore';
import { TICKET_STAGE_PROPERTIES_UPDATE_SUCCEEDED } from 'crm_data/actions/ActionTypes';
export default defineLazyValueStore({
  namespace: TICKET_STAGE_PROPERTIES,
  fetch: fetch
}).defineName('TicketStagePropertiesStore').defineResponseTo(TICKET_STAGE_PROPERTIES_UPDATE_SUCCEEDED, function (state, _ref) {
  var stageId = _ref.stageId,
      properties = _ref.properties;
  return state.setIn(['value', stageId], fromJS(properties));
}).register(dispatcher);