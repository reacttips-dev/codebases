import CartsV2 from 'bundles/naptimejs/resources/carts.v2';
import ProductType from 'bundles/payments/common/ProductType';
import createCartPromise from 'bundles/payments/promises/createCart';
import CourseraPlusProductVariant from 'bundles/payments-common/common/CourseraPlusProductVariant';

/**
 * Create a Coursera Plus subscription cart. NOTE: Refer to ./createCart for more information.
 * @param {string} productId - The productId of the product to enroll in
 * @param {string | null} courseIdToGrantMembership - The courseId of the course in a s12n to also enroll in
 * @returns {Promise.<CartsV2>} ./createCart response.
 */
export default (
  productId?: string,
  courseIdToGrantMembership?: string,
  productItemId?: string,
  couponId?: number
): Promise<CartsV2> => {
  const promiseOptions = {
    productItems: [
      {
        productType: ProductType.COURSERA_PLUS_SUBSCRIPTION,
        productItemId: productItemId || CourseraPlusProductVariant.ANNUAL_NO_FREE_TRIAL,
        productAction: 'Buy',
        ...(productId
          ? {
              metadata: {
                'org.coursera.payment.CourseraPlusSubscriptionCartItemMetadata': {
                  productEnrollmentInformation: {
                    productIdToEnroll: productId,
                    ...(courseIdToGrantMembership
                      ? {
                          courseIdToGrantMembership,
                        }
                      : {}),
                  },
                },
              },
            }
          : {}),
      },
    ],
    couponId,
  };

  return createCartPromise(promiseOptions);
};
