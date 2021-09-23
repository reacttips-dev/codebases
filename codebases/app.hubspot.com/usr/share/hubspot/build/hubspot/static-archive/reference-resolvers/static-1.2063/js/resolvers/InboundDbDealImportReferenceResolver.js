'use es6';

import { getProperties, createGetProperties } from '../api/InboundDbPropertiesApi';
import * as CacheKeys from '../constants/CacheKeys';
import createSimpleCachedReferenceResolver from '../lib/createSimpleCachedReferenceResolver';
export var createInboundDbDealImportReferenceResolver = function createInboundDbDealImportReferenceResolver(options) {
  return createSimpleCachedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.INBOUND_DB_DEAL_IMPORT,
    createFetchData: function createFetchData(opts) {
      var getFn = createGetProperties(opts);
      return function () {
        return getFn('deal');
      };
    },
    fetchData: function fetchData() {
      return getProperties('deal');
    }
  }, options));
};
export default createInboundDbDealImportReferenceResolver();