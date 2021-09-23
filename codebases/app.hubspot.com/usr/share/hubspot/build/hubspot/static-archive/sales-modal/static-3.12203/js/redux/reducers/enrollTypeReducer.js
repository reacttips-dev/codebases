'use es6';

import { INIT } from '../actionTypes';
export default function enrollTypeReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (action.type === INIT) {
    return action.payload.enrollType || state;
  }

  return state;
}