'use es6';

import curry from './curry';

function ifElse(predicate, affimative, negative, subject) {
  if (predicate(subject)) {
    return affimative(subject);
  }

  return negative(subject);
}
/**
 * Applies `affirmative` to `subject` if `predicate(subject)` is truthy.
 * Otherwise applies `negative` to `subject`.
 *
 * @example
 * const incrementAwayFromZero = ifElse(
 *   n => n >= 0,
 *   n => n + 1,
 *   n => n - 1
 * );
 *
 * incrementAwayFromZero(1) === 2
 * incrementAwayFromZero(-1) === -2
 *
 * @param {Function} predicate
 * @param {Function} affirmative
 * @param {Function} negative
 * @param {any} subject
 * @return {any}
 */


export default curry(ifElse);