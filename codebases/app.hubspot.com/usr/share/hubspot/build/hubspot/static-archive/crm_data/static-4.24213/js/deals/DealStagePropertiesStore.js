'use es6';

import { fromJS } from 'immutable';
import { DEAL_STAGE_PROPERTIES } from '../actions/ActionNamespaces';
import dispatcher from 'dispatcher/dispatcher';
import { fetch } from './api/DealStagePropertiesAPI';
import { defineLazyValueStore } from 'crm_data/store/LazyValueStore';
import { DEAL_STAGE_PROPERTIES_UPDATE_SUCCEEDED } from 'crm_data/actions/ActionTypes';
export default defineLazyValueStore({
  namespace: DEAL_STAGE_PROPERTIES,
  fetch: fetch
}).defineName('DealStagePropertiesStore').defineResponseTo(DEAL_STAGE_PROPERTIES_UPDATE_SUCCEEDED, function (state, _ref) {
  var stageId = _ref.stageId,
      properties = _ref.properties;
  return state.setIn(['value', stageId], fromJS(properties));
}).register(dispatcher);