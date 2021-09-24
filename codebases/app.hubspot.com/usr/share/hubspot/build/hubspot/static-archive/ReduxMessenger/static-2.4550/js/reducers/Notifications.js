'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import ActionTypes from '../actions/ActionTypes';
var DEFAULT_STATE = {};
export default function Notifications() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_STATE;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case ActionTypes.ADD_NOTIFICATION:
      return Object.assign({}, state, _defineProperty({}, action.payload.id, action.payload));

    case ActionTypes.REMOVE_NOTIFICATION:
      {
        if (state[action.payload.id] == null) return state;
        var nextState = Object.assign({}, state);
        delete nextState[action.payload.id];
        return nextState;
      }

    default:
      return state;
  }
}