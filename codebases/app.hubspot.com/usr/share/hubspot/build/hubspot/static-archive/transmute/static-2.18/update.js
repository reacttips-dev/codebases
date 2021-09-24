'use es6';

import _get from './internal/_get';
import _set from './internal/_set';
import curry from './curry';

function update(key, updater, subject) {
  var value = _get(key, subject);

  return _set(key, updater(value), subject);
}
/**
 * Sets the value at `key` to the result of `updater`.
 *
 * @example
 * const incrementCount = update('count', n => n + 1);
 * incrementCount({count: 1});
 * // returns {count: 2}
 *
 * @param {any} key
 * @param {Function} updater
 * @param {Array|Iterable|Object} subject
 * @return {Array|Iterable|Object}
 */


export default curry(update);