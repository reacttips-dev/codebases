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
  CHECKOUT_FETCH_AKITA_ESTIMATE,
  CHECKOUT_FETCH_LAT_LONG,
  CHECKOUT_FETCH_ORDERS_BY_PURCHASE_ID,
  CHECKOUT_FETCH_SYMPHONY_CONTENT,
  CHECKOUT_HAD_SHIP_OPTION_AUTO_SELECTED,
  CHECKOUT_JUST_LOADED,
  CHECKOUT_LOAD_AUTOCOMPLETE_SUGGESTIONS,
  CHECKOUT_ON_ADD_NEW_BILLING_ADDRESS_FROM_MODAL_ADDRESS_LIST_CLICK,
  CHECKOUT_ON_ADD_NEW_SHIP_ADDRESS_FROM_MODAL_ADDRESS_LIST_CLICK,
  CHECKOUT_ON_ASIN_HAS_GONE_OOS,
  CHECKOUT_ON_CHANGE_BILLING_ADDRESS_CLICK,
  CHECKOUT_ON_CHANGE_PAYMENT_CLICK,
  CHECKOUT_ON_CHANGE_SHIPPING_CLICK,
  CHECKOUT_ON_HIDE_BILLING_ADDRESS_FORM_MODAL_FROM_MODAL_ADDRESS_LIST_CLICK,
  CHECKOUT_ON_HIDE_BILLING_ADDRESS_MODAL_CLICK,
  CHECKOUT_ON_HIDE_NEW_SHIPPING_ADDRESS_MODAL_CLICK,
  CHECKOUT_ON_HIDE_SHIPPING_ADDRESS_FORM_MODAL_FROM_MODAL_ADDRESS_LIST_CLICK,
  CHECKOUT_ON_MAX_STEP_IS_CART_STEP,
  CHECKOUT_ON_MOVE_TO_FAVORITES_CLICK,
  CHECKOUT_ON_PROMISE_DATE_HAS_CHANGED,
  CHECKOUT_ON_SELECT_SHIPPING_SPEED,
  CHECKOUT_ON_SHOW_ADD_NEW_SHIPPING_ADDRESS_MODAL_CLICK,
  CHECKOUT_ON_USE_BILLING_ADDRESS_CLICK,
  CHECKOUT_ON_USE_SHIPPING_ADDRESS_CLICK,
  CHECKOUT_REDEEM_REWARDS_POINTS,
  CHECKOUT_REMOVE_ITEM,
  CHECKOUT_SEND_TO_DESIRED_PAGE,
  CHECKOUT_SEND_TO_MAX_AVAILABLE_STEP,
  CHECKOUT_SEND_TO_NEW_ADDRESS_WHEN_NO_SAVED_ADDRESSES,
  CHECKOUT_SET_IS_ENROLLED_IN_REWARDS,
  CHECKOUT_SHIP_OPTIONS_LOADED,
  CHECKOUT_TOGGLE_IS_PRIMARY,
  CHECKOUT_TOGGLE_ITEMS,
  CHECKOUT_TOGGLE_PROMO_BOX,
  CHECKOUT_TRACK_CV,
  CHECKOUT_TRACK_NOT_MAX_STEP,
  CHECKOUT_UPDATE_CC_EXPIRATION,
  CHECKOUT_USE_NEW_ADDRESS,
  CHECKOUT_USE_PAYMENT_METHOD,
  CHECKOUT_USE_SHIPPING_DOWNGRADE,
  CHECKOUT_USE_SUGGESTED_ADDRESS,
  CHECKOUT_VERIFY_ADDRESS_PAGEVIEW,
  CHECKOUT_VIEW_ECO_SHIPPING,
  CHECKOUT_VIEW_SHIPPING_DOWNGRADE,
  CONFIGURE_CHECKOUT,
  DELETE_CHECKOUT_ADDRESS,
  PLACE_ORDER,
  REQUEST_CHECKOUT_ADDRESSES,
  REQUEST_CHECKOUT_PAYMENTS,
  REQUEST_CHECKOUT_REDEEMABLE_REWARDS,
  RESET_CHECKOUT,
  SAVE_CHECKOUT_ADDRESS,
  SAVE_CHECKOUT_PAYMENT_METHOD,
  SET_CHECKOUT_USE_AS_DEFAULTS,
  SET_SELECTED_ADDRESS_ID,
  SET_SELECTED_BILLING_ADDRESS_ID,
  SET_SELECTED_PAYMENT_INSTRUMENT_ID,
  SET_SELECTED_SHIPPING_ADDRESS_ID,
  SET_SELECTED_SUGGESTED_ADDRESS_ID,
  SET_USE_PROMO_BALANCE,
  TRACK_CHECKOUT_DELIVERY_PROMISE,
  VERIFY_CHECKOUT_CREDIT_CARD
} from 'store/ducks/checkout/types';
import { BILLING_ADDRESS_SECTION, PAYMENT_SECTION, SHIPPING_SECTTION } from 'constants/amethyst';

export const placeCheckoutOrder = () => ({ type: PLACE_ORDER });
export const onCheckoutJustLoaded = () => ({ type: CHECKOUT_JUST_LOADED });
export const trackCheckoutDeliveryPromise = () => ({ type: TRACK_CHECKOUT_DELIVERY_PROMISE });
export const onHadConstraintViolation = constraintViolation => ({ type: CHECKOUT_TRACK_CV, constraintViolation });
export const onHadShipOptionAutoSelected = () => ({ type: CHECKOUT_HAD_SHIP_OPTION_AUTO_SELECTED });

// ----- review items
export const onMoveToFavoritesClick = payload => ({ type: CHECKOUT_ON_MOVE_TO_FAVORITES_CLICK, payload });
export const onChangeQuantityEvent = (newQuantity, originalQuantity, product) => ({ type: CHECKOUT_CHANGE_QUANTITY, newQuantity, originalQuantity, product });
export const onToggleItemsEvent = isShown => ({ type: CHECKOUT_TOGGLE_ITEMS, isShown });
export const onRemoveItem = () => ({ type: CHECKOUT_REMOVE_ITEM });

// ----- address related
export const onDeleteShipAddressClick = addressId => ({ type: DELETE_CHECKOUT_ADDRESS, addressId });
export const onDeleteBillingAddressClick = addressId => ({ type: DELETE_CHECKOUT_ADDRESS, addressId });
export const saveShippingAddress = () => ({ type: SAVE_CHECKOUT_ADDRESS, isBilling: false });
export const saveBillingAddress = () => ({ type: SAVE_CHECKOUT_ADDRESS, isBilling: true });
export const setSelectedAddressId = selectedAddressId => ({ type: SET_SELECTED_ADDRESS_ID, selectedAddressId });
export const onSelectedShippingAddress = selectedAddressId => ({ type: SET_SELECTED_SHIPPING_ADDRESS_ID, selectedAddressId });
export const onSelectedBillingAddress = selectedAddressId => ({ type: SET_SELECTED_BILLING_ADDRESS_ID, selectedAddressId });
export const onSelectedSuggestedShippingAddress = (selectedAddressId, selectedAddressIndex) => ({ type: SET_SELECTED_SUGGESTED_ADDRESS_ID, selectedAddressId, selectedAddressIndex, addressType: 1 });
export const onSelectedSuggestedBillingAddress = (selectedAddressId, selectedAddressIndex) => ({ type: SET_SELECTED_SUGGESTED_ADDRESS_ID, selectedAddressId, selectedAddressIndex, addressType: 2 });
export const requestAddresses = () => ({ type: REQUEST_CHECKOUT_ADDRESSES });
export const onHideBillingAddressModalClick = () => ({ type: CHECKOUT_ON_HIDE_BILLING_ADDRESS_MODAL_CLICK });
export const onHideNewShippingAddressModalClick = () => ({ type: CHECKOUT_ON_HIDE_NEW_SHIPPING_ADDRESS_MODAL_CLICK });
export const onShowAddNewShippingAddressModalClick = () => ({ type: CHECKOUT_ON_SHOW_ADD_NEW_SHIPPING_ADDRESS_MODAL_CLICK });
export const onSendToNewAddressWhenNoSavedAddresses = () => ({ type: CHECKOUT_SEND_TO_NEW_ADDRESS_WHEN_NO_SAVED_ADDRESSES });
export const onAddNewShippingAddressFromModalAddressListClick = () => ({ type: CHECKOUT_ON_ADD_NEW_SHIP_ADDRESS_FROM_MODAL_ADDRESS_LIST_CLICK });
export const onAddNewBillingAddressFromModalAddressListClick = () => ({ type: CHECKOUT_ON_ADD_NEW_BILLING_ADDRESS_FROM_MODAL_ADDRESS_LIST_CLICK });
export const onHideShippingAddressFormModalFromModalAddressListClick = () => ({ type: CHECKOUT_ON_HIDE_SHIPPING_ADDRESS_FORM_MODAL_FROM_MODAL_ADDRESS_LIST_CLICK });
export const onHideBillingAddressFormModalFromModalAddressListClick = () => ({ type: CHECKOUT_ON_HIDE_BILLING_ADDRESS_FORM_MODAL_FROM_MODAL_ADDRESS_LIST_CLICK });
export const onCloseSelectShippingAddressListClick = () => ({ type: CHECKOUT_CLOSE_SELECT_ADDRESS, sourceSection: SHIPPING_SECTTION });
export const onFetchLatLong = query => ({ type: CHECKOUT_FETCH_LAT_LONG, query });
export const onLoadAddressAutocompleteSuggestions = ({ query, near, countryCode }) => ({ type: CHECKOUT_LOAD_AUTOCOMPLETE_SUGGESTIONS, query, near, countryCode });

// ---- address event related
export const onUseShippingAddressClick = (selectedAddressId, addressIndex) => ({ type: CHECKOUT_ON_USE_SHIPPING_ADDRESS_CLICK, selectedAddressId, addressIndex });
export const onUseBillingAddressClick = (selectedAddressId, addressIndex) => ({ type: CHECKOUT_ON_USE_BILLING_ADDRESS_CLICK, selectedAddressId, addressIndex });
export const onChangeShippingAddressClick = () => ({ type: CHECKOUT_ON_CHANGE_SHIPPING_CLICK, changeToSection: SHIPPING_SECTTION });
export const onEditAddressClick = (editAddressId, editAddressIndex) => ({ type: CHECKOUT_EDIT_ADDRESS, editAddressId, editAddressIndex });
export const onUseSuggestedAddressClick = (addressType, selectedAddressId) => ({ type: CHECKOUT_USE_SUGGESTED_ADDRESS, addressType, selectedAddressId });
export const onCloseAddressModal = isBilling => ({ type: CHECKOUT_CLOSE_ADDRESSLIST_MODAL, isBilling, sourceSection: isBilling ? BILLING_ADDRESS_SECTION : SHIPPING_SECTTION });
export const onCloseSuggestedAddressModal = () => ({ type: CHECKOUT_CLOSE_SUGGESTED_ADDRESS_MODAL });
export const onUseNewBillingAddressClick = () => ({ type: CHECKOUT_USE_NEW_ADDRESS });
export const onChangeBillingAddressClick = () => ({ type: CHECKOUT_ON_CHANGE_BILLING_ADDRESS_CLICK, changeToSection: BILLING_ADDRESS_SECTION });
export const onVerifyAddressPageView = () => ({ type: CHECKOUT_VERIFY_ADDRESS_PAGEVIEW });
export const onAddOrEditAddressEvent = (passedValidation, addressId, addressType) => ({ type: CHECKOUT_ADD_OR_EDIT_ADDRESS_EVENT, passedValidation, addressId, addressType });
export const onAddOrEditBillingAddressErrorEvent = () => ({ type: CHECKOUT_ADD_OR_EDIT_ADDRESS_EVENT, passedValidation: false, addressId: null, addressType: 1 });
export const onAddOrEditShippingAddressErrorEvent = () => ({ type: CHECKOUT_ADD_OR_EDIT_ADDRESS_EVENT, passedValidation: false, addressId: null, addressType: 2 });

// ----- payment related
export const requestPayments = () => ({ type: REQUEST_CHECKOUT_PAYMENTS });
export const setSelectedPaymentInstrumentId = ({ paymentInstrumentId }) => ({ type: SET_SELECTED_PAYMENT_INSTRUMENT_ID, selectedPaymentInstrumentId: paymentInstrumentId });
export const savePaymentInstrument = ({ instrument, addressId, updatingAddress }) => ({ type: SAVE_CHECKOUT_PAYMENT_METHOD, instrument, addressId, updatingAddress });
export const setUsePromoBalance = usePromoBalance => ({ type: SET_USE_PROMO_BALANCE, usePromoBalance });
export const verifyCreditCard = ({ number, paymentInstrumentId }) => ({ type: VERIFY_CHECKOUT_CREDIT_CARD, number, paymentInstrumentId });
export const onUseShippingOptionClick = promise => ({ type: CHECKOUT_ON_SELECT_SHIPPING_SPEED, promise });
export const onAddPaymentInstrumentEvent = (paymentInstrumentId, makeDefaultPaymentInstrument, passedValidation) => ({ type: CHECKOUT_ADD_PAYMENT_INSTRUMENT, paymentInstrumentId, makeDefaultPaymentInstrument, passedValidation });
export const onAddPaymentInstrumentErrorEvent = makeDefaultPaymentInstrument => ({ type: CHECKOUT_ADD_PAYMENT_INSTRUMENT, paymentInstrumentId: null, makeDefaultPaymentInstrument, passedValidation: false });
export const onChangePaymentClick = () => ({ type: CHECKOUT_ON_CHANGE_PAYMENT_CLICK, changeToSection: PAYMENT_SECTION });

// ----- payment events related
export const onUsePaymentMethodClickEvent = (paymentInstrumentId, hasVerifyCreditCardError, index) => ({ type: CHECKOUT_USE_PAYMENT_METHOD, paymentInstrumentId, hasVerifyCreditCardError, index });
export const onAddNewPaymentClickEvent = () => ({ type: CHECKOUT_ADD_NEW_PAYMENT_CLICK });
export const onCloseNewPaymentEvent = () => ({ type: CHECKOUT_CLOSE_PAYMENT_MODAL });
export const onClosePaymentEvent = () => ({ type: CHECKOUT_CLOSE_PAYMENT, sourceSection: PAYMENT_SECTION });
export const onUpdateExpiration = () => ({ type: CHECKOUT_UPDATE_CC_EXPIRATION });
export const onToggleIsPrimary = isPrimary => ({ type: CHECKOUT_TOGGLE_IS_PRIMARY, isPrimary });
export const onApplyPromo = () => ({ type: CHECKOUT_APPLY_PROMO });
export const onTogglePromoBox = () => ({ type: CHECKOUT_TOGGLE_PROMO_BOX });

// ----- flow control
export const onMaxStepIsCartStep = () => ({ type: CHECKOUT_ON_MAX_STEP_IS_CART_STEP });
export const onSendToMaxAvailableStep = step => ({ type: CHECKOUT_SEND_TO_MAX_AVAILABLE_STEP, step });
export const onSendToDesiredPage = (step, query) => ({ type: CHECKOUT_SEND_TO_DESIRED_PAGE, step, query });

// ----- order confirmation
export const onFetchOrdersByPurchaseId = pId => ({ type: CHECKOUT_FETCH_ORDERS_BY_PURCHASE_ID, pId });

// ----- common
export const onCheckoutShipOptionsLoaded = () => ({ type: CHECKOUT_SHIP_OPTIONS_LOADED });
export const onCheckoutPromiseDateHasChanged = ({ duration, name, purchaseId, promiseDate, prevPromiseDate, sameOtherThanType, type }) => ({ type: CHECKOUT_ON_PROMISE_DATE_HAS_CHANGED, duration, name, purchaseId, promiseDate, prevPromiseDate, sameOtherThanType, changeType: type });
export const onViewShippingDowngrade = ({ dollarAmount, offeredSpeed, rewardsPoints }) => ({ type: CHECKOUT_VIEW_SHIPPING_DOWNGRADE, dollarAmount, offeredSpeed, rewardsPoints });
export const onUseShippingDowngradeClick = ({ dollarAmount, offeredSpeed, rewardsPoints }) => ({ type: CHECKOUT_USE_SHIPPING_DOWNGRADE, dollarAmount, offeredSpeed, rewardsPoints });
export const onFetchAkitaEstimate = () => ({ type: CHECKOUT_FETCH_AKITA_ESTIMATE });
export const onDetermineIsEnrolledInRewards = isEnrolledInRewards => ({ type: CHECKOUT_SET_IS_ENROLLED_IN_REWARDS, isEnrolledInRewards });
export const onRequestRedeemableRewards = () => ({ type: REQUEST_CHECKOUT_REDEEMABLE_REWARDS });
export const onRedeemPoints = spendPoints => ({ type: CHECKOUT_REDEEM_REWARDS_POINTS, spendPoints });
export const onAsinHasGoneOos = asin => ({ type: CHECKOUT_ON_ASIN_HAS_GONE_OOS, asin });
export const onUseAsDefaultsLoad = useAsDefaults => ({ type: SET_CHECKOUT_USE_AS_DEFAULTS, useAsDefaults });
export const onUseAsDefaultsToggle = useAsDefaults => ({ type: SET_CHECKOUT_USE_AS_DEFAULTS, useAsDefaults });
export const resetCheckout = () => ({ type: RESET_CHECKOUT });
export const trackEventNotMaxAvailable = step => ({ type: CHECKOUT_TRACK_NOT_MAX_STEP, step });
export const fetchCheckoutContent = () => ({ type: CHECKOUT_FETCH_SYMPHONY_CONTENT });
export const onViewEcoShipping = () => ({ type: CHECKOUT_VIEW_ECO_SHIPPING });
export const configurePurchase = ({ addressId, advanceOnSuccess, coupon, giftOptions, includePaymentsAndAddresses, paymentMethods, purchaseId, quantityUpdate, shipmentOptionId, shipmentOptionLineItemIds, isRemovingGiftOptions, isSavingGiftOptions, filterShipOptionsOnFirstLoad }) => {

  /*
Leaving this comment in here for now, as we still need to decide if we'll bother using some of the flags below:
  reqData = {
    useGCBalance: true,
    useDiscount: true,
    purchaseId: null
  },
  includeAssociated = true,
  [x added below] includePaymentsAndAddresses = false,
*/
  const reqData = {
    purchaseId
  };

  if (quantityUpdate) {
    reqData.quantityUpdate = quantityUpdate;
  }

  if (coupon) {
    reqData.coupon = coupon;
  }

  if (addressId) {
    reqData.addressId = addressId;
  }

  if (paymentMethods) {
    reqData.paymentMethods = paymentMethods;
  }

  if (shipmentOptionId) {
    reqData.shipmentOptionId = shipmentOptionId;
  }

  if (shipmentOptionLineItemIds) {
    reqData.shipmentOptionLineItemIds = shipmentOptionLineItemIds;
  }

  if (giftOptions) {
    reqData.giftOptions = giftOptions;
  }

  if (isRemovingGiftOptions) {
    reqData.isRemovingGiftOptions = isRemovingGiftOptions;
  }

  if (isSavingGiftOptions) {
    reqData.isSavingGiftOptions = isSavingGiftOptions;
  }

  const configureParams = {
    advanceOnSuccess,
    reqData
  };

  if (filterShipOptionsOnFirstLoad) {
    configureParams.filterShipOptionsOnFirstLoad = true;
  }

  // temporary hack to support filtering ship options on the client; once changes are made in mafia (no ticket yet), this can go away
  if (reqData.addressId || reqData.quantityUpdate) {
    configureParams.includeShipmentOptions = true;
  }

  if (includePaymentsAndAddresses) {
    configureParams.includePaymentsAndAddresses = true;
  }

  return { type: CONFIGURE_CHECKOUT, configureParams };
};
