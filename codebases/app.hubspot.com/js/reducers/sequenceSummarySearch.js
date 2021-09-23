'use es6';

import { Map as ImmutableMap } from 'immutable';
import { SEQUENCE_SUMMARY_SEARCH_UPDATE_QUERY } from '../constants/SequenceSummarySearchActionTypes';
import { SequenceSearchQuery } from '../records/SequenceSearchQuery';
var initialState = ImmutableMap({
  query: new SequenceSearchQuery()
});
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case SEQUENCE_SUMMARY_SEARCH_UPDATE_QUERY:
      return state.merge({
        query: action.payload
      });

    default:
      return state;
  }
});