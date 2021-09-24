'use es6';

import { Map as ImmutableMap } from 'immutable';
import { SUMMARY_COUNT_FETCH_STARTED, SUMMARY_COUNT_FETCH_SUCCEEDED, BULK_ENROLL_SUCCESS, ENROLL_SUCCESS, UNENROLL_BATCH_SUCCESS, UNENROLL_BATCH_SUCCESS_CRMOBJECTS } from '../constants/SequenceActionTypes';
import { getPropertyValue } from 'SequencesUI/util/summary/CRMSearchUtils';
var initialState = ImmutableMap();
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case SUMMARY_COUNT_FETCH_STARTED:
    case SUMMARY_COUNT_FETCH_SUCCEEDED:
      return state.merge(action.payload);

    case BULK_ENROLL_SUCCESS:
      {
        var results = action.payload.results;
        var sequenceId = "" + action.payload.sequenceId;
        var currentCount = state.getIn([sequenceId, 'executing']);
        return state.setIn([sequenceId, 'executing'], currentCount + results.get('successes').size);
      }

    case ENROLL_SUCCESS:
      {
        var _sequenceId = "" + action.payload.get('sequenceId');

        var _currentCount = state.getIn([_sequenceId, 'executing']);

        return state.setIn([_sequenceId, 'executing'], _currentCount + 1);
      }

    case UNENROLL_BATCH_SUCCESS:
      {
        var numUnenrolledBySequence = action.payload.groupBy(function (enrollment) {
          return enrollment.get('sequenceId');
        }).map(function (enrollments) {
          return enrollments.size;
        });
        numUnenrolledBySequence.forEach(function (unenrolledCount, sequenceId) {
          state = state.updateIn(["" + sequenceId, 'executing'], function (currentCount) {
            return currentCount - unenrolledCount;
          });
        });
        return state;
      }

    case UNENROLL_BATCH_SUCCESS_CRMOBJECTS:
      {
        var _numUnenrolledBySequence = action.payload.groupBy(function (enrollment) {
          return getPropertyValue(enrollment, 'hs_sequence_id');
        }).map(function (enrollments) {
          return enrollments.size;
        });

        _numUnenrolledBySequence.forEach(function (unenrolledCount, sequenceId) {
          state = state.updateIn(["" + sequenceId, 'executing'], function (currentCount) {
            return currentCount - unenrolledCount;
          });
        });

        return state;
      }

    default:
      return state;
  }
});