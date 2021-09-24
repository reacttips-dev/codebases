'use es6';

import { debounce, once } from './lib/utils';
import * as Atom from './lib/Atom';
import { fetchAvatars } from './api/AvatarAPI';
import defaultFetchAvatars from './api/defaultFetchAvatars';
import { Map as ImmutableMap, Set as ImmutableSet, List } from 'immutable';
import invariant from 'react-utils/invariant';
import PortalIdParser from 'PortalIdParser';
import LookupRecord from './Records/LookupRecord';
export var FIRST_TRY_DELAY = 200;
export var SECOND_TRY_DELAY = 1000;
export var LAST_TRY_DELAY = 4000;
/**
 * Given the various state Atoms, retrieves a URI from the cache or adds the
 * lookup to the queue.
 *
 * @param  {Atom<Map<LookupRecord,?string>>}
 * @param  {Atom<Set<LookupRecord>>}
 * @param  {Function}
 * @param  {Function}
 * @param  {number}
 * @param  {Lookup}
 * @return {?LookupRecord}
 */

function _getAvatarURI(cacheAtom, pendingAtom, enqueue, fetcher, portalId, lookup) {
  invariant(typeof fetcher === 'function', 'expected `fetcher` to be a function but got `%s`', fetcher);
  invariant(typeof portalId === 'number' || !lookup.requiresPortalId(), 'expected `portalId` to be a number or the lookup to not require a portalId but got `%s`', portalId);
  invariant(lookup instanceof LookupRecord, 'expected `lookup` to be a LookupRecord but got `%s`', lookup);
  var avatars = Atom.deref(cacheAtom);

  if (avatars.has(lookup)) {
    return avatars.get(lookup);
  }

  if (!Atom.deref(pendingAtom).has(lookup)) {
    enqueue(fetcher, portalId, ImmutableSet.of(lookup));
  }

  return undefined;
}
/**
 * @param  {?Map<LookupRecord, ?string>}
 * @return {Atom<Map<LookupRecord, ?string>>}
 */


export { _getAvatarURI as getAvatarURI };
export function makeCacheAtom() {
  var initialCache = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableMap();
  return Atom.atom(initialCache, ImmutableMap.isMap);
}
/**
 * @param  {?Set<LookupRecord>}
 * @return {Atom<Set<LookupRecord>>}
 */

export function makeQueueAtom() {
  var initialQueue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableSet();
  return Atom.atom(initialQueue, ImmutableSet.isSet);
}
/**
 * Adds lookups to the queue and schedules a queue flush.
 *
 * @param  {Atom<Set<LookupRecord>>}
 * @param  {Function}
 * @param  {Function}
 * @param  {number}
 * @param  {Set<LookupRecord>}
 * @return {void}
 */

export function queuer(queueAtom, flushQueue, fetcher, portalId, lookups) {
  invariant(ImmutableSet.isSet(lookups) && !lookups.isEmpty(), 'expected `lookups` to be a non-empty Set but got `%s`', lookups);
  Atom.swap(queueAtom, function (current) {
    return current.union(lookups);
  });
  flushQueue(fetcher, portalId);
}
/**
 * Creates a queing function bound to a queue Atom.
 *
 * @param  {Function}
 * @param  {Function}
 * @param  {Atom<Map<LookupRecord,?string>>}
 * @param  {Atom<Set<LookupRecord>>}
 * @param  {Function}
 * @return {Function}
 */

export function makeQueuer(queueAtom, doEnqueue, doFlush, cacheAtom, pendingAtom, nextEnqueue) {
  var flushQueue = function flushQueue() {
    for (var _len = arguments.length, partialArgs = new Array(_len), _key = 0; _key < _len; _key++) {
      partialArgs[_key] = arguments[_key];
    }

    return doFlush.apply(void 0, [cacheAtom, queueAtom, pendingAtom, nextEnqueue].concat(partialArgs));
  };

  return function () {
    for (var _len2 = arguments.length, partialArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      partialArgs[_key2] = arguments[_key2];
    }

    return doEnqueue.apply(void 0, [queueAtom, flushQueue].concat(partialArgs));
  };
}
/**
 * Splits lookups into buckets based on their dimensions so the fetcher can make
 * separate calls for each dimension.
 *
 * @param  {Set<LookupRecord>}
 * @return {Map<?number, Set(LookupRecord)>}
 */

export function toDimensionBuckets(lookups) {
  return lookups.reduce(function (dimensionBuckets, lookup) {
    return dimensionBuckets.update(lookup.dimensions, function (maybeSet) {
      return typeof maybeSet === 'undefined' ? ImmutableSet.of(lookup) : maybeSet.add(lookup);
    });
  }, ImmutableMap());
}
/**
 *  Splits the lookup set into batches in order so the fetcher can make
 *  batch requests to Avatars
 *
 * @param  {Set<LookupRecord>}
 * @param  {number}
 * @return {List<Set<LookupRecord>>}
 */

export function toBatches(lookupSet) {
  var batchSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
  invariant(typeof batchSize === 'number' && batchSize > 0, 'expected `batchSize` to number greater than 0 but got `%s`', batchSize);
  return lookupSet.reduce(function (batches, lookup) {
    if (batches.last().size >= batchSize) {
      return batches.push(ImmutableSet.of(lookup));
    }

    return batches.set(-1, batches.last().add(lookup));
  }, List.of(ImmutableSet()));
}
/**
 * Try to resolve the contents of a queue, adding hits to the cache and pushing
 * retries to the next queue.
 *
 * @param  {Atom<Map<LookupRecord,?string>>}
 * @param  {Atom<Set<LookupRecord>>}
 * @param  {Atom<Set<LookupRecord>>}
 * @param  {Function}
 * @param  {Function}
 * @param  {number}
 * @return {void}
 */

export function flush(cacheAtom, queueAtom, pendingAtom, nextFlush, fetcher, portalId) {
  var lookups = Atom.deref(queueAtom);

  if (lookups.isEmpty()) {
    return;
  }

  Atom.swap(pendingAtom, function (current) {
    return current.union(lookups);
  });
  Atom.swap(queueAtom, function (current) {
    return current.clear();
  });
  toDimensionBuckets(lookups).forEach(function (lookupSet, dimensions) {
    toBatches(lookupSet).forEach(function (batch) {
      fetchAvatars(fetcher, portalId, batch, dimensions).then(function (_ref) {
        var retry = _ref.retry,
            updates = _ref.updates;
        Atom.swap(pendingAtom, function (current) {
          return current.subtract(lookups);
        });
        Atom.swap(cacheAtom, function (current) {
          return current.merge(updates);
        });

        if (nextFlush && !retry.isEmpty()) {
          nextFlush(fetcher, portalId, retry);
        }
      }).done();
    });
  });
}
/**
 * Factory that creates the various state Atoms and bound functions that compose
 * an AvatarResolver and cache.
 *
 * @return {Object}
 */

export function makeAvatarResolver() {
  var cacheAtom = makeCacheAtom();
  var pendingAtom = makeQueueAtom();
  var firstQueueAtom = makeQueueAtom();
  var secondQueueAtom = makeQueueAtom();
  var lastQueueAtom = makeQueueAtom();
  var enqueueLastTry = makeQueuer(lastQueueAtom, queuer, debounce(flush, LAST_TRY_DELAY), cacheAtom, pendingAtom);
  var enqueueSecondTry = makeQueuer(secondQueueAtom, queuer, debounce(flush, SECOND_TRY_DELAY), cacheAtom, pendingAtom, enqueueLastTry);
  var enqueueFirstTry = makeQueuer(firstQueueAtom, queuer, debounce(flush, FIRST_TRY_DELAY), cacheAtom, pendingAtom, enqueueSecondTry);
  return {
    /**
     * The Atom that stores the lookup => url cache. It's usually best to use
     * the helper methods (getAvatarURI, setAvatarURI, etc.) rather than using
     * the cache directly.
     *
     * @prop  {Atom<Map<LookupRecord,?string>>}
     */
    avatars: cacheAtom,

    /**
     * Returns an avatar uri from the cache or queues the lookup to be fetched.
     *
     * @param  {LookupRecord}
     * @param  {Function}       fetcher that returns a promise for the API response
     * @param  {number}         portal id
     * @return {?string}        avatar url
     */
    getAvatarURI: function getAvatarURI(lookup) {
      var fetcher = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultFetchAvatars;
      var portalId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : PortalIdParser.get();
      return _getAvatarURI(cacheAtom, pendingAtom, enqueueFirstTry, fetcher, portalId, lookup);
    },

    /**
     * Associate an avatar uri with a lookup in the cache. This is useful when
     * client interaction changes the image an avatar should display (i.e. the
     * user uploaded a new profile photo for a contact).
     *
     * @param  {LookupRecord}   lookup (email or domain)
     * @param  {?string}        new url or null
     * @param  {Function}       fetcher that returns a promise for the API response
     * @param  {number}         portal id
     * @return {?string}        avatar url
     */
    setAvatarURI: function setAvatarURI(lookup, value) {
      var key = lookup;
      invariant(key instanceof LookupRecord, 'expected `lookup` to be an instance of LookupRecord but got `%s`', lookup);
      invariant(value === null || typeof value === 'string' && value.length > 0, 'expected `value` to be a non-empty string or `null` but got `%s`', value);
      Atom.swap(cacheAtom, function (current) {
        return current.set(lookup, value).map(function (cachedValue, cachedLookup) {
          return lookup.isSameAs(cachedLookup) ? value : cachedValue;
        });
      });
    },

    /**
     * Register a callback to be triggered whenever the avatars caches changes.
     *
     * @param  {Function}  callback
     * @return void
     */
    watch: function watch() {
      for (var _len3 = arguments.length, partialArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        partialArgs[_key3] = arguments[_key3];
      }

      return Atom.watch.apply(Atom, [cacheAtom].concat(partialArgs));
    },

    /**
     * Unregister a callback that was previously registered with `watch`.
     *
     * @param  {Function}  callback
     * @return void
     */
    unwatch: function unwatch() {
      for (var _len4 = arguments.length, partialArgs = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        partialArgs[_key4] = arguments[_key4];
      }

      return Atom.unwatch.apply(Atom, [cacheAtom].concat(partialArgs));
    }
  };
}
/**
 * Returns the AvatarResolver singleton used by UIAvatar.
 *
 * @return {Object}
 */

export var getAvatarResolver = once(makeAvatarResolver);