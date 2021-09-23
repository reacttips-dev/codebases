'use es6';

import { createAsyncAction } from 'conversations-async-data/async-action/createAsyncAction';
import { fromJS } from 'immutable';
import { CALL_DISPOSITIONS_DATA } from './asyncActionTypes';
import { logCallingError } from 'calling-error-reporting/report/error';
import { requestFn } from '../clients/callDispositionsClient';
export var toRecordFn = function toRecordFn(response) {
  try {
    var callDispositions = response.callDispositions.map(function (disposition) {
      return {
        text: disposition.label,
        value: disposition.uid
      };
    });
    return fromJS(callDispositions);
  } catch (e) {
    logCallingError({
      errorMessage: 'Error Parsing data from call dispositions',
      extraData: {
        error: e
      }
    });
    return null;
  }
};
export var getCallDispositions = createAsyncAction({
  actionTypes: CALL_DISPOSITIONS_DATA,
  requestFn: requestFn,
  toRecordFn: toRecordFn
});