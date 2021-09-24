'use es6';

import Raven from 'Raven';
import enviro from 'enviro';
var DEFAULT_OPTIONS = {
  actionsToReport: 10,
  reportActionErrors: false
};

function isRequestFailure(err) {
  return Boolean(err.options && err.xhr);
}

export function captureException(action, err) {
  if (!enviro.deployed('sentry')) {
    return;
  }

  if (!isRequestFailure(err) && !err.handled) {
    console.error(err); // eslint-disable-line no-console

    Raven.captureException(err);
  }
}
export default function createMiddleware() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  options = Object.assign({}, DEFAULT_OPTIONS, {}, options);
  var actions = [];
  Raven.setDataCallback(function (data, original) {
    data = Object.assign({}, data, {
      extra: Object.assign({
        reduxActions: actions
      }, data.extra)
    });
    return original ? original(data) : data;
  });
  return function () {
    return function (next) {
      return function (action) {
        // attempt to grab function name if we have an async action
        var actionName = action.type || action.name;

        if (actionName) {
          actions.unshift(actionName);
          actions = actions.slice(0, options.actionsToReport);
        }

        if (options.reportActionErrors) {
          if (action.payload instanceof Error) {
            captureException(action, action.payload);
          } else if (action.error instanceof Error) {
            captureException(action, action.error);
          }
        }

        return next(action);
      };
    };
  };
}