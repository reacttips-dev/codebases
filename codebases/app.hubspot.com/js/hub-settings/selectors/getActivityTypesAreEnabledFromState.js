'use es6';

import { getData } from 'conversations-async-data/async-data/operators/getters';
import getHubSettings from './getHubSettingsFromState';
import getHubSettingsValue from '../operators/getHubSettingValue';

var getActivityTypesAreEnabledFromState = function getActivityTypesAreEnabledFromState(state) {
  var hubSettings = getData(getHubSettings(state));
  var activityTypesAreEnabled = getHubSettingsValue(hubSettings, 'engagements:ActivityTypes:Enabled');
  return activityTypesAreEnabled === 'true';
};

export default getActivityTypesAreEnabledFromState;