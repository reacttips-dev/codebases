'use es6';

import { Map as ImmutableMap } from 'immutable';
import { TEMPLATE_BATCH_FETCH_SUCCEEDED, TEMPLATE_BATCH_UPDATE_SUCCEEDED } from '../constants/SequenceActionTypes';
var initialState = ImmutableMap();
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case TEMPLATE_BATCH_FETCH_SUCCEEDED:
      return action.payload;

    case TEMPLATE_BATCH_UPDATE_SUCCEEDED:
      return state.merge(action.payload);

    default:
      return state;
  }
});