'use es6';

import { SET_AUTH } from '../actions/ActionTypes';
export default function Auth() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
      auth = action.auth;

  switch (type) {
    case SET_AUTH:
      return auth;

    default:
      return state;
  }
}