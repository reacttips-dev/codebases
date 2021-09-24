'use es6';

import get from 'transmute/get';
import { createSelector } from 'reselect';
import { getData } from 'conversations-async-data/async-data/operators/getters';
export var getCSaTFeedbackAsyncDataFromState = get('csatFeedback');
export var getCSaTFeedbackScore = createSelector([getCSaTFeedbackAsyncDataFromState], function (csatData) {
  return getData(csatData);
});