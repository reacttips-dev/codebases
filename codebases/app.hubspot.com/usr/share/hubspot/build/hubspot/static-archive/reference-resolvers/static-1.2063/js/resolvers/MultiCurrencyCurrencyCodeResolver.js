'use es6';

import createSimpleCachedReferenceResolver from '../lib/createSimpleCachedReferenceResolver';
import * as CacheKeys from '../constants/CacheKeys';
import { fetchAllCurrencies, createFetchAllCurrencies } from '../api/MultiCurrencyApi';
export var createMultiCurrencyCurrencyCodeReferenceResolver = function createMultiCurrencyCurrencyCodeReferenceResolver(options) {
  return createSimpleCachedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.MULTI_CURRENCY_CURRENCY_CODES,
    createFetchData: createFetchAllCurrencies,
    fetchData: fetchAllCurrencies
  }, options));
};
export default createMultiCurrencyCurrencyCodeReferenceResolver();