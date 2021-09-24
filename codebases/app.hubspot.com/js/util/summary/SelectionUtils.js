'use es6';

import { EXECUTING, PAUSED } from 'SequencesUI/constants/SummaryFilterTypes';
import * as SequenceStepDependencyTypes from 'SequencesUI/constants/SequenceStepDependencyTypes';
import { getPropertyValue } from 'SequencesUI/util/summary/CRMSearchUtils';
export function canPauseEnrollment(sequenceEnrollment) {
  return getPropertyValue(sequenceEnrollment, 'hs_enrollment_state') === EXECUTING;
}
export function canResumeEnrollment(sequenceEnrollment) {
  // TODO eventually this will pass back for manual
  var enrollmentIsPaused = getPropertyValue(sequenceEnrollment, 'hs_enrollment_state') === PAUSED;
  var dependencyType = getPropertyValue(sequenceEnrollment, 'hs_dependency_type');
  return enrollmentIsPaused && !dependencyType || enrollmentIsPaused && dependencyType === SequenceStepDependencyTypes.MANUAL_PAUSE;
}
export function canUnenrollEnrollment(sequenceEnrollment) {
  var enrollmentState = getPropertyValue(sequenceEnrollment, 'hs_enrollment_state');
  return enrollmentState === EXECUTING || enrollmentState === PAUSED;
}
export function canSelectEnrollment(sequenceEnrollment) {
  return canPauseEnrollment(sequenceEnrollment) || canResumeEnrollment(sequenceEnrollment) || canUnenrollEnrollment(sequenceEnrollment);
}