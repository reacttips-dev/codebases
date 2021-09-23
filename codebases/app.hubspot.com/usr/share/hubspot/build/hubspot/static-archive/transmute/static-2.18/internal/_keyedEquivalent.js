'use es6';

import { Collection, Map, Seq } from 'immutable';
import { keyedEquivalent } from './TransmuteCollection';

var makeObject = function makeObject() {
  return {};
};

keyedEquivalent.implement(Array, makeObject);
keyedEquivalent.implement(Object, makeObject);
keyedEquivalent.implementInherited(Collection, function () {
  return Map();
});
keyedEquivalent.implementInherited(Seq, function () {
  return Seq.Keyed();
});
export default keyedEquivalent;