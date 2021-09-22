/* eslint-disable no-param-reassign */
import _ from 'lodash';

import ProductType from 'bundles/payments/common/ProductType';
import createCartPromise from 'bundles/payments/promises/createCart';

/**
 * Create a Prepaid Cart. NOTE: Refer to ./createCart for more information.
 * @param {string} id - The productItemId
 * @param {Object} options - Refer to ./createCart
 * @param {Array} options.auxiliaryCartInfo - Refer to ./createCart
 * @returns {Promise.<Object>} ./createCart response.
 */
export default function (id: string, options) {
  options = _.extend(
    {},
    {
      productItems: [
        {
          productType: options.productType || ProductType.SPECIALIZATION,
          productItemId: id,
          productAction: 'Buy',
          cartItemIdToRefund: {},
        },
      ],
    },
    options
  );

  return createCartPromise(options);
}
