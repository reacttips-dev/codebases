'use es6';

import { createAction } from 'redux-actions';
import { createAsyncAction } from 'conversations-async-data/async-action/createAsyncAction';
import { TOGGLE_RECORD, SET_INITIAL_RECORD_STATE, SET_CALL_SID } from './ActionTypes';
import { toggleRecording } from '../clients/toggleRecordingClient';
export var toggleRecord = createAsyncAction({
  actionTypes: TOGGLE_RECORD,
  requestFn: toggleRecording,
  toRecordFn: function toRecordFn(data) {
    return data;
  }
});
export var setCallSid = createAction(SET_CALL_SID);
export var setInitialRecordState = createAction(SET_INITIAL_RECORD_STATE);