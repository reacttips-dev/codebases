'use es6';

import curry from './curry';
import _every from './internal/_every';
/**
 * Returns `true` if **all** items in `subject` match `predicate`.
 *
 * @example
 * const alwaysBlue = every(v => v === 'blue');
 *
 * alwaysBlue(List.of('blue', 'blue')) === true;
 * alwaysBlue(List.of('red', 'blue')) === false;
 *
 * @param  {Function} predicate returns `true` if item is a match.
 * @param  {Iterable} subject
 * @return {bool}
 */

export default curry(_every);