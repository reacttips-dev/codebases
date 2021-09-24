'use es6';

import { createSelector } from 'reselect';
import { widgetIsInAwayMode } from './widgetIsInAwayMode';
import { getIsInOfficeHours } from './getIsInOfficeHours';
export var getIsWidgetInAwayMode = createSelector([widgetIsInAwayMode, getIsInOfficeHours], function (inAwayMode, isInOfficeHours) {
  return Boolean(inAwayMode || !isInOfficeHours);
});