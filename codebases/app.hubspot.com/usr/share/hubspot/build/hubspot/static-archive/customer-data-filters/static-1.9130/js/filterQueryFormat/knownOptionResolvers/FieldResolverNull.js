'use es6';

import { makeReferenceResolver } from 'reference-resolvers/ReferenceResolver';
import emptyFunction from 'react-utils/emptyFunction';
import valueSeq from 'transmute/valueSeq';
export default makeReferenceResolver({
  all: function all(next) {
    next(valueSeq([]));
    return emptyFunction;
  },
  byId: function byId(id, next) {
    next();
    return emptyFunction;
  }
});