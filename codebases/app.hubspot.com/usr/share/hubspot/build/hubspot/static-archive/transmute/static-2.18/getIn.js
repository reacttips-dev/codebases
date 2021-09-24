'use es6';

import _getIn from './internal/_getIn';
import curry from './curry';
/**
 * Retrieve a `keyPath` from a nested Immutable or JS structure.
 *
 * `getIn` short circuts when it encounters a `null` or `undefined` value.
 *
 * @example
 * const getFirstName = getIn(['name', 'first']);
 * const user = UserRecord({
 *   name: Map({
 *     first: 'Test',
 *     last: 'Testerson',
 *   }),
 * });
 * getFirstName(user) === 'Test'
 *
 * @param  {Array<string>} keyPath
 * @param  {Array|Iterable|Object} subject
 * @return {any}
 */

export default curry(_getIn);