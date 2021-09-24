import { Map as ImmutableMap } from 'immutable';
var cache = ImmutableMap();
/**
 * Rethrow error with logging
 *
 * @param {Error|mixed} error Error or caught value
 * @returns {mixed} Caught value
 * @throws Original error type of Error
 */

var rethrow = function rethrow(error) {
  if (!cache.has(error)) {
    cache = cache.set(error, true);
    console.error(error); // eslint-disable-line no-console
  }

  if (error instanceof Error) {
    throw error;
  }

  return error;
};

rethrow.bust = function () {
  cache = ImmutableMap();
};

export default rethrow;