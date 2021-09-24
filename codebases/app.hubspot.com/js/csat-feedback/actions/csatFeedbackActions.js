'use es6';

import { createAsyncAction } from 'conversations-async-data/async-action/createAsyncAction';
import { createAction } from 'redux-actions';
import { requestFn } from '../clients/csatFeedbackClient';
import { UPDATED_CSAT_FEEDBACK_RATING, SUBMIT_CSAT_FEEDBACK } from './actionTypes';
export var updateCSaTFeedbackRating = createAction(UPDATED_CSAT_FEEDBACK_RATING);
export var submitCSaTFeedback = createAsyncAction({
  actionTypes: SUBMIT_CSAT_FEEDBACK,
  requestFn: requestFn,
  toRecordFn: function toRecordFn(res) {
    return res;
  }
});