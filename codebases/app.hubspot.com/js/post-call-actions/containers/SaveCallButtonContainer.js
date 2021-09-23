'use es6';

import { connect } from 'react-redux';
import compose from 'transmute/compose';
import SaveCallButton from '../components/SaveCallButton';
import { updateCurrentEngagement } from '../../engagement/actions/engagementActions';
import { getRecordState } from '../../record/selectors/getRecordState';
import { getSelectedCallDispositionOption } from '../../call-types-outcomes/selectors/getSelectedCallDispositionOption';
import { getBETCallDetailsRequiredFromState } from '../../bet-activity-types/selectors/BETActivityTypeOptions';
import { resetCallData } from '../../active-call-settings/actions/activeCallSettingsActions';
import { getEngagementIdFromState, getExternalIdFromState } from '../../engagement/selectors/getEngagement';
import { getValidatedToNumberIsLoadingFromState, getIsQueueTaskFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
import { asyncTrackSaveCallEngagement } from '../actions/asyncTrackSaveCallEngagement';
import { submitCSaTFeedback } from '../../csat-feedback/actions/csatFeedbackActions';
import { getCSaTFeedbackScore } from '../../csat-feedback/selectors/getCSaTData';
import { getAppIdentifierFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
import { createFollowUpTask } from '../actions/followUpTaskActions';
import { withTaskAssociationDefinitions } from '../decorators/RequireTaskAssociationDefinitions';
import { getTaskAssociationDefinitionsFromState } from '../selectors/getTaskAssociationDefinitions';

var mapStateToProps = function mapStateToProps(state) {
  return {
    isRecording: getRecordState(state),
    engagementId: getEngagementIdFromState(state),
    callDisposition: getSelectedCallDispositionOption(state),
    betCallDetailsRequired: getBETCallDetailsRequiredFromState(state),
    isQueueTask: getIsQueueTaskFromState(state),
    validatedToNumberIsLoading: getValidatedToNumberIsLoadingFromState(state),
    csatFeedbackScore: getCSaTFeedbackScore(state),
    callSid: getExternalIdFromState(state),
    appIdentifier: getAppIdentifierFromState(state),
    taskAssociationDefinitions: getTaskAssociationDefinitionsFromState(state)
  };
};

var mapDispatchToProps = {
  updateEngagement: updateCurrentEngagement,
  resetCallData: resetCallData,
  trackSaveCall: asyncTrackSaveCallEngagement,
  submitCSaTFeedback: submitCSaTFeedback,
  createFollowUpTask: createFollowUpTask
};
export default compose(connect(mapStateToProps, mapDispatchToProps), withTaskAssociationDefinitions())(SaveCallButton);