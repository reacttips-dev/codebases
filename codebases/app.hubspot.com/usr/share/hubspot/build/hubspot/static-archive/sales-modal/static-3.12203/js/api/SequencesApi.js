'use es6';

import memoize from 'transmute/memoize';
import { fromJS, Map as ImmutableMap } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
import { SALES_SUBSCRIPTION, ACTIVE_ENROLLMENTS } from 'sales-modal/constants/EligibilityConstants';
import { MINUTE } from 'sales-modal/constants/Milliseconds';
import * as SequenceStepTypes from 'sales-modal/constants/SequenceStepTypes';
import { getSendDateForStep } from 'sales-modal/utils/enrollModal/SendTimeUtils';
import { isAttemptedOrFinishedStep } from 'sales-modal/utils/enrollModal/SendTimeUtils';
import getFirstEditableStepIndex from 'sales-modal/utils/enrollModal/getFirstEditableStepIndex';
import { EnrollmentStates } from 'sales-modal/constants/EnrollmentStates';
export function fetchById(id) {
  return apiClient.get("sequences/v1/sequence/" + id).then(fromJS);
}
export function fetchEligibility(toEmail) {
  var data = {
    toEmail: toEmail,
    validations: [SALES_SUBSCRIPTION, ACTIVE_ENROLLMENTS]
  };
  return apiClient.post('sequences/v2/eligibility', {
    data: data
  }).then(fromJS);
}
export function fetchEligibilityBatch(vids) {
  return apiClient.post('sequences/v2/eligibility/batch', {
    data: {
      vids: vids,
      validations: [SALES_SUBSCRIPTION, ACTIVE_ENROLLMENTS]
    }
  }).then(function (res) {
    return res.sequenceEnrollmentEligibilityByVid;
  }).then(fromJS);
}
export function fetchEnrollHealthStatus() {
  var url = 'sequences/v2/enrollments/health-check';
  return apiClient.get(url).then(fromJS);
}
export function unenroll(enrollmentId) {
  var url = "sequences/v1/enrollment/" + enrollmentId + "/unenroll";
  return apiClient.post(url).then(fromJS);
}
export function unenrollAfterError(enrollmentId) {
  var url = "sequences/v1/enrollment/" + enrollmentId + "/error";
  return apiClient.post(url).then(fromJS);
}
export function fetchUnsubscribeLinkType() {
  return apiClient.get('/userpreferences/v1/attributes').then(fromJS);
}
var formatSettingsInfo = memoize(function (sequenceSettings) {
  return {
    durationMillis: (sequenceSettings.get('sendWindowEndsAtMin') - sequenceSettings.get('sendWindowStartsAtMin')) * MINUTE,
    sendingStrategy: sequenceSettings.get('sendingStrategy')
  };
});
var getStepSendDate = memoize(function (sequenceEnrollment, stepOrder) {
  return getSendDateForStep(sequenceEnrollment, stepOrder);
});

var getUnfinishedAndRescheduledAutoEmailSteps = function getUnfinishedAndRescheduledAutoEmailSteps(sequenceEnrollment, originalEnrollment) {
  var firstEditableStepIndex = getFirstEditableStepIndex(sequenceEnrollment);
  return sequenceEnrollment.get('steps').slice(firstEditableStepIndex).filter(function (step) {
    return step.get('action') === SequenceStepTypes.SEND_TEMPLATE && !isAttemptedOrFinishedStep(step.get('stepOrder'), sequenceEnrollment.get('stepEnrollments'));
  }).filter(function (step) {
    var enrollmentIsBeingEditedAndTheStepDateHasNotChanged = originalEnrollment && getStepSendDate(sequenceEnrollment, step.get('stepOrder')) === originalEnrollment.getIn(['steps', step.get('stepOrder'), 'absoluteTime']);
    return !enrollmentIsBeingEditedAndTheStepDateHasNotChanged;
  });
};

var getStepDataFromSequence = function getStepDataFromSequence(sequenceEnrollment, originalEnrollment) {
  return getUnfinishedAndRescheduledAutoEmailSteps(sequenceEnrollment, originalEnrollment).map(function (step) {
    return {
      stepOrder: step.get('stepOrder'),
      stepType: step.get('action'),
      sendWindowInfo: Object.assign({}, formatSettingsInfo(sequenceEnrollment.get('sequenceSettings')), {
        startAbsoluteTimeMillis: getStepSendDate(sequenceEnrollment, step.get('stepOrder'))
      })
    };
  });
};

export function fetchSendTimeData(_ref) {
  var numTimes = _ref.numTimes,
      sequenceEnrollment = _ref.sequenceEnrollment,
      originalEnrollment = _ref.originalEnrollment;
  var data = {
    numTimes: numTimes,
    fromEmailAddress: sequenceEnrollment.inboxAddress,
    timeZone: sequenceEnrollment.timezone,
    stepSendTimesRequests: getStepDataFromSequence(sequenceEnrollment, originalEnrollment).toArray()
  };
  var hasAnyUnfinishedAndRescheduledAutoEmailSteps = data.stepSendTimesRequests.length > 0;

  if ( // When the enrollment is paused, we don't need to validate send windows.
  // The times will all be adjusted again by the BE when unpaused.
  sequenceEnrollment.get('enrollmentState') === EnrollmentStates.PAUSED || !hasAnyUnfinishedAndRescheduledAutoEmailSteps) {
    return Promise.resolve(ImmutableMap());
  }

  return apiClient.post('sequences/v2/send-times/enrollments', {
    data: data
  }).then(fromJS);
}
export function fetchSendLimits(sequenceEnrollment) {
  var timestampsWithIndex = getUnfinishedAndRescheduledAutoEmailSteps(sequenceEnrollment).reduce(function (acc, step) {
    var timestamp = getStepSendDate(sequenceEnrollment, step.get('stepOrder'));
    return acc.set(step.get('stepOrder'), timestamp);
  }, ImmutableMap());

  if (!timestampsWithIndex.size) {
    return Promise.resolve(timestampsWithIndex);
  }

  var data = {
    absoluteTimesMillis: timestampsWithIndex.valueSeq().toArray(),
    fromEmail: sequenceEnrollment.inboxAddress,
    timeZone: sequenceEnrollment.timezone
  };
  return apiClient.post('sequences/v2/send-times/limits', {
    data: data
  }).then(function (response) {
    return fromJS(response).map(function (stepData, timestamp) {
      var stepOrder = timestampsWithIndex.findKey(function (originalTimestamp) {
        return originalTimestamp === Number(timestamp);
      });
      return stepData.set('stepNumber', stepOrder + 1);
    });
  });
}
export function fetchSendLimitsForFutureDates(timeZone, fromEmail, timestamps) {
  var data = {
    absoluteTimesMillis: timestamps,
    fromEmail: fromEmail,
    timeZone: timeZone
  };
  return apiClient.post('sequences/v2/send-times/limits', {
    data: data
  }).then(fromJS);
}