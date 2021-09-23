'use es6';

import { Iterable, Map, Record } from 'immutable';
import { filter } from './TransmuteCollection';
filter.implement(Array, function (test, arr) {
  return arr.filter(test);
});
filter.implementInherited(Iterable, function (test, iter) {
  return iter.filter(test);
});
filter.implement(Object, function (test, obj) {
  var result = {};
  var keys = Object.keys(obj);
  var len = keys.length;

  for (var i = 0; i < len; i++) {
    var key = keys[i];
    var val = obj[key];

    if (test(val, key, obj)) {
      result[key] = val;
    }
  }

  return result;
});
filter.implementInherited(Record, function (test, rec) {
  return rec.reduce(function (acc, val, key) {
    if (!test(val, key, rec)) {
      return acc;
    }

    return acc.set(key, val);
  }, Map());
});
export default filter;