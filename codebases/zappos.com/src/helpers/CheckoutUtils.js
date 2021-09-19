import ExecutionEnvironment from 'exenv';
import queryString from 'query-string';

import { DELIVERY_PROMISE_TYPE } from '/common/regex';

import { REVIEW_STEP } from 'constants/checkoutFlow';
import { CV_WHITE_LIST } from 'constants/appConstants';
import {
  MAFIA_CLIENT_DESKTOP_PREFIX,
  MAFIA_CLIENT_MOBILE_PREFIX,
  MAFIA_CLIENT_ZPOT_PREFIX
} from 'constants/mafiaClient';
import {
  ADDRESS,
  ADDRESS_ASSOCIATION,
  BAD_PROMO_CODE_OR_GIFT_CARD,
  CART_QUANTITY_LIMIT,
  CROSS_BORDER_EXPORT,
  DELIVERY_INFORMATION_MISSING,
  DELIVERY_OPTION,
  DESTINATION_INFORMATION_MISSING,
  DROP_PRODUCT_DIRECT_FULFILLMENT,
  DROP_PRODUCT_NOT_AVAILABLE,
  DROP_PRODUCT_PURCHASE_AUTHORIZATION_MISSING,
  DROP_PRODUCT_QUANTITY_LIMIT,
  EXPIRED_INSTRUMENT,
  EXPORT_OFFER_BUYABILITY_RESTRICTION,
  FULLFILMENT_NETWORK_MISSING,
  GC_PAYMENT_METHOD_NOT_ALLOWED,
  GC_QUANTITY,
  GIFTCARD_CODE_ALREADY_REDEMEED,
  GIFTCARD_CODE_CANCELLED,
  GIFTCARD_CODE_EXPIRED,
  GIFTCARD_CODE_INVALID,
  INACTIVE_INSTRUMENT,
  INACTIVE_INSTRUMENT_BILLING_ADDRESS_VIOLATION,
  INSUFFICIENT_COVERAGE,
  INVALID_COUPON_BALANCE,
  INVALID_GIFT_OPTION,
  INVALID_SELECTED_DELIVERY_OPTION_FOR_LINE_ITEM,
  ITEM_IN_CART_WITH_NO_SHIP_OPTIONS,
  ITEM_IN_CART_WITH_PROBLEM,
  ITEM_QUANTITY_UNAVAILABLE,
  JURISDICTION,
  LEGACY_ORDER_LEVEL_BILLING_ADDRESS_MISSING,
  MISSING_DIGITAL_DELIVERY_INFORMATION,
  NO_SHIP_OPTIONS,
  OFFER_LISTING_AND_OFFER_SKU_DIFFER,
  OFFER_LISTING_NOT_AVAILABLE_CONSTRAINT_VIOLATION,
  PAYMENT_METHOD,
  PAYMENT_PLAN_MISSING,
  PRODUCT_MISSING,
  PROMOTIONAL_CODE_ALREADY_REDEEMED,
  PROMOTIONAL_CODE_BAD,
  PROMOTIONAL_CODE_EXPIRED,
  PROMOTIONAL_CODE_INVALID_FOR_PURCHASE,
  PROMOTIONAL_CODE_MISSING,
  PROMOTIONAL_CODE_USED_BEFORE_START_DATE,
  QUANTITY_LIMITS,
  SHIP_ADDRESS_DEACTIVATED,
  SHIPPING_ENGINE_FILTER_BASED,
  SHIPPING_ENGINE_PROVIDER_BASED,
  SHIPPING_ENGINE_REMOVER_BASED,
  SHIPPING_ENGINE_SHIPPING_OFFERING_NOT_SET,
  VALID_PAYMENT_METHOD_REQUIRED
} from 'constants/constraintViolations';
import {
  ROOKIEUSA_PLAIN,
  VRSNL_PLAIN,
  ZAPPOS_FREE_HOLIDAY_SHIPPING,
  ZAPPOS_LEGACY_VIP,
  ZAPPOS_LWA_PLUS_PRIME,
  ZAPPOS_MOBILE_PROMO,
  ZAPPOS_NEW_VIP,
  ZAPPOS_PLAIN,
  ZAPPOS_REWARDS_ELITE,
  ZAPPOS_REWARDS_GOLD,
  ZAPPOS_REWARDS_PLATINUM,
  ZAPPOS_REWARDS_SILVER,
  ZAPPOS_REWARDS_SILVER_AS_GOLD,
  ZEN_PLAIN
} from 'constants/shippingBenefitReasons';
import {
  DIGITAL_GC_ONLY_CART,
  MIXED_WITH_BOTH_GC,
  MIXED_WITH_EGC,
  MIXED_WITH_PHYSICAL,
  NON_MIXED_WITH_BOTH_GC,
  PHYSICAL_GC_ONLY_CART,
  RETAIL_ONLY_CART
} from 'constants/cartTypes';
import marketplace from 'cfg/marketplace.json';
import { toUSD } from 'helpers/NumberFormats';
import { toArray } from 'helpers/lodashReplacement';
import { isDesktop } from 'helpers/ClientUtils';

const {
  checkout: { shippingCountriesWhitelist },
  subsiteId: { desktop: desktopSubsiteId, mobile: mobileSubsiteId }
} = marketplace;

export function getEventCvFromCv(cv) {
  switch (cv) {
    case CROSS_BORDER_EXPORT:
      return 'CROSS_BORDER_EXPORT';
    case EXPORT_OFFER_BUYABILITY_RESTRICTION:
      return 'EXPORT_OFFER_BUYABILITY_RESTRICTION';
    case ITEM_IN_CART_WITH_NO_SHIP_OPTIONS:
      return 'ITEM_IN_CART_WITH_NO_SHIP_OPTIONS';
    case ITEM_IN_CART_WITH_PROBLEM:
      return 'ITEM_IN_CART_WITH_PROBLEM';
    case BAD_PROMO_CODE_OR_GIFT_CARD:
      return 'BAD_PROMO_CODE_OR_GIFT_CARD';
    case NO_SHIP_OPTIONS:
      return 'NO_SHIP_OPTIONS';
    case INVALID_GIFT_OPTION:
      return 'INVALID_GIFT_OPTION';
    case DELIVERY_OPTION:
      return 'DELIVERY_OPTION';
    case GC_PAYMENT_METHOD_NOT_ALLOWED:
      return 'GC_PAYMENT_METHOD_NOT_ALLOWED';
    case ADDRESS_ASSOCIATION:
      return 'ADDRESS_ASSOCIATION';
    case DESTINATION_INFORMATION_MISSING:
      return 'DESTINATION_INFORMATION_MISSING';
    case DELIVERY_INFORMATION_MISSING:
      return 'DELIVERY_INFORMATION_MISSING';
    case INACTIVE_INSTRUMENT_BILLING_ADDRESS_VIOLATION:
      return 'INACTIVE_INSTRUMENT_BILLING_ADDRESS_VIOLATION';
    case INSUFFICIENT_COVERAGE:
      return 'INSUFFICIENT_COVERAGE';
    case INVALID_SELECTED_DELIVERY_OPTION_FOR_LINE_ITEM:
      return 'INVALID_SELECTED_DELIVERY_OPTION_FOR_LINE_ITEM';
    case PROMOTIONAL_CODE_ALREADY_REDEEMED:
      return 'PROMOTIONAL_CODE_ALREADY_REDEEMED';
    case PROMOTIONAL_CODE_EXPIRED:
      return 'PROMOTIONAL_CODE_EXPIRED';
    case PROMOTIONAL_CODE_USED_BEFORE_START_DATE:
      return 'PROMOTIONAL_CODE_USED_BEFORE_START_DATE';
    case PROMOTIONAL_CODE_INVALID_FOR_PURCHASE:
      return 'PROMOTIONAL_CODE_INVALID_FOR_PURCHASE';
    case PROMOTIONAL_CODE_BAD:
      return 'PROMOTIONAL_CODE_BAD';
    case SHIPPING_ENGINE_REMOVER_BASED:
      return 'SHIPPING_ENGINE_REMOVER_BASED';
    case LEGACY_ORDER_LEVEL_BILLING_ADDRESS_MISSING:
      return 'LEGACY_ORDER_LEVEL_BILLING_ADDRESS_MISSING';
    case ITEM_QUANTITY_UNAVAILABLE:
      return 'ITEM_QUANTITY_UNAVAILABLE';
    case OFFER_LISTING_NOT_AVAILABLE_CONSTRAINT_VIOLATION:
      return 'OFFER_LISTING_NOT_AVAILABLE_CONSTRAINT_VIOLATION';
    case SHIPPING_ENGINE_FILTER_BASED:
      return 'SHIPPING_ENGINE_FILTER_BASED';
    case PAYMENT_PLAN_MISSING:
      return 'PAYMENT_PLAN_MISSING';
    case INACTIVE_INSTRUMENT:
      return 'INACTIVE_INSTRUMENT';
    case EXPIRED_INSTRUMENT:
      return 'EXPIRED_INSTRUMENT';
    case JURISDICTION:
      return 'JURISDICTION';
    case PAYMENT_METHOD:
      return 'PAYMENT_METHOD';
    case QUANTITY_LIMITS:
      return 'QUANTITY_LIMITS';
    case ADDRESS:
      return 'ADDRESS';
    case SHIPPING_ENGINE_PROVIDER_BASED:
      return 'SHIPPING_ENGINE_PROVIDER_BASED';
    case SHIPPING_ENGINE_SHIPPING_OFFERING_NOT_SET:
      return 'SHIPPING_ENGINE_SHIPPING_OFFERING_NOT_SET';
    case FULLFILMENT_NETWORK_MISSING:
      return 'FULLFILMENT_NETWORK_MISSING';
    case INVALID_COUPON_BALANCE:
      return 'INVALID_COUPON_BALANCE';
    case OFFER_LISTING_AND_OFFER_SKU_DIFFER:
      return 'OFFER_LISTING_AND_OFFER_SKU_DIFFER';
    case PRODUCT_MISSING:
      return 'PRODUCT_MISSING';
    case MISSING_DIGITAL_DELIVERY_INFORMATION:
      return 'MISSING_DIGITAL_DELIVERY_INFORMATION';
    case GIFTCARD_CODE_ALREADY_REDEMEED:
      return 'GIFTCARD_CODE_ALREADY_REDEMEED';
    case GIFTCARD_CODE_CANCELLED:
      return 'GIFTCARD_CODE_CANCELLED';
    case GIFTCARD_CODE_EXPIRED:
      return 'GIFTCARD_CODE_EXPIRED';
    case GIFTCARD_CODE_INVALID:
      return 'GIFTCARD_CODE_INVALID';
    case VALID_PAYMENT_METHOD_REQUIRED:
      return 'VALID_PAYMENT_METHOD_REQUIRED';
    case SHIP_ADDRESS_DEACTIVATED:
      return 'SHIP_ADDRESS_DEACTIVATED';
    case PROMOTIONAL_CODE_MISSING:
      return 'PROMOTIONAL_CODE_MISSING';
    case GC_QUANTITY:
      return 'GC_QUANTITY';
    case CART_QUANTITY_LIMIT:
      return 'CART_QUANTITY_LIMIT';
    case DROP_PRODUCT_NOT_AVAILABLE:
      return 'DROP_PRODUCT_NOT_AVAILABLE';
    case DROP_PRODUCT_PURCHASE_AUTHORIZATION_MISSING:
      return 'DROP_PRODUCT_PURCHASE_AUTHORIZATION_MISSING';
    case DROP_PRODUCT_QUANTITY_LIMIT:
      return 'DROP_PRODUCT_QUANTITY_LIMIT';
    case DROP_PRODUCT_DIRECT_FULFILLMENT:
      return 'DROP_PRODUCT_DIRECT_FULFILLMENT';
    default:
      return 'UNKNOWN_CONSTRAINT_VIOLATION_TYPE';
  }
}

export function isZapposShipping(shippingBenefitReason) {
  return shippingBenefitReason === ZAPPOS_PLAIN
  || shippingBenefitReason === ZAPPOS_MOBILE_PROMO
  || shippingBenefitReason === ZAPPOS_REWARDS_SILVER
  || shippingBenefitReason === ZAPPOS_FREE_HOLIDAY_SHIPPING
  || shippingBenefitReason === ZAPPOS_LWA_PLUS_PRIME
  || shippingBenefitReason === ZAPPOS_REWARDS_GOLD
  || shippingBenefitReason === ZAPPOS_LEGACY_VIP
  || shippingBenefitReason === ZAPPOS_REWARDS_PLATINUM
  || shippingBenefitReason === ZAPPOS_REWARDS_ELITE
  || shippingBenefitReason === ZAPPOS_REWARDS_SILVER_AS_GOLD
  || shippingBenefitReason === ZAPPOS_NEW_VIP;
}

export function isBaseZapposShipping(shippingBenefitReason) {
  return shippingBenefitReason === ZAPPOS_PLAIN
  || shippingBenefitReason === ZAPPOS_MOBILE_PROMO
  || shippingBenefitReason === ZAPPOS_REWARDS_SILVER;
}

const FREE_SHIPPING_SPEEDS = new Set(['next-wow', 'std-us-non48', 'std-n-us', 'std-us-military', 'std-us-protect', 'std-us']);
export const isFreeShippingSpeed = shipmentSpeed => FREE_SHIPPING_SPEEDS.has(shipmentSpeed);

export function isFreeHolidayShipping(shippingBenefitReason) {
  return shippingBenefitReason === ZAPPOS_FREE_HOLIDAY_SHIPPING;
}

export function isTwoDayPrimeShippingPerk(shippingBenefitReason) {
  return shippingBenefitReason === ZAPPOS_LWA_PLUS_PRIME;
}

export function isOneDayVipShippingPerk(shippingBenefitReason) {
  return shippingBenefitReason === ZAPPOS_REWARDS_GOLD
  || shippingBenefitReason === ZAPPOS_LEGACY_VIP
  || shippingBenefitReason === ZAPPOS_REWARDS_PLATINUM
  || shippingBenefitReason === ZAPPOS_REWARDS_ELITE
  || shippingBenefitReason === ZAPPOS_REWARDS_SILVER_AS_GOLD
  || shippingBenefitReason === ZAPPOS_NEW_VIP;
}

export function determineShippingBenefitReason(reason) {
  switch (reason) {
    case ZAPPOS_PLAIN:
      return 'ZAPPOS_PLAIN';
    case ZAPPOS_LEGACY_VIP:
      return 'ZAPPOS_LEGACY_VIP';
    case ZAPPOS_MOBILE_PROMO:
      return 'ZAPPOS_MOBILE_PROMO';
    case ZAPPOS_REWARDS_SILVER:
      return 'ZAPPOS_REWARDS_SILVER';
    case ZAPPOS_REWARDS_GOLD:
      return 'ZAPPOS_REWARDS_GOLD';
    case ZAPPOS_REWARDS_PLATINUM:
      return 'ZAPPOS_REWARDS_PLATINUM';
    case ZAPPOS_REWARDS_ELITE:
      return 'ZAPPOS_REWARDS_ELITE';
    case ZAPPOS_REWARDS_SILVER_AS_GOLD:
      return 'ZAPPOS_REWARDS_SILVER_AS_GOLD';
    case ZAPPOS_LWA_PLUS_PRIME:
      return 'ZAPPOS_LWA_PLUS_PRIME';
    case ZAPPOS_NEW_VIP:
      return 'ZAPPOS_NEW_VIP';
    case VRSNL_PLAIN:
      return 'VRSNL_PLAIN';
    case ZEN_PLAIN:
      return 'ZEN_PLAIN';
    case ROOKIEUSA_PLAIN:
      return 'ROOKIEUSA_PLAIN';
    default:
      return 'UNKNOWN_SHIPPING_BENEFIT_REASON';
  }
}

export function buildCheckoutErrorQueryString(params) {
  return buildErrorQueryString('martyCheckoutError', params);
}

export function buildErrorQueryString(type, params) {
  return queryString.stringify({ type, ...params });
}

export const makeDeliveryMessage = deliveryPromise => (deliveryPromise?.length ? deliveryPromise : 'We\'re experiencing shipping delays. We\'ll email when your order ships.');

export function hasCartQuantityLimit(cvs) {
  return cvs.hasOwnProperty(CART_QUANTITY_LIMIT);
}

export function hasGcQuantity(cvs) {
  return cvs.hasOwnProperty(GC_QUANTITY);
}

export function hasFraudCheckAroundPromoCode(cvs) {
  return cvs.hasOwnProperty(INVALID_COUPON_BALANCE);
}

export function hasExpiredInstrument(cvs) {
  return cvs.hasOwnProperty(EXPIRED_INSTRUMENT);
}

export function hasInactiveInstrument(cvs) {
  return cvs.hasOwnProperty(INACTIVE_INSTRUMENT);
}

export function hasGenericProblemWithPayment(cvs) {
  return cvs.hasOwnProperty(PAYMENT_METHOD);
}

export function hasInvalidShippingOptions(cvs) {
  return cvs.hasOwnProperty(INVALID_SELECTED_DELIVERY_OPTION_FOR_LINE_ITEM)
    || cvs.hasOwnProperty(SHIPPING_ENGINE_FILTER_BASED)
    || cvs.hasOwnProperty(DELIVERY_OPTION)
    || cvs.hasOwnProperty(SHIPPING_ENGINE_SHIPPING_OFFERING_NOT_SET)
    || cvs.hasOwnProperty(DROP_PRODUCT_DIRECT_FULFILLMENT);
}

export function isShippableAddress(countryCode) {
  return shippingCountriesWhitelist.includes(countryCode);
}

export function needsShippingOptions(cvs) {
  return cvs.hasOwnProperty(DELIVERY_INFORMATION_MISSING);
}

export function isMissingFulfillmentNetwork(cvs) {
  return cvs.hasOwnProperty(FULLFILMENT_NETWORK_MISSING);
}

export function needsValidShippingAddress(cvs) {
  return cvs.hasOwnProperty(DESTINATION_INFORMATION_MISSING)
  || cvs.hasOwnProperty(ADDRESS)
  || cvs.hasOwnProperty(EXPORT_OFFER_BUYABILITY_RESTRICTION)
  || cvs.hasOwnProperty(CROSS_BORDER_EXPORT)
  || cvs.hasOwnProperty(SHIP_ADDRESS_DEACTIVATED)
  || cvs.hasOwnProperty(SHIPPING_ENGINE_REMOVER_BASED);
}

export function hasInvalidGiftOptions(cvs) {
  return cvs.hasOwnProperty(INVALID_GIFT_OPTION);
}

export function hasInvalidGiftOptionsFromConstraintArray(cvs = []) {
  return !!cvs.find(item => item.name === INVALID_GIFT_OPTION);
}

export function isInactiveShippingAddress(cvs) {
  return cvs.hasOwnProperty(SHIP_ADDRESS_DEACTIVATED);
}

export function isGeneralAddressContstraintPresent(cvs) {
  return cvs.hasOwnProperty(ADDRESS);
}

export function isMissingShippingDestination(cvs) {
  return cvs.hasOwnProperty(DESTINATION_INFORMATION_MISSING);
}

export function needsValidPayment(cvs) {
  return cvs.hasOwnProperty(INSUFFICIENT_COVERAGE)
  || cvs.hasOwnProperty(PAYMENT_PLAN_MISSING)
  || cvs.hasOwnProperty(VALID_PAYMENT_METHOD_REQUIRED);
}

export function needsValidBillingAddress(cvs) {
  return cvs.hasOwnProperty(INACTIVE_INSTRUMENT_BILLING_ADDRESS_VIOLATION) ||
    cvs.hasOwnProperty(LEGACY_ORDER_LEVEL_BILLING_ADDRESS_MISSING);
}

export function needsToReAssociatePaymentToAddress(cvs) {
  return cvs.hasOwnProperty(ADDRESS_ASSOCIATION);
}

export function needsToReAssociatePaymentToAddressForPayment(cvs, paymentInstrumentId) {
  return needsToReAssociatePaymentToAddress(cvs) && cvs[ADDRESS_ASSOCIATION].paymentInstrumentId === paymentInstrumentId;
}

export function needsDigitalDeliveryInformation(cvs) {
  return cvs.hasOwnProperty(MISSING_DIGITAL_DELIVERY_INFORMATION);
}

export function hasAmazonCatalogIssue(cvs) {
  return cvs.hasOwnProperty(OFFER_LISTING_AND_OFFER_SKU_DIFFER);
}

export function hasProblemWithItemInCart(cvs) {
  return cvs.hasOwnProperty(JURISDICTION)
    || cvs.hasOwnProperty(ITEM_QUANTITY_UNAVAILABLE)
    || cvs.hasOwnProperty(OFFER_LISTING_NOT_AVAILABLE_CONSTRAINT_VIOLATION)
    || cvs.hasOwnProperty(QUANTITY_LIMITS)
    || cvs.hasOwnProperty(SHIPPING_ENGINE_PROVIDER_BASED)
    || cvs.hasOwnProperty(GC_QUANTITY)
    || cvs.hasOwnProperty(DROP_PRODUCT_NOT_AVAILABLE)
    || cvs.hasOwnProperty(DROP_PRODUCT_PURCHASE_AUTHORIZATION_MISSING)
    || cvs.hasOwnProperty(DROP_PRODUCT_QUANTITY_LIMIT)
    || isMissingFulfillmentNetwork(cvs);
}

export function isMissingProducts(cvs) {
  return cvs.hasOwnProperty(PRODUCT_MISSING);
}

export function hasAsinLevelProblem(cvs) {
  return hasProblemWithItemInCart(cvs) || hasInvalidShippingOptions(cvs);
}

export function isTryingToBuyGiftCardWithGiftCard(cvs) {
  return cvs.hasOwnProperty(GC_PAYMENT_METHOD_NOT_ALLOWED);
}

export function isPlacingOrderBlocked(cvs) {
  return (cvs ? toArray(cvs) : []).some(cv => !CV_WHITE_LIST.includes(cv.name));
}

export function canPurchaseHavePromos(cartType) {
  return cartType === MIXED_WITH_EGC
  || cartType === MIXED_WITH_PHYSICAL
  || cartType === MIXED_WITH_BOTH_GC
  || cartType === RETAIL_ONLY_CART;
}

export function isDigitalDeliveryOnlyCart(cartType) {
  return cartType === DIGITAL_GC_ONLY_CART;
}

export function isDigitalCart(cartType) {
  return cartType === DIGITAL_GC_ONLY_CART
  || cartType === MIXED_WITH_EGC
  || cartType === MIXED_WITH_BOTH_GC
  || cartType === NON_MIXED_WITH_BOTH_GC;
}

export function isNonRetailOnlyCart(cartType) {
  return cartType !== RETAIL_ONLY_CART;
}

export function isGiftCardOnlyCart(cartType) {
  return cartType === PHYSICAL_GC_ONLY_CART
  || cartType === DIGITAL_GC_ONLY_CART
  || cartType === NON_MIXED_WITH_BOTH_GC;
}

export function isDigitalChallenge(cvs) {
  return cvs.hasOwnProperty(ADDRESS_ASSOCIATION) && cvs[ADDRESS_ASSOCIATION].challengeType === 'DigitalChallenge';
}

export function refetchShipOptionsBasedOnCheckoutData(data) {
  return checkoutDataHasShipEngineFilterBaseCV(data) || checkoutDataHasShipEngineRemoverBaseCV(data);
}

export function checkoutDataHasShipEngineFilterBaseCV(data) {
  const { purchaseStatus: { constraintViolations: cvs } } = data;
  return !!cvs.find(cv => cv.name === SHIPPING_ENGINE_FILTER_BASED);
}

export function checkoutDataHasShipEngineRemoverBaseCV(data) {
  const { purchaseStatus: { constraintViolations: cvs } } = data;
  return !!cvs.find(cv => cv.name === SHIPPING_ENGINE_REMOVER_BASED);
}

export function hasBadPromoCodeOrGiftCardFromCVList(cvs) {
  const constraintViolations = {};
  cvs.forEach(cv => {
    constraintViolations[cv.name] = cv;
  });
  return hasBadPromoCodeOrGiftCard(constraintViolations);
}

export function hasBadPromoCodeOrGiftCard(cvs) {
  return cvs.hasOwnProperty(PROMOTIONAL_CODE_ALREADY_REDEEMED)
    || cvs.hasOwnProperty(PROMOTIONAL_CODE_EXPIRED)
    || cvs.hasOwnProperty(PROMOTIONAL_CODE_USED_BEFORE_START_DATE)
    || cvs.hasOwnProperty(PROMOTIONAL_CODE_INVALID_FOR_PURCHASE)
    || cvs.hasOwnProperty(PROMOTIONAL_CODE_BAD)
    // must be added in, but can't until this is complete: https://jira.zappos.net/browse/MAFIA-1132
    // || cvs.hasOwnProperty(GC_PAYMENT_METHOD_NOT_ALLOWED)
    || cvs.hasOwnProperty(GIFTCARD_CODE_ALREADY_REDEMEED)
    || cvs.hasOwnProperty(GIFTCARD_CODE_CANCELLED)
    || cvs.hasOwnProperty(GIFTCARD_CODE_EXPIRED)
    || cvs.hasOwnProperty(GIFTCARD_CODE_INVALID);
}

export function isReadyToSubmitCheckout({ constraintViolations, currentStep }) {
  const isOnReviewStep = currentStep === REVIEW_STEP;
  const isBlockedByCVs = isPlacingOrderBlocked(constraintViolations);
  return isOnReviewStep && !isBlockedByCVs;
}

export function hasOutOfStockCV(cvs) {
  if (!cvs || !cvs.length) {
    return false;
  }

  return !!cvs.find(cv => cv.name === ITEM_QUANTITY_UNAVAILABLE || cv.name === OFFER_LISTING_NOT_AVAILABLE_CONSTRAINT_VIOLATION);
}

export const inIframe = win => {
  if (typeof win === 'undefined' && typeof window === 'undefined') {
    return false;
  }

  const w = win || window;

  try {
    return w.self !== w.top;
  } catch (e) {
    return true;
  }
};

export const formatShippingPrice = price => {
  if (typeof price === 'undefined') {
    return '';
  }
  return price === 0 ? '(FREE!)' : `- ${toUSD(price)}`;
};

export const dateFromPromise = displayString => (displayString ? displayString.replace(DELIVERY_PROMISE_TYPE, '') : '');

export const getEndDateFromRange = (displayString = '') => {
  const parts = displayString.split(' ');
  return parts.length > 3 ? `${parts[4]} ${parts[5]} ${parts[6]}` : displayString;
};

export const getMafiaClientHeaderPrefix = (params = {}) => {
  const { isClient = ExecutionEnvironment.canUseDOM, win = window } = params;

  if (!isClient) {
    return;
  }

  const isDesktopDevice = isDesktop();

  switch (true) {
    case inIframe(win):
      return MAFIA_CLIENT_ZPOT_PREFIX;
    case isDesktopDevice:
      return MAFIA_CLIENT_DESKTOP_PREFIX;
    default:
      return MAFIA_CLIENT_MOBILE_PREFIX;
  }
};

export const buildPaginationRange = (currentPage, numPages) => {
  const current = currentPage,
    delta = 2,
    last = numPages,
    left = current - delta,
    rangeWithDots = [],
    right = current + delta + 1;

  let l;

  for (let i = 1; i <= last; i++) {
    if (i === 1 || i === last || i >= left && i < right) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
  }

  return rangeWithDots;
};

export function buildOrderConfirmationEventData(params) {
  const subsiteId = isDesktop() ? desktopSubsiteId : mobileSubsiteId;

  const {
    orderId: amazonPhysicalOrderId,
    digitalOrderId: amazonDigitalOrderId,
    purchaseId: amazonPurchaseId,
    chargeSummary: { shippingCharge, estimatedTax, subTotal, total },
    productList
  } = params;

  const orderItem = productList.map(item => {
    const { productId, stockId, asin } = item;
    return { asin, productId, stockId };
  });

  const checkout = {
    amazonPurchaseId,
    amazonDigitalOrderId,
    amazonPhysicalOrderId,
    shipping: +shippingCharge.toFixed(2),
    tax: +estimatedTax.toFixed(2),
    subtotal: +subTotal.toFixed(2),
    total: +total.toFixed(2),
    orderItem
  };

  return {
    type: 'Checkout',
    checkout,
    subsiteId
  };
}

export const ECO_SHIPPING_SPEEDS = new Set(['next-wow', 'std-n-us']);
export function isShippingOptionEligibleForEcoShipping(lineItemDeliveryOptions) {
  return !!lineItemDeliveryOptions && lineItemDeliveryOptions.some(({ deliveryOptions }) => !!deliveryOptions && deliveryOptions.some(({ name }) => ECO_SHIPPING_SPEEDS.has(name)));
}

export function getNumberOfEligibleShipOptionsFromDeliveryOptions({ deliveryOptions = [], filteredShipSpeeds = [] }) {
  return deliveryOptions.length - filteredShipSpeeds.length;
}
