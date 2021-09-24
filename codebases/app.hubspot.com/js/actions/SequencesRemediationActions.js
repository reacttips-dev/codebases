'use es6';

import partial from 'transmute/partial';
import identity from 'transmute/identity';
import debounce from 'transmute/debounce';
import { createAction } from 'flux-actions';
import * as SequencesRemediationApi from 'SequencesUI/api/SequencesRemediationApi';
import * as SequencesRemediationActionTypes from 'SequencesUI/constants/SequencesRemediationActionTypes';
import * as SequenceActions from 'SequencesUI/actions/SequenceActions';
import * as SequenceRemediationStateTypes from 'SequencesUI/constants/SequenceRemediationStateTypes';
var fetchEnrollmentsLoading = createAction(SequencesRemediationActionTypes.SEQUENCES_REMEDIATION_FETCH_ENROLLMENTS_LOADING, identity);
var fetchEnrollmentsSucceeded = createAction(SequencesRemediationActionTypes.SEQUENCES_REMEDIATION_FETCH_ENROLLMENTS_SUCCEEDED, identity);
var fetchEnrollmentsFailed = createAction(SequencesRemediationActionTypes.SEQUENCES_REMEDIATION_FETCH_ENROLLMENTS_FAILED, identity);
export var fetchEnrollments = function fetchEnrollments() {
  return function (dispatch) {
    dispatch(fetchEnrollmentsLoading());
    SequencesRemediationApi.fetchEnrollments().then(function (response) {
      return dispatch(fetchEnrollmentsSucceeded(response));
    }, function (error) {
      return dispatch(fetchEnrollmentsFailed(error));
    });
  };
};
var debouncedFetch = debounce(100, function (dispatch) {
  return dispatch(fetchEnrollments());
});

var updateEnrollmentStatus = function updateEnrollmentStatus(prevEnrollmentId, state, replacementEnrollmentId) {
  return function (dispatch) {
    SequencesRemediationApi.updateImpactedEnrollmentStatus(prevEnrollmentId, state, replacementEnrollmentId).then(partial(debouncedFetch, dispatch));
  };
};

export var fetchEnrollment = function fetchEnrollment(id) {
  return SequencesRemediationApi.fetchEnrollment(id);
};

var reenroll = function reenroll(prevEnrollment, enrollment) {
  return function (dispatch) {
    var contactVid = prevEnrollment.get('vid');
    var state = SequenceRemediationStateTypes.REENROLLED;
    return dispatch(SequenceActions.enroll({
      enrollment: enrollment,
      vid: contactVid,
      isReenroll: true
    })).then(function (newEnrollment) {
      var prevEnrollmentId = prevEnrollment.get('id');
      var replacementEnrollmentId = newEnrollment.get('id');
      dispatch(updateEnrollmentStatus(prevEnrollmentId, state, replacementEnrollmentId));
    });
  };
};

export var reenrollContact = function reenrollContact(prevEnrollment, enrollment) {
  return function (dispatch) {
    return dispatch(reenroll(prevEnrollment, enrollment));
  };
};
export var removeEnrollment = function removeEnrollment(id) {
  return function (dispatch) {
    return dispatch(updateEnrollmentStatus(id, SequenceRemediationStateTypes.DISMISSED));
  };
};