'use es6';

import { RESET_MODAL } from 'sales-modal/redux/actionTypes';
import { SEQUENCE_FETCH_STARTED, SEQUENCE_FETCH_SUCCEEDED, SEQUENCE_FETCH_FAILED } from '../actionTypes';
var initialState = {
  data: null,
  fetching: true,
  error: false
};
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case SEQUENCE_FETCH_STARTED:
      return initialState;

    case SEQUENCE_FETCH_SUCCEEDED:
      return Object.assign({}, state, {
        data: action.payload.sequence,
        fetching: false,
        error: false
      });

    case SEQUENCE_FETCH_FAILED:
      return Object.assign({}, state, {
        fetching: false,
        error: true
      });

    case RESET_MODAL:
      return initialState;

    default:
      {
        return state;
      }
  }
});