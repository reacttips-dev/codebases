'use es6';

import { createAsyncAction } from 'conversations-async-data/async-action/createAsyncAction';
import { fromJS } from 'immutable';
import { MINUTES_USAGE_DATA } from './asyncActionTypes';
import { logCallingError } from 'calling-error-reporting/report/error';
import { requestFn } from '../clients/minutesUsageClient';
export var toRecordFn = function toRecordFn(response) {
  try {
    return fromJS(response);
  } catch (e) {
    logCallingError({
      errorMessage: 'Error parsing usage data',
      extraData: {
        error: e
      }
    });
    return null;
  }
};
export var getMinutesUsage = createAsyncAction({
  actionTypes: MINUTES_USAGE_DATA,
  requestFn: requestFn,
  toRecordFn: toRecordFn
});