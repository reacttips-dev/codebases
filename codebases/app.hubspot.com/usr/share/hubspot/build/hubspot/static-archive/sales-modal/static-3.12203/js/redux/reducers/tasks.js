'use es6';

import { Map as ImmutableMap } from 'immutable';
import { TASK_FETCH_STARTED, TASK_FETCH_SUCCEEDED } from '../actionTypes';
var initialState = ImmutableMap();
export default function tasks() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (action.type === TASK_FETCH_STARTED) {
    return state.set(action.payload.taskId, null);
  } else if (action.type === TASK_FETCH_SUCCEEDED) {
    return state.set(action.payload.taskId, action.payload.task);
  }

  return state;
}