'use es6';

import always from '../always';
import isFunction from '../isFunction';
import isNumber from '../isNumber';
import protocol from '../protocol';
var isAnyValue = always(true);
export var clear = protocol({
  args: [protocol.TYPE],
  name: 'clear'
});
/**
 * @private
 * Returns the number of values in `subject`.
 *
 * @param {TYPE} subject
 * @return {number}
 */

export var count = protocol({
  args: [protocol.TYPE],
  name: 'count'
});
/**
 * @private
 * Returns a concatenated `subject` and `update`.
 *
 * @param {any} update
 * @param {TYPE} subject
 * @return {number}
 */

export var concat = protocol({
  args: [isAnyValue, // update
  protocol.TYPE],
  name: 'concat'
});
/**
 * @private
 * Returns a Seq of key,value tuples (in JS Array)
 *
 * @param {TYPE}
 * @return {Seq<[any, any]>}
 */

export var entrySeq = protocol({
  args: [protocol.TYPE],
  name: 'entrySeq'
});
/**
 * @private
 * Returns true if `predicate` returns `true` for _all_ items in `subject`.
 *
 * @param {Function} predicate
 * @param {TYPE} subject
 * @return {bool}
 */

export var every = protocol({
  args: [isFunction, // predicate
  protocol.TYPE],
  name: 'every'
});
/**
 * @private
 * Returns a new value of items in `subject` for which `predicate` returns `true`.
 *
 * @param {Function} predicate
 * @param {TYPE} subject
 */

export var filter = protocol({
  args: [isFunction, // predicate
  protocol.TYPE],
  name: 'filter'
});
export var flattenN = protocol({
  args: [isNumber, // depth
  protocol.TYPE],
  name: 'flattenN'
});
export var forEach = protocol({
  args: [isFunction, // effect
  protocol.TYPE],
  name: 'forEach'
});
/**
 * @private
 * Return the value of `key` in `subject`.
 *
 * @param {any} key
 * @param {TYPE} subject
 * @return {any}
 */

export var get = protocol({
  args: [isAnyValue, // key
  protocol.TYPE],
  name: 'get',
  fallback: function fallback(key, obj) {
    return obj[key];
  }
});
/**
 * @private
 * Returns `true` if `key` is in `subject`'s keys.
 *
 * @param {any} key
 * @param {TYPE} subject
 * @return {any}
 */

export var has = protocol({
  args: [isAnyValue, // key
  protocol.TYPE],
  name: 'has'
});
/**
 * @private
 * Return a `Seq` of the keys in `subject`.
 *
 * @param {TYPE<K, _>} subject
 * @return {Seq<K>}
 */

export var keySeq = protocol({
  args: [protocol.TYPE],
  name: 'keySeq'
});
export var keyedEquivalent = protocol({
  args: [protocol.TYPE],
  name: 'keyedEquivalent'
});
/**
 * @private
 * Returns a new value by applying `mapper` to each item in `subject`.
 *
 * @param {Function} mapper
 * @param {TYPE} subject
 * @return {TYPE}
 */

export var map = protocol({
  args: [isFunction, // mapper
  protocol.TYPE],
  name: 'map'
});
/**
 * @private
 * Returns a new value by applying `mapper` to each item in `subject`.
 *
 * @param {Function} mapper
 * @param {TYPE} subject
 * @return {TYPE}
 */

export var reduce = protocol({
  args: [isAnyValue, // accumulator
  isFunction, // reducer
  protocol.TYPE],
  name: 'reduce'
});
/**
 * @private
 * Set the `value` of `key` in `subject`.
 *
 * @param {any} value
 * @param {any} key
 * @param {TYPE} subject
 * @return {TYPE}
 */

export var set = protocol({
  args: [isAnyValue, // value
  isAnyValue, // key
  protocol.TYPE],
  name: 'set'
});
/**
 * @private
 * Returns true if `predicate` returns `true` for _any_ items in `subject`.
 *
 * @param {Function} predicate
 * @param {TYPE} subject
 * @return {bool}
 */

export var some = protocol({
  args: [isFunction, // predicate
  protocol.TYPE],
  name: 'some'
});
/**
 * @private
 * Returns a copy of `subject` sorted according to `getSortValue`.
 *
 * @param {Function} getSortValue
 * @param {TYPE} subject
 * @return {TYPE}
 */

export var sortBy = protocol({
  args: [isFunction, // getSortValue
  protocol.TYPE],
  name: 'sortBy'
});
/**
 * @private
 * Return a `Seq` of the values in `subject`.
 *
 * @param {TYPE<_, V>} subject
 * @return {Seq<K>}
 */

export var valueSeq = protocol({
  args: [protocol.TYPE],
  name: 'valueSeq'
});