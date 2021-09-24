'use es6';

import curry from './curry';

function both(condition1, condition2, arg) {
  return !!(condition1(arg) && condition2(arg));
}
/**
 * Returns `true` if the results of `arg` applied to both `condition1` and
 * `condition2` are truthy.
 *
 * @example
 * const isOneToTen = both(
 *   n => n >= 1,
 *   n => n <= 10
 * );
 *
 * isOneToTen(3) === true;
 * isOneToTen(11) === false;
 *
 * @param {Function} condition1
 * @param {Function} condition2
 * @return {boolean}
 */


export default curry(both);