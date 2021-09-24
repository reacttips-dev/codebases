'use es6';

import { Iterable } from 'immutable';
import { map } from './TransmuteCollection';
map.implement(Array, function (mapper, arr) {
  return arr.map(mapper);
});
map.implementInherited(Iterable, function (mapper, iter) {
  return iter.map(mapper);
});
map.implement(Object, function (mapper, obj) {
  var result = {};
  var keys = Object.keys(obj);
  var len = keys.length;

  for (var i = 0; i < len; i++) {
    var key = keys[i];
    result[key] = mapper(obj[key], key, obj);
  }

  return result;
});
export default map;