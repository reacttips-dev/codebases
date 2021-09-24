'use es6';

import { createSelector } from 'reselect';
import { getData } from 'conversations-async-data/async-data/operators/getters';
import { getWidgetDataAsyncData } from './getWidgetDataAsyncData';
export var getLatestWidgetData = createSelector(getWidgetDataAsyncData, function (widgetDataAsyncData) {
  return getData(widgetDataAsyncData);
});