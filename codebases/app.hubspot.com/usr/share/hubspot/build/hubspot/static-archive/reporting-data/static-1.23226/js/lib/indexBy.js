'use es6';

import { Map as ImmutableMap } from 'immutable';
/**
 * Creates a immutable map from a iterable which is indexed by the indexer
 *
 * @param {(item: T) => I} indexer returns the index for the value
 * @return {Immutable.Map<I, T>}
 */

export default (function (indexer, collection) {
  return ImmutableMap().withMutations(function (result) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = collection[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;
        result.set(indexer(item), item);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return result;
  });
});