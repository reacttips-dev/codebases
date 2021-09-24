'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import isFunction from './isFunction';
import { ACTION_TYPE_DELIMITER } from './combineActions';

function reduceReducers() {
  for (var _len = arguments.length, reducers = new Array(_len), _key = 0; _key < _len; _key++) {
    reducers[_key] = arguments[_key];
  }

  return function (previous, current) {
    return reducers.reduce(function (p, r) {
      return r(p, current);
    }, previous);
  };
}

function handleAction(types, reducer) {
  var splitTypes = types.split(ACTION_TYPE_DELIMITER);
  return function (state, action) {
    if (!splitTypes.includes(action.type)) {
      return state;
    }

    return isFunction(reducer) ? reducer(state, action) : state;
  };
}

export default function handleActions(handlers, defaultState) {
  var reducers = Object.getOwnPropertyNames(handlers).map(function (types) {
    return handleAction(types, handlers[types]);
  });
  var reducer = reduceReducers.apply(void 0, _toConsumableArray(reducers));
  return typeof defaultState !== 'undefined' ? function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    return reducer(state, action);
  } : reducer;
}