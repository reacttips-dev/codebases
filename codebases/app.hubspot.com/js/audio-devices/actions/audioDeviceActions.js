'use es6';

import { createAction } from 'redux-actions';
import { SET_AVAILABLE_INPUT_DEVICES, SET_AVAILABLE_OUTPUT_DEVICES, SET_INPUT_DEVICE, SET_OUTPUT_DEVICE, OUTPUT_DEVICE_NOT_SUPPORTED, INPUT_DEVICE_NOT_SUPPORTED } from './ActionTypes';
export var setAvailableInputDevices = createAction(SET_AVAILABLE_INPUT_DEVICES);
export var setAvailableOutputDevices = createAction(SET_AVAILABLE_OUTPUT_DEVICES);
export var setInputDevice = createAction(SET_INPUT_DEVICE);
export var setOutputDevice = createAction(SET_OUTPUT_DEVICE);
export var setOutputDeviceNotSupported = createAction(OUTPUT_DEVICE_NOT_SUPPORTED);
export var setInputDeviceNotSupported = createAction(INPUT_DEVICE_NOT_SUPPORTED);