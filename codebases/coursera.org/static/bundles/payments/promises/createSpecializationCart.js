/* eslint-disable no-param-reassign */

import _ from 'underscore';

import ProductType from 'bundles/payments/common/ProductType';
import createCartPromise from 'bundles/payments/promises/createCart';

/**
 * Create a Specialization Cart. NOTE: Refer to ./createCart for more information.
 * @param {string} id - The productItemId
 * @param {Object} options - Refer to ./createCart
 * @param {Array} options.auxiliaryCartInfo - Refer to ./createCart
 * @param {Boolean} skipWelcomeEmail - Whether to skip the s12n welcome email
 * @returns {Promise.<Object>} ./createCart response.
 */
export default function (id, options = {}, skipWelcomeEmail) {
  options = _.extend(
    {},
    {
      productItems: [
        {
          productType: options.productType || ProductType.SPECIALIZATION,
          productItemId: id,
          productAction: 'Buy',
          ...(skipWelcomeEmail
            ? {
                metadata: {
                  'org.coursera.payment.SpecializationSubscriptionCartItemMetadata': {
                    skipWelcomeEmail: true,
                  },
                },
              }
            : {}),
          cartItemIdToRefund: {},
        },
      ],
    },
    options
  );

  return createCartPromise(options);
}
