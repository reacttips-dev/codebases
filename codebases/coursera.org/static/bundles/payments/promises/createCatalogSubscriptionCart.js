import _ from 'underscore';
import ProductType from 'bundles/payments/common/ProductType';
import createCartPromise from 'bundles/payments/promises/createCart';

/**
 * Create a Catalog Subscription Cart. NOTE: Refer to ./createCart for more information.
 * @param {string} id - The productItemId
 * @param {Object} options - Refer to ./createCart
 * @param {Array} options.auxiliaryCartInfo - Refer to ./createCart
 * @returns {Promise.<Object>} ./createCart response.
 */
export default function (id, options = {}) {
  const createCartOptions = _.extend(
    {},
    {
      productItems: [
        {
          productType: options.productType || ProductType.CATALOG_SUBSCRIPTION,
          productItemId: id,
          productAction: 'Buy',
          cartItemIdToRefund: {},
        },
      ],
    },
    options
  );

  return createCartPromise(createCartOptions);
}
