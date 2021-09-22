import _ from 'underscore';
import ProductType from 'bundles/payments/common/ProductType';
import createCartPromise from 'bundles/payments/promises/createCart';

/**
 * Create a VC Cart. NOTE: Refer to ./createCart for more information.
 * @param {string} id - The productItemId
 * @param {Object} options - Refer to ./createCart
 * @returns {Promise.<Object>} ./createCart response.
 */
export default function (id, options) {
  options = _.extend(
    {},
    {
      productItems: [
        {
          productType: ProductType.VERIFIED_CERTIFICATE,
          productItemId: id,
          productAction: 'Buy',
          cartItemIdToRefund: {},
        },
      ],
    },
    options
  );

  const promise = createCartPromise(options);
  promise.done();
  return promise;
}
