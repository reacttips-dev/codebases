'use es6';

import get from 'transmute/get';
import { fromJS, Iterable } from 'immutable';
import ReferenceRecord from '../schema/ReferenceRecord';
import { makeKeyedResolver } from './Strategy';
import { enforceBoolean, enforceIterable, enforcePositiveInt, enforceString } from 'reference-resolvers/lib/enforce';
import ResolverLoading from 'reference-resolvers/schema/ResolverLoading';
import ResolverError from 'reference-resolvers/schema/ResolverError';
var getCount = get('count');
var getHasMore = get('hasMore');
var getOffset = get('offset');
var getQuery = get('query');
var getResults = get('results');

function _makeIterable(value) {
  if (!Iterable.isIterable(value)) {
    return fromJS(value);
  }

  return value;
}

export function makeSearchQuery(key) {
  enforceIterable('key', key);
  enforcePositiveInt('count', getCount(key));
  enforcePositiveInt('offset', getOffset(key));
  enforceString('query', getQuery(key));
  return _makeIterable(key);
}
export function makeSearchResponse(response) {
  if (response instanceof ResolverError || response instanceof ResolverLoading) {
    return response;
  }

  enforceIterable('response', response);
  enforcePositiveInt('count', getCount(response));
  enforceBoolean('hasMore', getHasMore(response));
  enforcePositiveInt('offset', getOffset(response));
  ReferenceRecord.enforceReferenceIterable(getResults(response));
  return _makeIterable(response);
}
export var makeSearchResolver = makeKeyedResolver({
  idTransform: makeSearchQuery,
  valueTransform: makeSearchResponse
});