/* Given a collection of courses, returns a promise for their VC prices. */
import { VERIFIED_CERTIFICATE } from 'bundles/payments/common/ProductType';

import { getPricesForProducts } from 'bundles/payments/promises/productPrices';

export default (courseIds) => {
  const vcProducts = courseIds.map((courseId) => ({
    productType: VERIFIED_CERTIFICATE,
    productTypeId: courseId,
  }));

  const promise = getPricesForProducts(vcProducts);
  promise.done();
  return promise;
};
