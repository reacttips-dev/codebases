// Use of restricted syntax (window.localStorage) is intentional.
/* eslint-disable no-restricted-syntax */
import Raven from 'raven-js';

const isAvailable = (function () {
  let isAvailable0: boolean | undefined;

  // Lesser used browsers have strange fallback behaviours when localStorage isn't available, so we'll feature detect it
  // by trying to use it and verifying that it works instead of checking if it has the right shape.

  function isAvailableImpl() {
    try {
      if (typeof window.localStorage === 'undefined' || window.localStorage === null) {
        return false;
      }
      const key = '__localStorageEx__';
      const expected = String(Date.now());
      window.localStorage.setItem(key, expected);
      const actual = window.localStorage.getItem(key);
      window.localStorage.removeItem(key);
      return actual === expected;
    } catch (_) {
      return false;
    }
  }

  return function isAvailableMemo() {
    if (isAvailable0 == null) {
      isAvailable0 = isAvailableImpl();
    }
    return isAvailable0;
  };
})();

type ReviverFunc<T> = (item: string) => T;

type SerializeFunc<T> = (value: T) => string;

const IgnoredMessages = new Set([
  "Cannot read property 'getItem' of null",
  "Cannot read property 'setItem' of null",
  "Cannot read property 'removeItem' of null",
  "Cannot read property 'localStorage' of null",
  'window.localStorage is null',
]);

/**
 * Gets an item from localStorage.
 *
 * @template T Value type.
 * @param key Key to store at.
 * @param deserializeFunc Converts the item from {@link String} to {@link T}, e.g. {@link JSON.parse} or {@link String}.
 * @param valueIfNotFound Value to return if no item exists.
 * @param valueIfNotAvailable Value to return if localStorage is not available. Defaults to {@link valueIfNotFound}.
 * @param valueIfNotDeserialized Value to return if conversion from {@link String} to {@link T} fails. Default to {@link valueIfNotFound}.
 * @returns Stored value or the appropriate default value.
 */
function getItem<T>(
  key: string,
  deserializeFunc: ReviverFunc<T>,
  valueIfNotFound: T,
  valueIfNotAvailable: T = valueIfNotFound,
  valueIfNotDeserialized: T = valueIfNotFound
): T {
  if (!isAvailable()) {
    return valueIfNotAvailable;
  }

  let item: string | null;

  try {
    item = window.localStorage.getItem(key);
  } catch (err) {
    if (!IgnoredMessages.has(err?.message)) {
      Raven.captureException(err);
    }
    return valueIfNotAvailable;
  }

  if (item == null) {
    return valueIfNotFound;
  }

  try {
    return deserializeFunc(item);
  } catch (err) {
    if (!IgnoredMessages.has(err?.message)) {
      Raven.captureException(err);
    }
    return valueIfNotDeserialized;
  }
}

/**
 * Removes an item from localStorage.
 *
 * @param key Key to remove at.
 */
function removeItem(key: string) {
  if (!isAvailable()) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch (err) {
    // Not much we can do about this.
    if (!IgnoredMessages.has(err?.message)) {
      Raven.captureException(err);
    }
  }
}

/**
 * Stores an item to localStorage.
 *
 * @template T Value type.
 * @param key Key to store at.
 * @param value Value to store.
 * @param serializeFunc Converts the value from {@link T} to {@link string}, e.g. {@link JSON.stringify} or {@link String}.
 * @param removeIfQuotaExceeded When true, the item at the key is removed if storing exceeds the quota. Defaults to true.
 */
function setItem<T>(key: string, value: T, serializeFunc: SerializeFunc<T>, removeIfQuotaExceeded = true) {
  if (!isAvailable()) {
    return;
  }

  const item = serializeFunc(value);

  try {
    window.localStorage.setItem(key, item);
  } catch (err) {
    const isQuotaExceeded =
      err instanceof DOMException &&
      (err.name === 'QuotaExceededError' || err.name === 'QUOTA_EXCEEDED_ERR' || err.code === 22);
    if (isQuotaExceeded) {
      if (removeIfQuotaExceeded) {
        removeItem(key);
      }
    } else if (!IgnoredMessages.has(err?.message)) {
      Raven.captureException(err);
    }
  }
}

export default {
  getItem,
  setItem,
  removeItem,
  isAvailable,
};
