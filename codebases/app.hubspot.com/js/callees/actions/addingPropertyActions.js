'use es6';

import { createAction } from 'redux-actions';
import { SET_CALLEE_TO_UPDATE, CLEAR_CALLEE_TO_UPDATE } from '../constants/addingPropertyActionTypes';
export var setCalleeToUpdate = createAction(SET_CALLEE_TO_UPDATE);
export var clearCalleeToUpdate = createAction(CLEAR_CALLEE_TO_UPDATE);