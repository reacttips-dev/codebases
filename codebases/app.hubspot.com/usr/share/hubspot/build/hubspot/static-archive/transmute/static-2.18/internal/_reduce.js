'use es6';

import { Iterable } from 'immutable';
import { reduce } from './TransmuteCollection';
reduce.implement(Array, function (into, operation, arr) {
  return arr.reduce(operation, into);
});
reduce.implement(Object, function (into, operation, obj) {
  var keys = Object.keys(obj);
  var len = keys.length;
  var acc = into;

  for (var i = 0; i < len; i++) {
    var key = keys[i];
    acc = operation(acc, obj[key], key, obj);
  }

  return acc;
});
reduce.implementInherited(Iterable, function (into, operation, iter) {
  return iter.reduce(operation, into);
});
export default reduce;