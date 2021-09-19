import { CHECKOUT_PAGE } from 'constants/amethystPageTypes';
import {
  PROMISE_CHANGE_TYPE,
  SHIPPING_DURATION,
  SHIPPING_NAME,
  SHIPPING_PROMISE
} from 'constants/amethystEnums';
import {
  API_ERROR_CANNOT_CONFIRM_PURCHASE_OOS,
  API_ERROR_CANNOT_CONFIRM_PURCHASE_OTHER,
  API_ERROR_EDIT_INACTIVE_ADDRESS,
  API_ERROR_EMPTY_CART,
  API_ERROR_INVALID_GIFT_OPTIONS,
  API_ERROR_NOT_AUTHORIZED,
  API_ERROR_PURCHASE_NOT_FOUND,
  API_ERROR_QUANTITY_CHANGE_VALIDATION,
  API_ERROR_REDEEMABLE_REWARDS_NOT_FOUND,
  API_ERROR_REQUEST_VALIDATION,
  API_ERROR_UNKNOWN
} from 'constants/apiErrors';
import {
  HAD_SHIP_OPTION_AUTO_SELECTED,
  HAS_DELIVERY_PROMISE,
  HAS_LOADED_AAC_SUGGESTIONS,
  HAS_MULTIPLE_DELIVERY_GROUPS,
  HAS_SELECTED_AAC_SUGGESTION,
  MISSING_DELIVERY_PROMISE,
  SAW_ADDRESS_FORM_WITH_AAC
} from 'constants/informationTypes';
import {
  EDIT_ADDRESS_STEP,
  LIST_ADDRESS_STEP,
  NEW_ADDRESS_STEP,
  NEW_BILLING_ADDRESS_STEP,
  PAYMENT_STEP,
  REVIEW_STEP,
  SELECT_BILLING_ADDRESS_STEP,
  SHIP_OPTIONS_STEP
} from 'constants/checkoutFlow';
import { API_ERROR, RR_CHANGE_REDEEM_AMOUNT, RR_COMPONENT_VIEW } from 'constants/reduxActions';
import { trackEvent } from 'helpers/analytics';
import {
  determineShippingBenefitReason,
  getEventCvFromCv,
  inIframe,
  isDigitalCart,
  isPlacingOrderBlocked
} from 'helpers/CheckoutUtils';
import { sendMonetateEvent } from 'apis/monetate';
import { middlewareTrack } from 'apis/amethyst';
import {
  CHECKOUT_ADD_NEW_PAYMENT_CLICK,
  CHECKOUT_ADD_OR_EDIT_ADDRESS_EVENT,
  CHECKOUT_ADD_PAYMENT_INSTRUMENT,
  CHECKOUT_APPLY_PROMO,
  CHECKOUT_CHANGE_QUANTITY,
  CHECKOUT_CLOSE_ADDRESSLIST_MODAL,
  CHECKOUT_CLOSE_PAYMENT,
  CHECKOUT_CLOSE_PAYMENT_MODAL,
  CHECKOUT_CLOSE_SELECT_ADDRESS,
  CHECKOUT_CLOSE_SUGGESTED_ADDRESS_MODAL,
  CHECKOUT_EDIT_ADDRESS,
  CHECKOUT_HAD_SHIP_OPTION_AUTO_SELECTED,
  CHECKOUT_JUST_LOADED,
  CHECKOUT_ON_ADD_NEW_BILLING_ADDRESS_FROM_MODAL_ADDRESS_LIST_CLICK,
  CHECKOUT_ON_ADD_NEW_SHIP_ADDRESS_FROM_MODAL_ADDRESS_LIST_CLICK,
  CHECKOUT_ON_CHANGE_BILLING_ADDRESS_CLICK,
  CHECKOUT_ON_CHANGE_PAYMENT_CLICK,
  CHECKOUT_ON_CHANGE_SHIPPING_CLICK,
  CHECKOUT_ON_MOVE_TO_FAVORITES_CLICK,
  CHECKOUT_ON_PROMISE_DATE_HAS_CHANGED,
  CHECKOUT_ON_SELECT_SHIPPING_SPEED,
  CHECKOUT_ON_SHOW_ADD_NEW_SHIPPING_ADDRESS_MODAL_CLICK,
  CHECKOUT_ON_USE_BILLING_ADDRESS_CLICK,
  CHECKOUT_ON_USE_SHIPPING_ADDRESS_CLICK,
  CHECKOUT_PAGEVIEW,
  CHECKOUT_REDEEM_REWARDS_POINTS,
  CHECKOUT_REMOVE_ITEM,
  CHECKOUT_SEND_TO_DESIRED_PAGE,
  CHECKOUT_SEND_TO_MAX_AVAILABLE_STEP,
  CHECKOUT_SHIP_OPTIONS_LOADED,
  CHECKOUT_TOGGLE_IS_PRIMARY,
  CHECKOUT_TOGGLE_ITEMS,
  CHECKOUT_TOGGLE_PROMO_BOX,
  CHECKOUT_TRACK_CV,
  CHECKOUT_TRACK_NOT_MAX_STEP,
  CHECKOUT_UPDATE_CC_EXPIRATION,
  CHECKOUT_USE_PAYMENT_METHOD,
  CHECKOUT_USE_SHIPPING_DOWNGRADE,
  CHECKOUT_USE_SUGGESTED_ADDRESS,
  CHECKOUT_VERIFY_ADDRESS_PAGEVIEW,
  CHECKOUT_VIEW_ECO_SHIPPING,
  CHECKOUT_VIEW_SHIPPING_DOWNGRADE,
  CONFIGURE_CHECKOUT_SUCCESS,
  DELETE_CHECKOUT_ADDRESS,
  PLACE_ORDER,
  SAVE_CHECKOUT_ADDRESS,
  SAVE_CHECKOUT_PAYMENT_METHOD,
  SET_SELECTED_BILLING_ADDRESS_ID,
  SET_SELECTED_PAYMENT_INSTRUMENT_ID,
  SET_SELECTED_SHIPPING_ADDRESS_ID,
  SET_SELECTED_SUGGESTED_ADDRESS_ID,
  SET_USE_PROMO_BALANCE,
  TRACK_CHECKOUT_DELIVERY_PROMISE,
  VERIFY_CHECKOUT_CREDIT_CARD
} from 'store/ducks/checkout/types';
import {
  ADDRESS_HAS_LOADED_AAC_SUGGESTIONS,
  ADDRESS_HAS_SELECTED_AAC_SUGGESTION,
  ADDRESS_SAW_ADDRESS_FORM_WITH_AAC,
  ON_TOGGLE_IS_ALSO_BILLING
} from 'store/ducks/address/types';
import {
  GIFT_OPTIONS_IMPRESSION,
  GIFT_OPTIONS_NOT_ELIGIBLE,
  SET_GIFT_OPTIONS_SAVING,
  TOGGLE_GIFT_OPTIONS
} from 'store/ducks/giftoptions/types';
import { toFloatInt } from 'helpers/NumberFormats';
import { evAddToCollections } from 'events/favorites';

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/AddAddressClick.proto
// Adress Type: Billing: 1, Shipping: 2
export const evAddAddressClick = ({ addressType }) => (
  {
    addAddressClick: {
      addressType: determineAddressType(addressType),
      sourcePage: 6 // sourcePage also pageType defined by https://code.amazon.com/packages/AmethystEvents/blobs/faf0f5e028991bc37ab4f812b597685205aa5bfc/--/configuration/include/com/zappos/amethyst/website/WebsiteEnums.proto#L86
    }
  }
);

const amethystAddShippingAddressClick = () => {
  middlewareTrack(evAddAddressClick({ addressType: 2 }));
};

const amethystAddBillingAddressClick = () => {
  middlewareTrack(evAddAddressClick({ addressType: 1 }));
};

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/AddPaymentInstrumentClick.proto
export const evAddPaymentInstrumentClick = () => ({ addPaymentInstrumentClick: { sourcePage: 6 } });
const amethystAddPaymentInstrumentClick = () => middlewareTrack(evAddPaymentInstrumentClick());

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/AddPaymentInstrument.proto
export const evAddPaymentInstrument = ({ passedValidation, paymentInstrumentId, makeDefaultPaymentInstrument }) => (
  {
    addPaymentInstrument: {
      passedValidation,
      paymentInstrumentId,
      makeDefaultPaymentInstrument
    }
  }
);
const amethystAddPaymentInstrument = (appState, params) => {
  middlewareTrack(evAddPaymentInstrument(params));
};

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/ShippingDowngradeIncentiveClick.proto
//  offeredSpeed: UNKNOWN_SHIPPING_SPEED = 0; DAYS_3_5 = 1; DAYS_2 = 2; NEXT_DAY = 3;
export const evShippingDowngradeIncentiveClick = ({ dollarAmount, offeredSpeed, rewardsPoints }) => (
  {
    shippingDowngradeIncentiveClick: {
      sourcePage: 6,
      offeredSpeed,
      incentiveOffered: {
        dollarAmount,
        rewardsPoints
      }
    }
  }
);

const amethystShippingDowngradeIncentiveClick = (appstate, params) => {
  middlewareTrack(evShippingDowngradeIncentiveClick(params));
};

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/ShippingDowngradeIncentiveImpression.proto
export const evShippingDowngradeIncentiveImpression = ({ dollarAmount, offeredSpeed, rewardsPoints }) => (
  {
    shippingDowngradeIncentiveImpression: {
      sourcePage: 6,
      offeredSpeed,
      incentiveOffered: {
        dollarAmount,
        rewardsPoints
      }
    }
  }
);

const amethystShippingDowngradeIncentiveImpression = (appstate, params) => {
  middlewareTrack(evShippingDowngradeIncentiveImpression(params));
};

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/AddOrEditAddress.proto
// Adress Type: Billing: 1, Shipping: 2
export const evAddOrEditAddress = ({ passedValidation, addressId, addressType }) => (
  {
    addOrEditAddress: {
      passedValidation,
      addressId,
      addressType: determineAddressType(addressType)
    }
  }
);
const amethystAddOrEditBillingAndShippingAddress = (appstate, params) => {
  middlewareTrack(evAddOrEditAddress(params));
};

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/AddOrEditAddressPageView.proto
export const evAddorEditAddressPageView = () => ({ addOrEditAddressPageView: {} });

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/AddOrEditPaymentInstrumentPageView.proto
export const evAddorEditPaymentInstrumentPageView = () => ({ addOrEditPaymentInstrumentPageView: {} });
const amethystAddOrEditPaymentInstrumentPageView = () => middlewareTrack(evAddorEditPaymentInstrumentPageView());

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/ToggleItems.proto
export const evToggleItems = (showItems, hideItems) => (
  {
    toggleItems: {
      sourcePage: 6,
      showItems,
      hideItems
    }
  }
);
const amethystToggleItems = (appstate, { isShown }) => {
  middlewareTrack(evToggleItems(isShown, !isShown));
};

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/EditAddressClick.proto
export const evEditAddressClick = ({ addressType, addressIndex, addressId }) => (
  {
    editAddressClick: {
      addressType,
      addressIndex,
      addressId
    }
  }
);
const amethystEditShippingAddressClick = (appState, { editAddressId, editAddressIndex }) => {
  middlewareTrack(evEditAddressClick({ addressId: editAddressId, addressIndex: toFloatInt(editAddressIndex), addressType: 2 }));
};

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/ModifyQuantity.proto
export const evModifyQuantity = ({ newQuantity, originalQuantity, product }) => {
  const {
    productId,
    styleId,
    colorId,
    stockId,
    asin
  } = product;

  return {
    modifyQuantity: {
      pageType: CHECKOUT_PAGE,
      newQuantity,
      originalQuantity,
      productIdentifiers: {
        productId,
        styleId,
        colorId,
        stockId,
        asin
      }
    }
  };
};
const amethystModifyQuantity = (appState, data) => {

  middlewareTrack(evModifyQuantity(data));
};

export const determineAddressType = type => {
  switch (type) {
    case '1':
    case 1:
      return 'BILLING';
    case '2':
    case 2:
      return 'SHIPPING';
    default:
      return 'UNKNOWN_ADDRESS_TYPE';
  }
};

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/SelectAddress.proto
export const evSelectAddress = (addressId, addressIndex, addressType) => (
  {
    selectAddress: {
      addressIndex,
      addressId,
      addressType: determineAddressType(addressType)
    }
  }
);

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/VerifyAddressPageView.proto
export const evVerifyAddressPageView = ({ checkoutData }) => {
  const checkoutDetails = checkoutDetailsFromPurchaseData({ checkoutData });

  return {
    verifyAddressPageView: {
      checkoutDetails
    }
  };
};

const amethystVerifyAddressPageView = appState => {
  middlewareTrack(evVerifyAddressPageView(appState));
};

export const evVerifyAddress = (addressType, suggestionChosen) => (
  {
    verifyAddress: {
      addressType: determineAddressType(addressType),
      suggestionChosen
    }
  }
);

const amethystSelectShippingAddress = (appstate, { selectedAddressId, addressIndex }) => {
  middlewareTrack(evSelectAddress(selectedAddressId, addressIndex, 2));
};
const amethystSelectBillingAddress = (appstate, { selectedAddressId, addressIndex }) => {
  middlewareTrack(evSelectAddress(selectedAddressId, addressIndex, 1));
};
const amethystSelectSuggestedAddress = (appstate, { selectedAddressId, addressType }) => {
  if (selectedAddressId === 'original') {
    middlewareTrack(evVerifyAddress(addressType, false));
  } else {
    middlewareTrack(evVerifyAddress(addressType, true));
  }
};

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/SelectPaymentInstrument.proto
export const evSelectPaymentInstrument = ({ paymentInstrumentIndex, paymentInstrumentId, useGcOrPromo, reconfirmRequired }) => (
  {
    selectPaymentInstrument: {
      sourcePage: 6,
      paymentInstrumentIndex,
      paymentInstrumentId,
      useGcOrPromo,
      reconfirmRequired
    }
  }
);
const amethystSelectPaymentInstrument = ({ usePromoBalance }, { paymentInstrumentId, hasVerifyCreditCardError, index }) => {
  middlewareTrack(evSelectPaymentInstrument({ paymentInstrumentIndex: index, paymentInstrumentId, useGcOrPromo: usePromoBalance, reconfirmRequired: hasVerifyCreditCardError }));
};
// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/SelectPaymentInstrumentPageView.proto
export const pvSelectPaymentInstrumentPageView = ({ checkoutData }) => {
  const checkoutDetails = checkoutDetailsFromPurchaseData({ checkoutData });

  return {
    selectPaymentInstrumentPageView: {
      checkoutDetails
    }
  };
};

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/SelectShippingAddressPageView.proto
export const pvSelectShippingAddressPageView = ({ checkoutData }) => {
  const checkoutDetails = checkoutDetailsFromPurchaseData({ checkoutData });
  return {
    selectShippingAddressPageView: {
      checkoutDetails
    }
  };
};

export const pvSelectBillingAddressPageView = ({ checkoutData }) => {
  const checkoutDetails = checkoutDetailsFromPurchaseData({ checkoutData });
  return {
    selectBillingAddressPageView: {
      checkoutDetails
    }
  };
};

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/CheckoutPageView.proto
export const pvCheckout = ({ address, checkoutData, sharedPayment }) => {
  const { purchase: { constraintViolations } } = checkoutData;
  const placeOrderEnabled = !isPlacingOrderBlocked(constraintViolations);
  const checkoutDetails = checkoutDetailsFromPurchaseData({ checkoutData });
  const {
    purchase: {
      productList,
      termsAndConditionReminders: {
        eligible: isTermsAndConditionsEligible,
        inShowGroup: isTermsAndConditionsShown
      } = {}
    }
  } = checkoutData;
  const { savedAddresses = [] } = address || {};
  const { savedPayments = [] } = sharedPayment || {};
  const products = productList.map(({ asin, productId, styleId, stockId }) => ({
    asin,
    productId,
    styleId,
    stockId
  }));

  return {
    checkoutPageView: {
      placeOrderEnabled,
      prePopulatedCheckoutDetails: checkoutDetails,
      countOfSavedAddresses: savedAddresses.length,
      countOfSavedPayments: savedPayments.length,
      products,
      isTermsAndConditionsEligible,
      isTermsAndConditionsShown
    }
  };
};

// https://code.amazon.com/packages/AmethystEvents/blobs/f90bb2dff261c1a01e46314d4c5eee6b38feee0b/--/configuration/include/com/zappos/amethyst/website/OrderConfirmationPageView.prot
export const pvOrderConfirmation = params => {
  const { purchaseData, digitalOrderId: amazonDigitalOrderId, orderId: amazonPhysicalOrderId } = params;
  const details = checkoutDetailsFromPurchaseData({ checkoutData: purchaseData });
  const checkoutDetails = { ...details, amazonDigitalOrderId, amazonPhysicalOrderId };

  return {
    orderConfirmationPageView: {
      orderDetails: checkoutDetails
    }
  };
};

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/PlaceOrder.proto
export const evPlaceOrder = ({ checkoutData, giftOptions: { giftMessage } }) => {
  const { purchase: { productList } } = checkoutData;
  const checkoutDetails = checkoutDetailsFromPurchaseData({ checkoutData });
  const productIdentifiers = productList.map(item => ({ asin: item.asin }));

  return {
    placeOrder: {
      orderDetails: checkoutDetails,
      orderedItems: productIdentifiers,
      hasGiftMessage: !!giftMessage
    }
  };
};

const amethystMultipleDeliveryGroups = ({ checkoutData: { cartType }, shipOption: { lineItemDeliveryOptions = [] } }) => {
  const isDigital = isDigitalCart(cartType);
  const numGroups = lineItemDeliveryOptions.length;
  const hasMultipleGroupsWhenDigital = isDigital && numGroups > 2;
  const hasMultipleGroupsWhenNotDigital = !isDigital && numGroups > 1;

  if (hasMultipleGroupsWhenDigital || hasMultipleGroupsWhenNotDigital) {
    middlewareTrack(evInfo(HAS_MULTIPLE_DELIVERY_GROUPS));
  }
};

const amethystGiftOptionsImpression = () => {
  middlewareTrack({ checkoutGiftOptionImpression: {} });
};

const amethystToggleGiftOptions = () => {
  middlewareTrack({ checkoutToggleGiftOptions: {} });
};

const amethystGiftOptionsNotEligible = () => {
  middlewareTrack({ checkoutGiftOptionsNotEligible: {} });
};

const amethystSaveGiftOptions = (_appstate, { isRemovingGiftOptions }) => {
  if (isRemovingGiftOptions) {
    middlewareTrack({ checkoutGiftOptionRemoveClick: {} });
  } else {
    middlewareTrack({ checkoutGiftOptionSaveClick: {} });
  }
};

const amethystTrackDeliveryGroups = ({ checkoutData: { purchase: { purchaseId, shipmentSpeed } }, shipOption: { lineItemDeliveryOptions = [] } }) => {
  lineItemDeliveryOptions.forEach((dg, i) => {
    const shippingOption = [];
    const { deliveryOptions, isDigitalDelivery } = dg;
    const checkoutShippingDeliveryGroup = {
      deliveryGroupNumber: i + 1,
      numOfShipOptions: lineItemDeliveryOptions.length,
      selectedShippingName: determineShippingName(shipmentSpeed),
      isDigitalDelivery,
      purchaseId
    };

    deliveryOptions.forEach(option => {
      const {
        name,
        price,
        promise,
        selected,
        deliveryPromise: {
          isBusinessUnknown,
          displayString
        },
        isFiltered
      } = option;
      shippingOption.push({
        shippingName: determineShippingName(name),
        shippingPromise: determineShippingPromise(promise),
        shippingPromiseLabel: displayString,
        price,
        isBusinessUnknown,
        isFiltered,
        isSelected: selected
      });
    });

    checkoutShippingDeliveryGroup.shippingOption = shippingOption;
    middlewareTrack({ checkoutShippingDeliveryGroup });
  });
};

const amethystHadShipOptionAutoSelected = () => {
  middlewareTrack(evInfo(HAD_SHIP_OPTION_AUTO_SELECTED));
};

const amethystDeliveryPromiseMissing = ({ checkoutData: { purchase: { deliveryPromise } } }) => {
  if (deliveryPromise) {
    middlewareTrack(evInfo(HAS_DELIVERY_PROMISE));
  } else {
    middlewareTrack(evInfo(MISSING_DELIVERY_PROMISE));
  }
};

const amethystEcoShippingOptionImpression = () => {
  middlewareTrack({ ecoShippingOptionImpression: {} });
};

const amethystSawAddressFormWihtAac = () => {
  middlewareTrack(evInfo(SAW_ADDRESS_FORM_WITH_AAC));
};

const amethystHasLoadedAacSuggestions = () => {
  middlewareTrack(evInfo(HAS_LOADED_AAC_SUGGESTIONS));
};

const amethystHasSelectedAacSuggestion = () => {
  middlewareTrack(evInfo(HAS_SELECTED_AAC_SUGGESTION));
};

const evInfo = informationType => ({
  info: {
    sourcePage: CHECKOUT_PAGE,
    informationType
  }
});

const amethystTrackCheckoutPromiseDateHasChanged = (appstate, params) => {
  middlewareTrack(evCheckoutPromiseDateHasChanged(params));
};

const evCheckoutPromiseDateHasChanged = ({ duration, name, purchaseId, promiseDate, prevPromiseDate, sameOtherThanType, changeType }) => ({
  checkoutPromiseDateHasChanged: {
    duration: determineDuration(duration),
    promiseDate,
    prevPromiseDate,
    name: determineShippingName(name),
    purchaseId,
    sameOtherThanType,
    type: determinePromiseChangeType(changeType)
  }
});

const amethystTrackCV = (appstate, { constraintViolation }) => {
  const constraintViolationType = getEventCvFromCv(constraintViolation);
  if (constraintViolationType === 'UNKNOWN_CONSTRAINT_VIOLATION_TYPE') {
    middlewareTrack(evTrackCV({ constraintViolationType, constraintViolation }));
  } else {
    middlewareTrack(evTrackCV({ constraintViolationType }));
  }
};

export const evTrackCV = ({ constraintViolationType, constraintViolation }) => ({
  constraintViolation: {
    sourcePage: CHECKOUT_PAGE,
    constraintViolationType,
    constraintViolation
  }
});

const amethystRemoveItem = () => {
  middlewareTrack(evCheckoutRemoveItem());
};

export const evCheckoutRemoveItem = () => ({ checkoutRemoveItem: {} });

const amethystRewardsRedeemed = () => {
  middlewareTrack(evCheckoutRewardsRedeemed());
};

export const evCheckoutRewardsRedeemed = () => ({ checkoutRewardsRedeemed: {} });

const amethystRewardsRedemptionViewed = () => {
  middlewareTrack(evCheckoutRewardsRedemptionViewed());
};

export const evCheckoutRewardsRedemptionViewed = () => ({ checkoutRewardsRedemptionViewed: {} });

const amethystRewardsChangeRedemptionAmount = () => {
  middlewareTrack(evCheckoutRewardsChangeRedemptionAmount());
};

export const evCheckoutRewardsChangeRedemptionAmount = () => ({ checkoutChangeRedemptionAmount: {} });

export const evChangeSectionClick = changeToSection => ({ checkoutChangeSectionClick: { changeToSection } });

export const evCancelSectionClick = sourceSection => ({ checkoutCancelSectionClick: { sourceSection } });

const amethystCancelSectionClick = (appstate, { sourceSection }) => {
  middlewareTrack(evCancelSectionClick(sourceSection));
};

const amethystChangeSectionClick = (appstate, { changeToSection }) => {
  middlewareTrack(evChangeSectionClick(changeToSection));
};

export const evTogglePromoBox = () => ({
  checkout_toggle_promo_box: {}
});

const amethystTogglePromoBox = () => {
  middlewareTrack(evTogglePromoBox());
};

export const evToggleUsePromo = () => ({
  checkout_toggle_use_promo: {}
});

const amethystToggleUsePromo = () => {
  middlewareTrack(evToggleUsePromo());
};

export const evApplyPromo = () => ({
  checkout_apply_promo: {}
});

const amethystApplyPromo = () => {
  middlewareTrack(evApplyPromo());
};

export const evAddToFavorites = () => ({
  addToFavorites: {
    addedFrom: CHECKOUT_PAGE
  }
});

export const evSelectShippingSpeed = ({ promise }) => ({
  selectShippingSpeed: {
    shippingSpeed: determineShippingSpeed(promise)
  }
});

const amethystSelectShippingSpeed = (appState, { promise }) => {
  middlewareTrack(evSelectShippingSpeed({ promise }));
};

export const evSelectShippingSpeedPageView = ({ checkoutData }) => {
  const checkoutDetails = checkoutDetailsFromPurchaseData({ checkoutData });

  return {
    selectShippingSpeedPageView: {
      checkoutDetails
    }
  };
};

const teOnApiError = (appState, { apiErrorType, pageType }) => {
  if (pageType !== CHECKOUT_PAGE) {
    return;
  }

  switch (apiErrorType) {
    case API_ERROR_CANNOT_CONFIRM_PURCHASE_OOS: {
      trackEvent('TE_CHECKOUT_ERROR_CANNOT_CONFIRM_PURCHASE_OOS');
      break;
    }
    case API_ERROR_CANNOT_CONFIRM_PURCHASE_OTHER: {
      trackEvent('TE_CHECKOUT_ERROR_CANNOT_CONFIRM_PURCHASE_OTHER');
      break;
    }
    case API_ERROR_EDIT_INACTIVE_ADDRESS: {
      trackEvent('TE_CHECKOUT_ERROR_EDIT_INACTIVE_ADDRESS');
      break;
    }
    case API_ERROR_EMPTY_CART: {
      trackEvent('TE_CHECKOUT_ERROR_EMPTY_CART');
      break;
    }
    case API_ERROR_INVALID_GIFT_OPTIONS: {
      trackEvent('TE_CHECKOUT_ERROR_INVALID_GIFT_OPTIONS');
      break;
    }
    case API_ERROR_NOT_AUTHORIZED: {
      trackEvent('TE_CHECKOUT_ERROR_NOT_AUTHORIZED');
      break;
    }
    case API_ERROR_PURCHASE_NOT_FOUND: {
      trackEvent('TE_CHECKOUT_ERROR_PURCHASE_NOT_FOUND');
      break;
    }
    case API_ERROR_QUANTITY_CHANGE_VALIDATION: {
      trackEvent('TE_CHECKOUT_ERROR_QUANTITY_CHANGE_VALIDATION');
      break;
    }
    case API_ERROR_REDEEMABLE_REWARDS_NOT_FOUND: {
      trackEvent('TE_CHECKOUT_ERROR_REDEEMABLE_REWARDS_NOT_FOUND');
      break;
    }
    case API_ERROR_REQUEST_VALIDATION: {
      trackEvent('TE_CHECKOUT_ERROR_REQUEST_VALIDATION');
      break;
    }
    case API_ERROR_UNKNOWN: {
      trackEvent('TE_CHECKOUT_ERROR_DEFAULT');
      break;
    }
  }
};

const checkoutDetailsFromPurchaseData = ({ checkoutData }) => {
  const {
    cartType,
    hasHazmatItem,
    numItems: units,
    purchase: {
      purchaseId: amazonPurchaseId,
      shippingAddressId: addressId,
      shippingBenefitReason,
      deliveryPromise,
      promise,
      chargeSummary: {
        coupons,
        estimatedTax: totalTax,
        subTotal: totalItemPrice,
        couponTotal: totalDiscountsApplied,
        grandTotal: orderTotal,
        shippingCharge: shippingCost
      }
    },
    purchaseCreditCard
  } = checkoutData;

  const { paymentInstrumentId } = purchaseCreditCard || {};
  const employeeDiscountApplied = hasEmployeeDiscount(coupons);
  const shippingSpeed = determineShippingSpeed(promise);

  return {
    addressId,
    cartType,
    deliveryPromise,
    paymentInstrumentId,
    shippingSpeed,
    totalItemPrice,
    totalTax,
    shippingCost,
    orderTotal,
    amazonPurchaseId,
    totalDiscountsApplied,
    employeeDiscountApplied,
    isAgent: inIframe(),
    shippingBenefitReason: determineShippingBenefitReason(shippingBenefitReason),
    units,
    hasHazmatItem
  };
};

export const determineShippingName = name => SHIPPING_NAME[name] || 'UNKNOWN_SHIPPING_NAME';

export const determineShippingPromise = promise => SHIPPING_PROMISE[promise] || 'UNKNOWN_SHIPPING_PROMISE';

export const determineDuration = duration => SHIPPING_DURATION[duration] || 'UNKNOWN_DELIVERY_DURATION';

export const determinePromiseChangeType = changeType => PROMISE_CHANGE_TYPE[changeType] || 'UNKNOWN_PROMISE_CHANGE_TYPE';

export const determineShippingSpeed = promise => {
  switch (promise) {
    case '3-5 Business Days':
      return 'DAYS_3_5';
    case '2-Business Days':
      return 'DAYS_2';
    case '1-Business Day':
      return 'NEXT_DAY';
    case '3-7 Business Days':
      return 'DAYS_3_7';
    case '5-7 Business Days':
      return 'DAYS_5_7';
    case '5-10 Business Days':
      return 'DAYS_5_10';
    default:
      return 'UNKNOWN_SHIPPING_SPEED';
  }
};

const amethystMoveToFavorites = (appState, { payload }) => {
  middlewareTrack(evAddToCollections({ sourcePage: CHECKOUT_PAGE, ...payload }));
  middlewareTrack(evAddToFavorites());
};

const amethystCheckoutJustLoaded = ({ address, checkoutData, sharedPayment }) => {
  middlewareTrack(pvCheckout({ address, checkoutData, sharedPayment }));
};

const amethystPlaceOrder = ({ checkoutData, giftOptions }) => {
  middlewareTrack(evPlaceOrder({ checkoutData, giftOptions }));
};

export const hasEmployeeDiscount = (coupons = []) => !!coupons.find(cv => cv.description === '[Zappos  EE]' || cv.description === '[6pm  EE]');

// Rewards ZFC Tracking Events
const teRewardsChangeRedemptionAmount = () => trackEvent('TE_REWARDS_CHANGE_REDEMPTION_AMOUNT', 'checkout');
const teRewardsRedeemPoints = () => trackEvent('TE_REWARDS_REDEEM_POINTS', 'checkout');
const teRewardsRedeemPointsComponentView = () => trackEvent('TE_CV_REDEEMABLE_REWARDS', 'rewardsDashboard', 'checkout');

// ZFC Shipping Downgrade
const teShippingDowngradeComponentView = () => trackEvent('TE_CV_CHECKOUT_SHIPPING_DOWNGRADE');
const teUseShippingDowngrade = () => trackEvent('TE_CHECKOUT_SPC_USE_SHIPPING_DOWNGRADE');

// ZFC Tracking Events
const teCheckoutPlaceOrder = () => trackEvent('TE_CHECKOUT_SPC_PLACE_ORDER');
const teCheckoutJustLoaded = () => trackEvent('TE_PV_NATIVECHECKOUT');
const teSelectBillingAddress = () => trackEvent('TE_CHECKOUT_BL_SELECT_ADDRESS');
const teSelectShippingAddress = () => trackEvent('TE_CHECKOUT_AL_SELECT_ADDRESS');
const teSelectSuggestedAddress = () => trackEvent('TE_CHECKOUT_SA_SELECT_ADDRESS');
const teUpdateUseShippingAddress = () => trackEvent('TE_CHECKOUT_AL_SHIP_TO_ADDRESS');
const teChangeShippingAddress = () => trackEvent('TE_CHECKOUT_SPC_CHANGE_SHIPPING');
const teCloseSelectAddress = () => trackEvent('TE_CHECKOUT_SPC_CLOSE_SEL_ADDRESS');
const teSelectEditShippingAddress = () => trackEvent('TE_CHECKOUT_AL_SELECT_FOR_EDIT');
const teSelectDeleteShippingAddress = () => trackEvent('TE_CHECKOUT_AL_SELECT_FOR_DELETE');
const teSelectPayment = () => trackEvent('TE_CHECKOUT_PL_SELECT_PAYMENT');
const teClickAddNewPayment = () => trackEvent('TE_CHECKOUT_PL_GO_TO_ADD_NEW');
const teClosePaymentModal = () => trackEvent('TE_CHECKOUT_SPC_CLOSE_PAYMENT_MODAL');
const teUsePromo = (appstate, { usePromoBalance }) => trackEvent('TE_CHECKOUT_PL_TOGGLE_USE_PROMO', usePromoBalance);
const teClosePayment = () => trackEvent('TE_CHECKOUT_SPC_CLOSE_PAYMENT');
const teChangeItemQty = () => trackEvent('TE_CHECKOUT_REV_QTY');
const teCloseSuggestedAddressModal = () => trackEvent('TE_CHECKOUT_SPC_CLOSE_SUGG_ADDRESS_MODAL');
const teChangeBillingAddress = () => trackEvent('TE_CHECKOUT_SPC_CHANGE_BILLING');
const teUpdateCC = () => trackEvent('TE_CHECKOUT_PL_UPDATE_EXP');
const teVerifyCC = () => trackEvent('TE_CHECKOUT_PL_VERIFY_CC');
const teAddNewPayment = () => trackEvent('TE_CHECKOUT_PM_ADD_NEW_PAYMENT');
const teTogglePrimaryPayment = (appstate, { isPrimary }) => trackEvent('TE_CHECKOUT_PM_TOGGLE_PRIMARY', isPrimary);
const teApplyPromo = () => trackEvent('TE_CHECKOUT_GC_APPLY_PROMO');
const teOnToggleIsAlsoBilling = (appstate, { isAlsoBilling }) => trackEvent('TE_CHECKOUT_AM_TOGGLE_IS_BILLING', `${isAlsoBilling}`);

const teShipToNewAddress = (appState, { isBilling }) => {
  isBilling ? trackEvent('TE_CHECKOUT_AM_BILL_TO_ADDRESS') : trackEvent('TE_CHECKOUT_AM_SHIP_TO_ADDRESS');
};

const teUsePaymentMethod = (appstate, { paymentInstrumentId }) => {
  paymentInstrumentId === 'savedBalance' ?
    trackEvent('TE_CHECKOUT_PL_USE_PAYMENT', 'savedBalance') :
    trackEvent('TE_CHECKOUT_PL_USE_PAYMENT', `cc:${paymentInstrumentId}`);
};

const teUseSuggestedAddress = (appState, { addressType }) => {
  addressType === 'orginal' ?
    trackEvent('TE_CHECKOUT_SA_USE_ADDRESS', 'original') :
    trackEvent('TE_CHECKOUT_SA_USE_ADDRESS', 'suggested');
};

const teCloseAddressListModal = (appState, { isBilling }) => {
  isBilling ? trackEvent('TE_CHECKOUT_SPC_CLOSE_ADDRESS_MODAL', 'billing') : trackEvent('TE_CHECKOUT_SPC_CLOSE_SEL_ADDRESS_MODAL');
};

const tePageView = (appstate, { step }) => {
  if (step === PAYMENT_STEP) {
    trackEvent('TE_CHECKOUT_SPC_CHANGE_PAYMENT');
  }
  trackEvent(EVENT_NAME_FOR_STEP[step]);
};

const fireAmethystPageViewFromEventName = (appState, { step }) => {
  switch (step) {
    case LIST_ADDRESS_STEP:
      const { address: { savedAddresses } } = appState;
      if (savedAddresses.length) {
        middlewareTrack(pvSelectShippingAddressPageView(appState));
      } else {
        middlewareTrack(evAddorEditAddressPageView());
      }
      break;
    case SELECT_BILLING_ADDRESS_STEP:
      middlewareTrack(pvSelectBillingAddressPageView(appState));
      break;
    case NEW_ADDRESS_STEP:
      middlewareTrack(evAddorEditAddressPageView());
      break;
    case EDIT_ADDRESS_STEP:
    case NEW_BILLING_ADDRESS_STEP:
      middlewareTrack(evAddorEditAddressPageView());
      break;
    case SHIP_OPTIONS_STEP:
      middlewareTrack(evSelectShippingSpeedPageView(appState));
      break;
    case PAYMENT_STEP:
      const { sharedPayment: { savedPayments } } = appState;
      if (savedPayments.length) {
        middlewareTrack(pvSelectPaymentInstrumentPageView(appState));
      } else {
        middlewareTrack(evAddorEditPaymentInstrumentPageView());
      }
      break;
    default:
      break;
  }
};

const EVENT_NAME_FOR_STEP = {
  [EDIT_ADDRESS_STEP]: 'TE_PV_CHECKOUT_ESA',
  [NEW_ADDRESS_STEP]: 'TE_PV_CHECKOUT_NSA',
  [NEW_BILLING_ADDRESS_STEP]: 'TE_PV_CHECKOUT_NBA',
  [PAYMENT_STEP]: 'TE_PV_CHECKOUT_SP',
  [REVIEW_STEP]: 'TE_PV_CHECKOUT_SPC',
  [LIST_ADDRESS_STEP]: 'TE_PV_CHECKOUT_SSA',
  [SELECT_BILLING_ADDRESS_STEP]: 'TE_PV_CHECKOUT_SBA',
  [SHIP_OPTIONS_STEP]: 'TE_PV_CHECKOUT_SSO'
};

const monetateCheckoutView = appState => {
  const capProducts = appState?.checkoutData?.productsByLineItem || {};
  const capProductKeys = Object.keys(capProducts);
  if (capProductKeys.length > 0) {
    const productData = capProductKeys.map(v => capProducts[v]).map(v => {
      const { productId, styleId, quantity, price } = v;
      return { productId, sku: styleId, quantity, unitPrice: price };
    });
    sendMonetateEvent(
      ['setPageType', 'checkout'],
      ['addCartRows', productData]
    );
  }
};

export default {
  clientCalled: CONFIGURE_CHECKOUT_SUCCESS,
  pageEvent: CHECKOUT_PAGEVIEW,
  events: {
    [CHECKOUT_ADD_OR_EDIT_ADDRESS_EVENT]: [amethystAddOrEditBillingAndShippingAddress],
    [CHECKOUT_ADD_NEW_PAYMENT_CLICK]: [teClickAddNewPayment, amethystAddOrEditPaymentInstrumentPageView, amethystAddPaymentInstrumentClick],
    [CHECKOUT_APPLY_PROMO]: [teApplyPromo, amethystApplyPromo],
    [CHECKOUT_CHANGE_QUANTITY]: [amethystModifyQuantity, teChangeItemQty],
    [CHECKOUT_CLOSE_PAYMENT_MODAL]: [teClosePaymentModal, amethystCancelSectionClick],
    [CHECKOUT_CLOSE_PAYMENT]: [teClosePayment, amethystCancelSectionClick],
    [CHECKOUT_CLOSE_ADDRESSLIST_MODAL]: [teCloseAddressListModal, amethystCancelSectionClick],
    [CHECKOUT_CLOSE_SUGGESTED_ADDRESS_MODAL]: [teCloseSuggestedAddressModal],
    [CHECKOUT_CLOSE_SELECT_ADDRESS]: [teCloseSelectAddress, amethystCancelSectionClick],
    [CHECKOUT_JUST_LOADED]: [teCheckoutJustLoaded, amethystCheckoutJustLoaded],
    [CHECKOUT_EDIT_ADDRESS]: [amethystEditShippingAddressClick, teSelectEditShippingAddress],
    [CHECKOUT_ON_ADD_NEW_BILLING_ADDRESS_FROM_MODAL_ADDRESS_LIST_CLICK]: [amethystAddBillingAddressClick],
    [CHECKOUT_ON_ADD_NEW_SHIP_ADDRESS_FROM_MODAL_ADDRESS_LIST_CLICK]: [amethystAddShippingAddressClick],
    [CHECKOUT_ON_SHOW_ADD_NEW_SHIPPING_ADDRESS_MODAL_CLICK]: [amethystAddShippingAddressClick],
    [CHECKOUT_ON_USE_BILLING_ADDRESS_CLICK]: [amethystSelectBillingAddress, teChangeBillingAddress],
    [CHECKOUT_ON_USE_SHIPPING_ADDRESS_CLICK]: [amethystSelectShippingAddress, teUpdateUseShippingAddress],
    [CHECKOUT_ON_CHANGE_SHIPPING_CLICK]: [teChangeShippingAddress, amethystChangeSectionClick],
    [CHECKOUT_ON_SELECT_SHIPPING_SPEED]: [amethystSelectShippingSpeed],
    [CHECKOUT_ON_MOVE_TO_FAVORITES_CLICK]: [amethystMoveToFavorites],
    [CHECKOUT_SEND_TO_DESIRED_PAGE]: [fireAmethystPageViewFromEventName, tePageView],
    [CHECKOUT_SEND_TO_MAX_AVAILABLE_STEP]: [fireAmethystPageViewFromEventName, tePageView],
    [CHECKOUT_TRACK_NOT_MAX_STEP]: [fireAmethystPageViewFromEventName, tePageView],
    [CHECKOUT_TOGGLE_ITEMS]: [amethystToggleItems],
    [CHECKOUT_USE_SHIPPING_DOWNGRADE]: [teUseShippingDowngrade, amethystShippingDowngradeIncentiveClick],
    [CHECKOUT_USE_PAYMENT_METHOD]: [teUsePaymentMethod, amethystSelectPaymentInstrument],
    [CHECKOUT_UPDATE_CC_EXPIRATION]: [teUpdateCC],
    [CHECKOUT_TOGGLE_IS_PRIMARY]: [teTogglePrimaryPayment],
    [CHECKOUT_VERIFY_ADDRESS_PAGEVIEW]: [amethystVerifyAddressPageView],
    [CHECKOUT_VIEW_SHIPPING_DOWNGRADE]: [teShippingDowngradeComponentView, amethystShippingDowngradeIncentiveImpression],
    [CHECKOUT_USE_SUGGESTED_ADDRESS]: [amethystSelectSuggestedAddress, teUseSuggestedAddress],
    [CONFIGURE_CHECKOUT_SUCCESS]: [monetateCheckoutView, amethystMultipleDeliveryGroups],
    [DELETE_CHECKOUT_ADDRESS]: [teSelectDeleteShippingAddress],
    [PLACE_ORDER]: [teCheckoutPlaceOrder, amethystPlaceOrder],
    [SAVE_CHECKOUT_ADDRESS]: [teShipToNewAddress],
    [SAVE_CHECKOUT_PAYMENT_METHOD]: [teAddNewPayment],
    [CHECKOUT_ADD_PAYMENT_INSTRUMENT]: [amethystAddPaymentInstrument],
    [SET_SELECTED_PAYMENT_INSTRUMENT_ID]: [teSelectPayment],
    [SET_USE_PROMO_BALANCE]: [teUsePromo, amethystToggleUsePromo],
    [SET_SELECTED_BILLING_ADDRESS_ID]: [teSelectBillingAddress],
    [SET_SELECTED_SHIPPING_ADDRESS_ID]: [teSelectShippingAddress],
    [SET_SELECTED_SUGGESTED_ADDRESS_ID]: [teSelectSuggestedAddress],
    [ON_TOGGLE_IS_ALSO_BILLING]: [teOnToggleIsAlsoBilling],
    [VERIFY_CHECKOUT_CREDIT_CARD]: [teVerifyCC],
    [CHECKOUT_REDEEM_REWARDS_POINTS]: [teRewardsRedeemPoints, amethystRewardsRedeemed],
    [RR_CHANGE_REDEEM_AMOUNT]: [teRewardsChangeRedemptionAmount, amethystRewardsChangeRedemptionAmount],
    [RR_COMPONENT_VIEW]: [teRewardsRedeemPointsComponentView, amethystRewardsRedemptionViewed],
    [API_ERROR]: [teOnApiError],
    [TRACK_CHECKOUT_DELIVERY_PROMISE]: [amethystDeliveryPromiseMissing],
    [CHECKOUT_REMOVE_ITEM]: [amethystRemoveItem],
    [CHECKOUT_TRACK_CV]: [amethystTrackCV],
    [CHECKOUT_TOGGLE_PROMO_BOX]: [amethystTogglePromoBox],
    [CHECKOUT_ON_CHANGE_BILLING_ADDRESS_CLICK]: [amethystChangeSectionClick],
    [CHECKOUT_ON_CHANGE_PAYMENT_CLICK]: [amethystChangeSectionClick],
    [CHECKOUT_ON_PROMISE_DATE_HAS_CHANGED]: [amethystTrackCheckoutPromiseDateHasChanged],
    [ADDRESS_HAS_LOADED_AAC_SUGGESTIONS]: [amethystHasLoadedAacSuggestions],
    [ADDRESS_HAS_SELECTED_AAC_SUGGESTION]: [amethystHasSelectedAacSuggestion],
    [ADDRESS_SAW_ADDRESS_FORM_WITH_AAC]: [amethystSawAddressFormWihtAac],
    [CHECKOUT_SHIP_OPTIONS_LOADED]: [amethystTrackDeliveryGroups],
    [GIFT_OPTIONS_IMPRESSION]: [amethystGiftOptionsImpression],
    [TOGGLE_GIFT_OPTIONS]: [amethystToggleGiftOptions],
    [SET_GIFT_OPTIONS_SAVING]: [amethystSaveGiftOptions],
    [GIFT_OPTIONS_NOT_ELIGIBLE]: [amethystGiftOptionsNotEligible],
    [CHECKOUT_VIEW_ECO_SHIPPING]: [amethystEcoShippingOptionImpression],
    [CHECKOUT_HAD_SHIP_OPTION_AUTO_SELECTED]: [amethystHadShipOptionAutoSelected]
  }
};
