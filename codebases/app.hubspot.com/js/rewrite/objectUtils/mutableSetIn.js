'use es6';

import has from 'transmute/has';
import curry from 'transmute/curry';
export var mutableSetIn = curry(function (keyPath, value, obj) {
  keyPath.reduce(function (nestedObj, key, index) {
    if (index === keyPath.length - 1) {
      nestedObj[key] = value;
    } else if (!has(key, nestedObj)) {
      nestedObj[key] = {};
    }

    return nestedObj[key];
  }, obj);
});