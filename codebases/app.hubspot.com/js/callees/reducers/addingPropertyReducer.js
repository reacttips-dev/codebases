'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _addingPropertyReduce;

import { Map as ImmutableMap } from 'immutable';
import { handleActions } from 'redux-actions';
import { CLEAR_CALLEE_TO_UPDATE, SET_CALLEE_TO_UPDATE } from '../constants/addingPropertyActionTypes';
import { ADDING } from '../operators/updatePropertyTypes';
var initialState = ImmutableMap({
  updateType: null,
  calleeToUpdate: null
});
var addingPropertyReducer = (_addingPropertyReduce = {}, _defineProperty(_addingPropertyReduce, SET_CALLEE_TO_UPDATE, function (state, _ref) {
  var payload = _ref.payload;
  var calleeToUpdate = payload.calleeToUpdate,
      _payload$updateType = payload.updateType,
      updateType = _payload$updateType === void 0 ? ADDING : _payload$updateType;
  return state.merge({
    calleeToUpdate: calleeToUpdate,
    updateType: updateType
  });
}), _defineProperty(_addingPropertyReduce, CLEAR_CALLEE_TO_UPDATE, function (state) {
  return state.merge({
    calleeToUpdate: null,
    updateType: null
  });
}), _addingPropertyReduce);
export default handleActions(addingPropertyReducer, initialState);