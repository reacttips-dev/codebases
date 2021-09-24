'use es6';

import ResolverError from 'reference-resolvers/schema/ResolverError';
import ResolverLoading from 'reference-resolvers/schema/ResolverLoading';
import curry from 'transmute/curry';
import isInstanceOf from 'transmute/isInstanceOf';
export var isLoading = isInstanceOf(ResolverLoading);
export var isError = isInstanceOf(ResolverError);
export var isResolved = function isResolved(value) {
  return value != null && !isLoading(value) && !isError(value);
};
/**
 * Maps a resolving value to with the correct mapper givin its state
 *
 * @param {object} mappers
 * @return {any}
 */

export var mapResolve = curry(function (_ref, value) {
  var loading = _ref.loading,
      error = _ref.error,
      resolved = _ref.resolved;

  if (isLoading(value)) {
    return loading(value);
  }

  if (isError(value)) {
    return error(value);
  }

  return resolved(value);
});