'use es6';

import get from 'transmute/get';
export var getWidgetDataAsyncData = function getWidgetDataAsyncData(state) {
  return get('widgetData', state);
};