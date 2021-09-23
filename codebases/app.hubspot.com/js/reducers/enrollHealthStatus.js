'use es6';

import { Map as ImmutableMap } from 'immutable';
import * as EnrollHealthStatusTypes from '../constants/EnrollHealthStatusTypes';
import * as EnrollHealthStatusActionTypes from '../constants/EnrollHealthStatusActionTypes';
var initialState = ImmutableMap({
  status: EnrollHealthStatusTypes.DISABLED
});
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case EnrollHealthStatusActionTypes.FETCH_ENROLL_HEALTH_STATUS_SUCCEEDED:
      return state.merge({
        status: action.payload.get('status')
      });

    default:
      return state;
  }
});