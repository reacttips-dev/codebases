'use es6';

import PropTypes from 'prop-types';
export var EnrollmentSelectionPropType = PropTypes.shape({
  deselectAllEnrollments: PropTypes.func.isRequired,
  deselectEnrollments: PropTypes.func.isRequired,
  selectAllMatches: PropTypes.func.isRequired,
  selectedAllMatches: PropTypes.bool.isRequired,
  selectedEnrollments: PropTypes.array.isRequired,
  selectEnrollments: PropTypes.func.isRequired
});
export function isEnrollmentSelected(enrollment, enrollmentSelection) {
  return enrollmentSelection.selectedAllMatches || enrollmentSelection.selectedEnrollments.some(function (selected) {
    return selected.objectId === enrollment.objectId;
  });
}
export function areAllEnrollmentsSelected(enrollments, enrollmentSelection) {
  return enrollments.reduce(function (result, enrollment) {
    return result && isEnrollmentSelected(enrollment, enrollmentSelection);
  }, true);
}