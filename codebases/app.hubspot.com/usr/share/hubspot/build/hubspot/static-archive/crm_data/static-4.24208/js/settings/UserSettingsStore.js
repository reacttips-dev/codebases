'use es6';

import * as UserSettingsAPI from 'crm_data/settings/UserSettingsAPI';
import { definePooledObjectStore } from 'crm_data/flux/definePooledObjectStore';
import registerPooledObjectService from 'crm_data/flux/registerPooledObjectService';
import { USER_SETTINGS_SAVED, USER_SETTINGS_SAVE_FAILED, USERSETTINGS_FETCH_FAILED } from 'crm_data/actions/ActionTypes';
import { USERSETTINGS } from 'crm_data/actions/ActionNamespaces';
import dispatcher from 'dispatcher/dispatcher';
registerPooledObjectService({
  actionTypePrefix: USERSETTINGS,
  fetcher: UserSettingsAPI.fetchUserSetting
});
export var FETCH_FAILED_KEY = 'FETCH_FAILED';
export var FETCH_FAILED_VALUE = 'FETCH_FAILED';
export default definePooledObjectStore({
  actionTypePrefix: USERSETTINGS
}).defineName('UserSettingsStore').defineResponseTo([USER_SETTINGS_SAVED, USER_SETTINGS_SAVE_FAILED], function (state, payload) {
  var key = payload.key,
      value = payload.value;
  return state.set(key, value);
}).defineResponseTo([USERSETTINGS_FETCH_FAILED], function (state) {
  return state.set(FETCH_FAILED_KEY, FETCH_FAILED_VALUE);
}).register(dispatcher);