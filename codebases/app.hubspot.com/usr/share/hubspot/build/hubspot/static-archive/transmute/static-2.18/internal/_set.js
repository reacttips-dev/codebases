'use es6';

import { Iterable, is } from 'immutable';
import { set } from './TransmuteCollection';
set.implement(Array, function (index, value, arr) {
  if (is(arr[index], value)) {
    return arr;
  }

  var next = arr.concat();
  next.splice(index, 1, value);
  return next;
});
set.implementInherited(Iterable, function (key, value, subject) {
  return subject.set(key, value);
});
set.implement(Object, function (key, value, obj) {
  if (is(obj[key], value)) {
    return obj;
  }

  var result = Object.assign({}, obj);
  result[key] = value;
  return result;
});
export default set;