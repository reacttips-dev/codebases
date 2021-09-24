'use es6';

import { logCallingError } from 'calling-error-reporting/report/error';
export var LOCAL_SETTINGS_PREFIX = 'LocalSettings:Calling:';

function getPrefixedKey(key, prefix) {
  return "" + prefix + key;
}

export function deleteSetting(key, prefix) {
  if (!window.localStorage) {
    return;
  }

  try {
    window.localStorage.removeItem(getPrefixedKey(key, prefix));
  } catch (error) {
    logCallingError({
      errorMessage: 'Removing item from localstorage failed',
      extraData: {
        error: error
      }
    });
  }
}
export function setSetting(key, value) {
  var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : LOCAL_SETTINGS_PREFIX;

  if (!window.localStorage) {
    return undefined;
  }

  try {
    if (typeof value === 'string') {
      window.localStorage.setItem(getPrefixedKey(key, prefix), value);
    } else {
      window.localStorage.setItem(getPrefixedKey(key, prefix), JSON.stringify(value));
    }

    return value;
  } catch (error) {
    logCallingError({
      errorMessage: 'Setting LocalStorage value failed',
      extraData: {
        error: error
      }
    });
    return undefined;
  }
}
export function getSetting(key, fallback, parser) {
  var prefix = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : LOCAL_SETTINGS_PREFIX;

  if (!window.localStorage) {
    return fallback;
  }

  try {
    var entry = window.localStorage.getItem(getPrefixedKey(key, prefix));

    if (!entry) {
      if (fallback) {
        setSetting(key, fallback);
      }

      return fallback;
    } else if (entry.startsWith('{')) {
      var result = JSON.parse(entry);
      return typeof parser === 'function' ? parser(result) : result;
    } else if (entry === 'null' || entry === 'undefined') {
      setSetting(key, fallback);
      return fallback;
    }

    return entry;
  } catch (error) {
    setSetting(key, fallback);
    logCallingError({
      errorMessage: 'Parsing LocalStorage value failed',
      extraData: {
        error: error
      }
    });
    return fallback;
  }
}