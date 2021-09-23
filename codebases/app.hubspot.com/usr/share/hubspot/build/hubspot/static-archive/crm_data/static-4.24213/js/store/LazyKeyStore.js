'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { SUCCEEDED } from '../actions/ActionSteps';
import { DELETE, FETCH, REFRESH } from '../actions/ActionVerbs';
import { dispatchImmediate, dispatchQueue } from '../dispatch/Dispatch';
import { makeAsyncActionType, makeAsyncActionTypes, makeAction } from '../actions/MakeActions';
import enviro from 'enviro';
import { defineFactory } from 'general-store';
import identity from 'transmute/identity';
import { fromJS, is, Iterable, Map as ImmutableMap, Record, Seq, Set as ImmutableSet } from 'immutable';
import invariant from 'react-utils/invariant';
import registerService from '../flux/registerService';
import devLogger from 'react-utils/devLogger';
import { getSuperstoreClient } from './getSuperstoreClient';
import { getSuperstoreKey } from './getSuperstoreKey';
export var LazyKeyServiceState = Record({
  pending: ImmutableSet(),
  queue: ImmutableSet()
}, 'LazyKeyServiceState');

function isIterable(ids) {
  return Iterable.isIterable(ids) || Array.isArray(ids);
}

function baseFillUnfoundKeys(idTransform, keys, result) {
  // if any keys are missing we fill them with null so
  // we know they don't exist
  return keys.reduce(function (filled, key) {
    return filled.set(idTransform(key), result.get(key) || null);
  }, ImmutableMap());
}

function enforceId(idIsValid, namespace, id) {
  invariant(idIsValid(id), '`%s` expected `idIsValid` to return true for id: `%s`', namespace, JSON.stringify(id));
  return id;
}

function baseNormalizeIds(idIsValid, idTransform, namespace, ids) {
  if (idIsValid(ids)) {
    return Seq.of(idTransform(ids));
  }

  invariant(isIterable(ids), '`%s` expected `ids` to be an `Iterable` or an `Array` but got `%s`', namespace, ids);
  return Seq(ids).map(enforceId.bind(null, idIsValid, namespace)).map(idTransform);
}

export function defineLazyKeyStore(_ref) {
  var namespace = _ref.namespace,
      _ref$getInitialState = _ref.getInitialState,
      getInitialState = _ref$getInitialState === void 0 ? ImmutableMap : _ref$getInitialState,
      idIsValid = _ref.idIsValid,
      _ref$idTransform = _ref.idTransform,
      idTransform = _ref$idTransform === void 0 ? identity : _ref$idTransform,
      _ref$serializeData = _ref.serializeData,
      serializeData = _ref$serializeData === void 0 ? function (collection) {
    return collection && collection.toJS ? collection.toJS() : collection;
  } : _ref$serializeData,
      _ref$responseTransfor = _ref.responseTransform,
      responseTransform = _ref$responseTransfor === void 0 ? identity : _ref$responseTransfor,
      _ref$unstable_enableC = _ref.unstable_enableCache,
      enableCache = _ref$unstable_enableC === void 0 ? false : _ref$unstable_enableC;
  invariant(typeof idIsValid === 'function', 'expected `idIsValid` to be a function but got `%s`', idIsValid);
  var FetchTypes = makeAsyncActionTypes(namespace, FETCH);
  var DELETE_SUCCEEDED = makeAsyncActionType(namespace, DELETE, SUCCEEDED);
  var UPDATED = namespace + "_UPDATED";
  var CLEARED = makeAction(namespace, 'CLEARED');
  var normalizeIds = baseNormalizeIds.bind(null, idIsValid, idTransform, namespace);
  return defineFactory().defineName(namespace + "_LazyKeyStore").defineGetInitialState(getInitialState).defineGet(function (state, ids) {
    if (ids === undefined) {
      if (!enviro.deployed() || enviro.getShort() !== 'prod') {
        var warningInfo = {
          message: "Calling LazyKeyStore.get() with no arguments is a debugging feature. It isn't safe for production!",
          url: 'https://git.hubteam.com/HubSpot/CRM/pull/4291',
          key: 'LazyKeyStore:getWarning'
        };
        devLogger.warn(warningInfo);
      }

      return state;
    }

    var idList = normalizeIds(ids);

    if (idList.isEmpty()) {
      return ids;
    }

    var missing = Seq(idList).filterNot(function (id) {
      return state.has(id);
    }).toSet();

    if (!missing.isEmpty()) {
      // sends the missing ids to the LazyKeyService to be fetched
      dispatchQueue(FetchTypes.QUEUED, missing).done();
    } // if it's a single id, just return the value


    if (idIsValid(ids)) {
      return state.get(idTransform(ids));
    }

    return ids.map(function (id) {
      return state.get(idTransform(id));
    });
  }).defineResponseTo(DELETE_SUCCEEDED, function (state, keys) {
    return state.withMutations(function (nextState) {
      keys.forEach(function (key) {
        return nextState.set(idTransform(key), null);
      });
      return nextState;
    });
  }).defineResponseTo(FetchTypes.SUCCEEDED, function (state, newObjects) {
    if (enableCache) {
      getSuperstoreClient().then(function (store) {
        return store.get(getSuperstoreKey(namespace)).then(function () {
          var existingData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          var dataToStore = existingData;
          newObjects.forEach(function (entry, key) {
            dataToStore[key] = serializeData(entry);
          });
          return store.set(getSuperstoreKey(namespace), dataToStore).catch(function () {
            // Some part of the cache write failed. It doesn't really matter what failed,
            // regardless we want to blow away cache so it's clear for next fetch
            return store.delete(getSuperstoreKey(namespace));
          }).catch(function () {// ignore. on systems with IndexedDB disabled `store.delete` can fail,
            // but there's nothing we can do about it, so just ignore the error
          });
        }).catch(function () {// ignore
        });
      }).catch(function () {// ignore
      });
    }

    return newObjects.reduce(function (acc, entry, key) {
      return acc.set(idTransform(key), responseTransform(entry, key));
    }, state);
  }).defineResponseTo(UPDATED, function (state, updatedObjectFragments) {
    return state.mergeDeep(updatedObjectFragments.reduce(function (acc, val, key) {
      return acc.set(idTransform(key), val);
    }, ImmutableMap()));
  }).defineResponseTo(CLEARED, function () {
    return getInitialState();
  });
}
export function registerLazyKeyService(_ref2) {
  var _this = this,
      _registerService;

  var namespace = _ref2.namespace,
      fetch = _ref2.fetch,
      _ref2$idTransform = _ref2.idTransform,
      idTransform = _ref2$idTransform === void 0 ? identity : _ref2$idTransform,
      fetchLimit = _ref2.fetchLimit,
      _ref2$deserializeData = _ref2.deserializeData,
      deserializeData = _ref2$deserializeData === void 0 ? fromJS : _ref2$deserializeData,
      _ref2$unstable_enable = _ref2.unstable_enableCache,
      enableCache = _ref2$unstable_enable === void 0 ? false : _ref2$unstable_enable;
  invariant(typeof fetch === 'function', 'expected `fetch` to be a function but got `%s`', fetch);
  var FetchTypes = makeAsyncActionTypes(namespace, FETCH);
  var RefreshTypes = makeAsyncActionTypes(namespace, REFRESH);
  var cacheKey = getSuperstoreKey(namespace);
  var fillUnfoundKeys = baseFillUnfoundKeys.bind(null, idTransform);

  var handleQueued = function handleQueued(state, ids) {
    var pending = state.pending,
        queue = state.queue;
    var newIds = ids.toSet().subtract(pending, queue);

    if (newIds.isEmpty()) {
      return state;
    }

    dispatchQueue(FetchTypes.STARTED).done();
    return state.set('queue', queue.union(newIds));
  };

  var handleStarted = function handleStarted(state) {
    var pending = state.pending,
        queue = state.queue;

    if (queue.isEmpty()) {
      return state;
    }

    var fetchQueue = fetchLimit && queue.size > fetchLimit ? queue.slice(0, fetchLimit) : queue;
    var waitQueue = fetchLimit && queue.size > fetchLimit ? queue.slice(fetchLimit) : ImmutableSet();
    var idsToFetch = fetchQueue.toList();

    function fetchItems(maybeCachedData) {
      fetch(idsToFetch).then(function (result) {
        var fetchedData = fillUnfoundKeys(fetchQueue, result);

        if (!maybeCachedData || !fetchQueue.every(function (id) {
          var fetched = fetchedData.get(id);
          var cached = maybeCachedData.get(id); // if cached value is null/undefined we don't need an immutable compare

          return fetched === cached || is(fetched, cached);
        })) {
          dispatchImmediate(FetchTypes.SUCCEEDED, fetchedData);
        }

        if (waitQueue.size) {
          dispatchQueue(FetchTypes.QUEUED, waitQueue);
        } // FIXME: ideally we want to dispatch SETTLED even when the request
        // fails but we don't want that request to be retried forever


        return dispatchQueue(FetchTypes.SETTLED, fetchQueue);
      }, function (error) {
        return dispatchImmediate(FetchTypes.FAILED, error);
      }).done();
    } // only execute caching code if cache is enabled and fetch list has different ids


    if (enableCache && !pending.equals(fetchQueue)) {
      getSuperstoreClient().then(function (store) {
        return store.has(cacheKey).then(function (hasCachedData) {
          // If the store has cached data we can return it and continue the promise chain.
          // If not, we throw an exception to bypass the next `.then` block.
          if (hasCachedData) {
            return store.get(cacheKey);
          }

          return {};
        }).then(function (cachedState) {
          // With the data returned from the cache, pull out any entries
          // that are a part of the current fetch queue. Dispatch those to the store
          var cachedData = idsToFetch.reduce(function (acc, _id) {
            var id = idTransform(_id);

            if (cachedState[id]) {
              return acc.set(id, deserializeData(cachedState[id]));
            }

            return acc;
          }, ImmutableMap());

          if (cachedData.size) {
            dispatchImmediate(FetchTypes.SUCCEEDED, cachedData);
            dispatchImmediate(FetchTypes.SETTLED, idsToFetch);
            return cachedData;
          }

          return undefined;
        }).then(function (restoredCacheData) {
          // Always fetch items regardless of cache hit - we still want to refresh the
          // cache in the background.
          setTimeout(fetchItems.bind(_this, restoredCacheData), 1);
        }).catch(function () {
          // Always fetch items regardless of cache hit - we still want to refresh the
          // cache in the background.
          setTimeout(fetchItems, 1); // Regardless of what failed above, pessamistically blow away the cache
          // assuming that there's corruped data present somewhere.

          return store.delete(cacheKey);
        }).catch(function () {// ignore. on systems with IndexedDB disabled `store.delete` can fail,
          // but there's nothing we can do about it, so just ignore the error
        });
      }).catch(function () {
        setTimeout(fetchItems, 1);
      }).done();
    } else if (!pending.equals(fetchQueue)) {
      fetchItems();
    }

    return state.merge({
      pending: pending.union(fetchQueue),
      queue: ImmutableSet()
    });
  };

  return registerService(LazyKeyServiceState(), (_registerService = {}, _defineProperty(_registerService, FetchTypes.QUEUED, handleQueued), _defineProperty(_registerService, RefreshTypes.QUEUED, handleQueued), _defineProperty(_registerService, FetchTypes.STARTED, handleStarted.bind(this)), _defineProperty(_registerService, FetchTypes.SETTLED, function (state, keys) {
    var pending = state.pending;
    return state.set('pending', pending.subtract(keys));
  }), _registerService));
}