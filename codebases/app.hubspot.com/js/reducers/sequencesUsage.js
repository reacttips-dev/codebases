'use es6';

import { SEQUENCE_FETCH_USAGE_SUCCESS } from '../constants/SequenceActionTypes';
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case SEQUENCE_FETCH_USAGE_SUCCESS:
      return {
        count: action.payload.currentUsage,
        userLimit: action.payload.limit,
        limit: action.payload.limit
      };

    default:
      return state;
  }
});