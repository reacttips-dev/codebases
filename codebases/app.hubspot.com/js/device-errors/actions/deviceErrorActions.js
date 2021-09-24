'use es6';

import { createAction } from 'redux-actions';
import { SET_DEVICE_ERROR } from './ActionTypes';
export var setDeviceError = createAction(SET_DEVICE_ERROR);