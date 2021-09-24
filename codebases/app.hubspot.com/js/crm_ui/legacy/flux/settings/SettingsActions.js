'use es6';

import * as ActionTypes from 'crm_data/actions/ActionTypes';
import * as SettingsAPI from 'crm_data/settings/SettingsAPI';
import SettingsStore from 'crm_data/settings/SettingsStore';
import { transact } from 'crm_data/flux/transact';
import PortalIdParser from 'PortalIdParser';
import * as Alerts from 'customer-data-ui-utilities/alerts/Alerts';

function notifyError() {
  Alerts.addError('settingsGeneric.error');
}

function notifySuccess() {
  Alerts.addSuccess('settingsGeneric.success');
}

var baseSet = function baseSet(key, value) {
  var oldValue = SettingsStore.get() && SettingsStore.get(key);
  return transact({
    operation: function operation() {
      return SettingsAPI.set(PortalIdParser.get(), key, value);
    },
    commit: [ActionTypes.SET_SETTING, {
      key: key,
      value: value
    }],
    rollback: [ActionTypes.REVERT_SETTING, {
      key: key,
      value: oldValue
    }]
  });
};

var baseDelete = function baseDelete(key) {
  var oldValue = SettingsStore.get() && SettingsStore.get(key);
  return transact({
    operation: function operation() {
      return SettingsAPI.del(PortalIdParser.get(), key);
    },
    commit: [ActionTypes.DELETE_SETTING, {
      key: key
    }],
    rollback: [ActionTypes.REVERT_SETTING, {
      key: key,
      value: oldValue
    }]
  });
};

export default {
  //Exposed to do something custom in auto associate. You probably shouldnt use this.
  _baseSet: baseSet,
  set: function set(key, value, silent) {
    if (Array.isArray(key)) {
      return Promise.all(key.map(function (subKey) {
        return baseSet(subKey, value);
      })).then(function () {
        if (!silent) {
          notifySuccess();
        }
      }, notifyError);
    } else {
      return baseSet(key, value).then(function () {
        if (!silent) {
          notifySuccess();
        }
      }, notifyError);
    }
  },
  delete: function _delete(key, silent) {
    return baseDelete(key).then(function () {
      if (!silent) {
        notifySuccess();
      }
    }, notifyError);
  }
};