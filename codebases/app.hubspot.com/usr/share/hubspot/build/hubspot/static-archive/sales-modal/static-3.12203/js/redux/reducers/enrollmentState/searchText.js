'use es6';

import { ENROLLMENT_STATE_UPDATED_SEARCH_TEXT, ENROLLMENT_STATE_RESET_SEARCH_TEXT } from '../../actionTypes';
var initialState = '';
export default function searchText() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case ENROLLMENT_STATE_UPDATED_SEARCH_TEXT:
      return action.payload;

    case ENROLLMENT_STATE_RESET_SEARCH_TEXT:
      return initialState;

    default:
      return state;
  }
}