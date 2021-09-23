'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import { handleActions } from 'flux-actions';
import { Map as ImmutableMap } from 'immutable';
import ActionMapper from '../../lib/legacyRequestActionMapper';
import actionTypes from '../actions/actionTypes';
export default handleActions((_handleActions = {}, _defineProperty(_handleActions, ActionMapper.began(actionTypes.BROADCASTS_EXPORT), function (state) {
  return state.merge({
    data: undefined
  });
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.BROADCASTS_EXPORT), function (state, action) {
  return state.merge({
    data: action.data,
    lastSucceeded: true
  });
}), _defineProperty(_handleActions, actionTypes.EXPORT_DONE, function (state) {
  return state.merge({
    data: undefined,
    lastSucceeded: undefined
  });
}), _handleActions), new ImmutableMap({}));