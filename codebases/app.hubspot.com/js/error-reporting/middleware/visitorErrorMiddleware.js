'use es6';

import { isErrorAction } from 'conversations-error-reporting/error-actions/operators/isErrorAction';
import { captureActionBreadcrumb } from 'conversations-error-reporting/error-reporting/captureActionBreadcrumb';
import { reportErrorAction } from 'conversations-error-reporting/error-reporting/reportErrorAction';
export var visitorErrorMiddleware = function visitorErrorMiddleware() {
  return function (next) {
    return function (action) {
      captureActionBreadcrumb(action);

      if (isErrorAction(action)) {
        reportErrorAction(action);
      }

      return next(action);
    };
  };
};