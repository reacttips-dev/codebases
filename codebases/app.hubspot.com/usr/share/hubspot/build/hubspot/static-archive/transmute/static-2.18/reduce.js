'use es6';

import curry from './curry';
import _reduce from './internal/_reduce';
/**
 * Transform the contents of `subject` to `into` by applying `operation` to each
 * item.
 *
 * @example
 * reduce(
 *   List(),
 *   (acc, val) => acc.push(val),
 *   Map({ one: 1, two: 2, three: 3 })
 * );
 * // returns List [ 1, 2, 3 ]
 *
 * @param  {any} into
 * @param  {Function} operation
 * @param  {Iterable} subject   [description]
 * @return {Iterable}
 */

export default curry(_reduce);