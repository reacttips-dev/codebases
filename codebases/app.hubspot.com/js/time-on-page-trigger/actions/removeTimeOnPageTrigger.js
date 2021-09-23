'use es6';

import { getTimeOnPageTriggerTimeoutId } from '../selectors/getTimeOnPageTriggerTimeoutId';
import { removeTimeOnPageTriggerAction } from './removeTimeOnPageTriggerAction';
export var removeTimeOnPageTrigger = function removeTimeOnPageTrigger() {
  return function (dispatch, getState) {
    var timeoutId = getTimeOnPageTriggerTimeoutId(getState());
    clearTimeout(timeoutId);
    dispatch(removeTimeOnPageTriggerAction());
  };
};