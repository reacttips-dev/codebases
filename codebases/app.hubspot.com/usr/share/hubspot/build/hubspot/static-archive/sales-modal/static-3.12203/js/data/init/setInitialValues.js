'use es6';

import I18n from 'I18n';
import { SEND_SPECIFIC_TIME, SEND_IMMEDIATELY } from 'sales-modal/constants/FirstSendTypes';
import EnrollmentSettingsRecord from 'sales-modal/data/EnrollmentSettingsRecord';
import getFirstEditableStepIndex from 'sales-modal/utils/enrollModal/getFirstEditableStepIndex';
import { EnrollTypes } from 'sales-modal/constants/EnrollTypes';
export default function (_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      enrollType = _ref.enrollType,
      stepEnrollments = _ref.stepEnrollments,
      enrollmentState = _ref.enrollmentState;
  var currentTime = I18n.moment();
  var sequenceSettings = EnrollmentSettingsRecord.init({
    sequenceSettings: sequenceEnrollment.sequenceSettings
  });
  var startingStepOrder = sequenceEnrollment.startingStepOrder || 0;
  var startingStepDelay = sequenceEnrollment.getIn(['steps', startingStepOrder, 'delay']);
  sequenceEnrollment = sequenceEnrollment.set('initialTouchDelay', startingStepDelay);
  sequenceEnrollment = sequenceEnrollment.withMutations(function (_sequenceEnrollment) {
    return _sequenceEnrollment.set('sequenceSettings', sequenceSettings).set('timeOfInitialization', currentTime).set('startingStepOrder', startingStepOrder).set('stepEnrollments', stepEnrollments).set('enrollmentState', enrollmentState);
  });
  var firstEditableStepIndex = getFirstEditableStepIndex(sequenceEnrollment, stepEnrollments);
  var userAlreadyChoseStepTimes = enrollType === EnrollTypes.EDIT || enrollType === EnrollTypes.RESUME || enrollType === EnrollTypes.VIEW;
  var preservingRemediationReenrollTimes = enrollType === EnrollTypes.REENROLL && sequenceEnrollment.steps.getIn([firstEditableStepIndex, 'absoluteTime']) !== null;
  var firstSendType = userAlreadyChoseStepTimes || preservingRemediationReenrollTimes ? SEND_SPECIFIC_TIME : SEND_IMMEDIATELY;
  sequenceEnrollment = sequenceEnrollment.updateIn(['steps', firstEditableStepIndex], function (step) {
    return step.set('previousStepEstimatedCompletionCalendarDaysDelay', step.get('pausedDelayInCalendarDaysMillis') || 0);
  });
  return sequenceEnrollment.set('firstSendType', firstSendType);
}