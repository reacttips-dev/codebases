'use es6';

import createSimpleCachedReferenceResolver from '../lib/createSimpleCachedReferenceResolver';
import * as CacheKeys from '../constants/CacheKeys';
import { fetchMultiCurrencyInfo, createFetchMultiCurrencyInfo } from '../api/MultiCurrencyApi';
export var createMultiCurrencyInformationReferenceResolver = function createMultiCurrencyInformationReferenceResolver(options) {
  return createSimpleCachedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.MULTI_CURRENCY_INFORMATION,
    createFetchData: createFetchMultiCurrencyInfo,
    fetchData: fetchMultiCurrencyInfo
  }, options));
};
export default createMultiCurrencyInformationReferenceResolver();