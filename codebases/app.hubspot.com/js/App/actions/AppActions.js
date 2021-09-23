'use es6';

import { APP_STARTED } from './ActionTypes';
export var startApp = function startApp() {
  return function (dispatch) {
    dispatch({
      type: APP_STARTED
    });
  };
};