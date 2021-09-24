'use es6';

import { connect } from 'react-redux';
import RecordErrorBanner from '../components/RecordErrorBanner';
import { getRecordState, getRecordError } from '../selectors/getRecordState';
import { toggleRecord } from '../actions/recordActions';
import { getRecordingEnabledFromState } from '../../settings-omnibus/selectors/getInitialLoadSettings';
import { getEngagementIdFromState } from '../../engagement/selectors/getEngagement';

var mapStateToProps = function mapStateToProps(state) {
  return {
    engagementId: getEngagementIdFromState(state),
    isRecording: getRecordState(state),
    recordingEnabled: getRecordingEnabledFromState(state),
    recordError: getRecordError(state)
  };
};

var mapDispatchToProps = {
  toggleRecord: toggleRecord
};
export default connect(mapStateToProps, mapDispatchToProps)(RecordErrorBanner);