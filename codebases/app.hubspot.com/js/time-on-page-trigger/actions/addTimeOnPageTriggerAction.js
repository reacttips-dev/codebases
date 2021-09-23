'use es6';

import { createAction } from 'flux-actions';
import { ADD_TIME_ON_PAGE_TRIGGER } from '../constants/timeOnPageTriggerActionTypes';
export var addTimeOnPageTriggerAction = createAction(ADD_TIME_ON_PAGE_TRIGGER, function (timeoutId) {
  return {
    timeoutId: timeoutId
  };
});