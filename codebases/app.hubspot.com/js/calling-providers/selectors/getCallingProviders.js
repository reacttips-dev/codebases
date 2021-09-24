'use es6';

import get from 'transmute/get';
import { createSelector } from 'reselect';
import { getIsProviderTwilioConnect } from 'calling-lifecycle-internal/call-provider/operators/getIsProviderTwilioConnect';
import { getScopesFromState } from '../../Auth/selectors/authSelectors';
import { getIsTwilioBasedCallProvider } from 'calling-lifecycle-internal/call-provider/operators/getIsTwilioBasedCallProvider';
import * as AccessLevels from 'calling-lifecycle-internal/constants/AccessLevels';
import { getData } from 'conversations-async-data/async-data/operators/getters';
import { isStarterOrPro } from 'calling-settings-ui-library/utils/CallingSalesPro';
export var getCallProvidersFromState = get('callingProviders');
export var getSelectedCallProviderFromState = createSelector([getCallProvidersFromState], get('selectedCallProvider'));
export var getIsUsingTwilioConnectFromState = createSelector([getSelectedCallProviderFromState], getIsProviderTwilioConnect);
export var getIsTwilioBasedCallProviderFromState = createSelector([getSelectedCallProviderFromState], getIsTwilioBasedCallProvider);
export var hasNecessaryScopesForCallingExtension = createSelector([getScopesFromState], function (scopes) {
  var hasCallingLimitScope = isStarterOrPro(scopes);
  var hasCallingIntegrationScope = scopes.includes(AccessLevels.CallingIntegrations);
  return hasCallingLimitScope || hasCallingIntegrationScope;
});
export var getCallProvidersAsyncDataFromState = createSelector([getCallProvidersFromState], get('callProvidersList'));
export var hasMultipleCallProviders = createSelector([getCallProvidersAsyncDataFromState], function (callProviders) {
  return getData(callProviders).size > 1;
});