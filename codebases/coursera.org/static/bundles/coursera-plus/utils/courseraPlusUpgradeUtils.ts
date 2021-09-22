import Q from 'q';
import Uri from 'jsuri';

import epicClient from 'bundles/epic/client';
import CourseraPlusUpgrade from 'bundles/subscriptions/api/courseraPlusUpgrade';
import S12nSubscriptionWelcomeEmailsV1 from 'bundles/subscriptions/api/s12nSubscriptionWelcomeEmailsV1';
import ProductTypeObject from 'bundles/payments/common/ProductType';

import user from 'js/lib/user';

export const isCourseUpsellEpicEnabledRecordImpression = () =>
  (epicClient.get('payments', 'coursePostPurchaseUpsellNoFreeTrial') ?? 'control') !== 'control';

export const upsellVariantCourseraPlusCourseUpsell = () =>
  epicClient.preview('payments', 'coursePostPurchaseUpsellNoFreeTrial');
export const isControl = () => upsellVariantCourseraPlusCourseUpsell() === 'control';
export const isVariant1 = () => upsellVariantCourseraPlusCourseUpsell() === '1';
export const isVariant2 = () => upsellVariantCourseraPlusCourseUpsell() === '2';

const upgradeEligibilityUri = (productItemId: string, productType: string): Uri => {
  return new Uri()
    .addQueryParam('action', 'isEligible')
    .addQueryParam('productItemId', productItemId)
    .addQueryParam('productType', productType);
};

const upgradeTypeUri = (productItemId: string, productType: string): Uri => {
  return new Uri()
    .addQueryParam('action', 'upsellType')
    .addQueryParam('productItemId', productItemId)
    .addQueryParam('productType', productType);
};

export const isEligibleForCourseraPlusUpgrade = (productItemId: string, productType: string): Q.Promise<boolean> => {
  const uri = upgradeEligibilityUri(productItemId, productType);
  // API response returns a boolean by default
  // If API fails, recover as a non-blocking issue by returning `false` as a default
  return Q(CourseraPlusUpgrade.post(uri.toString())).fail(() => {
    return false;
  });
};

export const isS12nEligibleForCourseraPlusUpgrade = (productItemId: string): Q.Promise<boolean> => {
  return isEligibleForCourseraPlusUpgrade(productItemId, ProductTypeObject.SPECIALIZATION);
};

export type CourseraPlusUpsellType =
  | 'Gateway' // upsell from a Gateway Certificate, defined in https://tools.coursera.org/epic/experiment/Yxs3IOTfEeuSNOtwPG-sIA
  | 'Default' // upsell from a $49 product (not Gateway)
  | 'None'; // no upsell (invalid product or user does not qualify, e.g. already owns Coursera Plus)

export const courseraPlusUpsellType = (
  productItemId: string,
  productType: string,
  originalCartId: string | number,
  shouldCheckProductOwnership = true
): Q.Promise<CourseraPlusUpsellType> => {
  const uri = upgradeTypeUri(productItemId, productType).addQueryParam('originalCartId', originalCartId);

  if (shouldCheckProductOwnership) {
    uri.addQueryParam('ownedByUser', user.get().id);
  }

  return (
    Q(CourseraPlusUpgrade.post(uri.toString()))
      // API response returns "Gateway", "Default", or an empty string (which gets interpreted as `undefined`) by default
      .then((response) => {
        if (!response) {
          return 'None';
        } else {
          return response;
        }
      })
      // If API fails, recover as a non-blocking issue by returning "None" as a default
      .fail(() => {
        return 'None';
      })
  );
};

export const upgradeS12nToCourseraPlus = (
  s12nId: string,
  s12nProductType: string,
  courseIdToGrantMembership: string,
  originalCartId: number
): Q.Promise<boolean> => {
  const data = {
    userId: user.get().id,
    productItemId: s12nId,
    productType: s12nProductType,
    originalCartId,
    courseIdToGrantMembership,
  };
  const uri = new Uri().addQueryParam('action', 'upgrade');
  return Q(CourseraPlusUpgrade.post(uri.toString(), { data }));
};

export const upgradeCourseToCourseraPlus = (
  productItemId: string,
  productType: string,
  originalCartId: number,
  paymentWalletId: number
): Q.Promise<boolean> => {
  const uri = new Uri().addQueryParam('action', 'upgrade');
  const data = {
    userId: user.get().id,
    productItemId,
    productType,
    originalCartId,
    paymentInformation: {
      transactionId: '',
      paymentWalletId,
    },
  };
  return Q(CourseraPlusUpgrade.post(uri.toString(), { data }));
};

export const sendWelcomeEmail = (cartId: number, subscriptionId: string): Q.Promise<boolean> => {
  const uri = new Uri().addQueryParam('action', 'sendConsolidatedWelcomeEmail');
  const data = { cartId, subscriptionId };

  // API response returns a boolean by default
  // If API fails, recover as a non-blocking issue by returning `false` as a default
  return Q(S12nSubscriptionWelcomeEmailsV1.post(uri.toString(), { data })).fail(() => {
    return false;
  });
};

export const isGateway = (productItemId?: string): boolean => {
  const gatewayIds = epicClient.preview('payments', 'courseraPlusGatewayCertificates');

  for (const gatewayId of gatewayIds) {
    if (gatewayId === productItemId) {
      return true;
    }
  }
  return false;
};
