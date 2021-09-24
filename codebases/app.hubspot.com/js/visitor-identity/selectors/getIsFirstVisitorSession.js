'use es6';

import { createSelector } from 'reselect';
import { getIsFirstVisitorSession as getIsFirstVisitorSessionOperator } from '../operators/getIsFirstVisitorSession';
import { getVisitorIdentity } from './getVisitorIdentity';
import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
import { getIsPrivateLoad } from '../../widget-data/operators/getIsPrivateLoad';
export var getIsFirstVisitorSession = createSelector([getVisitorIdentity, getLatestWidgetData], function (visitorIdentity, widgetData) {
  if (getIsPrivateLoad(widgetData)) {
    return false;
  }

  return getIsFirstVisitorSessionOperator(visitorIdentity);
});