'use es6';

import identity from '../lib/identity';
import indexBy from 'reference-resolvers-lite/lib/indexBy';
export var NoCacheProvider = function NoCacheProvider() {
  return identity;
};
export var DefaultSimpleCacheProvider = function DefaultSimpleCacheProvider(_ref) {
  var getId = _ref.getId;
  return function (_ref2) {
    var _all = _ref2.all;
    var cache = null;
    var api = {
      byId: function byId(id) {
        if (cache && cache[id]) {
          return Promise.resolve(cache[id]);
        }

        return api.all().then(function () {
          return cache[id];
        });
      },
      all: function all() {
        if (cache) {
          return Promise.resolve(Object.values(cache));
        }

        return _all().then(function (references) {
          cache = indexBy(getId)(references);
          return references;
        });
      },
      refreshCache: function refreshCache() {
        cache = null;
        return api.all();
      }
    };
    return api;
  };
};
export var DefaultBatchedCacheProvider = function DefaultBatchedCacheProvider() {
  return function (_ref3) {
    var byId = _ref3.byId,
        search = _ref3.search;
    var cache = {};
    var api = {
      search: search
    };

    if (byId) {
      api.byId = function (id) {
        if (cache[id]) {
          return Promise.resolve(cache[id]);
        }

        return byId(id).then(function (reference) {
          cache[id] = reference;
          return reference;
        });
      };
    }

    if (byId || search) {
      api.refreshCache = function (id) {
        delete cache[id];
        return api.byId(id);
      };
    }

    return api;
  };
};