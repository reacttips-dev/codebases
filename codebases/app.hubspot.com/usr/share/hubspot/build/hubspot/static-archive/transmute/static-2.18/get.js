'use es6';

import curry from './curry';
import _get from './internal/_get';
/**
 * Retrieve the value at `key` from `subject`.
 *
 * @example
 * // returns 1
 * get('one', Map({one: 1, two: 2, three: 3}))
 *
 * @param  {any} key to lookup in `subject`.
 * @param  {Iterable|Object} subject in which to look up `key`.
 * @return {any} the value at `key`.
 */

export default curry(_get);