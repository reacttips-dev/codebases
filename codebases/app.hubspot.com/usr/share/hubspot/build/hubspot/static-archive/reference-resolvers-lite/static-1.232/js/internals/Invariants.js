'use es6';

import invariant from 'react-utils/invariant';
export var verifyReferenceType = function verifyReferenceType(referenceType) {
  return invariant(referenceType && typeof referenceType === 'string', 'expected `referenceType` to be a non-empty string');
};
export var verifyFetchedObjectAccessors = function verifyFetchedObjectAccessors(_ref) {
  var getId = _ref.getId,
      getLabel = _ref.getLabel;
  invariant(typeof getId === 'function', 'expected fetchedObjectAccessors.getId to be a function');
  invariant(typeof getLabel === 'function', 'expected fetchedObjectAccessors.getLabel to be a function');
};
export var verifyQueryKey = function verifyQueryKey(key, objectTypeId) {
  return invariant(key === objectTypeId, 'query key does not match resolver objectTypeId');
};
export var verifyFetchFn = function verifyFetchFn(fn) {
  return invariant(!!fn, 'fetch api function not present in resolver');
};
export var verifySearchFn = function verifySearchFn(fn) {
  return invariant(!!fn, 'search api function not present in resolver');
};