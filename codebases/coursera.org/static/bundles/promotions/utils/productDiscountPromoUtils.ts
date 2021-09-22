import Q from 'q';
import _ from 'underscore';

import user from 'js/lib/user';
import logger from 'js/app/loggerSingleton';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import PromotionEligibilityTypes from 'bundles/promotions/common/PromotionEligibilityTypes';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import couponsPromise from 'bundles/vouchers/service/couponsPromise';

import userPreferencesApi from 'bundles/user-preferences/lib/api';
import localStorage from 'js/lib/coursera.store';
import language from 'js/lib/language';

const LOCAL_STORAGE_KEY = 'productDiscountPromoCodes';
// flag to check wether user acquired promotion directly from URL and not from promo page
const LOCAL_STORAGE_FLAG = 'promoCodeFromUrl';

// This fixes a race condition where by the mobile and desktop banners are seeing different promo codes.
// Cleared before saving a new promo code
let _lastSeenPromotion: string | undefined;

const savePromoCodes = (promoCodes: Array<string>) => {
  if (typeof window !== 'undefined') {
    userPreferencesApi.set(userPreferencesApi.keyEnum.PROMOTION_LANDING_PAGE, { promoCodes }).fail(logger.error).done();
  }
};

export const savePromoFromUrlFlag = () => {
  return localStorage.set(LOCAL_STORAGE_FLAG, true);
};

export const isPromoCodeFromUrl = () => !!localStorage.get(LOCAL_STORAGE_FLAG);

export const removePromoFromUrlFlag = () => {
  return isPromoCodeFromUrl() && localStorage.remove(LOCAL_STORAGE_FLAG);
};

export const getPromotions = (): Array<string> => {
  return localStorage.get(LOCAL_STORAGE_KEY) || [];
};

export const loadLocalStorage = (promoCodes: Array<string>) => {
  const localPromoCodes = getPromotions();

  // Make sure there are no duplicate promo codes
  const filteredPromoCodes = promoCodes.filter((promoCode) => {
    return !localPromoCodes.includes(promoCode);
  });

  // Local promo codes should always be the most recent (at the end of the array)
  localStorage.set(LOCAL_STORAGE_KEY, filteredPromoCodes.concat(localPromoCodes));
};

// Some promo codes are not saved to local store. Do not solely rely on this.
// Refer to `withPromotion`.
export const getLatestSeenPromotion = (): string | undefined => {
  if (_lastSeenPromotion) {
    return _lastSeenPromotion;
  }
  const savedPromotions = getPromotions();
  if (!_(savedPromotions).isEmpty()) {
    _lastSeenPromotion = savedPromotions[savedPromotions.length - 1];
  }

  return _lastSeenPromotion;
};

export type CouponResponse = {
  couponId: string;
};

export type PromoErrorResponse = {
  promoErrorCode: string;
};

export const redeemPromotion = (
  promoCode?: string | null
): Q.Promise<CouponResponse | PromoErrorResponse | undefined> => {
  if (promoCode) {
    return couponsPromise(promoCode)
      .then((id: $TSFixMe /* TODO: type couponsPromise */) => ({ couponId: id }))
      .catch((res: $TSFixMe /* TODO: type couponsPromise */) => {
        const promoErrorCode =
          (res && res.responseJSON && res.responseJSON.errorCode) || PromotionEligibilityTypes.PROMOTION_INACTIVE; // make sure to at least have an error for checkout to call out
        return { promoErrorCode };
      });
  } else {
    return Q.resolve(undefined);
  }
};

export const removePromotion = (promoCode: string): void => {
  // If we're removing the cached "last seen" promo, invalidate the cache.
  if (promoCode === _lastSeenPromotion) {
    _lastSeenPromotion = undefined;
  }

  const newPromotions = getPromotions().filter((code) => code !== promoCode);
  localStorage.set(LOCAL_STORAGE_KEY, newPromotions);

  if (user.isAuthenticatedUser()) {
    savePromoCodes(newPromotions);
  }
};

export const savePromotion = (promoCode: string) => {
  _lastSeenPromotion = undefined;

  // Remove+add to move the promo to the end, so that it becomes the latest seen promotion
  removePromotion(promoCode);
  const newPromotions = getPromotions().concat(promoCode);
  localStorage.set(LOCAL_STORAGE_KEY, newPromotions);

  if (user.isAuthenticatedUser()) {
    savePromoCodes(newPromotions);
  }
};

export const shouldRemovePromotion = (eligibilityCode: keyof typeof PromotionEligibilityTypes): boolean => {
  const {
    PROMOTION_INACTIVE,
    TOTAL_REDEMPTION_LIMIT_REACHED,
    USER_REDEMPTION_LIMIT_REACHED,
  } = PromotionEligibilityTypes;

  return [PROMOTION_INACTIVE, TOTAL_REDEMPTION_LIMIT_REACHED, USER_REDEMPTION_LIMIT_REACHED].includes(eligibilityCode);
};

type TrackingData = {
  userId: number | null;
  languageCode: string;
  promoCode?: string;
};

export const getTrackingData = (): TrackingData | undefined => {
  if (!getLatestSeenPromotion()) {
    return undefined;
  }

  return {
    userId: user.isAuthenticatedUser() ? user.get().id : null,
    languageCode: language.getLanguageCode(),
    promoCode: getLatestSeenPromotion(),
  };
};

export default {
  loadLocalStorage,
  getPromotions,
  getLatestSeenPromotion,
  getTrackingData,
  removePromotion,
  savePromotion,
  shouldRemovePromotion,
};
