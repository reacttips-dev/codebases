'use es6';

import { createSelector } from 'reselect';
import { makeTypicalResponseTimeText } from 'conversations-internal-schema/typical-response-time/operators/makeTypicalResponseTimeText';
import { getTypicalResponseTime } from 'conversations-internal-schema/availability/operators/config/availabilityConfigGetters';
import { getWidgetAvailabilityOptions } from './getWidgetAvailabilityOptions';
export var getAvailabilityTypicalResponseTimeMessage = createSelector(getWidgetAvailabilityOptions, function (availabilityOptions) {
  var typicalResponseTime = getTypicalResponseTime(availabilityOptions);

  if (!typicalResponseTime) {
    return '';
  }

  return makeTypicalResponseTimeText({
    typicalResponseTime: typicalResponseTime
  });
});