'use es6';

import curry from 'transmute/curry';
import { STATUS } from '../constants/KeyPaths';
export var setStatus = curry(function (status, thread) {
  return thread.setIn(STATUS, status);
});