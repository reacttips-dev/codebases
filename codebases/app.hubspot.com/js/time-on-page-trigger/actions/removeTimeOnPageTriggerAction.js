'use es6';

import { createAction } from 'flux-actions';
import { REMOVE_TIME_ON_PAGE_TRIGGER } from '../constants/timeOnPageTriggerActionTypes';
export var removeTimeOnPageTriggerAction = createAction(REMOVE_TIME_ON_PAGE_TRIGGER);