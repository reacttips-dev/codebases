'use es6';

import { buildError } from './buildError';
/**
 * @description Wraps buildError with a defined message, and
 * overrides any retry configuration. Without the retry override,
 * a core promise client adapter will basically catch this error,
 * retry the request a bunch of times, and then throw its own
 * error once it's failed its maximum number of retries.
 * @param {Error} error
 */

export var buildNetworkUnavailableError = function buildNetworkUnavailableError(error) {
  return buildError('Network Unavailable', Object.assign({}, error, {
    retry: null
  }));
};