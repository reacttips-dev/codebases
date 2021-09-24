'use es6';

import ProductUrlMappings from 'settings-ui-nav/utils/ProductUrlMappings';

var productFromUrl = function productFromUrl(url) {
  for (var productKey in ProductUrlMappings) {
    if (url.search(ProductUrlMappings[productKey].path) > -1) {
      return ProductUrlMappings[productKey];
    }
  }

  return undefined;
};

export default productFromUrl;