'use es6';

import { createSelector } from 'reselect';
import { getInitialLoadSettingsFromState } from 'calling-communicator-ui/initial-load-settings/selectors/getInitialLoadSettings';
import { getFromNumbers, getConnectNumbers, getToken, getConnectToken, getRecordingEnabled } from 'calling-internal-common/initial-load-settings/record/getters';
import { getSelectedFromNumberFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
import { getIsUsingTwilioConnectFromState } from '../../calling-providers/selectors/getCallingProviders';
export var getTwilioTokenFromState = createSelector([getInitialLoadSettingsFromState, getIsUsingTwilioConnectFromState], function (initialLoadSettings, isUsingTwilioConnect) {
  var getter = !isUsingTwilioConnect ? getToken : getConnectToken;
  return getter(initialLoadSettings);
});
export var getFromNumbersFromState = createSelector([getInitialLoadSettingsFromState, getIsUsingTwilioConnectFromState], function (initialLoadSettings, isUsingTwilioConnect) {
  if (isUsingTwilioConnect) {
    return getConnectNumbers(initialLoadSettings);
  }

  return getFromNumbers(initialLoadSettings);
});
export var getSelectedFromNumberInfoFromState = createSelector([getFromNumbersFromState, getSelectedFromNumberFromState], function (fromNumbers, selectedFromNumber) {
  return fromNumbers && fromNumbers.get(selectedFromNumber);
});
export var getRecordingEnabledFromState = createSelector([getInitialLoadSettingsFromState], function (initialLoadSettings) {
  return getRecordingEnabled(initialLoadSettings);
});