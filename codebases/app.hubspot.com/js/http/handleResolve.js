'use es6';

import { buildError } from 'conversations-error-reporting/error-reporting/builders/buildError';
import { reportError } from 'conversations-error-reporting/error-reporting/reportError';
export var handleResolve = function handleResolve(resolveCallback) {
  return function (promiseResult) {
    try {
      resolveCallback(promiseResult);
    } catch (error) {
      var resolveError = buildError(error && error.message, {
        name: 'ResolveError'
      });
      reportError({
        error: resolveError,
        fingerprint: ['{{ default }}', 'ResolveError']
      });
      throw error;
    }
  };
};