'use es6';

import { authLoaded } from 'crm_data/auth/AuthActions';
import UserSettingsStore from 'crm_data/settings/UserSettingsStore';
import SettingsStore from 'crm_data/settings/SettingsStore';
import UserPortalSettingsKeys from 'crm_data/settings/UserPortalSettingsKeys';
import UserSettingsKeys from 'crm_data/settings/UserSettingsKeys';

var defaultInitSettings = function defaultInitSettings() {
  UserSettingsStore.get([].concat(Object.values(UserPortalSettingsKeys), Object.values(UserSettingsKeys)));
  SettingsStore.get();
};

var SetupData = function SetupData(auth) {
  var initSettings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultInitSettings;

  require('crm_data/gates/IsUngatedStore');

  require('crm_data/user/UserStore');

  require('crm_data/portal/PortalStore');

  authLoaded(auth);
  initSettings();
};

export default SetupData;