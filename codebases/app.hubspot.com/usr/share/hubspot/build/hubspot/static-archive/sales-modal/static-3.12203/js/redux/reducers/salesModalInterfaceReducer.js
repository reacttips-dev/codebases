'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { combineReducers } from 'redux';
import { INIT } from 'sales-modal/redux/actionTypes';

var initValueReducer = function initValueReducer(name) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var action = arguments.length > 1 ? arguments[1] : undefined;

    switch (action.type) {
      case INIT:
        return action.payload[name] !== null && action.payload[name] !== undefined ? action.payload[name] : state;

      default:
        return state;
    }
  };
};

var properties = ['user', 'portal', 'platform', 'recipient', 'closeModal', 'sender', 'enrollSequence', 'selectConnectedAccount', 'useCachedConnectedAccount', 'signature', 'insertLink', 'insertTemplate', 'contacts', 'enrolledSequence'];
export default combineReducers(properties.reduce(function (acc, key) {
  return Object.assign({}, acc, _defineProperty({}, key, initValueReducer(key)));
}, {}));