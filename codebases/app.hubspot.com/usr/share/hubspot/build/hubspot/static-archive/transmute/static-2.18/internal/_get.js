'use es6';

import { get } from './TransmuteCollection';
import { Iterable } from 'immutable';

var empty = function empty() {
  return undefined;
};

get.implement(null, empty);
get.implement(undefined, empty);
get.implementInherited(Iterable, function (key, subject) {
  return subject.get(key);
});
export default get;