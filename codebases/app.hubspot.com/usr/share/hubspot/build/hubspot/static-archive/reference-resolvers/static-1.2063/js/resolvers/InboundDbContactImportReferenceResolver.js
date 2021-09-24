'use es6';

import { getProperties, createGetProperties } from '../api/InboundDbPropertiesApi';
import * as CacheKeys from '../constants/CacheKeys';
import createSimpleCachedReferenceResolver from '../lib/createSimpleCachedReferenceResolver';
export var createInboundDbContactImportReferenceResolver = function createInboundDbContactImportReferenceResolver(options) {
  return createSimpleCachedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.INBOUND_DB_CONTACT_IMPORT,
    createFetchData: function createFetchData(opts) {
      var getFn = createGetProperties(opts);
      return function () {
        return getFn('contact');
      };
    },
    fetchData: function fetchData() {
      return getProperties('contact');
    }
  }, options));
};
export default createInboundDbContactImportReferenceResolver();