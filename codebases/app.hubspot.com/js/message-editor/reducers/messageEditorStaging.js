'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import { Map as ImmutableMap } from 'immutable';
import get from 'transmute/get';
import setIn from 'transmute/setIn';
import { GET_VISITOR_THREADS_SUCCESS, UPDATE_MESSAGE_EDITOR_STAGING_TEXT, REMOVE_MESSAGE_EDITOR_STAGING_TEXT } from '../../constants/VisitorActionTypes';
import { getThreadId } from '../../threads/operators/threadGetters';
import { handleActions } from 'flux-actions';
var initialState = ImmutableMap();
export var STAGING_TEXT = 'stagingText';
export default handleActions((_handleActions = {}, _defineProperty(_handleActions, GET_VISITOR_THREADS_SUCCESS, function (state, action) {
  var threads = action.payload.threads;
  var indexedDefaultStagingThreads = !threads || !threads.length ? ImmutableMap() : threads.reduce(function (newThreadsMap, newThread) {
    var threadId = getThreadId(newThread);
    return newThreadsMap.set(threadId, {
      stagingText: ''
    });
  }, ImmutableMap());
  return indexedDefaultStagingThreads;
}), _defineProperty(_handleActions, UPDATE_MESSAGE_EDITOR_STAGING_TEXT, function (state, action) {
  var _action$payload = action.payload,
      threadId = _action$payload.threadId,
      stagingText = _action$payload.stagingText;
  var existingThread = get(threadId, state);

  if (existingThread) {
    var newStagingState = setIn([threadId, STAGING_TEXT], stagingText, state);
    return newStagingState;
  }

  return state.set(threadId, {
    stagingText: stagingText
  });
}), _defineProperty(_handleActions, REMOVE_MESSAGE_EDITOR_STAGING_TEXT, function (state, action) {
  var currentThreadId = action.payload;
  var existingThread = get(currentThreadId, state);

  if (existingThread) {
    var newStagingState = setIn([currentThreadId, STAGING_TEXT], '', state);
    return newStagingState;
  }

  return state;
}), _handleActions), initialState);