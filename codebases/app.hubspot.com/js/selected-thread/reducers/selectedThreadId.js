'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import { handleActions, combineActions } from 'flux-actions';
import { SELECT_THREAD, CLEAR_SELECTED_THREAD } from '../constants/selectedThreadActionTypes';
import { CREATE_NEW_THREAD } from '../../thread-create/constants/actionTypes';
var initialState = null;
export default handleActions((_handleActions = {}, _defineProperty(_handleActions, combineActions(SELECT_THREAD, CREATE_NEW_THREAD.SUCCEEDED), function (state, action) {
  var threadId = action.payload.threadId;
  return threadId;
}), _defineProperty(_handleActions, CLEAR_SELECTED_THREAD, function () {
  return initialState;
}), _handleActions), initialState);