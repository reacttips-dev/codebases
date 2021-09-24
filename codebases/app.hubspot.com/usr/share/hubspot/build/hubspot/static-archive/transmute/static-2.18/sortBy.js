'use es6';

import curry from './curry';
import _sortBy from './internal/_sortBy';
/**
 * Sort `subject` according to the value returned by `getSortValue`.
 *
 * @example
 * // returns List [ 2, 1, 3 ]
 * sortBy(
 *   (n) => n % 2,
 *   List.of(1, 2, 3)
 * );
 *
 * @example
 * // returns OrderedMap { "one" => 1, "two" => 2, "three" => 3 }
 * sortBy(
 *   (n) => n % 2,
 *   Map({three: 3, one: 1, two: 2})
 * );
 *
 * @param  {Function} getSortValue returns a value to sort on for each item in `subject`.
 * @param  {Array|Iterable|Object} subject the thing to sort.
 * @return {Iterable} an ordered version of `subject` (e.g. sorting a `Map` returns an `OrderedMap`).
 */

export default curry(_sortBy);