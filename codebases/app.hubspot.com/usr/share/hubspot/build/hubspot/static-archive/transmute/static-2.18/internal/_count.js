'use es6';

import { count } from './TransmuteCollection';
import { Iterable } from 'immutable';
count.implement(Array, function (arr) {
  return arr.length;
});
count.implementInherited(Iterable, function (subject) {
  return subject.count();
});
count.implement(Object, function (obj) {
  return Object.keys(obj).length;
});
count.implement(String, function (str) {
  return str.length;
});
count.implement(Number, function (num) {
  return num;
});
export default count;