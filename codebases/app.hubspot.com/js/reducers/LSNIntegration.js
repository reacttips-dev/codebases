'use es6';

import { Map as ImmutableMap } from 'immutable';
import * as LSNIntegrationActionTypes from '../constants/LSNIntegrationActionTypes';
var initialState = ImmutableMap({
  connected: false,
  loading: true
});
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case LSNIntegrationActionTypes.FETCH_QUEUED:
      return state.merge({
        loading: true
      });

    case LSNIntegrationActionTypes.FETCH_SUCCEEDED:
      return state.merge({
        connected: action.payload,
        loading: false
      });

    case LSNIntegrationActionTypes.FETCH_FAILED:
      return state.merge({
        loading: false
      });

    default:
      return state;
  }
});