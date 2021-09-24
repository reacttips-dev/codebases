'use es6';

import { Iterable, Seq } from 'immutable';
import { sortBy } from './TransmuteCollection';
sortBy.implement(Array, function (getSortValue, arr) {
  return Seq(arr).sortBy(getSortValue).toArray();
});
sortBy.implementInherited(Iterable, function (getSortValue, subject) {
  return subject.sortBy(getSortValue);
});
sortBy.implement(Object, function (getSortValue, obj) {
  return Seq(obj).sortBy(getSortValue).toObject();
});
export default sortBy;