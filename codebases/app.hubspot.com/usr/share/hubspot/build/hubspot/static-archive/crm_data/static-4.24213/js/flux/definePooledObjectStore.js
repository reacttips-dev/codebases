'use es6';

import { defineLazyKeyStore } from '../store/LazyKeyStore';

function idIsValid(id) {
  return typeof id === 'string' || typeof id === 'number';
}

function idTransform(id) {
  return "" + id;
}

export function definePooledObjectStore(_ref) {
  var actionTypePrefix = _ref.actionTypePrefix;
  return defineLazyKeyStore({
    namespace: actionTypePrefix,
    idIsValid: idIsValid,
    idTransform: idTransform
  });
}