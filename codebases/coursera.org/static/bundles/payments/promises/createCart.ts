import CartsV2 from 'bundles/naptimejs/resources/carts.v2';
import ProductTypeObject, { ProductType } from 'bundles/payments/common/ProductType';
import { AuxiliaryInfoItem } from 'bundles/payments/common/types';
import createCartData from 'bundles/payments/data/createCart';
import requestCountry from 'js/lib/requestCountry';
import user from 'js/lib/user';
import { createCart as createSubscriptionCart } from 'bundles/subscriptions/lib/subscriptionsV1Client';
import createCredentialTrackSubscriptionCart from 'bundles/subscriptions/lib/credentialTrackSubscriptionsV1Client';
import { createCart as createCourseraPlusSubscriptionCart } from 'bundles/subscriptions/lib/courseraPlusSubscriptionsV1Client';
import prices from 'js/lib/prices';

type CourseraPlusSubscriptionCartItemMetadata = {
  'org.coursera.payment.CourseraPlusSubscriptionCartItemMetadata': {
    productEnrollmentInformation: {
      productIdToEnroll: string;
      courseIdToGrantMembership?: string;
    };
  };
};

type GuidedProjectCartItemMetadata = {
  'org.coursera.payment.GuidedProjectCartItemMetadata': {};
};

type CartItemMetadata = CourseraPlusSubscriptionCartItemMetadata | GuidedProjectCartItemMetadata;

export type CartCreateOptions = {
  paymentProcessorId?: string;
  userId?: number;
  currencyCode?: string;
  couponId?: number;
  productType?: ProductType;
  productItems: Array<{
    productType: ProductType;
    productItemId: string;
    productAction: string;
    metadata?: CartItemMetadata;
  }>;
  auxiliaryCartInfo?: Array<AuxiliaryInfoItem>;
};

/**
 * @typedef ProductItem
 * @type Object
 * @property {string} productType - eg. ['VerifiedCertificate', 'Specialization', ...]
 * @property {string} productItemId - Id of product.
 * @property {string} productAction - Action ['Buy', 'Refund'] Most usages are 'Buy'
 * @property {object} cartItemIdToRefund - TODO: Ask Gringott's team.
 */

/**
 * POST request to create a cart. If you want to create a cart with auxiliaryInfo,
 * then pass auxiliaryInfo using bundles/payments/models/cart/auxiliaryInfo
 *
 * @param {string} options.paymentProcessorId - ['braintree', ...]
 * @param {string} options.userId - UserId of user creating the cart.
 * @param {string} [options.currencyCode] - 3 character currency code. eg 'USD'
 * @param {Array.<ProductItem>} options.productItems - List of productItems in this cart.
 * @returns {Promise.<CartsV2>} Promise of NaptimeJS CartsV2 model
 */
export default (cartCreateOptions: CartCreateOptions): Promise<CartsV2> => {
  const requestCountryCode = requestCountry.get();
  const options = {
    userId: user.get().id,
    currencyCode: prices.getCurrencyFromCountry(requestCountryCode),
    countryIsoCode: requestCountryCode,
    auxiliaryCartInfo: cartCreateOptions.auxiliaryCartInfo ? cartCreateOptions.auxiliaryCartInfo : [],
    ...cartCreateOptions,
  };

  if (
    options.productType === ProductTypeObject.COURSERA_PLUS_SUBSCRIPTION ||
    options.productItems[0].productType === ProductTypeObject.COURSERA_PLUS_SUBSCRIPTION
  ) {
    // @ts-expect-error ts-migrate(2741) FIXME: Property 'finally' is missing in type 'PromiseBase... Remove this comment to see the full error message
    return createCourseraPlusSubscriptionCart(options).then((response) => new CartsV2(response));
  } else if (
    options.productType === ProductTypeObject.SPECIALIZATION_SUBSCRIPTION ||
    options.productItems[0].productType === ProductTypeObject.CATALOG_SUBSCRIPTION
  ) {
    // @ts-expect-error ts-migrate(2322) FIXME: Type 'PromiseBase<Carts, never, never, never, neve... Remove this comment to see the full error message
    return createSubscriptionCart(options).then((response) => new CartsV2(response));
  } else if (
    options.productType === ProductTypeObject.CREDENTIAL_TRACK_SUBSCRIPTION ||
    options.productType === ProductTypeObject.CREDENTIAL_TRACK_SUBSCRIPTION_V2 ||
    options.productItems[0].productType === ProductTypeObject.CREDENTIAL_TRACK_SUBSCRIPTION ||
    options.productItems[0].productType === ProductTypeObject.CREDENTIAL_TRACK_SUBSCRIPTION_V2
  ) {
    // @ts-expect-error ts-migrate(2322) FIXME: Type 'PromiseBase<Carts, never, never, never, neve... Remove this comment to see the full error message
    return createCredentialTrackSubscriptionCart(options).then((response) => new CartsV2(response));
  } else {
    return createCartData(options).then((response) => new CartsV2(response.elements[0]));
  }
};
