import ProductType from 'bundles/payments/common/ProductType';
import CartsV2 from 'bundles/naptimejs/resources/carts.v2';
import createCartPromise, { CartCreateOptions } from 'bundles/payments/promises/createCart';

/**
 * Create a Guided Project Cart. NOTE: Refer to ./createCart for more information.
 * @param {string} id - The courseId
 * @param {Object} options - Refer to ./createCart
 * @returns {Promise.<Object>} ./createCart response.
 */
export default function (courseId: string, options: Partial<CartCreateOptions>): Promise<CartsV2> {
  const data = {
    productItems: [
      {
        productType: ProductType.VERIFIED_CERTIFICATE,
        productItemId: courseId,
        productAction: 'Buy',
        cartItemIdToRefund: {},
        metadata: {
          'org.coursera.payment.GuidedProjectCartItemMetadata': {},
        },
      },
    ],
    ...options,
  };

  return createCartPromise(data);
}
