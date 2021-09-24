'use es6';

import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import invariant from 'react-utils/invariant';
import { OBJECT_TYPE_TO_ENDPOINT_MAPPINGS, RETINA_MULTIPLIER } from '../Constants';
export var BASE_PATH = 'avatars/v1/';
export var BATCH_GET_PATH = 'avatars/batch';
export var UPLOAD_PATH = 'overrides';
/**
 * Reduces the original lookups and the response into a Map of lookup => url.
 *
 * @param  {Set(LookupRecord)}
 * @param  {Object}
 * @return {Map<LookupRecord,?string>}
 */

export function normalizeUpdates(lookups, response) {
  return lookups.reduce(function (updates, lookup) {
    if (!response[lookup.getIdentifierName()] || !response[lookup.getIdentifierName()][lookup.getIdentifier()] || !response[lookup.getIdentifierName()][lookup.getIdentifier()].uri) {
      return updates;
    }

    return updates.set(lookup, response[lookup.getIdentifierName()][lookup.getIdentifier()].uri);
  }, ImmutableMap());
}
/**
 * Reduces the original lookups and the response into a Set of lookups that are
 * queued and should be retried.
 *
 * @param  {Set(LookupRecord)}
 * @param  {Object}
 * @return {Set<LookupRecord>}
 */

export function normalizeRetries(lookups, response) {
  return lookups.reduce(function (retries, lookup) {
    if (!response[lookup.getIdentifierName()] || !response[lookup.getIdentifierName()][lookup.getIdentifier()] || !response[lookup.getIdentifierName()][lookup.getIdentifier()].queued) {
      return retries;
    }

    return retries.add(lookup);
  }, ImmutableSet());
}
/**
 * @param  {Set(LookupRecord)}
 * @param  {Object}
 * @return {{retry: Set(LookupRecord), updates: Map<LookupRecord,?string>}}
 */

export function normalizeResponse(lookups, response) {
  return {
    retry: normalizeRetries(lookups, response),
    updates: normalizeUpdates(lookups, response)
  };
}
/**
 * Takes a list of lookups in transforms them to a JSON structure that the api
 * understands.
 *
 * @param  {Set(LookupRecord)}
 * @param  {?number}
 * @return {Object}
 */

export function toRequestData(lookups, dimension) {
  invariant(ImmutableSet.isSet(lookups), 'expected `lookups` to be a Set but got `%s`', lookups);
  invariant(typeof dimension === 'undefined' || typeof dimension === 'number', 'expected `dimension` to be undefined or a number but got `%s`', lookups);
  var requestDataWithoutDimensions = lookups.reduce(function (builder, lookup) {
    var withoutKnown = builder.update(lookup.getIdentifierName(), function (maybeSet) {
      return typeof maybeSet === 'undefined' ? ImmutableSet.of(lookup.getIdentifier()) : maybeSet.add(lookup.getIdentifier());
    });

    if (!lookup.isKnown()) {
      return withoutKnown;
    }

    return withoutKnown.update(lookup.getKnownName(), function (maybeSet) {
      return typeof maybeSet === 'undefined' ? ImmutableSet.of(lookup.getKnownObject()) : maybeSet.add(lookup.getKnownObject());
    });
  }, ImmutableMap());

  if (typeof dimension === 'number') {
    var doubleDimensionForRetina = dimension * RETINA_MULTIPLIER;
    return requestDataWithoutDimensions.set('sizeParams', ImmutableMap({
      width: doubleDimensionForRetina,
      height: doubleDimensionForRetina
    })).toJS();
  }

  return requestDataWithoutDimensions.toJS();
}
/**
 * Uses `fetcher` to retrieve and then normalize responses from the API.
 *
 * @param  {(uri: string, data: Object) => Promise<Object>}
 * @param  {number || undefined} If undefined, will look for enrichment avatars only
 * @param  {Set(LookupRecord)}
 * @param  {?number}
 * @return {{retry: Set(LookupRecord), updates: Map<LookupRecord,?string>}}
 */

export function fetchAvatars(fetcher, portalId, lookups, dimension) {
  invariant(typeof fetcher === 'function', 'expected `fetcher` to be a function but got `%s`', fetcher);
  invariant(typeof portalId === 'number' || typeof portalId === 'undefined', 'expected `portalId` to be a number or undefined but got `%s`', portalId);
  invariant(ImmutableSet.isSet(lookups), 'expected `lookups` to be a Set but got `%s`', lookups);
  invariant(typeof dimension === 'number' || typeof dimension === 'undefined', 'expected `dimension` to be a number or undefined but got `%s`', dimension);
  var portalIdQueryString = typeof portalId !== 'undefined' ? "?portalId=" + portalId : '';
  return fetcher("" + BASE_PATH + BATCH_GET_PATH + portalIdQueryString, toRequestData(lookups, dimension)).then(function () {
    for (var _len = arguments.length, partialArgs = new Array(_len), _key = 0; _key < _len; _key++) {
      partialArgs[_key] = arguments[_key];
    }

    return normalizeResponse.apply(void 0, [lookups].concat(partialArgs));
  });
}
/**
 * Uses `uploader` to submit an avatar override
 * @param  {(uri: string, data: Object) => Promise<Object>} uploader
 * @param  {number} portalId
 * @param  {OneOf[...]} objectType
 * @param  {number} objectId
 * @param  {Blob([Uint8Array])} formData
 * @return {{uri: string, source: string, queued: bool, fromDefault: bool}}
 */

export function uploadAvatar(uploader, portalId, objectType, objectId, formData) {
  invariant(typeof uploader === 'function', 'expected `uploader` to be a function but got `%s`', uploader);
  invariant(typeof portalId === 'number', 'expected `portalId` to be a number but got `%s`', portalId);
  var acceptableTypes = Object.keys(OBJECT_TYPE_TO_ENDPOINT_MAPPINGS);
  invariant(acceptableTypes.indexOf(objectType) >= 0, "expected `objectType` to be one of " + acceptableTypes + " but got `%s`", objectType);
  invariant(typeof objectId === 'number', 'expected `objectId` to be a number but got `%s`', objectId);
  invariant(formData instanceof FormData, 'expected `formData` to be an instance of FormData but got `%s`', formData);
  var endpoint = OBJECT_TYPE_TO_ENDPOINT_MAPPINGS[objectType];
  return uploader("" + BASE_PATH + UPLOAD_PATH + "/" + endpoint + "/" + objectId + "?portalId=" + portalId, formData);
}