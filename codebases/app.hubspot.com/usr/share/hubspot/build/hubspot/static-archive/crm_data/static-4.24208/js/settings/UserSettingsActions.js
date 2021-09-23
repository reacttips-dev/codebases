'use es6';

import { USER_SETTINGS_SAVED, USER_SETTINGS_SAVE_FAILED } from 'crm_data/actions/ActionTypes';
import invariant from 'react-utils/invariant';
import { transact } from 'crm_data/flux/transact';
import * as UserSettingsAPI from 'crm_data/settings/UserSettingsAPI';
import UserSettingsStore from 'crm_data/settings/UserSettingsStore';
import { dispatchQueue } from 'crm_data/dispatch/Dispatch';

var _enforceKey = function _enforceKey(key) {
  invariant(typeof key === 'string', 'UserSettingsActions: Argument "key" must be of type String (got `%s`)', typeof key);
};

export function saveUserSetting(key, value) {
  _enforceKey(key);

  var oldValue = UserSettingsStore.get(key);
  return transact({
    operation: function operation() {
      return UserSettingsAPI.saveUserSetting(key, value);
    },
    commit: [USER_SETTINGS_SAVED, {
      key: key,
      value: value
    }],
    rollback: [USER_SETTINGS_SAVE_FAILED, {
      key: key,
      value: oldValue
    }]
  });
}
export function queueSaveUserSetting(key, value) {
  var oldValue = UserSettingsStore.get(key);
  return UserSettingsAPI.saveUserSetting(key, value).then(function () {
    return dispatchQueue(USER_SETTINGS_SAVED, {
      key: key,
      value: value
    });
  }).catch(function () {
    return dispatchQueue(USER_SETTINGS_SAVE_FAILED, {
      key: key,
      value: oldValue
    });
  });
}