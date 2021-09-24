'use es6';

import { CONNECTED_ACCOUNTS_FETCH_SUCCEEDED } from '../constants/SequenceActionTypes';
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case CONNECTED_ACCOUNTS_FETCH_SUCCEEDED:
      return action.payload;

    default:
      return state;
  }
});