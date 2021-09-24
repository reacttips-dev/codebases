'use es6';

import get from 'transmute/get';
import { createSelector } from 'reselect';
import { getData } from 'conversations-async-data/async-data/operators/getters';
import { getUsageSummaryFromState } from 'calling-communicator-ui/initial-load-settings/selectors/getInitialLoadSettings';
export var getMinutesUsageAsyncDataFromState = get('minutesUsage');
export var getMinutesUsageFromState = createSelector([getMinutesUsageAsyncDataFromState], function (usage) {
  return getData(usage);
});
export var getTotalMinutesPerMonthFromState = createSelector([getUsageSummaryFromState], function (initialLoadSettingsUsage) {
  return get('userMinutesAvailable', initialLoadSettingsUsage);
});
export var getUserMinutesUsedFromState = createSelector([getMinutesUsageFromState, getUsageSummaryFromState], function (usage, initialLoadSettingsUsage) {
  var usageData = initialLoadSettingsUsage;

  if (usage && get('userMinutesAvailable', usage)) {
    usageData = usage;
  }

  var used = get('userMinutesUsed', usageData) || 0;
  var available = get('userMinutesAvailable', usageData) || 0;
  return used < available ? used : available;
});
export var getMinutesAvailableFromState = createSelector([getMinutesUsageFromState, getUsageSummaryFromState], function (usage, initialLoadSettingsUsage) {
  var usageData = initialLoadSettingsUsage;

  if (usage && get('userMinutesAvailable', usage)) {
    usageData = usage;
  }

  var used = get('userMinutesUsed', usageData) || 0;
  var available = get('userMinutesAvailable', usageData) || 0;
  var totalAvailable = available - used;
  return totalAvailable > 0 ? totalAvailable : 0;
});
export var getHasMinutesAvailableFromState = createSelector([getMinutesUsageFromState, getUsageSummaryFromState], function (usage, initialLoadSettingsUsage) {
  var usageData = initialLoadSettingsUsage;

  if (usage && get('userMinutesAvailable', usage)) {
    usageData = usage;
  }

  var used = get('userMinutesUsed', usageData) || 0;
  var available = get('userMinutesAvailable', usageData) || 0;
  return available > used;
});