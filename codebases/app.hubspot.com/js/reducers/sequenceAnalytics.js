'use es6';

import { Map as ImmutableMap } from 'immutable';
import ReportRecord from 'SequencesUI/records/ReportRecord';
import { SEQUENCE_REPORT_FETCH_QUEUED, SEQUENCE_REPORT_FETCH_SUCCEEDED, SEQUENCE_REPORT_FETCH_FAILED } from 'SequencesUI/constants/SequenceAnalyticsActionTypes'; // TODO This can be deleted when the email steps table is replaced.

var initialState = ImmutableMap();

function getInitialSequenceState(sequenceId) {
  return ImmutableMap().set(sequenceId, ImmutableMap({
    isFetching: true,
    hasError: false,
    report: new ReportRecord()
  }));
}

export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case SEQUENCE_REPORT_FETCH_QUEUED:
      return state.merge(getInitialSequenceState(action.payload.sequenceId));

    case SEQUENCE_REPORT_FETCH_SUCCEEDED:
      return state.mergeIn([action.payload.sequenceId], {
        isFetching: false,
        hasError: false,
        report: action.payload.report
      });

    case SEQUENCE_REPORT_FETCH_FAILED:
      return state.mergeIn([action.payload.sequenceId], {
        isFetching: false,
        hasError: true
      });

    default:
      return state;
  }
});