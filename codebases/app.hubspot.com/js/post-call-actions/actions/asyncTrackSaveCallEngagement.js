'use es6';

import { getEngagementFromState } from '../../engagement/selectors/getEngagement';
import { asyncTrackSaveCall } from '../operators/asyncTrackSaveCall';
import { getAppIdentifierFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
export var asyncTrackSaveCallEngagement = function asyncTrackSaveCallEngagement(_ref) {
  var callDisposition = _ref.callDisposition,
      isRecording = _ref.isRecording;
  return function (dispatch, getState) {
    var state = getState();
    var engagement = getEngagementFromState(state);
    var appIdentifier = getAppIdentifierFromState(state);
    asyncTrackSaveCall({
      engagement: engagement,
      callDisposition: callDisposition,
      isRecording: isRecording,
      appIdentifier: appIdentifier
    });
  };
};