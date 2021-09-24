'use es6';

import { registerLazyKeyService } from '../store/LazyKeyStore';

function idIsValid(id) {
  return typeof id === 'string' || typeof id === 'number';
}

function idTransform(id) {
  return "" + id;
}

export default function registerPooledObjectService(_ref) {
  var actionTypePrefix = _ref.actionTypePrefix,
      fetcher = _ref.fetcher,
      fetchLimit = _ref.fetchLimit;
  return registerLazyKeyService({
    namespace: actionTypePrefix,
    fetch: fetcher,
    idIsValid: idIsValid,
    idTransform: idTransform,
    fetchLimit: fetchLimit
  });
}