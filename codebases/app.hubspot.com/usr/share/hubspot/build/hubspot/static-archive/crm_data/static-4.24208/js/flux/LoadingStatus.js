'use es6';

import { EMPTY, LOADING } from '../constants/LoadingStatus';

function equalsEmpty(value) {
  return value === EMPTY;
}

export {
/**
 * Placeholder for a value that could not be resolved.
 *
 * @type {null}
 */
EMPTY
/**
 * Placeholder for a value that is currently being resolved.
 *
 * @type {undefined}
 */
, LOADING };
/**
 * Returns `true` if any item in `values` is `EMPTY`.
 *
 * @param  {Array<EMPTY|LOADING|any>} ...values
 * @return {boolean}
 */

export function isEmpty() {
  for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
    values[_key] = arguments[_key];
  }

  return values.some(equalsEmpty);
}

function equalsLoading(value) {
  return value === LOADING;
}
/**
 * Returns `true` if any item in `values` is `LOADING`.
 *
 * @param  {Array<EMPTY|LOADING|any>} ...values
 * @return {boolean}
 */


export function isLoading() {
  for (var _len2 = arguments.length, values = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    values[_key2] = arguments[_key2];
  }

  return values.some(equalsLoading);
}

function equalsResolved(value) {
  return !equalsLoading(value) && !equalsEmpty(value);
}
/**
 * Returns `true` if no item in `values` is `EMPTY` or `LOADING`.
 *
 * @param  {Array<EMPTY|LOADING|any>} ...values
 * @return {boolean}
 */


export function isResolved() {
  for (var _len3 = arguments.length, values = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    values[_key3] = arguments[_key3];
  }

  return values.every(equalsResolved);
}