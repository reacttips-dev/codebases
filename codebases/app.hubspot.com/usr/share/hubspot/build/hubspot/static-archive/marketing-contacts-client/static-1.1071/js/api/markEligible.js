'use es6';

import BatchMutateAPI from './BatchMutateAPI';
export default (function (_ref) {
  var query = _ref.query,
      applyToAll = _ref.applyToAll,
      expectedNumberObjectsModified = _ref.expectedNumberObjectsModified,
      source = _ref.source;
  return BatchMutateAPI.post({
    query: query,
    applyToAll: applyToAll,
    expectedNumberObjectsModified: expectedNumberObjectsModified,
    marketableStatusType: 'MARKETABLE',
    source: source
  });
});