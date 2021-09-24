'use es6';

import { requestFn } from '../clients/settingsOmnibusClient';
import { createAsyncAction } from 'conversations-async-data/async-action/createAsyncAction';
import { SETTINGS_OMNIBUS } from './asyncActionTypes';
export var getOmnibusSettings = createAsyncAction({
  actionTypes: SETTINGS_OMNIBUS,
  requestFn: requestFn,
  toRecordFn: function toRecordFn(data) {
    return data;
  }
});