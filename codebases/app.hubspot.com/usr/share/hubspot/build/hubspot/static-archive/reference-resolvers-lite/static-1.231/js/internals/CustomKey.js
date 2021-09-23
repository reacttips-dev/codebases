'use es6';

export var createCustomKey = function createCustomKey(key, objectTypeId) {
  return key + "_" + objectTypeId;
};
export var toQueryKey = function toQueryKey(referenceType, objectTypeId) {
  return objectTypeId && referenceType !== objectTypeId ? createCustomKey(referenceType, objectTypeId) : referenceType;
};