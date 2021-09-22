import CartsV2 from 'bundles/naptimejs/resources/carts.v2';
import PromotionDetailsV1 from 'bundles/naptimejs/resources/promotionDetails.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import SubscriptionTrialsV1 from 'bundles/naptimejs/resources/subscriptionTrials.v1';

export type DigitProps = {
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
};

export const amountToDigitsProps = (amount?: number | null): DigitProps => {
  return amount && typeof amount === 'number' && amount % 1 > 0
    ? { maximumFractionDigits: 2, minimumFractionDigits: 2 }
    : {};
};

export const isSubscriptionFreeTrial = ({
  cart,
  promotionDetails,
  subscriptionTrials,
  isMonthlyCatalogSubscriptionEnabled,
}: {
  cart?: CartsV2;
  isMonthlyCatalogSubscriptionEnabled?: boolean;

  // TODO: Remove these props and downstream naptime requests if applicable.
  promotionDetails?: Array<PromotionDetailsV1>;
  subscriptionTrials?: SubscriptionTrialsV1;
}): boolean => {
  if (!cart) {
    return false;
  }

  const response =
    !isMonthlyCatalogSubscriptionEnabled &&
    (cart.isSpecializationSubscription || cart.isCourseraPlusSubscription) &&
    cart.hasFreeTrial;
  return !!response;
};

export const getCartIdFromQuery = (query: { [key: string]: string } | undefined): string | undefined => {
  // use regex match to strip any trailing Coursera header tag and non-numeric inputs
  return query?.cartId?.replace(/[0-9]{4}Coursera/, '')?.match(/([0-9]*)/)?.[0];
};

export default {
  amountToDigitsProps,
  isSubscriptionFreeTrial,
  getCartIdFromQuery,
};
