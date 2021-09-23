'use es6';

import { Map as ImmutableMap } from 'immutable';
import enviro from 'enviro';
import invariant from 'react-utils/invariant';
import isString from 'transmute/isString';
export var LOCAL_SETTINGS_PREFIX = 'LocalSettings:Sales:';
/**
 * Prefixes `key` with the local settings namespace.
 *
 * @example
 * makePrefixedKey('testing') === 'LocalSettings:Sales:testing'
 *
 * @param  {String}
 * @return {String}
 */

export function makePrefixedKey(key) {
  invariant(isString(key) && key.length > 1, 'expected `key` to be a non-empty string but got `%s`', key);
  return LOCAL_SETTINGS_PREFIX + key;
}
/**
 * Removes `key` from `storage`.
 *
 * @example
 * deleteFrom(localStorage, 'setting');
 *
 * @param  {Object}
 * @param  {String}
 * @return {void}
 */

export function deleteFrom(storage, key) {
  var addPrefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  try {
    delete storage[addPrefix ? makePrefixedKey(key) : key];
  } catch (error) {
    if (!enviro.isProd()) {
      // eslint-disable-next-line no-console
      console.error('Error: deleteFrom:', error);
    }
  }
}
/**
 * Retrieves `key` from `storage`.
 * Returns the result of JSON.parse'ing the string found in storage.
 * Returns `undefined` if storage access or JSON.parse fail.
 *
 * @example
 * getFrom(localStorage, 'setting') === true
 *
 * @param  {Object}
 * @param  {String}
 * @return {any}
 */

export function getFrom(storage, key) {
  var addPrefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  try {
    var entry = storage[addPrefix ? makePrefixedKey(key) : key];

    if (entry === undefined) {
      return entry;
    }

    return JSON.parse(entry);
  } catch (error) {
    if (!enviro.isProd()) {
      // eslint-disable-next-line no-console
      console.error('Error: getFrom:', error);
    }

    return undefined;
  }
}
/**
 * @deprecated This method can be removed once `getFromSafe`
 *             calls have been replaced with `getFrom` in
 *             all dependents.
 */

export var getFromSafe = getFrom;
export function getFromBatch(storage, keys) {
  var addPrefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return keys.reduce(function (results, key) {
    return results.set(key, getFrom(storage, key, addPrefix));
  }, ImmutableMap());
}
/**
 * Returns `true` if `key` is set in storage; otherwise `false`.
 *
 * @example
 * hasFrom(localStorage, 'setting'); //=> true
 * hasFrom(localStorage, 'unknown'); //=> false
 *
 * @param  {Object}
 * @param  {String}
 * @return {bool}
 */

export function hasFrom(storage, key) {
  var addPrefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  try {
    return Object.prototype.hasOwnProperty.call(storage, addPrefix ? makePrefixedKey(key) : key);
  } catch (error) {
    if (!enviro.isProd()) {
      // eslint-disable-next-line no-console
      console.error('Error: hasFrom:', error);
    }

    return undefined;
  }
}
/**
 * Adds `value` to `storage` at `key`.
 * JSON.stringify's `value` before writing to storage.
 * Returns `value` if set successfully; otherwise `undefined`.
 *
 * @example
 * setFrom(localStorage, 'setting', true);
 *
 * @param  {Object}
 * @param  {String}
 * @param  {any}
 * @return {any}
 */

export function setFrom(storage, key, value) {
  var addPrefix = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  try {
    storage[addPrefix ? makePrefixedKey(key) : key] = JSON.stringify(value);
    return value;
  } catch (error) {
    if (!enviro.isProd()) {
      // eslint-disable-next-line no-console
      console.error('Error: setFrom:', error);
    }

    return undefined;
  }
}
/**
 * @deprecated This method can be removed once `setFromSafe`
 *             calls have been replaced with `setFrom` in
 *             all dependents.
 */

export var setFromSafe = setFrom;