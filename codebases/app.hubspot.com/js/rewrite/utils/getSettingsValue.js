'use es6';

import Raven from 'Raven';
import getIn from 'transmute/getIn';
export var USER_SETTINGS = 'userSettings';
export var PORTAL_SETTINGS = 'portalSettings';
export var parseSettingsValue = function parseSettingsValue(_ref) {
  var key = _ref.key,
      value = _ref.value,
      settingsType = _ref.settingsType;

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    Raven.captureException(error, {
      tags: {
        feature: settingsType
      },
      extra: {
        key: key,
        value: value
      }
    });
    return null;
  }
};
export var getSettingsValue = function getSettingsValue(_ref2) {
  var key = _ref2.key,
      settings = _ref2.settings,
      _ref2$parse = _ref2.parse,
      parse = _ref2$parse === void 0 ? true : _ref2$parse,
      settingsType = _ref2.settingsType;
  var value = getIn([key, 'value'], settings);

  if (parse) {
    return parseSettingsValue({
      key: key,
      value: value,
      settingsType: settingsType
    });
  }

  return value;
};
export var parseUserSettingsValue = function parseUserSettingsValue(options) {
  return parseSettingsValue(Object.assign({
    settingsType: USER_SETTINGS
  }, options));
};
export var getUserSettingsValue = function getUserSettingsValue(options) {
  return getSettingsValue(Object.assign({
    settingsType: USER_SETTINGS
  }, options));
};
export var parsePortalSettingsValue = function parsePortalSettingsValue(options) {
  return parseSettingsValue(Object.assign({
    settingsType: PORTAL_SETTINGS
  }, options));
};
export var getPortalSettingsValue = function getPortalSettingsValue(options) {
  return getSettingsValue(Object.assign({
    settingsType: PORTAL_SETTINGS
  }, options));
};