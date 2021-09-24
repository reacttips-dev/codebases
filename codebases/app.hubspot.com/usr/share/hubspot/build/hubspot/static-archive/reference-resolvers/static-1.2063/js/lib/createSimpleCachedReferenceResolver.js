'use es6';

import { makeReferenceResolver } from 'reference-resolvers/ReferenceResolver';
import ResolverLoading from 'reference-resolvers/schema/ResolverLoading';
import ResolverError from 'reference-resolvers/schema/ResolverError';
import { reset, swap, watch, unwatch, deref } from 'atom';
import { Map as ImmutableMap } from 'immutable';
import identity from 'transmute/identity';
import invariant from 'react-utils/invariant';
var initialCacheState = ImmutableMap({
  loading: false,
  loaded: false
});

var createCache = function createCache(atom) {
  swap(atom, function (cache) {
    return cache != null ? cache : initialCacheState;
  });
  return {
    setLoading: function setLoading() {
      reset(atom, ImmutableMap({
        loading: Date.now(),
        loaded: false
      }));
    },
    setError: function setError(error) {
      reset(atom, ImmutableMap({
        loading: false,
        loaded: false,
        error: error
      }));
    },
    setLoadedData: function setLoadedData(data) {
      reset(atom, ImmutableMap({
        loading: false,
        loaded: true,
        data: data
      }));
    },
    listen: function listen(onUpdate) {
      watch(atom, onUpdate);
      onUpdate(deref(atom));
      return function () {
        unwatch(atom, onUpdate);
      };
    },
    evict: function evict() {
      if (!deref(atom).get('loading')) {
        reset(atom, initialCacheState);
      }
    }
  };
};

var createSimpleCachedReferenceResolver = function createSimpleCachedReferenceResolver(_ref) {
  var cacheKey = _ref.cacheKey,
      createFetchData = _ref.createFetchData,
      fetchData = _ref.fetchData,
      httpClient = _ref.httpClient,
      _ref$selectReferences = _ref.selectReferences,
      selectReferences = _ref$selectReferences === void 0 ? identity : _ref$selectReferences,
      _ref$selectReferences2 = _ref.selectReferencesById,
      selectReferencesById = _ref$selectReferences2 === void 0 ? selectReferences : _ref$selectReferences2,
      _ref$selectAllReferen = _ref.selectAllReferences,
      selectAllReferences = _ref$selectAllReferen === void 0 ? selectReferences : _ref$selectAllReferen;
  invariant(cacheKey && typeof cacheKey === 'string', 'expected `cacheKey` to be a non-empty string');

  if (httpClient) {
    invariant(!!createFetchData, 'createFetchData factory function not provided for supplied httpClient for simple resolver');
    fetchData = createFetchData({
      httpClient: httpClient
    });
  }

  return function (getCacheAtom) {
    var cache = createCache(getCacheAtom(cacheKey));

    var resolveReferences = function resolveReferences(next, selector, resolve) {
      return cache.listen(function (state) {
        if (state.get('loading')) {
          next(ResolverLoading({
            startDate: state.get('loading')
          }));
        } else if (state.get('error')) {
          next(ResolverError({
            reason: state.get('error')
          }));
        } else if (state.get('loaded')) {
          var refs = selector(state.get('data'));
          resolve(refs);
        } else {
          cache.setLoading();
          fetchData().then(cache.setLoadedData).catch(cache.setError);
        }
      });
    };

    return makeReferenceResolver({
      byId: function byId(id, next) {
        return resolveReferences(next, selectReferencesById, function (refs) {
          return next(refs.get(id));
        });
      },
      all: function all(next) {
        return resolveReferences(next, selectAllReferences, function (refs) {
          return next(refs.valueSeq());
        });
      },
      refreshCache: function refreshCache() {
        cache.evict();
      }
    }, "SimpleCachedReferenceResolver_" + cacheKey);
  };
};

export default createSimpleCachedReferenceResolver;