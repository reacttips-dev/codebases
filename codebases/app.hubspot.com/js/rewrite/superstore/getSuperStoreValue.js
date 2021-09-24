'use es6';

import { getSuperStoreInstance } from './getSuperStoreInstance';
export var getSuperStoreValue = function getSuperStoreValue(key) {
  return getSuperStoreInstance().then(function (store) {
    return store.get(key);
  });
};