'use es6';
/**
 * Returns `true` if `subject` is a JavaScript Number and not `NaN`.
 * 
 * @param {any} value 
 * @return {boolean}
 */

export default function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}