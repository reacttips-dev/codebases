'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import { Map as ImmutableMap } from 'immutable';
import { handleActions } from 'flux-actions';
import ActionMapper from '../../lib/legacyRequestActionMapper';
import actionTypes from '../actions/actionTypes';
export default handleActions((_handleActions = {}, _defineProperty(_handleActions, ActionMapper.began(actionTypes.BROADCASTS_FETCH), function (state, action) {
  if (action.payload && typeof action.payload.polling === 'boolean') {
    if (action.payload.polling) {
      document.querySelector('html').classList.add('auto-refreshing');
    } else {
      document.querySelector('html').classList.remove('auto-refreshing');
    }
  }

  return state;
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.BROADCASTS_FETCH), function (state, action) {
  document.querySelector('html').classList.remove('auto-refreshing');
  return action.data.broadcasts;
}), _defineProperty(_handleActions, actionTypes.BROADCAST_UPDATE, function (state, action) {
  if (!state.has(action.payload.id)) {
    return state;
  }

  return state.mergeIn([action.payload.id], action.payload.attrs);
}), _defineProperty(_handleActions, actionTypes.BROADCASTS_UPDATE, function (state, action) {
  action.payload.ids.forEach(function (id) {
    if (state.has(id)) {
      state = state.mergeIn([id], action.payload.attrs);
    }
  });
  return state;
}), _handleActions), ImmutableMap());