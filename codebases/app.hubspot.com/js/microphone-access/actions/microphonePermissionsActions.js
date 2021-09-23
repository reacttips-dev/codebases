'use es6';

import { createAsyncAction } from 'conversations-async-data/async-action/createAsyncAction';
import { MICROPHONE_PERMISSIONS } from './asyncActionTypes';
import { requestFn } from '../clients/microphonePermissionsClient';
export var getMicrophonePermissionsState = createAsyncAction({
  actionTypes: MICROPHONE_PERMISSIONS,
  requestFn: requestFn,
  toRecordFn: function toRecordFn(data) {
    return data;
  }
});