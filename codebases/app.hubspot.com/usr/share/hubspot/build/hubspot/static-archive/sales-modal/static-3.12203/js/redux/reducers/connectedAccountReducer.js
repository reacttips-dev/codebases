'use es6';

import { CONNECTED_ACCOUNTS } from 'sales-modal/constants/ActionNamespaces';
import { SELECT_SENDER } from 'sales-modal/redux/actionTypes';
var STARTED = CONNECTED_ACCOUNTS + "_FETCH_STARTED";
var SUCCEEDED = CONNECTED_ACCOUNTS + "_FETCH_SUCCEEDED";
var FAILED = CONNECTED_ACCOUNTS + "_FETCH_FAILED";
var initialState = {
  signature: null,
  selectedSender: null,
  fetching: true,
  data: null,
  error: false
};
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case STARTED:
      return initialState;

    case SUCCEEDED:
      {
        var _action$payload = action.payload,
            connectedAccounts = _action$payload.connectedAccounts,
            selectedSender = _action$payload.selectedSender,
            signature = _action$payload.signature;
        return Object.assign({}, state, {
          signature: signature,
          selectedSender: selectedSender,
          data: connectedAccounts,
          fetching: false,
          error: false
        });
      }

    case FAILED:
      return Object.assign({}, state, {
        fetching: false,
        error: true
      });

    case SELECT_SENDER:
      return Object.assign({}, state, {
        selectedSender: action.payload
      });

    default:
      return state;
  }
});