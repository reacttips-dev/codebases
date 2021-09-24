'use es6';

import { Iterable } from 'immutable';
import { some } from './TransmuteCollection';
some.implement(Array, function (predicate, arr) {
  return arr.some(predicate);
});
some.implementInherited(Iterable, function (test, iter) {
  return iter.some(test);
});
some.implement(Object, function (predicate, obj) {
  var keys = Object.keys(obj);
  var len = keys.length;

  for (var i = 0; i < len; i++) {
    var key = keys[i];

    if (predicate(obj[key], key, obj)) {
      return true;
    }
  }

  return false;
});
export default some;