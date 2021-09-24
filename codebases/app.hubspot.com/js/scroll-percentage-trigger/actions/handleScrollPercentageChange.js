'use es6';

import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
import { getTargetScrollPercentage } from '../operators/getTargetScrollPercentage';
import { executeScrollTrigger } from '../../client-triggers/actions/executeScrollTrigger';
export var handleScrollPercentageChange = function handleScrollPercentageChange(_ref) {
  var scrollPercentage = _ref.scrollPercentage;
  return function (dispatch, getState) {
    var widgetData = getLatestWidgetData(getState());

    if (scrollPercentage >= getTargetScrollPercentage(widgetData)) {
      dispatch(executeScrollTrigger());
    }
  };
};