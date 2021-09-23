'use es6';

import getIn from 'transmute/getIn';

var getHubSettingsValue = function getHubSettingsValue(hubSettings, hubSettingKey) {
  return getIn([hubSettingKey, 'value'], hubSettings);
};

export default getHubSettingsValue;