'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _audioDevicesReducer;

import { handleActions } from 'redux-actions';
import { fromJS, Map as ImmutableMap } from 'immutable';
import { SET_AVAILABLE_INPUT_DEVICES, SET_AVAILABLE_OUTPUT_DEVICES, SET_INPUT_DEVICE, SET_OUTPUT_DEVICE, OUTPUT_DEVICE_NOT_SUPPORTED, INPUT_DEVICE_NOT_SUPPORTED } from '../actions/ActionTypes';
var initialState = fromJS({
  availableInputDevices: ImmutableMap(),
  availableOutputDevices: ImmutableMap(),
  selectedInputDevice: null,
  selectedOutputDevice: null,
  isOutputDeviceSupported: true,
  isInputDeviceSupported: true
});
var audioDevicesReducer = (_audioDevicesReducer = {}, _defineProperty(_audioDevicesReducer, SET_AVAILABLE_INPUT_DEVICES, function (state, _ref) {
  var payload = _ref.payload;
  return state.set('availableInputDevices', fromJS(payload));
}), _defineProperty(_audioDevicesReducer, SET_AVAILABLE_OUTPUT_DEVICES, function (state, _ref2) {
  var payload = _ref2.payload;
  return state.set('availableOutputDevices', fromJS(payload));
}), _defineProperty(_audioDevicesReducer, SET_INPUT_DEVICE, function (state, _ref3) {
  var payload = _ref3.payload;
  return state.set('selectedInputDevice', payload);
}), _defineProperty(_audioDevicesReducer, SET_OUTPUT_DEVICE, function (state, _ref4) {
  var payload = _ref4.payload;
  return state.set('selectedOutputDevice', payload);
}), _defineProperty(_audioDevicesReducer, OUTPUT_DEVICE_NOT_SUPPORTED, function (state) {
  return state.set('isOutputDeviceSupported', false);
}), _defineProperty(_audioDevicesReducer, INPUT_DEVICE_NOT_SUPPORTED, function (state) {
  return state.set('isInputDeviceSupported', false);
}), _audioDevicesReducer);
export default handleActions(audioDevicesReducer, initialState);