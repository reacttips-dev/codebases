'use es6';

export var getRecentlyUsedPropertiesSuperStoreKey = function getRecentlyUsedPropertiesSuperStoreKey(objectTypeId) {
  return objectTypeId + ":recently-used-properties";
};