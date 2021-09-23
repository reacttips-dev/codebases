'use es6';

import { Iterable } from 'immutable';
import { has } from './TransmuteCollection';
has.implement(Array, function (key, arr) {
  return arr.hasOwnProperty(key);
});
has.implementInherited(Iterable, function (key, subject) {
  return subject.has(key);
});
has.implement(Object, function (key, obj) {
  return obj.hasOwnProperty(key);
});
export default has;