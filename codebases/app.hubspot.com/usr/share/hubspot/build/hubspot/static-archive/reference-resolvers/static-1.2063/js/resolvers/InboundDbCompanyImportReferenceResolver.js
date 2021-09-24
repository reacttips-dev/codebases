'use es6';

import { getProperties, createGetProperties } from '../api/InboundDbPropertiesApi';
import * as CacheKeys from '../constants/CacheKeys';
import createSimpleCachedReferenceResolver from '../lib/createSimpleCachedReferenceResolver';
export var createInboundDbCompanyImportReferenceResolver = function createInboundDbCompanyImportReferenceResolver(options) {
  return createSimpleCachedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.INBOUND_DB_COMPANY_IMPORT,
    createFetchData: function createFetchData(opts) {
      var getFn = createGetProperties(opts);
      return function () {
        return getFn('company');
      };
    },
    fetchData: function fetchData() {
      return getProperties('company');
    }
  }, options));
};
export default createInboundDbCompanyImportReferenceResolver();