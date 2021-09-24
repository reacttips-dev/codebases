'use es6';

import { createSelector } from 'reselect';
import { getIsPrivateLoad as getIsPrivateLoadOperator } from '../operators/getIsPrivateLoad';
import { getLatestWidgetData } from './getLatestWidgetData';
export var getIsPrivateLoad = createSelector(getLatestWidgetData, function (widgetData) {
  return getIsPrivateLoadOperator(widgetData);
});