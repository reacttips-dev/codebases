'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _typingStatesReducer;

import { Map as ImmutableMap } from 'immutable';
import { handleActions } from 'flux-actions';
import setIn from 'transmute/setIn';
import omit from 'transmute/omit';
import updateIn from 'transmute/updateIn';
import { ADD_TYPING_TIMEOUT_ID, REMOVE_TYPING_TIMEOUT_ID } from '../constants/typingIndicatorActionTypes';
import { getTypingTimeoutIdForAgentInThread } from '../operators/getTypingTimeoutIdForAgentInThread';
var initialState = ImmutableMap();
var typingStatesReducer = (_typingStatesReducer = {}, _defineProperty(_typingStatesReducer, ADD_TYPING_TIMEOUT_ID, function (state, action) {
  var _action$payload = action.payload,
      threadId = _action$payload.threadId,
      senderId = _action$payload.senderId,
      timeoutId = _action$payload.timeoutId;
  return setIn(["" + threadId, "" + senderId], timeoutId, state);
}), _defineProperty(_typingStatesReducer, REMOVE_TYPING_TIMEOUT_ID, function (state, action) {
  var _action$payload2 = action.payload,
      threadId = _action$payload2.threadId,
      senderId = _action$payload2.senderId;

  if (getTypingTimeoutIdForAgentInThread({
    threadId: "" + threadId,
    senderId: "" + senderId,
    typingStates: state
  })) {
    return updateIn(["" + threadId], omit(["" + senderId]), state);
  }

  return state;
}), _typingStatesReducer);
export default handleActions(typingStatesReducer, initialState);