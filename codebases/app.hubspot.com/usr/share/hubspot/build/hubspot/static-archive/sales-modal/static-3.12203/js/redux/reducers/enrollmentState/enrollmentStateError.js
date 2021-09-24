'use es6';

import { ENROLLMENT_STATE_INIT, ENROLLMENT_STATE_INIT_FAILED, ENROLLMENT_STATE_INIT_STARTED } from '../../actionTypes';
var initialState = null;
export default function enrollmentStateError() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case ENROLLMENT_STATE_INIT_STARTED:
    case ENROLLMENT_STATE_INIT:
      return null;

    case ENROLLMENT_STATE_INIT_FAILED:
      return action.payload;

    default:
      return state;
  }
}