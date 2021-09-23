'use es6';

import { timeOnPageTriggerDelaySeconds } from '../operators/timeOnPageTriggerDelaySeconds';
import { addTimeOnPageTriggerAction } from './addTimeOnPageTriggerAction';
import { removeTimeOnPageTrigger } from './removeTimeOnPageTrigger';
import { executeTimeOnPageTrigger } from '../../client-triggers/actions/executeTimeOnPageTrigger';
export var addTimeOnPageTrigger = function addTimeOnPageTrigger(widgetData) {
  return function (dispatch) {
    dispatch(removeTimeOnPageTrigger());
    var delaySeconds = timeOnPageTriggerDelaySeconds(widgetData);
    var delayMilliseconds = delaySeconds * 1000;
    var timeoutId = setTimeout(function () {
      dispatch(executeTimeOnPageTrigger());
    }, delayMilliseconds);
    dispatch(addTimeOnPageTriggerAction(timeoutId));
  };
};