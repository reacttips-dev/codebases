import {
  CART_STEP,
  CHECKOUT_STEP_MAP,
  EDIT_ADDRESS_STEP,
  EDIT_BILLING_ADDRESS_STEP,
  LIST_ADDRESS_STEP,
  NEW_ADDRESS_STEP,
  NEW_BILLING_ADDRESS_STEP,
  PAYMENT_STEP,
  REVIEW_STEP,
  SELECT_BILLING_ADDRESS_STEP,
  SHIP_OPTIONS_STEP,
  TBD_STEP
} from 'constants/checkoutFlow';
import {
  DIGITAL_GC_ONLY_CART,
  MIXED_WITH_BOTH_GC,
  MIXED_WITH_EGC,
  MIXED_WITH_PHYSICAL,
  NON_MIXED_WITH_BOTH_GC,
  PHYSICAL_GC_ONLY_CART,
  RETAIL_ONLY_CART
} from 'constants/cartTypes';
import { filter } from 'helpers/lodashReplacement';
import {
  CHECKOUT_RECEIVE_ORDER_INFORMATION,
  CHECKOUT_RECIEVE_SYMPHONY_CONTENT,
  CHECKOUT_REDEEM_REWARDS_POINTS,
  CHECKOUT_SET_CONFIRMATION_PIXEL_PAYLOAD,
  CHECKOUT_SET_IS_ENROLLED_IN_REWARDS,
  CHECKOUT_STORE_AKITA_ESTIMATE,
  CONFIGURE_CHECKOUT_SUCCESS,
  RESET_CHECKOUT,
  SET_CHECKOUT_DATA_LOADING,
  SET_CHECKOUT_REDEEMABLE_REWARDS,
  SET_CHECKOUT_USE_AS_DEFAULTS,
  SET_IS_PLACING_ORDER,
  SET_SELECTED_ADDRESS_ID,
  SET_SELECTED_BILLING_ADDRESS_ID,
  SET_SELECTED_PAYMENT_INSTRUMENT_ID,
  SET_SELECTED_SHIPPING_ADDRESS_ID,
  SET_USE_PROMO_BALANCE
} from 'store/ducks/checkout/types';
import { toFormatted } from 'store/ducks/address/utils';
import {
  hasBadPromoCodeOrGiftCard,
  hasCartQuantityLimit,
  hasExpiredInstrument,
  hasGenericProblemWithPayment,
  hasInactiveInstrument,
  hasInvalidShippingOptions,
  hasProblemWithItemInCart,
  isMissingProducts,
  isShippableAddress,
  needsShippingOptions,
  needsToReAssociatePaymentToAddress,
  needsValidBillingAddress,
  needsValidPayment,
  needsValidShippingAddress
} from 'helpers/CheckoutUtils';

const defaultState = {
  cartType: null,
  estimate: { shippingDowngrade: {} },
  giftOptions: {},
  isLoaded: false,
  isLoading: false,
  links: {},
  purchase: {},
  selectedAddressId: null,
  selectedPaymentInstrumentId: null,
  selectedShipOptionId: null,
  shipOptions: {},
  useAsDefaults: false,
  usePromoBalance: true,
  usePromoBalanceIsLoading: false,
  maxAvailableStep: REVIEW_STEP
};

export default function checkoutReducer(state = defaultState, action = {}) {
  const {
    isEnrolledInRewards,
    isRedeemingPromo,
    payload,
    redeemableRewards,
    type,
    selectedAddressId,
    selectedPaymentInstrumentId,
    spendPointDollarValue,
    spendPoints,
    useAsDefaults,
    usePromoBalance,
    content
  } = action;

  switch (type) {
    case CHECKOUT_STORE_AKITA_ESTIMATE: {
      const { shipping_downgrade: shippingDowngrade } = payload;
      return { ...state, estimate: { ...state.estimate, shippingDowngrade } };
    }

    case CHECKOUT_SET_IS_ENROLLED_IN_REWARDS: {
      return { ...state, isEnrolledInRewards };
    }

    case CHECKOUT_SET_CONFIRMATION_PIXEL_PAYLOAD: {
      return { ...state, confirmationPixelPayload: payload };
    }

    case CHECKOUT_RECEIVE_ORDER_INFORMATION: {
      return { ...state, orderInfo: payload };
    }

    case SET_CHECKOUT_REDEEMABLE_REWARDS: {
      return { ...state, redeemableRewards, spendPointDollarValue, spendPoints };
    }

    case SET_CHECKOUT_USE_AS_DEFAULTS: {
      return { ...state, useAsDefaults };
    }

    case CHECKOUT_REDEEM_REWARDS_POINTS: {
      return { ...state, isLoading: true };
    }

    case SET_CHECKOUT_DATA_LOADING: {
      return { ...state, isLoading: payload, isRedeemingPromo };
    }

    case SET_IS_PLACING_ORDER: {
      return { ...state, isPlacingOrder: payload };
    }

    case CONFIGURE_CHECKOUT_SUCCESS: {
      const { purchaseStatus } = payload;
      const { selectedPaymentInstrumentId: origSelectedPaymentInstrumentId } = state;
      let newState = { ...state, purchase: purchaseStatus, isLoaded: true, isLoading: false, usePromoBalanceIsLoading: false };

      newState = addCheckoutLinks(newState);
      newState = storeConstraintViolations(newState);
      newState = storePromoRedemptionStatus(newState);
      newState = storeCartType(newState);
      newState = storeFormattedPurchaseAddress(newState);
      newState = storePaymentMethods(newState);
      newState = storeDoesPurchaseRequireCreditCard(newState);
      newState = storeMaxAvailableStep(newState);
      newState = storeCancelChangeLinkVisibility(newState);
      newState = storeNumItems(newState);
      newState = sortProductList(newState);
      newState = storeProductsByLineItem(newState);
      newState = storeHasHazmatItem(newState);

      const { doesPurchaseRequireCC, purchaseCreditCard } = newState;
      const { shipmentSpeed, shippingAddressId: selectedAddressId } = purchaseStatus;
      const selectedShipOptionId = shipmentSpeed;

      if (origSelectedPaymentInstrumentId) {
        return { ...newState, selectedAddressId, selectedShipOptionId };
      } else {
        const selectedPaymentInstrumentId = doesPurchaseRequireCC ? purchaseCreditCard?.paymentInstrumentId : 'savedBalance';
        return { ...newState, selectedAddressId, selectedPaymentInstrumentId, selectedShipOptionId };
      }
    }

    case RESET_CHECKOUT: {
      return defaultState;
    }

    case SET_SELECTED_SHIPPING_ADDRESS_ID:
    case SET_SELECTED_BILLING_ADDRESS_ID:
    case SET_SELECTED_ADDRESS_ID: {
      return { ...state, selectedAddressId };
    }

    case SET_SELECTED_PAYMENT_INSTRUMENT_ID: {
      const { doesPurchaseRequireCC } = state;
      if (selectedPaymentInstrumentId === 'savedBalance') {
        return { ...state, selectedPaymentInstrumentId, usePromoBalance: true };
      } else if (doesPurchaseRequireCC) {
        return { ...state, selectedPaymentInstrumentId };
      } else {
        return { ...state, selectedPaymentInstrumentId, usePromoBalance: false };
      }
    }

    case SET_USE_PROMO_BALANCE: {
      return { ...state, usePromoBalance, usePromoBalanceIsLoading: true };
    }

    case CHECKOUT_RECIEVE_SYMPHONY_CONTENT: {
      return { ...state, content };
    }

    default: {
      return state;
    }
  }
}

export function storePromoRedemptionStatus(state) {
  const { isRedeemingPromo, purchase: { constraintViolations } } = state;
  const showPromoSuccessMessage = isRedeemingPromo && !constraintViolations.length;
  return { ...state, showPromoSuccessMessage, isRedeemingPromo: false };
}

export function storeHasHazmatItem(state) {
  const { purchase: { productList } } = state;

  if (!productList || !productList.length) {
    return state;
  }

  const hasHazmatItem = productList.some(item => item.hazmat?.length);

  return { ...state, hasHazmatItem };
}

export function storeProductsByLineItem(state) {
  const { purchase: { productList } } = state;

  if (!productList || !productList.length) {
    return state;
  }

  const productsByLineItem = productList.reduce((map, product) => {
    map[product.lineItemId] = product;
    return map;
  }, {});

  return { ...state, productsByLineItem };
}

export const storeFormattedPurchaseAddress = state => {
  const { purchase: { shippingAddress } } = state;
  const address = shippingAddress || {};
  const formattedPurchaseAddress = toFormatted(address);
  return { ...state, formattedPurchaseAddress };
};

export const storePaymentMethods = state => {
  const { purchase: { paymentMethods } } = state;

  if (!paymentMethods) {
    return state;
  }

  const purchaseCreditCard = paymentMethods.find(
    item => item.paymentMethodCode !== 'GC') || null;

  const purchaseGiftCard = paymentMethods.find(
    item => item.paymentMethodCode === 'GC') || null;

  return { ...state, purchaseCreditCard, purchaseGiftCard };
};

export const addCheckoutLinks = state => {
  const { purchase: { purchaseId } } = state;
  const links = {
    [LIST_ADDRESS_STEP]: `${CHECKOUT_STEP_MAP[LIST_ADDRESS_STEP]}?pid=${purchaseId}`,
    [REVIEW_STEP]: `${CHECKOUT_STEP_MAP[REVIEW_STEP]}?pid=${purchaseId}`,
    [TBD_STEP]: `${CHECKOUT_STEP_MAP[TBD_STEP]}?pid=${purchaseId}`,
    [EDIT_ADDRESS_STEP]: `${CHECKOUT_STEP_MAP[EDIT_ADDRESS_STEP]}?pid=${purchaseId}`,
    [NEW_ADDRESS_STEP]: `${CHECKOUT_STEP_MAP[NEW_ADDRESS_STEP]}?pid=${purchaseId}`,
    [PAYMENT_STEP]: `${CHECKOUT_STEP_MAP[PAYMENT_STEP]}?pid=${purchaseId}`,
    [SHIP_OPTIONS_STEP]: `${CHECKOUT_STEP_MAP[SHIP_OPTIONS_STEP]}?pid=${purchaseId}`,
    [SELECT_BILLING_ADDRESS_STEP]: `${CHECKOUT_STEP_MAP[SELECT_BILLING_ADDRESS_STEP]}?pid=${purchaseId}`,
    [EDIT_BILLING_ADDRESS_STEP]: `${CHECKOUT_STEP_MAP[EDIT_BILLING_ADDRESS_STEP]}?pid=${purchaseId}`,
    [NEW_BILLING_ADDRESS_STEP]: `${CHECKOUT_STEP_MAP[NEW_BILLING_ADDRESS_STEP]}?pid=${purchaseId}`
  };
  return { ...state, links };
};

export function storeNumItems(state) {
  const { purchase: { productList } } = state;
  const numItems = productList.reduce((sum, item) => item.quantity + sum, 0);
  return { ...state, numItems };
}

export function storeCartType(state) {
  const { purchase: { productList = [] } } = state;
  const eGiftCards = filter(productList, item => !!item.gcCustomization) || [];
  const physicalGiftCards = filter(productList, item => item.glProductGroupType === 'gl_gift_card' && item.gcCustomization === null) || [];
  const totalNumGiftCards = eGiftCards.length + physicalGiftCards.length;
  const digitalItemLineItemId = eGiftCards[0]?.lineItemId;

  switch (true) {
    case eGiftCards.length === productList.length:
      return { ...state, cartType: DIGITAL_GC_ONLY_CART, digitalItemLineItemId };
    case physicalGiftCards.length === productList.length:
      return { ...state, cartType: PHYSICAL_GC_ONLY_CART };
    case totalNumGiftCards === productList.length:
      return { ...state, cartType: NON_MIXED_WITH_BOTH_GC, digitalItemLineItemId };
    case physicalGiftCards.length > 0 && eGiftCards.length > 0:
      return { ...state, cartType: MIXED_WITH_BOTH_GC, digitalItemLineItemId };
    case physicalGiftCards.length > 0:
      return { ...state, cartType: MIXED_WITH_PHYSICAL };
    case eGiftCards.length > 0:
      return { ...state, cartType: MIXED_WITH_EGC, digitalItemLineItemId };
    default:
      return { ...state, cartType: RETAIL_ONLY_CART };
  }
}

export function sortProductList(state) {
  const { purchase: { productList } } = state;
  const sorted = [ ...productList ].sort((a, b) => a.lineItemId - b.lineItemId);
  return { ...state, purchase: { ...state.purchase, productList: sorted } };
}

export function storeDoesPurchaseRequireCreditCard(state) {
  const {
    cartType,
    purchase: {
      chargeSummary: { estimatedTax, grandTotal, totalBeforeTax },
      eligibleBalances: { couponBalance, gcBalance },
      useDiscount: arePromosApplied
    }
  } = state;

  if (cartType !== RETAIL_ONLY_CART) {
    return { ...state, doesPurchaseRequireCC: true };
  }

  // promos are not yet applied
  // this isn't fool proof, but there is no fool proof option here
  // (coupon is pre tax, gc is post tax, so we'd have to recompute the tax which we can't do)
  const doesCouponBalanceCoverPurchase = couponBalance >= totalBeforeTax;
  const doesGiftCardBalanceCoverPurchase = gcBalance > 0 && gcBalance >= (totalBeforeTax - couponBalance + estimatedTax);
  const whenPromosNotApplied = !arePromosApplied && (doesCouponBalanceCoverPurchase || doesGiftCardBalanceCoverPurchase);

  // promos are applied
  const whenPromosApplied = arePromosApplied && grandTotal === 0;
  const doesPurchaseRequireCC = !(whenPromosNotApplied || whenPromosApplied);

  return { ...state, doesPurchaseRequireCC };
}

export function storeConstraintViolations(state) {
  const { purchase: { constraintViolations: cvs } } = state;
  const asinErrors = {};
  const constraintViolations = {};

  if (cvs) {
    cvs.forEach(cv => {
      constraintViolations[cv.name] = cv;
      if (cv.hasOwnProperty('asin')) {
        asinErrors[cv.asin] = asinErrors.hasOwnProperty(cv.asin)
          ? [...asinErrors[cv.asin], { ...cv }]
          : [{ ...cv }];
      }
    });
  }

  return { ...state, asinErrors, constraintViolations };
}

export function storeCancelChangeLinkVisibility(state) {
  const { cartType, maxAvailableStep } = state;
  const isDigitalDeliveryOnly = DIGITAL_GC_ONLY_CART === cartType;

  switch (true) {
    case maxAvailableStep >= REVIEW_STEP:
      return {
        ...state,
        canChangeAddress: !isDigitalDeliveryOnly,
        canCancelAddress: !isDigitalDeliveryOnly,
        canChangePayment: true,
        canCancelPayment: true,
        canChangeShipOptions: !isDigitalDeliveryOnly,
        canCancelShipOptions: !isDigitalDeliveryOnly
      };
    case maxAvailableStep >= PAYMENT_STEP:
      return {
        ...state,
        canChangeAddress: !isDigitalDeliveryOnly,
        canCancelAddress: !isDigitalDeliveryOnly,
        canChangePayment: false,
        canCancelPayment: false,
        canChangeShipOptions: false,
        canCancelShipOptions: false
      };
    default: {
      return {
        ...state,
        canChangeAddress: false,
        canCancelAddress: false,
        canChangePayment: false,
        canCancelPayment: false,
        canChangeShipOptions: false,
        canCancelShipOptions: false
      };
    }
  }
}

export function storeMaxAvailableStep(state) {
  const {
    constraintViolations: cvs,
    purchase: { shippingAddress }
  } = state;

  const isAddressShippable = shippingAddress && shippingAddress.countryCode && isShippableAddress(shippingAddress.countryCode);
  const hasAddressAndItIsNotShippable = shippingAddress && !isAddressShippable;

  if (hasBadPromoCodeOrGiftCard(cvs)) {
    // change nothing, as could be adding GC from a few different places
    return state;
  }

  // ************************
  // Order here is important!
  // ************************
  switch (true) {
    case hasCartQuantityLimit(cvs):
    case isMissingProducts(cvs):
      // this means our middleware is broken, as should never get here
      return { ...state, maxAvailableStep: CART_STEP };
    case hasAddressAndItIsNotShippable:
    case needsValidShippingAddress(cvs):
      return { ...state, maxAvailableStep: LIST_ADDRESS_STEP };
    case needsValidPayment(cvs):
      return { ...state, maxAvailableStep: PAYMENT_STEP };
    case hasInactiveInstrument(cvs):
      return { ...state, maxAvailableStep: PAYMENT_STEP };
    case hasExpiredInstrument(cvs):
    case needsToReAssociatePaymentToAddress(cvs):
      return { ...state, maxAvailableStep: PAYMENT_STEP };
    case needsValidBillingAddress(cvs):
      return { ...state, maxAvailableStep: SELECT_BILLING_ADDRESS_STEP };
    case needsShippingOptions(cvs): {
      return { ...state, maxAvailableStep: REVIEW_STEP };
    }
    case hasInvalidShippingOptions(cvs):
      // can't kick to ship options step, as could be item that has no ship options
      return { ...state, maxAvailableStep: REVIEW_STEP };
    case hasGenericProblemWithPayment(cvs):
      return { ...state, maxAvailableStep: PAYMENT_STEP };
    case hasProblemWithItemInCart(cvs):
      return { ...state, maxAvailableStep: REVIEW_STEP };
    default:
      return { ...state, maxAvailableStep: REVIEW_STEP };
  }
}
