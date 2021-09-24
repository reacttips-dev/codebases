'use es6';

import defineObjectTypeStore from 'crm_data/flux/defineObjectTypeStore';
import { fetchDefaults } from 'crm_data/properties/FavoritePropertiesAPI';
import { DEFAULT_PROPERTIES_SAVE_SUCCEEDED } from './UserFavoritesActionTypes';
import dispatcher from 'dispatcher/dispatcher';
export default defineObjectTypeStore({
  actionTypePrefix: 'DEFAULT_PROPERTIES',
  fetch: fetchDefaults
}).defineName('PortalFavoritesStore').defineResponseTo(DEFAULT_PROPERTIES_SAVE_SUCCEEDED, function (state, _ref) {
  var value = _ref.value,
      objectType = _ref.objectType;
  return state.setIn(['data', objectType], value);
}).register(dispatcher);