'use es6';

export var expandedSettingsKey = 'SETTINGS_NAV:EXPANDED_ITEMS';
export var navConfigSettingsKey = 'SETTINGS_NAV:NAV_CONFIG';
export var navConfigSettingsV4Key = 'SETTINGS_NAV:NAV_CONFIG_V4';
export var navConfigSettingsPreferencesKey = 'SETTINGS_PREFERENCES_NAV:NAV_CONFIG';
export var hasSeenWelcomeDialogKey = 'SETTINGS_NAV:SEEN_WELCOME_DIALOG';
export var getSessionSetting = function getSessionSetting(key) {
  var setting;

  try {
    setting = JSON.parse(window.sessionStorage.getItem(key));
  } catch (e) {
    console.error(e);
  }

  return setting;
};
export var setSessionSetting = function setSessionSetting(key, value) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(e);
  }
};
export var getLocalSetting = function getLocalSetting(key) {
  var setting;

  try {
    setting = JSON.parse(window.localStorage.getItem(key));
  } catch (e) {
    console.error(e);
  }

  return setting;
};
export var setLocalSetting = function setLocalSetting(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(e);
  }
};