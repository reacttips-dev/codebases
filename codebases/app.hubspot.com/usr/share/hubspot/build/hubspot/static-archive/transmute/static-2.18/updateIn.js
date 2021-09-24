'use es6';

import curry from './curry';
import _getIn from './internal/_getIn';
import _setIn from './internal/_setIn';

function updateIn(keyPath, updater, subject) {
  var value = _getIn(keyPath, subject);

  return _setIn(keyPath, updater(value), subject);
}
/**
 * Apply `updater` to the value at `keyPath`.
 *
 * @example
 * const incrementUserCount = updateIn(['users', 'count'], n => n + 1);
 * incrementUserCount({users: {count: 1}});
 * // returns {users: {count: 2}}
 *
 * @example <caption>Unset keyPaths will be set based on the most recent type.</caption>
 * const incrementUserCount = updateIn(['users', 'count'], (n = 0) => n + 1);
 * incrementUserCount({});
 * // returns {users: {count: 1}}
 *
 * incrementUserCount(Map());
 * // returns Map { users => Map { count => 1 } }
 *
 * @param  {Array<any>|Iterable<any>} keyPath the location where `updater` should be applied.
 * @param  {Function} updater the tranformation to apply.
 * @param  {Array|Iterable|Object} subject the thing to update.
 * @return {Array|Iterable|Object}
 */


export default curry(updateIn);