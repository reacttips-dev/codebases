'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import * as SequenceApi from '../api/SequenceApi';
import { getPropertyValue } from 'SequencesUI/util/summary/CRMSearchUtils';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import { SEQUENCE_ENROLLMENT_POLLING_RESOLVED } from '../constants/SequenceActionTypes';
export function enrollmentPollingResolved(payload) {
  return {
    type: SEQUENCE_ENROLLMENT_POLLING_RESOLVED,
    payload: payload
  };
}
export function resume(enrollments, contactName) {
  return SequenceApi.resumeEnrollments(enrollments.map(function (enrollment) {
    return getPropertyValue(enrollment, 'hs_enrollment_id');
  })).then(function () {
    var message;

    if (enrollments.length === 1) {
      message = /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequences.alerts.singleResumeSuccess",
        options: {
          contactName: contactName
        }
      });
    } else {
      message = /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequences.alerts.multipleResumeSuccess",
        options: {
          count: enrollments.length
        }
      });
    }

    FloatingAlertStore.addAlert({
      titleText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequences.alerts.success"
      }),
      message: message,
      type: 'success'
    });
  }).catch(function () {
    var message;

    if (enrollments.length === 1) {
      message = /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequences.alerts.singleResumeFailed",
        options: {
          contactName: contactName
        }
      });
    } else {
      message = /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequences.alerts.multipleResumeFailed",
        options: {
          count: enrollments.length
        }
      });
    }

    FloatingAlertStore.addAlert({
      message: message,
      type: 'danger'
    });
  });
}
export function unenrollQuery(query) {
  return SequenceApi.unenrollQuery(query.toJS()).then(function (response) {
    return response.actionableIds;
  }).then(function (actionableIds) {
    FloatingAlertStore.addAlert({
      titleText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequences.alerts.success"
      }),
      message: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "index.alerts.sequenceUnenroll.success",
        options: {
          count: actionableIds.length
        }
      }),
      type: 'success'
    });
    return actionableIds;
  }).catch(function () {
    FloatingAlertStore.addAlert({
      titleText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequences.alerts.error"
      }),
      message: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "index.alerts.sequenceUnenroll.error"
      }),
      type: 'danger'
    });
  });
}
export function pauseQuery(query) {
  return SequenceApi.pauseQuery(query.toJS()).then(function (response) {
    return response.actionableIds;
  }).then(function (actionableIds) {
    FloatingAlertStore.addAlert({
      titleText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequences.alerts.success"
      }),
      message: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "index.alerts.sequencePause.success",
        options: {
          count: actionableIds.length
        }
      }),
      type: 'success'
    });
    return actionableIds;
  }).catch(function () {
    FloatingAlertStore.addAlert({
      titleText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequences.alerts.error"
      }),
      message: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "index.alerts.sequencePause.error"
      }),
      type: 'danger'
    });
  });
}
export function resumeQuery(query) {
  return SequenceApi.resumeQuery(query.toJS()).then(function (response) {
    return response.actionableIds;
  }).then(function (actionableIds) {
    FloatingAlertStore.addAlert({
      titleText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequences.alerts.success"
      }),
      message: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "index.alerts.sequenceResume.success",
        options: {
          count: actionableIds.length
        }
      }),
      type: 'success'
    });
    return actionableIds;
  }).catch(function () {
    FloatingAlertStore.addAlert({
      titleText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequences.alerts.error"
      }),
      message: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "index.alerts.sequenceResume.error"
      }),
      type: 'danger'
    });
  });
} // Resume from modal

export var resumeEnrollment = function resumeEnrollment(enrollment) {
  return SequenceApi.resumeEnrollment(enrollment).then(function () {
    FloatingAlertStore.addAlert({
      titleText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequences.alerts.success"
      }),
      message: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequences.alerts.resumeEnrollmentSuccess"
      }),
      type: 'success'
    });
    return enrollment;
  }).catch(function () {
    FloatingAlertStore.addAlert({
      message: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequences.alerts.resumeEnrollmentFailed"
      }),
      type: 'danger'
    });
  });
};