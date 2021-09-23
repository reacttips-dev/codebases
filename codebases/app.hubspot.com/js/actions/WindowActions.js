'use es6';

import { createAction } from 'flux-actions';
import { APP_IN_FOREGROUND, APP_IN_BACKGROUND } from '../constants/VisitorActionTypes';
export var setAppInBackground = createAction(APP_IN_BACKGROUND);
export var setAppInForeground = createAction(APP_IN_FOREGROUND);
export function setWindowVisible(isVisible) {
  return function (dispatch) {
    if (isVisible) {
      dispatch(setAppInForeground());
    } else {
      dispatch(setAppInBackground());
    }
  };
}