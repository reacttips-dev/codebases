'use es6';

import { createAsyncAction } from 'conversations-async-data/async-action/createAsyncAction';
import { MICROPHONE_ACCESS } from './asyncActionTypes';
import { requestFn } from '../clients/microphoneAccessClient';
export var getMicrophoneAccess = createAsyncAction({
  actionTypes: MICROPHONE_ACCESS,
  requestFn: requestFn,
  successMetaActionCreator: function successMetaActionCreator(_ref) {
    var requestArgs = _ref.requestArgs,
        data = _ref.data;
    return requestArgs.onSuccess(data);
  },
  toRecordFn: function toRecordFn(data) {
    return data;
  }
});