'use es6';

import { createAction } from 'redux-actions';
import { SET_CAPABILITIES } from '../constants/capabiltiesActionTypes';
export var setCapabilities = createAction(SET_CAPABILITIES);