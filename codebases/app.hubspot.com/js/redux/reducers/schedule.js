'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import { handleActions } from 'flux-actions';
import ActionMapper from '../../lib/legacyRequestActionMapper';
import actionTypes from '../actions/actionTypes';
export default handleActions((_handleActions = {}, _defineProperty(_handleActions, ActionMapper.success(actionTypes.SCHEDULE_FETCH), function (state, action) {
  return action.data;
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.SCHEDULE_SAVE), function (state, action) {
  return action.data || state;
}), _defineProperty(_handleActions, actionTypes.SCHEDULE_UPDATE, function (state, action) {
  return state.merge(action.payload);
}), _defineProperty(_handleActions, actionTypes.SCHEDULE_REMOVE_TIMES, function (state, action) {
  return state.set('suggestedTimes', state.suggestedTimes.subtract(action.payload));
}), _defineProperty(_handleActions, actionTypes.SCHEDULE_ADD_TIMES, function (state, action) {
  return state.set('suggestedTimes', state.suggestedTimes.union(action.payload));
}), _handleActions));