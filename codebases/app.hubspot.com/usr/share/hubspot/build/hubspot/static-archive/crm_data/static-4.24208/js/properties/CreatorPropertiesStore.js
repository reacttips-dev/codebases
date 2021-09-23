'use es6';

import dispatcher from 'dispatcher/dispatcher';
import { fetch } from './CreatorPropertiesAPI';
import defineObjectTypeStore from 'crm_data/flux/defineObjectTypeStore';
import { fromJS } from 'immutable';
import { OBJECT_CREATOR_PROPERTIES } from '../actions/ActionNamespaces';
import { CREATOR_PROPERTIES_UPDATE_SUCCEEDED } from 'crm_data/actions/ActionTypes';
export default defineObjectTypeStore({
  actionTypePrefix: OBJECT_CREATOR_PROPERTIES,
  fetch: fetch
}).defineName('CreatorPropertiesStore').defineResponseTo(CREATOR_PROPERTIES_UPDATE_SUCCEEDED, function (state, _ref) {
  var objectType = _ref.objectType,
      properties = _ref.properties;
  return state.setIn(['data', objectType], fromJS(properties));
}).register(dispatcher);