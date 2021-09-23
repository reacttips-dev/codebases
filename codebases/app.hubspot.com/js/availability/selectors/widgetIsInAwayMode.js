'use es6';

import { createSelector } from 'reselect';
import { getAvailabilityAwayMessage } from './getAvailabilityAwayMessage';
export var widgetIsInAwayMode = createSelector([getAvailabilityAwayMessage], function (awayMessage) {
  return Boolean(awayMessage);
});