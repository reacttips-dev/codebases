'use es6';

import getIn from 'transmute/getIn';
export var getInputFocus = function getInputFocus(state) {
  return getIn(['widgetInputFocusStatus', 'widgetInputIsOnFocus'], state);
};