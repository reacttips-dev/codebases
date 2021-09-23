'use es6';

import { Map as ImmutableMap } from 'immutable';
import * as RequestStatusTypes from 'SequencesUI/constants/RequestStatusTypes';
import * as SequencesRemediationActionTypes from 'SequencesUI/constants/SequencesRemediationActionTypes';
var initialState = ImmutableMap({
  requestStatus: RequestStatusTypes.LOADING,
  results: null
});
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case SequencesRemediationActionTypes.SEQUENCES_REMEDIATION_FETCH_ENROLLMENTS_LOADING:
      return initialState;

    case SequencesRemediationActionTypes.SEQUENCES_REMEDIATION_FETCH_ENROLLMENTS_SUCCEEDED:
      return state.merge({
        results: action.payload,
        requestStatus: RequestStatusTypes.SUCCEEDED
      });

    case SequencesRemediationActionTypes.SEQUENCES_REMEDIATION_FETCH_ENROLLMENTS_FAILED:
      return state.merge({
        results: null,
        requestStatus: RequestStatusTypes.FAILED
      });

    default:
      return state;
  }
});