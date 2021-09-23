/* eslint-disable no-unsafe-finally */
'use es6';

import { fromJS } from 'immutable';
/**
 * The backend enforces a character limit each value.
 */

export var MAX_DATA_LENGTH = 1000;
export function encodeSettingsValue(value) {
  try {
    // Did you know? Immutable objects support being stringified.
    value = JSON.stringify(value);
  } finally {
    var length = typeof value === 'string' ? value.length : 0;

    if (length > MAX_DATA_LENGTH) {
      var error = new Error("Expected encodedValue.length to be less than " + MAX_DATA_LENGTH);
      throw error;
    }

    return value;
  }
}
export function decodeSettingsValue(value) {
  if (value === null || value === undefined || typeof value === 'undefined') {
    return null;
  } else if (value === 'undefined') {
    return 'undefined';
  }

  try {
    value = JSON.parse(value);
  } finally {
    return fromJS(value);
  }
}