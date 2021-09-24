'use es6';

import enviro from 'enviro';
/* eslint-disable no-console */
// borrowed from https://github.com/rackt/redux/blob/master/docs/advanced/Middleware.md

var logger = function logger(store) {
  return function (next) {
    return function (action) {
      var isDebug = enviro.debug('social');

      if (isDebug && typeof action === 'object') {
        console.log('[logger] dispatching', window.HEADLESS ? action.type : action);
      }

      var result = next(action);

      if (isDebug && !window.HEADLESS) {
        console.log('[logger] next state', store.getState());
      }

      return result;
    };
  };
};

export default logger;