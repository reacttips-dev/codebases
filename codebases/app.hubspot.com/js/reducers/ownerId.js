'use es6';

import { Map as ImmutableMap } from 'immutable';
import { OWNER_ID_FETCH_STARTED, OWNER_ID_FETCH_SUCCEEDED, OWNER_ID_FETCH_FAILED } from 'SequencesUI/constants/SequenceEditorActionTypes';
var initialState = ImmutableMap({
  ownerId: null,
  fetchFailed: false
});
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case OWNER_ID_FETCH_STARTED:
      return initialState;

    case OWNER_ID_FETCH_SUCCEEDED:
      return state.set('ownerId', action.payload);

    case OWNER_ID_FETCH_FAILED:
      return state.set('fetchFailed', true);

    default:
      return state;
  }
});