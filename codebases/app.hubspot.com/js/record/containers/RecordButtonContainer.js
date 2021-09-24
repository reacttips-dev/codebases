'use es6';

import { connect } from 'react-redux';
import RecordButton from '../components/RecordButton';
import { getRecordState, getCallSidFromState } from '../selectors/getRecordState';
import { toggleRecord } from '../actions/recordActions';
import { getRecordingEnabledFromState } from '../../settings-omnibus/selectors/getInitialLoadSettings';
import { getRequiresTwoPartyConsentFromState, getAppIdentifierFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
import { getEngagementIdFromState } from '../../engagement/selectors/getEngagement';

var mapStateToProps = function mapStateToProps(state) {
  return {
    engagementId: getEngagementIdFromState(state),
    isRecording: getRecordState(state),
    recordingEnabled: getRecordingEnabledFromState(state),
    requiresTwoPartyConsent: getRequiresTwoPartyConsentFromState(state),
    callSid: getCallSidFromState(state),
    appIdentifier: getAppIdentifierFromState(state)
  };
};

var mapDispatchToProps = {
  onIsRecordingChange: toggleRecord
};
export default connect(mapStateToProps, mapDispatchToProps)(RecordButton);