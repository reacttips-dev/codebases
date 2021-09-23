'use es6';

import { createSelector } from 'reselect';
import { getIsTwilioBasedCallProvider } from 'calling-lifecycle-internal/call-provider/operators/getIsTwilioBasedCallProvider';
import { getSelectedCallProviderFromState } from '../calling-providers/selectors/getCallingProviders';
import { getIsClientReady } from '../active-call-settings/selectors/getActiveCallSettings';
import { getIsThirdPartyCallingReady } from '../third-party-calling/selectors/thirdPartyCallingSelectors';
export var getIsCallProviderReady = createSelector([getSelectedCallProviderFromState, getIsClientReady, getIsThirdPartyCallingReady], function (provider, clientIsReady, thirdPartyIsReady) {
  if (!provider) {
    return false;
  }

  if (getIsTwilioBasedCallProvider(provider)) {
    return clientIsReady;
  }

  return thirdPartyIsReady;
});