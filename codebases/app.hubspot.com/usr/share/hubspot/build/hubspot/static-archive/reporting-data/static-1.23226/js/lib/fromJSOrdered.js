'use es6';

import { Seq, Iterable } from 'immutable';

var fromJSOrdered = function fromJSOrdered(object) {
  return Iterable.isIterable(object) || typeof object !== 'object' || object === null ? object : Array.isArray(object) ? Seq(object).map(fromJSOrdered).toList() : Seq(object).map(fromJSOrdered).toOrderedMap();
};

export default fromJSOrdered;