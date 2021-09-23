'use es6';

import _set from './internal/_set';
import curry from './curry';
/**
 * Returns a copy of `subject` with `key` set to `value`.
 *
 * @example
 * set('one', 2, {one: 1});
 * // returns {one: 2}
 *
 * @param {any} key
 * @param {any} value
 * @param {Array|Iterable|Object} subject
 * @return {Array|Iterable|Object}
 */

export default curry(_set);