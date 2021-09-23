'use es6';

import { createAsyncAction } from 'conversations-async-data/async-action/createAsyncAction';
import { fromJS } from 'immutable';
import uniqueId from 'transmute/uniqueId';
import { ACTIVITY_TYPES_DATA } from './asyncActionTypes';
import { logCallingError } from 'calling-error-reporting/report/error';
import { requestFn } from '../clients/activityTypesClient';
export var toRecordFn = function toRecordFn(response) {
  try {
    var types = response.map(function (type) {
      return {
        text: type.name,
        value: uniqueId('activityType-')
      };
    });
    return fromJS(types);
  } catch (e) {
    logCallingError({
      errorMessage: 'Error Parsing data from activity types',
      extraData: {
        error: e
      }
    });
    return null;
  }
};
export var getActivityTypes = createAsyncAction({
  actionTypes: ACTIVITY_TYPES_DATA,
  requestFn: requestFn,
  toRecordFn: toRecordFn
});