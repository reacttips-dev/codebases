'use es6';

import { createSelector } from 'reselect';
import getIn from 'transmute/getIn';
import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
export var getWidgetLocation = createSelector([getLatestWidgetData], function (state) {
  return getIn(['widgetLocation'], state);
});