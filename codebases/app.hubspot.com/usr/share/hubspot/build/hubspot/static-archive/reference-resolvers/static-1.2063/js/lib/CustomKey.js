'use es6';

import memoize from 'transmute/memoize';
export var createCustomKey = memoize(function (key, objectTypeId) {
  return key + "_" + objectTypeId;
});