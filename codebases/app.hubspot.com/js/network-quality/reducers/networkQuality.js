'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { handleActions } from 'redux-actions';
import { fromJS } from 'immutable';
import { SET_MOS_SCORE } from '../actions/ActionTypes';
var initialState = fromJS({
  mosScore: 5
});

var networkQualityReducer = _defineProperty({}, SET_MOS_SCORE, function (state, _ref) {
  var payload = _ref.payload;
  return state.set('mosScore', payload);
});

export default handleActions(networkQualityReducer, initialState);