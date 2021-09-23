'use es6';

import curry from './curry';
import _some from './internal/_some';
/**
 * Returns `true` if **any** items in `subject` match `predicate`.
 *
 * @example
 * const anyBlue = some(v => v === 'blue');
 *
 * anyBlue(List.of('blue', 'red')) === true;
 * anyBlue(List.of('red', 'red')) === true;
 *
 * @param  {Function} predicate returns `true` if item is a match.
 * @param  {Iterable} subject
 * @return {bool}
 */

export default curry(_some);