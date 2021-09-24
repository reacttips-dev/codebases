'use es6';

import { createSelector } from 'reselect';
import { getIsTwilioBasedCallProvider } from 'calling-lifecycle-internal/call-provider/operators/getIsTwilioBasedCallProvider';
import { getSelectedCallProviderFromState } from '../calling-providers/selectors/getCallingProviders';
import { getIsLoggedInToThirdParty } from '../third-party-calling/selectors/thirdPartyCallingSelectors';
var getIsLoggedIn = createSelector([getSelectedCallProviderFromState, getIsLoggedInToThirdParty], function (provider, isLoggedInToThirdParty) {
  if (getIsTwilioBasedCallProvider(provider)) {
    return true;
  }

  return isLoggedInToThirdParty;
});
export default getIsLoggedIn;