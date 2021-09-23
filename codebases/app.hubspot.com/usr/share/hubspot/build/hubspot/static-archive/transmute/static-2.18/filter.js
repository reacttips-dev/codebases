'use es6';

import curry from './curry';
import _filter from './internal/_filter';
/**
 * Remove values for which `predicate` returns `false`.
 *
 * @example
 * // returns List [ 2 ]
 * filter(
 *   (n) => n % 2 === 0,
 *   List.of(1, 2, 3)
 * );
 *
 * @example <caption>`Record`s have a fixed set of keys, so filter returns a Map instead.</caption>
 * // returns Map { 'one' => 1, 'three' => 3 }
 * filter(
 *   (n) => n % 2 === 0,
 *   ThreeRecord({one: 1, two: 2, three: 3})
 * );
 *
 * @param {Function} predicate returns `true` if a value should be included.
 * @param {Iterable} subject to filter.
 * @return {Iterable} without values that didn't match `predicate`.
 */

export default curry(_filter);