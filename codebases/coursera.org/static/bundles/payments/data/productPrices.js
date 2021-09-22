import _ from 'underscore';
import productPriceApi from 'bundles/payments/api/productPrices';
import Q from 'q';
import URI from 'jsuri';

/**
 * Call the product API and return a promise with the the raw response data.
 *
 * @param {String|Array} productIds On a string, do a single call, on an array, do a multi-get.
 */
export default (productIds) => {
  if (_(productIds).isArray()) {
    const productPricesUri = new URI().addQueryParam('ids', productIds.join());
    return Q(productPriceApi.get(productPricesUri.toString()));
  } else {
    return Q(productPriceApi.get(productIds));
  }
};
