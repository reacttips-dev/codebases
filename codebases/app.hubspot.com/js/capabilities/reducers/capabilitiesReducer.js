'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { handleActions } from 'redux-actions';
import { SET_CAPABILITIES } from '../constants/capabiltiesActionTypes';
import CapabilitiesRecord from 'calling-lifecycle-internal/capabilities/records/CapabilitiesRecord';
var initialState = new CapabilitiesRecord();

var capabilitiesReducer = _defineProperty({}, SET_CAPABILITIES, function (state, _ref) {
  var payload = _ref.payload;
  return state.merge(payload);
});

export default handleActions(capabilitiesReducer, initialState);