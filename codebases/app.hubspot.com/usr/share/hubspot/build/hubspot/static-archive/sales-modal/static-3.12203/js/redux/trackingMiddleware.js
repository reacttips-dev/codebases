'use es6';

export default (function (handlers) {
  return function (store) {
    return function (next) {
      return function (action) {
        var prevState = store.getState();
        var result = next(action);
        var handler = handlers[action.type];

        if (handler && typeof handler === 'function') {
          handler(action, store.getState(), store.dispatch, prevState);
        }

        return result;
      };
    };
  };
});