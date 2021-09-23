'use es6';

import { Map as ImmutableMap } from 'immutable';
import { ENROLLMENT_STATE_INIT_STARTED, ENROLLMENT_STATE_INIT_FAILED, ENROLLMENT_STATE_INIT } from '../../actionTypes';
import { SUCCEEDED, STARTED, FAILED, ENROLLMENT_INIT_FETCH } from 'sales-modal/constants/RequestStatusTypes';
var initialState = ImmutableMap({
  ENROLLMENT_INIT_FETCH: null
});
export default function requestStatus() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case ENROLLMENT_STATE_INIT:
      return state.set(ENROLLMENT_INIT_FETCH, SUCCEEDED);

    case ENROLLMENT_STATE_INIT_FAILED:
      return state.set(ENROLLMENT_INIT_FETCH, FAILED);

    case ENROLLMENT_STATE_INIT_STARTED:
      return state.set(ENROLLMENT_INIT_FETCH, STARTED);

    default:
      return state;
  }
}