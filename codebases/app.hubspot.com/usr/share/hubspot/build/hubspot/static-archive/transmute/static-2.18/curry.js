'use es6';

import curryN from './curryN';
/**
 * Creates a curried version of `operation`.
 *
 * @example
 * const toArray = curry((a, b, c) => [a, b, c]);
 * const toArrayWith1 = toArray(1);
 * toArrayWith1(2, 3) === [1, 2, 3];
 *
 * @param  {Function} operation
 * @return {Function}
 */

export default function curry(operation) {
  return curryN(operation.length, operation);
}