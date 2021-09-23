'use es6';

import SettingsOmnibusHubSettings from '../constants/SettingsOmnibusHubSettings';
var urlPrefix = '/twilio/v1/settings';

function buildSettingsOmnibusRequestPath() {
  var url = urlPrefix + "/?" + SettingsOmnibusHubSettings.reduce(function (acc, value, index) {
    acc += "hubSetting=" + value;

    if (index < SettingsOmnibusHubSettings.length - 1) {
      acc += '&';
    }

    return acc;
  }, '');
  return url;
}

export default buildSettingsOmnibusRequestPath;