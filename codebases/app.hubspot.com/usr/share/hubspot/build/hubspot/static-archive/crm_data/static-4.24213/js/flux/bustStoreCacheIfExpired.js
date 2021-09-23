'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
var EXPIRATION = 300000; // 5 minutes

import makeExpiration from '../timing/makeExpiration';
export default function bustStoreCacheIfExpired() {
  var isExpired = makeExpiration(EXPIRATION);
  return function deref(props, state, _ref) {
    var _ref2 = _slicedToArray(_ref, 1),
        store = _ref2[0];

    return store.get(!isExpired());
  };
}