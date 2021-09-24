'use es6';

import { createAction } from 'redux-actions';
import { SET_SELECTED_CALL_PROVIDER } from './ActionTypes';
export var setSelectedProvider = createAction(SET_SELECTED_CALL_PROVIDER);