'use es6';

import isFunction from './isFunction';
export default function createAction(type, actionCreator, metaCreator) {
  return function () {
    var action = {
      type: type
    };

    if (isFunction(actionCreator)) {
      action.payload = actionCreator.apply(void 0, arguments);
    }

    if (isFunction(metaCreator)) {
      action.meta = metaCreator.apply(void 0, arguments);
    }

    return action;
  };
}