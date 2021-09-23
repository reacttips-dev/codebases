'use es6';

import { Map as ImmutableMap } from 'immutable';
import * as RequestStatusTypes from 'SequencesUI/constants/RequestStatusTypes';
import * as SequenceScheduleActionTypes from 'SequencesUI/constants/SequenceScheduleActionTypes';
var initialState = ImmutableMap({
  requestStatus: RequestStatusTypes.LOADING,
  results: null,
  page: 1,
  paging: ImmutableMap().set(1, '')
});
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case SequenceScheduleActionTypes.FETCH_LOADING:
      return state.merge({
        requestStatus: RequestStatusTypes.LOADING
      });

    case SequenceScheduleActionTypes.FETCH_SUCCEEDED:
      return state.merge({
        requestStatus: RequestStatusTypes.SUCCEEDED,
        results: action.payload.results,
        page: action.payload.page,
        paging: action.payload.paging
      });

    case SequenceScheduleActionTypes.FETCH_FAILED:
      return state.merge({
        requestStatus: RequestStatusTypes.FAILED
      });

    default:
      return state;
  }
});