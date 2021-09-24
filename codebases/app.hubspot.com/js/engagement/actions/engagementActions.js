'use es6';

import { getObjectId } from 'calling-client-interface/records/engagement/getters';
import { createAsyncAction } from 'conversations-async-data/async-action/createAsyncAction';
import { UPDATE_ENGAGEMENT } from './asyncActionTypes';
import { requestFn } from '../clients/engagementClient';
import { createAction } from 'redux-actions';
import { SET_ENGAGEMENT_DATA, SET_CALL_DISPOSITION, SET_ACTIVITY_TYPE, SET_NOTES, SET_NON_TWILIO_BET_PROPERTIES } from './ActionTypes';
import { getEngagementFromState } from '../selectors/getEngagement';
export var updateEngagement = createAsyncAction({
  actionTypes: UPDATE_ENGAGEMENT,
  requestFn: requestFn,
  failureMetaActionCreator: function failureMetaActionCreator(_ref) {
    var requestArgs = _ref.requestArgs;
    return requestArgs.onSaveFail();
  },
  successMetaActionCreator: function successMetaActionCreator(_ref2) {
    var requestArgs = _ref2.requestArgs;
    requestArgs.onSaveSuccess();
  },
  toRecordFn: function toRecordFn(data) {
    return data;
  }
});
export var updateCurrentEngagement = function updateCurrentEngagement(_ref3) {
  var onSuccess = _ref3.onSuccess,
      onFail = _ref3.onFail;
  return function (dispatch, getState) {
    var engagement = getEngagementFromState(getState());
    var engagementId = getObjectId(engagement);
    dispatch(updateEngagement({
      engagementId: engagementId,
      engagement: engagement,
      onSaveSuccess: onSuccess,
      onSaveFail: onFail
    }));
  };
};
export var setEngagementData = createAction(SET_ENGAGEMENT_DATA);
export var setCallDisposition = createAction(SET_CALL_DISPOSITION);
export var setActivityType = createAction(SET_ACTIVITY_TYPE);
export var setNotes = createAction(SET_NOTES);
export var setNonTwilioBETProperties = createAction(SET_NON_TWILIO_BET_PROPERTIES);