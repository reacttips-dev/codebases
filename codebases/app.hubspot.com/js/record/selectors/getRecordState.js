'use es6';

import get from 'transmute/get';
import { createSelector } from 'reselect';
export var getRecordStateFromState = get('recordState');
export var getRecordState = createSelector([getRecordStateFromState], get('isRecording'));
export var getRecordError = createSelector([getRecordStateFromState], get('error'));
export var getCallSidFromState = createSelector([getRecordStateFromState], get('callSid'));