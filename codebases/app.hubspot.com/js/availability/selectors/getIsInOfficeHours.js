'use es6';

import { createSelector } from 'reselect';
import { getOfficeHoursStartTime } from 'conversations-internal-schema/availability/operators/availabilityGetters';
import { getWidgetAvailabilityOptions } from './getWidgetAvailabilityOptions';
import { getAwayMessage } from 'conversations-internal-schema/availability/operators/config/availabilityConfigGetters';
export var getIsInOfficeHours = createSelector([getWidgetAvailabilityOptions], function (availabilityOptions) {
  return !getOfficeHoursStartTime(availabilityOptions) && !getAwayMessage(availabilityOptions);
});