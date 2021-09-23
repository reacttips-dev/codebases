'use es6';

import { toFetchFailedError, toInvalidIdError, toObjectNotFoundError, toSearchFailedError } from '../Errors';
import { Promise } from 'hub-http/helpers/promise';
import chunk from '../lib/chunk';
import debounce from 'react-utils/debounce';
import flatten from '../lib/flatten';
import indexBy from '../lib/indexBy';

var makeCacheEntry = function makeCacheEntry() {
  var entry = {};
  entry.promise = new Promise(function (resolve, reject) {
    entry.resolve = resolve;
    entry.reject = reject;
  });
  return entry;
};

var indexIds = indexBy(String);
export var createPendingResolutionCache = function createPendingResolutionCache() {
  return {
    idQueue: [],
    pending: {}
  };
};
export var resolveSimpleReferences = function resolveSimpleReferences(fetchAll) {
  return function (selector) {
    return fetchAll().then(selector, function (error) {
      return Promise.reject(toFetchFailedError(error));
    });
  };
};
export var resolveBatchFetchedReferences = function resolveBatchFetchedReferences(_ref) {
  var debouncePeriod = _ref.debouncePeriod,
      fetchByIds = _ref.fetchByIds,
      isIdValid = _ref.isIdValid,
      maxBatchSize = _ref.maxBatchSize,
      resolutionCache = _ref.resolutionCache;
  var makeBatchedIdRequest = debounce(function () {
    var ids = resolutionCache.idQueue;
    resolutionCache.idQueue = [];
    var idChunks = chunk(ids, maxBatchSize);
    Promise.all(idChunks.map(function (idChunk) {
      return fetchByIds(idChunk);
    })).then(flatten).then(function (results) {
      var idMap = indexIds(ids);
      results.forEach(function (reference) {
        var id = String(reference.id);
        resolutionCache.pending[id].resolve(reference);
        delete resolutionCache.pending[id];
        delete idMap[id];
      });
      var missing = Object.keys(idMap);
      missing.forEach(function (id) {
        resolutionCache.pending[id].reject(toObjectNotFoundError(id));
        delete resolutionCache.pending[id];
      });
    }, function (error) {
      ids.forEach(function (id) {
        var idStr = String(id);
        resolutionCache.pending[idStr].reject(toFetchFailedError(error));
        delete resolutionCache.pending[idStr];
      });
    });
  }, debouncePeriod);
  return function (id) {
    if (!isIdValid(id)) {
      return Promise.reject(toInvalidIdError(id));
    }

    var idStr = String(id);

    if (resolutionCache.pending[idStr]) {
      return resolutionCache.pending[idStr].promise;
    }

    resolutionCache.pending[idStr] = makeCacheEntry();
    resolutionCache.idQueue.push(id);
    makeBatchedIdRequest();
    return resolutionCache.pending[idStr].promise;
  };
};
export var resolveSearchedReferences = function resolveSearchedReferences(search) {
  return function (query) {
    return search(query).catch(function (error) {
      return Promise.reject(toSearchFailedError(error));
    });
  };
};