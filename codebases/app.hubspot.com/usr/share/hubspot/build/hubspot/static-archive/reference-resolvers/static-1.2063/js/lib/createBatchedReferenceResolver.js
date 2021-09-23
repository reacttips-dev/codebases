'use es6';

import { makeReferenceResolver } from 'reference-resolvers/ReferenceResolver';
import ResolverLoading from 'reference-resolvers/schema/ResolverLoading';
import ResolverError from 'reference-resolvers/schema/ResolverError';
import { Set as ImmutableSet, Map as ImmutableMap, Range } from 'immutable';
import debounce from 'transmute/debounce';
import updateIn from 'transmute/updateIn';
import curry from 'transmute/curry';
import hasIn from 'transmute/hasIn';
import isArray from 'transmute/isArray';
import isEmpty from 'transmute/isEmpty';
import always from 'transmute/always';
import indexBy from 'transmute/indexBy';
import identity from 'transmute/identity';
import merge from 'transmute/merge';
import get from 'transmute/get';
import ifThen from 'transmute/ifThen';
import pipe from 'transmute/pipe';
import setIn from 'transmute/setIn';
import filterNot from 'transmute/filterNot';
import { swap, deref, watch, unwatch } from 'atom';
import invariant from 'react-utils/invariant';

var chunk = function chunk(collection, size) {
  return Range(0, collection.count(), size).map(function (start) {
    return collection.slice(start, start + size);
  });
};

var not = curry(function (test, subject) {
  return !test(subject);
});

var toIdsSet = function toIdsSet() {
  var ids = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  if (!isArray(ids)) {
    ids = [ids];
  }

  return ImmutableSet(ids.map(String));
};

var createCache = function createCache(atom) {
  swap(atom, ifThen(isEmpty, always(ImmutableMap({
    idQueue: ImmutableSet(),
    objects: ImmutableMap(),
    startDates: ImmutableMap()
  }))));
  return {
    queueId: function queueId(id) {
      swap(atom, ifThen(not(hasIn(['objects', id])), pipe(updateIn(['idQueue'], function (queue) {
        return queue.add(id);
      }), setIn(['startDates', id], Date.now()))));
    },
    getQueue: function getQueue() {
      var queue = deref(atom).get('idQueue');
      return queue;
    },
    loadingData: function loadingData(ids) {
      var newObjects = indexBy(identity, ids).map(function () {
        return ImmutableMap({
          loading: true,
          reference: null
        });
      });
      swap(atom, function (state) {
        return state.update('objects', merge(newObjects)).update('idQueue', function (queue) {
          return queue.subtract(ids);
        });
      });
    },
    loadingDataFailed: function loadingDataFailed(ids, e) {
      var newObjects = indexBy(identity, ids).map(function () {
        return ImmutableMap({
          loading: false,
          error: e,
          reference: null
        });
      });
      swap(atom, pipe(updateIn(['objects'], merge(newObjects)), updateIn(['startDates'], filterNot(function (_, id) {
        return ids.contains(id);
      }))));
    },
    loadedData: function loadedData(ids, references) {
      var newObjects = indexBy(get('id'), references).map(function (reference) {
        return ImmutableMap({
          loading: false,
          reference: reference
        });
      });
      var missing = indexBy(identity, ids.filter(function (id) {
        return !newObjects.has(id);
      })).map(function () {
        return ImmutableMap({
          loading: false,
          reference: null
        });
      });
      swap(atom, pipe(updateIn(['objects'], merge(newObjects.merge(missing))), updateIn(['startDates'], filterNot(function (_, id) {
        return ids.contains(id);
      }))));
    },
    listen: function listen(onUpdate) {
      watch(atom, onUpdate);
      onUpdate(deref(atom));
      return function () {
        unwatch(atom, onUpdate);
      };
    },
    evict: function evict(ids) {
      if (ids.isEmpty()) {
        ids = deref(atom).get('objects').keySeq();
      }

      swap(atom, updateIn(['objects'], filterNot(function (object, id) {
        return !object.get('loading') && ids.contains(id);
      })));
    }
  };
};

var createBatchedReferenceResolver = function createBatchedReferenceResolver(_ref) {
  var cacheKey = _ref.cacheKey,
      createFetchSearchPage = _ref.createFetchSearchPage,
      createFetchByIds = _ref.createFetchByIds,
      fetchSearchPage = _ref.fetchSearchPage,
      fetchByIds = _ref.fetchByIds,
      httpClient = _ref.httpClient,
      _ref$debouncePeriod = _ref.debouncePeriod,
      debouncePeriod = _ref$debouncePeriod === void 0 ? 500 : _ref$debouncePeriod,
      _ref$maxBatchSize = _ref.maxBatchSize,
      maxBatchSize = _ref$maxBatchSize === void 0 ? 500 : _ref$maxBatchSize,
      _ref$idIsValid = _ref.idIsValid,
      idIsValid = _ref$idIsValid === void 0 ? function () {
    return true;
  } : _ref$idIsValid;
  invariant(cacheKey && typeof cacheKey === 'string', 'expected `cacheKey` to be a non-empty string');

  if (httpClient) {
    invariant(!!(createFetchSearchPage || createFetchByIds), 'createFetchSearchPage or createFetchByIds factory function not provided for supplied httpClient for batched resolver');
    fetchSearchPage = createFetchSearchPage && createFetchSearchPage({
      httpClient: httpClient
    });
    fetchByIds = createFetchByIds && createFetchByIds({
      httpClient: httpClient
    });
  }

  return function (getCacheAtom) {
    var cache = createCache(getCacheAtom(cacheKey));
    var makeBatchedIdRequest = debounce(debouncePeriod, function () {
      var ids = cache.getQueue();

      if (ids.size > 0) {
        cache.loadingData(ids);
        var chunks = chunk(ids, maxBatchSize);
        chunks.forEach(function (chunkIds) {
          fetchByIds(chunkIds.toArray()).then(function (results) {
            return cache.loadedData(chunkIds, results);
          }, function (e) {
            cache.loadingDataFailed(chunkIds, e);
          });
        });
      }
    });

    var queueIdFetch = function queueIdFetch(id) {
      cache.queueId(id);
      makeBatchedIdRequest();
    };

    return makeReferenceResolver({
      byId: function byId(id, next) {
        return cache.listen(function (state) {
          if (!idIsValid(id)) {
            return;
          }

          var object = state.getIn(['objects', id]);
          var queued = state.hasIn(['idQueue', id]);

          if (object == null && !queued) {
            queueIdFetch(id);
          } else if (object == null || object && object.get('loading')) {
            var startDate = state.getIn(['startDates', id]);
            next(ResolverLoading({
              startDate: startDate
            }));
          } else if (object.get('error')) {
            next(ResolverError({
              reason: object.get('error')
            }));
          } else if (!object.get('loading')) {
            next(object.get('reference'));
          }
        });
      },
      search: function search(query, next) {
        next(ResolverLoading({
          startDate: Date.now()
        }));
        fetchSearchPage(query).then(next).catch(function (e) {
          return next(ResolverError({
            reason: e
          }));
        });
        return function () {};
      },
      refreshCache: function refreshCache(ids) {
        cache.evict(toIdsSet(ids));
      }
    }, "BatchedReferenceResolver_" + cacheKey);
  };
};

export default createBatchedReferenceResolver;