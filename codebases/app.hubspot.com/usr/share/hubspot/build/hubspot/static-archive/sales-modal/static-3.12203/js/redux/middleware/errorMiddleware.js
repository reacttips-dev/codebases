'use es6';

import Raven from 'Raven';
export var errorMiddleware = function errorMiddleware() {
  return function (next) {
    return function (action) {
      Raven.captureBreadcrumb({
        message: action.type,
        category: 'redux action'
      });
      return next(action);
    };
  };
};