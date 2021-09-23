'use es6';

import { createSelector } from 'reselect';
import getIn from 'transmute/getIn';
import get from 'transmute/get';
import { isFailed, isSucceeded } from 'conversations-async-data/async-data/operators/statusComparators';
import { getData } from 'conversations-async-data/async-data/operators/getters';
import { getIsTwilioBasedCallProvider } from 'calling-lifecycle-internal/call-provider/operators/getIsTwilioBasedCallProvider';
import { getInitialLoadSettingsAsyncDataFromState } from '../../initial-load-settings/selectors/getInitialLoadSettings';
import { getIsProviderTwilioConnect } from 'calling-lifecycle-internal/call-provider/operators/getIsProviderTwilioConnect';
import { FAILED, COMPLETE, NO_ACCOUNT, REGISTER_NUMBER, LOADING } from 'calling-lifecycle-internal/onboarding/constants/onboardingStatuses';
import { getSelectedCallProviderFromState } from '../../calling-providers/selectors/getCallingProviders'; // TODO: CT-5254 The following logic needs to evently be opened to more possibilities

var getEnabledInfo = function getEnabledInfo(settings, selectedCallProvider) {
  var isTwilioBased = getIsTwilioBasedCallProvider(selectedCallProvider);
  if (!isTwilioBased) return COMPLETE;
  var isUsingTwilioConnect = getIsProviderTwilioConnect(selectedCallProvider);
  var tokenKey = isUsingTwilioConnect ? 'connectToken' : 'token';
  var fromNumberKey = isUsingTwilioConnect ? 'connectNumbers' : 'fromNumbers';
  var token = getIn([tokenKey, 'token'], settings);
  var registeredNumbers = getIn([fromNumberKey], settings);
  var hasRegistedNumbers = registeredNumbers && registeredNumbers.length > 0; // when a user runs out of minutes the token is not included in this response

  if (hasRegistedNumbers) {
    return COMPLETE;
  }

  return !token ? NO_ACCOUNT : REGISTER_NUMBER;
};

export var getOnboardingStatusFromState = createSelector([getInitialLoadSettingsAsyncDataFromState, getSelectedCallProviderFromState], function (initialLoadSettings, selectedCallProvider) {
  if (isFailed(initialLoadSettings)) return FAILED;

  if (!selectedCallProvider || !isSucceeded(initialLoadSettings)) {
    return LOADING;
  }

  return getEnabledInfo(getData(initialLoadSettings), selectedCallProvider);
});
export var getIsHubspotCallingEnabled = createSelector([getInitialLoadSettingsAsyncDataFromState], function (initialLoadSettings) {
  var token = getIn(['token', 'token'], initialLoadSettings);
  return Boolean(token);
});
export var getOnboardingFromState = get('onboarding');
export var getShouldShowOnboardingIntroFromState = createSelector([getOnboardingFromState], get('shouldShowOnboardingIntro'));
export var getRegisterFromNumberTypeFromState = createSelector([getOnboardingFromState], get('registerFromNumberType'));