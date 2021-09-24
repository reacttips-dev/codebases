'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ImmutableMap;

import { Map as ImmutableMap } from 'immutable';
import { VIEWED_SEND_TIME_ALERT } from '../../actionTypes';
import { NO_TIME_SLOTS, CLOSE_TO_SEND_LIMIT, AT_SEND_LIMIT } from 'sales-modal/constants/SendTimeAlertWarningTypes';
var initialState = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, NO_TIME_SLOTS, false), _defineProperty(_ImmutableMap, CLOSE_TO_SEND_LIMIT, false), _defineProperty(_ImmutableMap, AT_SEND_LIMIT, false), _ImmutableMap));
export default function sendTimeAlertTracking() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case VIEWED_SEND_TIME_ALERT:
      {
        return state.set(action.payload, true);
      }

    default:
      return state;
  }
}