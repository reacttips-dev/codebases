'use es6';

import { ENROLLMENT_ERROR, ENROLLMENT_STATE_ENROLLMENT_INIT } from '../../actionTypes';
var initialState = null;
export default function enrollmentError() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case ENROLLMENT_ERROR:
      return action.payload;

    case ENROLLMENT_STATE_ENROLLMENT_INIT:
      return initialState;

    default:
      return state;
  }
}