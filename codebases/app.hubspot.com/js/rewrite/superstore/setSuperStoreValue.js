'use es6';

import { getSuperStoreInstance } from './getSuperStoreInstance';
export var setSuperStoreValue = function setSuperStoreValue(key, value) {
  return getSuperStoreInstance().then(function (store) {
    return store.set(key, value);
  });
};