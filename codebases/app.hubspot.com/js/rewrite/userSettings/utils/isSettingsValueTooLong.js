'use es6';

import { MAX_DATA_LENGTH } from '../constants/MaxDataLength';
export var isSettingsValueTooLong = function isSettingsValueTooLong(value) {
  return value.length > MAX_DATA_LENGTH;
};