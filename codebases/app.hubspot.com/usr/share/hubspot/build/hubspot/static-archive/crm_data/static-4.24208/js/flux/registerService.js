'use es6';

import defaultDispatcher from 'dispatcher/dispatcher';
export default function registerService(initialState, handlers) {
  var dispatcher = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultDispatcher;
  var state = initialState;

  function runService(_ref) {
    var actionType = _ref.actionType,
        data = _ref.data;

    if (Object.prototype.hasOwnProperty.call(handlers, actionType)) {
      state = handlers[actionType](state, data, actionType);
    }
  }

  var dispatcherId = dispatcher.register(runService);
  return {
    dispatcherId: dispatcherId,
    getState: function getState() {
      return state;
    },
    handlers: handlers,
    initialState: initialState,
    runService: runService,
    unregister: function unregister() {
      return dispatcher.unregister(dispatcherId);
    }
  };
}
export var WEBPACK_3_FORCE_MODULE_IMPORT = 1;