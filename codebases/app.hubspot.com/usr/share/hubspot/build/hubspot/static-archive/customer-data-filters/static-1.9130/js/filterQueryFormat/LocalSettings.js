'use es6';

import enviro from 'enviro';
import invariant from 'react-utils/invariant';
import isString from 'transmute/isString';
export var LOCAL_SETTINGS_PREFIX = 'LocalSettings:CustomerDataFilters:';
export function makePrefixedKey(key) {
  invariant(isString(key) && key.length > 1, 'expected `key` to be a non-empty string but got `%s`', key);
  return LOCAL_SETTINGS_PREFIX + key;
}
export function getFrom(storage, key) {
  try {
    var entry = storage[makePrefixedKey(key)];

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
export function setFrom(storage, key, value) {
  try {
    storage[makePrefixedKey(key)] = JSON.stringify(value);
    return value;
  } catch (error) {
    if (!enviro.isProd()) {
      // eslint-disable-next-line no-console
      console.error('Error: setFrom:', error);
    }

    return undefined;
  }
}