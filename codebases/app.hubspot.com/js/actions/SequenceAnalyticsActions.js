'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import identity from 'transmute/identity';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
import { createAction } from 'flux-actions';
import { SEQUENCE_REPORT_FETCH_QUEUED, SEQUENCE_REPORT_FETCH_SUCCEEDED, SEQUENCE_REPORT_FETCH_FAILED } from 'SequencesUI/constants/SequenceAnalyticsActionTypes';
import * as SequenceApi from '../api/SequenceApi';
var fetchReportStarted = createAction(SEQUENCE_REPORT_FETCH_QUEUED, identity);
var fetchReportSuccess = createAction(SEQUENCE_REPORT_FETCH_SUCCEEDED, identity);
var fetchReportFailure = createAction(SEQUENCE_REPORT_FETCH_FAILED, identity);
export var fetchReport = function fetchReport(_ref) {
  var sequenceId = _ref.sequenceId,
      start = _ref.start,
      end = _ref.end,
      enrolledBy = _ref.enrolledBy;
  return function (dispatch) {
    dispatch(fetchReportStarted({
      sequenceId: sequenceId
    }));
    return SequenceApi.fetchReport({
      sequenceId: sequenceId,
      start: start,
      end: end,
      enrolledBy: enrolledBy
    }).then(function (report) {
      dispatch(fetchReportSuccess({
        sequenceId: sequenceId,
        report: report
      }));
    }, function (error) {
      if (error.status !== 403) {
        FloatingAlertStore.addAlert({
          titleText: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "alerts.fetchReportError"
          }),
          type: 'danger'
        });
      }

      dispatch(fetchReportFailure({
        sequenceId: sequenceId,
        error: error
      }));
      rethrowError(error);
    });
  };
};