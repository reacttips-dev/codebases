'use es6';

import get from '../lib/get';
var getReferences = get('results');
var getHasMore = get('hasMore');
var getOffset = get('offset');
export var defaultSearchResponseAccessors = {
  getReferences: getReferences,
  getHasMore: getHasMore,
  getOffset: getOffset
};