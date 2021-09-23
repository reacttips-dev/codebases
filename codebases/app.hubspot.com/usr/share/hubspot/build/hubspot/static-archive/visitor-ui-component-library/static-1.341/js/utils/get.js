'use es6';

import { curryable } from './curryable';
export var get = curryable(function (key, data) {
  return data[key];
});