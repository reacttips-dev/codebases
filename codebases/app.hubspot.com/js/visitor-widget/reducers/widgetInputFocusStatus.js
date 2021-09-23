'use es6';

import * as ActionTypes from '../../constants/VisitorActionTypes';
var defaultState = {
  widgetInputIsOnFocus: false
};
export default function widgetInputFocusStatus() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case ActionTypes.USER_INPUT_ON_FOCUS:
      return Object.assign({}, state, {}, action.payload);

    default:
      return state;
  }
}