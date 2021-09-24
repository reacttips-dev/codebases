'use es6';

import UserPortalSettingsKeys from 'crm_data/settings/UserPortalSettingsKeys';
import UserSettingsStore from 'crm_data/settings/UserSettingsStore';
export var setupUserSettingsStore = function setupUserSettingsStore(auth) {
  var user = auth.user;
  UserSettingsStore.get(UserPortalSettingsKeys.SALES_SEGMENTATION);

  if (user.scopes.indexOf('contacts-read') === -1) {
    window.location = '/';
  }
};