'use es6';

import { createAction } from 'flux-actions';
import { SELECT_THREAD } from '../constants/selectedThreadActionTypes';
export var selectThread = createAction(SELECT_THREAD, function (threadId) {
  return {
    threadId: threadId
  };
});