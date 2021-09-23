'use es6';

import get from 'transmute/get';
import { createSelector } from 'reselect';
import { getData } from 'conversations-async-data/async-data/operators/getters';
import { isSucceeded } from 'conversations-async-data/async-data/operators/statusComparators';
import { getHasTwilioConnect, getUsageSummary } from 'calling-internal-common/initial-load-settings/record/getters';
export var getInitialLoadSettingsAsyncDataFromState = get('initialLoadSettings');
export var getInitialLoadSettingsFromState = createSelector([getInitialLoadSettingsAsyncDataFromState], function (initialLoadSettings) {
  return getData(initialLoadSettings);
});
export var getInitialLoadSettingsSucceededFromState = createSelector([getInitialLoadSettingsAsyncDataFromState], isSucceeded);
export var getHasTwilioConnectFromState = createSelector([getInitialLoadSettingsFromState], getHasTwilioConnect);
export var getUsageSummaryFromState = createSelector([getInitialLoadSettingsFromState], getUsageSummary);