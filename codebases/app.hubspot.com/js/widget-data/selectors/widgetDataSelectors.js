'use es6';

import { createSelector } from 'reselect';
import { getLanguage } from '../operators/widgetDataGetters';
import { getLatestWidgetData } from './getLatestWidgetData';
export var getWidgetDataLanguage = createSelector(getLatestWidgetData, function (widgetData) {
  return getLanguage(widgetData);
});