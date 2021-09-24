'use es6';

import { Iterable } from 'immutable';
import { every } from './TransmuteCollection';
every.implement(Array, function (predicate, arr) {
  return arr.every(predicate);
});
every.implementInherited(Iterable, function (test, iter) {
  return iter.every(test);
});
every.implement(Object, function (predicate, obj) {
  var keys = Object.keys(obj);
  var len = keys.length;

  for (var i = 0; i < len; i++) {
    var key = keys[i];

    if (!predicate(obj[key], key, obj)) {
      return false;
    }
  }

  return true;
});
export default every;