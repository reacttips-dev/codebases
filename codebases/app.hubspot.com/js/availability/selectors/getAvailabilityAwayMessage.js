'use es6';

import { createSelector } from 'reselect';
import { getAwayMessage } from 'conversations-internal-schema/availability/operators/config/availabilityConfigGetters';
import { getWidgetAvailabilityOptions } from './getWidgetAvailabilityOptions';
export var getAvailabilityAwayMessage = createSelector([getWidgetAvailabilityOptions], function (availabilityOptions) {
  return getAwayMessage(availabilityOptions) || '';
});