'use es6';

import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import createSimpleCachedReferenceResolver from 'reference-resolvers/lib/createSimpleCachedReferenceResolver';
import { createGetAllBusinessUnits, getAllBusinessUnits } from '../api/BusinessUnitsAPI';
export var createBusinessUnitReferenceResolver = function createBusinessUnitReferenceResolver(options) {
  return createSimpleCachedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.BUSINESS_UNITS,
    createFetchData: createGetAllBusinessUnits,
    fetchData: getAllBusinessUnits
  }, options));
};
export default createBusinessUnitReferenceResolver();