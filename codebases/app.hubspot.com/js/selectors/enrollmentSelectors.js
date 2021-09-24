'use es6';

import { createSelector } from 'reselect';
import { getPropertyValue } from 'SequencesUI/util/summary/CRMSearchUtils';

var getSequenceEnrollments = function getSequenceEnrollments(state) {
  return state.sequenceEnrollments;
};

export var getEnrollmentFromProps = function getEnrollmentFromProps(state, props) {
  return props.enrollment;
};
export var getIsContactAlreadyEnrolled = createSelector([getSequenceEnrollments, getEnrollmentFromProps], function (enrollments, enrollment) {
  var vid = +getPropertyValue(enrollment, 'hs_contact_id');
  var currentEnrollmentState = enrollments.get(vid);
  return Boolean(currentEnrollmentState && currentEnrollmentState.get('isEnrolled'));
});