'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import { handleActions } from 'flux-actions';
import ActionMapper from '../../lib/legacyRequestActionMapper';
import actionTypes from '../actions/actionTypes';
export default handleActions((_handleActions = {}, _defineProperty(_handleActions, ActionMapper.success(actionTypes.FOLLOW_ME_LINKS_FETCH), function (state, action) {
  return action.data;
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.FOLLOW_ME_LINKS_CREATE), function (state, action) {
  return state.push(action.data);
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.FOLLOW_ME_LINKS_DELETE), function (state, action) {
  return state.filterNot(function (url) {
    return url.id === action.data;
  });
}), _handleActions));