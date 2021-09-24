'use es6';

import createBatchedReferenceResolver from 'reference-resolvers/lib/createBatchedReferenceResolver';
import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import { PRODUCT } from 'reference-resolvers/constants/ReferenceObjectTypes';
import { searchObjects, createSearchObjects } from 'reference-resolvers/api/ContactSearchAPI';
import { getProductsByIds, createGetProductsByIds } from '../api/ProductsAPI';
export var createProductReferenceResolver = function createProductReferenceResolver(options) {
  return createBatchedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.PRODUCTS,
    createFetchByIds: createGetProductsByIds,
    createFetchSearchPage: function createFetchSearchPage(opts) {
      return createSearchObjects(opts)(PRODUCT);
    },
    fetchByIds: getProductsByIds,
    fetchSearchPage: searchObjects(PRODUCT),
    maxBatchSize: 100
  }, options));
};
export default createProductReferenceResolver();