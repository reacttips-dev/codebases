'use es6';
/**
 * Returns true if `value` is a Function.
 * 
 * @param {any} value
 * @return {boolean}
 */

export default function isFunction(value) {
  return typeof value === 'function';
}