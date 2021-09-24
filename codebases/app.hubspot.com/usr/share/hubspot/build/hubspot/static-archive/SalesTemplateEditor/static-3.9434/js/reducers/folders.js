'use es6';

import { Map as ImmutableMap } from 'immutable';
import ActionTypes from 'SalesTemplateEditor/constants/ActionTypes';
var initialState = ImmutableMap({
  folders: null,
  error: null
});
export default function folders() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  switch (action.type) {
    case ActionTypes.FETCH_FOLDERS_STARTED:
      return initialState;

    case ActionTypes.FETCH_FOLDERS_SUCCESS:
      return state.set('folders', action.payload).set('error', false);

    case ActionTypes.FETCH_FOLDERS_ERROR:
      return state.set('error', true);

    default:
      return state;
  }
}