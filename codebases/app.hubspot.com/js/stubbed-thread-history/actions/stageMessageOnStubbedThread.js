'use es6';

import { createAction } from 'flux-actions';
import { STAGE_MESSAGE_ON_STUBBED_THREAD } from '../constants/StubbedThreadHistoryActionTypes';
export var stageMessageOnStubbedThread = createAction(STAGE_MESSAGE_ON_STUBBED_THREAD, function (message) {
  return {
    message: message
  };
});