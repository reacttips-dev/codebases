'use es6';

import { createAction } from 'flux-actions';
import { CLEAR_SELECTED_THREAD } from '../constants/selectedThreadActionTypes';
export var clearSelectedThread = createAction(CLEAR_SELECTED_THREAD);