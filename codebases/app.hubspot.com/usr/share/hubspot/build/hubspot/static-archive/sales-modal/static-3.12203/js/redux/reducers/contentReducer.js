'use es6';

import { INIT, RESET_MODAL, RECEIVE_COUNT } from 'sales-modal/redux/actionTypes';
var initialState = {
  supplementalObjectType: null,
  supplementalObjectId: null,
  count: null
};

var contentReducer = function contentReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case INIT:
      return Object.assign({}, state, {
        supplementalObjectType: action.payload.supplementalObjectType,
        supplementalObjectId: action.payload.supplementalObjectId
      });

    case RECEIVE_COUNT:
      return Object.assign({}, state, {
        count: action.payload.get('total')
      });

    case RESET_MODAL:
      return initialState;

    default:
      return state;
  }
};

export default contentReducer;