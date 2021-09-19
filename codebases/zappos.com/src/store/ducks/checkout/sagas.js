import { call, put, select, takeEvery } from 'redux-saga/effects';

import { extractCheckoutPixelServerData } from 'actions/checkout/pixelServer';
import { CHECKOUT_PAGE } from 'constants/amethystPageTypes';
import {
  LIST_ADDRESS_STEP,
  NEW_ADDRESS_STEP,
  NEW_BILLING_ADDRESS_STEP,
  PAYMENT_STEP,
  REVIEW_STEP,
  SELECT_BILLING_ADDRESS_STEP
} from 'constants/checkoutFlow';
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
import { DIGITAL_GC_ONLY_CART } from 'constants/cartTypes';
import {
  API_ERROR,
  CART_RESET_STATE,
  CHECKOUT_UPDATED_QUANTITY,
  RECEIVE_CART_ITEMS,
  REDIRECT,
  SET_FEDERATED_LOGIN_MODAL_VISIBILITY,
  SET_SHOULD_FIRE_ORDER_CONFIRMATION_PIXEL
} from 'constants/reduxActions';
import { REDEEM_REWARDS_ERROR, REDEEM_REWARDS_SUCCESS, REDEEM_REWARDS_TIMEOUT } from 'constants/rewardsInfo';
import { pvOrderConfirmation } from 'events/checkout';
import { evCheckoutFromInfluencer } from 'events/influencer';
import { buildAuthenticationRedirectUrl } from 'utils/redirect';
import { clearCartCount, updateCartCount } from 'actions/cart';
import { titaniteView, track } from 'apis/amethyst';
import {
  addToList,
  changeCart,
  configureCheckout,
  getAkitaEstimator,
  getOrdersByPurchaseId,
  getPixelData,
  getRedeemableRewards,
  placeOrder,
  recordToSplunk
} from 'apis/checkout';
import {
  getSymphonySlots
} from 'apis/mafia';
import { trackOrderConfirmationEvent } from 'helpers/analytics';
import { clearCartLocalStorage, storeCartToLocalStorage } from 'helpers/CartUtils';
import { clearInfluencerLocalStorage, getInfluencerToken } from 'helpers/InfluencerUtils';
import { buildCheckoutErrorQueryString, buildOrderConfirmationEventData, hasBadPromoCodeOrGiftCardFromCVList, isDigitalChallenge } from 'helpers/CheckoutUtils';
import logger from 'middleware/logger';
import {
  ERROR_CANNOT_CONFIRM_PURCHASE_OOS,
  ERROR_CANNOT_CONFIRM_PURCHASE_OTHER,
  ERROR_EDIT_INACTIVE_ADDRESS,
  ERROR_EMPTY_CART,
  ERROR_INVALID_GIFT_OPTIONS,
  ERROR_NOT_AUTHENTICATED,
  ERROR_PURCHASE_NOT_FOUND,
  ERROR_QUANTITY_CHANGE_REQUEST_VALIDATION,
  ERROR_REQUEST_VALIDATION,
  REDEEMABLE_REWARDS_NOT_FOUND
} from 'middleware/fetchErrorMiddleware';
import {
  configurePurchase,
  onAddOrEditAddressEvent,
  onAddOrEditBillingAddressErrorEvent,
  onAddOrEditShippingAddressErrorEvent,
  onAddPaymentInstrumentErrorEvent,
  onAddPaymentInstrumentEvent,
  onAsinHasGoneOos,
  onDetermineIsEnrolledInRewards,
  onRequestRedeemableRewards,
  requestPayments,
  resetCheckout
} from 'store/ducks/checkout/actions';
import {
  onToggleIsAlsoBilling,
  storeEditOfInactiveAddressError,
  storeTempFailureMsg,
  storeTempSuccessMsg
} from 'store/ducks/address/actions';
import {
  setGiftOptionsSaving
} from 'store/ducks/giftoptions/actions';
import {
  CHECKOUT_FETCH_AKITA_ESTIMATE,
  CHECKOUT_FETCH_LAT_LONG,
  CHECKOUT_FETCH_ORDERS_BY_PURCHASE_ID,
  CHECKOUT_FETCH_SYMPHONY_CONTENT,
  CHECKOUT_JUST_LOADED,
  CHECKOUT_LOAD_AUTOCOMPLETE_SUGGESTIONS,
  CHECKOUT_ON_ADD_NEW_BILLING_ADDRESS_FROM_MODAL_ADDRESS_LIST_CLICK,
  CHECKOUT_ON_ADD_NEW_SHIP_ADDRESS_FROM_MODAL_ADDRESS_LIST_CLICK,
  CHECKOUT_ON_ASIN_HAS_GONE_OOS,
  CHECKOUT_ON_HIDE_BILLING_ADDRESS_FORM_MODAL_FROM_MODAL_ADDRESS_LIST_CLICK,
  CHECKOUT_ON_HIDE_BILLING_ADDRESS_MODAL_CLICK,
  CHECKOUT_ON_HIDE_NEW_SHIPPING_ADDRESS_MODAL_CLICK,
  CHECKOUT_ON_HIDE_SHIPPING_ADDRESS_FORM_MODAL_FROM_MODAL_ADDRESS_LIST_CLICK,
  CHECKOUT_ON_MAX_STEP_IS_CART_STEP,
  CHECKOUT_ON_MOVE_TO_FAVORITES_CLICK,
  CHECKOUT_ON_SHOW_ADD_NEW_SHIPPING_ADDRESS_MODAL_CLICK,
  CHECKOUT_RECEIVE_ORDER_INFORMATION,
  CHECKOUT_RECIEVE_SYMPHONY_CONTENT,
  CHECKOUT_REDEEM_REWARDS_POINTS,
  CHECKOUT_SEND_TO_DESIRED_PAGE,
  CHECKOUT_SEND_TO_MAX_AVAILABLE_STEP,
  CHECKOUT_SEND_TO_NEW_ADDRESS_WHEN_NO_SAVED_ADDRESSES,
  CHECKOUT_SET_CONFIRMATION_PIXEL_PAYLOAD,
  CHECKOUT_STORE_AKITA_ESTIMATE,
  CONFIGURE_CHECKOUT,
  CONFIGURE_CHECKOUT_SUCCESS,
  DELETE_CHECKOUT_ADDRESS,
  PLACE_ORDER,
  REQUEST_CHECKOUT_ADDRESSES,
  REQUEST_CHECKOUT_PAYMENTS,
  REQUEST_CHECKOUT_REDEEMABLE_REWARDS,
  SAVE_CHECKOUT_ADDRESS,
  SAVE_CHECKOUT_PAYMENT_METHOD,
  SET_CHECKOUT_DATA_LOADING,
  SET_CHECKOUT_REDEEMABLE_REWARDS,
  SET_FORM_ERRORS,
  SET_IS_PLACING_ORDER,
  SET_SELECTED_PAYMENT_INSTRUMENT_ID,
  VERIFY_CHECKOUT_CREDIT_CARD
} from 'store/ducks/checkout/types';
import { SET_REDEEMING_REWARDS_STATUS } from 'store/ducks/rewards/types';
import { ADDRESS_CLEAR_AAC_DATA, SET_ADDRESS_DATA_LOADING } from 'store/ducks/address/types';
import { clearPaymentErrors, setHasVerifyCreditCardError } from 'store/ducks/payment/actions';
import { SET_PAYMENT_DATA_LOADING } from 'store/ducks/payment/types';
import { workDeleteAddress, workFetchLatLong, workLoadAutocompleteSuggestions, workRequestAddresses, workUpdateAddress } from 'store/ducks/address/sagas';
import { firePixelServer } from 'store/ducks/pixelServer/sagas';
import { workRedeemPoints } from 'store/ducks/rewards/sagas';
import {
  getAccountApiAndCredentials,
  getAddressFormItemIsBilling,
  getAkitaKey,
  getCartType,
  getCheckoutLinks,
  getCheckoutProducts,
  getFormattedConstraintViolations,
  getIsAlsoBilling,
  getMafiaAndCredentials,
  getNumberPurchaseProducts,
  getPurchaseAddresses,
  getPurchaseCard,
  getPurchaseData,
  getPurchaseId,
  getPurchaseShippingAddress,
  getShouldFireOrderConfirmationPixel,
  getUseAsDefaults,
  getUsePromoBalances,
  getVersionNumber,
  getWasAddressValid
} from 'store/ducks/readFromStore';
import { workRequestPayments, workSavePaymentInstrument, workVerifyCreditCard } from 'store/ducks/payment/sagas';
import { withSession } from 'store/ducks/session/sagas';
import { SET_SHIP_OPTIONS_NOT_LOADED } from 'store/ducks/shipOption/types';
import marketplace from 'cfg/marketplace.json';

export function* watchOnFetchOrdersByPurchaseId() {
  yield takeEvery(CHECKOUT_FETCH_ORDERS_BY_PURCHASE_ID, workFetchOrdersByPurchaseId);
}

export function* watchOnMoveToFavoritesClick() {
  yield takeEvery(CHECKOUT_ON_MOVE_TO_FAVORITES_CLICK, workOnMoveToFavoritesClick);
}

export function* watchSendToDesiredPage() {
  yield takeEvery(CHECKOUT_SEND_TO_DESIRED_PAGE, workGoToStep);
}

export function* watchSendToMaxAvailableStep() {
  yield takeEvery(CHECKOUT_SEND_TO_MAX_AVAILABLE_STEP, workGoToStep);
}

export function* watchOnHideBillingAddressFromModalAddressList() {
  yield takeEvery(CHECKOUT_ON_HIDE_BILLING_ADDRESS_FORM_MODAL_FROM_MODAL_ADDRESS_LIST_CLICK, workGoToStep, { step: SELECT_BILLING_ADDRESS_STEP });
}

export function* watchOnHideShippingAddressFromModalAddressList() {
  yield takeEvery(CHECKOUT_ON_HIDE_SHIPPING_ADDRESS_FORM_MODAL_FROM_MODAL_ADDRESS_LIST_CLICK, workGoToStep, { step: LIST_ADDRESS_STEP });
}

export function* watchOnAddNewBillingAddressFromModalAddressList() {
  yield takeEvery(CHECKOUT_ON_ADD_NEW_BILLING_ADDRESS_FROM_MODAL_ADDRESS_LIST_CLICK, workGoToStep, { step: NEW_BILLING_ADDRESS_STEP });
}

export function* watchOnAddNewShippingAddressFromModalAddressList() {
  yield takeEvery(CHECKOUT_ON_ADD_NEW_SHIP_ADDRESS_FROM_MODAL_ADDRESS_LIST_CLICK, workGoToStep, { step: NEW_ADDRESS_STEP });
}

export function* watchOnMaxStepIsCartStep() {
  yield takeEvery(CHECKOUT_ON_MAX_STEP_IS_CART_STEP, workGoToCart);
}

export function* watchOnSendToNewAddressWhenNoSavedAddresses() {
  yield takeEvery(CHECKOUT_SEND_TO_NEW_ADDRESS_WHEN_NO_SAVED_ADDRESSES, workGoToStep, { step: NEW_ADDRESS_STEP });
}

export function* watchOnShowNewShippingAddressModalClick() {
  yield takeEvery(CHECKOUT_ON_SHOW_ADD_NEW_SHIPPING_ADDRESS_MODAL_CLICK, workGoToStep, { step: NEW_ADDRESS_STEP });
}

export function* watchOnHideBillingAddressModalClick() {
  yield takeEvery(CHECKOUT_ON_HIDE_BILLING_ADDRESS_MODAL_CLICK, workGoToStep, { step: REVIEW_STEP });
}

export function* watchOnHideNewShippingAddressModalClick() {
  yield takeEvery(CHECKOUT_ON_HIDE_NEW_SHIPPING_ADDRESS_MODAL_CLICK, workGoToStep, { step: LIST_ADDRESS_STEP });
}

export function* watchOnFetchAkitaEstimate() {
  yield takeEvery(CHECKOUT_FETCH_AKITA_ESTIMATE, workOnFetchAkitaEstimate);
}

export function* watchOnCheckoutJustLoaded() {
  yield takeEvery(CHECKOUT_JUST_LOADED, workOnCheckoutJustLoaded);
}

export function* workOnCheckoutJustLoaded() {
  const state = yield select();
  const trackingPayload = yield call(extractCheckoutPixelServerData, state);
  yield call(firePixelServer, { pageType: 'checkout', trackingPayload });
}

export function* workOnFetchAkitaEstimate() {
  const akitaKey = yield select(getAkitaKey);
  const { mafia, credentials } = yield select(getMafiaAndCredentials);
  try {
    const { payload } = yield call(withSession, [getAkitaEstimator, mafia, akitaKey, credentials]);
    yield put({ type: CHECKOUT_STORE_AKITA_ESTIMATE, payload });
  } catch (error) {
    recordToSplunk(buildCheckoutErrorQueryString({ function: 'workOnFetchAkitaEstimate' }));
    yield call(catchHandler, error);
  }
}

export function* workFetchOrdersByPurchaseId({ pId }) {
  try {
    const { mafia, credentials } = yield select(getMafiaAndCredentials);
    const shouldFireOnOrderConfirmation = yield select(getShouldFireOrderConfirmationPixel);

    const { payload } = yield call(withSession, [getOrdersByPurchaseId, mafia, pId, credentials]);
    yield put({ type: CHECKOUT_RECEIVE_ORDER_INFORMATION, payload });

    if (shouldFireOnOrderConfirmation) {
      yield call(workFetchPixelData, pId);
      yield put({ type: SET_SHOULD_FIRE_ORDER_CONFIRMATION_PIXEL, shouldFireOnOrderConfirmation: false });
    }
  } catch (error) {
    recordToSplunk(buildCheckoutErrorQueryString({ function: 'workFetchOrdersByPurchaseId' }));
    yield call(catchHandler, error, `/confirmation/${pId}`);
  }
}

export function* workFetchPixelData(pId) {
  try {
    const { mafia, credentials } = yield select(getMafiaAndCredentials);
    const { payload } = yield call(withSession, [getPixelData, mafia, pId, credentials]);
    yield put({ type: CHECKOUT_SET_CONFIRMATION_PIXEL_PAYLOAD, payload });
  } catch (error) {
    logger('Unable to get valid response from /pixel endpoint, not firing pixel server. Erro was: ', error);
  }
}

export function* workGoToStep(params) {
  const { step, query = {} } = params;
  let qs = '';
  Object.keys(query).forEach(key => {
    if (key !== 'pid') {
      qs += `&${key}=${query[key]}`;
    }
  });
  const links = yield select(getCheckoutLinks);
  const location = `${links[step]}${qs}`;
  yield put({ type: REDIRECT, location });
}

export function* workOnMoveToFavoritesClick({ payload: { asin, lineItemId, giftOptions } }) {
  try {
    yield put({ type: SET_CHECKOUT_DATA_LOADING, payload: true });
    const { mafia } = yield select(getMafiaAndCredentials);
    const { account, credentials } = yield select(getAccountApiAndCredentials);
    const numItems = yield select(getNumberPurchaseProducts);
    yield call(withSession, [addToList, account, { subItemId: asin }, credentials]);
    const { payload: cart } = yield call(withSession, [changeCart, mafia, { 'items': [{ asin, quantity: 0 }] }, credentials]);
    yield put({ type: RECEIVE_CART_ITEMS, cartCount: cart.activeItemTotalQuantity || 0, cartObj: cart });
    yield call(updateCartCount, cart);
    const appState = yield select();
    const { ['x-main']: xMain, ['session-id']: sessionId } = appState?.cookies || {};
    yield call(storeCartToLocalStorage, cart, xMain, sessionId);

    if (numItems > 1) {
      const params = { quantityUpdate: { lineItemId, quantity: 0 }, advanceOnSuccess: false };
      if (giftOptions?.length) {
        params.giftOptions = giftOptions;
      }
      yield put(configurePurchase(params));
    } else {
      yield call(workGoToCart);
    }
  } catch (error) {
    recordToSplunk(buildCheckoutErrorQueryString({ function: 'workOnMoveToFavoritesClick' }));
    const links = yield select(getCheckoutLinks);
    yield put({ type: SET_CHECKOUT_DATA_LOADING, payload: false });
    yield call(catchHandler, error, links[REVIEW_STEP]);
  }
}

export function* workGoToCart() {
  const location = '/cart';
  yield put({ type: REDIRECT, location });
}

export function* watchDeleteCheckoutAddress() {
  yield takeEvery(DELETE_CHECKOUT_ADDRESS, workDeleteCheckoutAddress);
}

export function* workDeleteCheckoutAddress({ addressId }) {
  try {
    const success = yield call(workDeleteAddress, addressId);
    const addresses = yield select(getPurchaseAddresses);
    if (addresses.length === 1) {
      yield put(configurePurchase({ advanceOnSuccess: true }));
    } else {
      yield call(workGoToStep, { step: LIST_ADDRESS_STEP });
    }

    if (success) {
      yield call(workRequestAddresses);
      yield put(storeTempSuccessMsg('Address was deleted!'));
    } else {
      yield put(storeTempFailureMsg('Unable to delete address at this time.'));
    }
  } catch (error) {
    recordToSplunk(buildCheckoutErrorQueryString({ function: 'workDeleteCheckoutAddress' }));
    const links = yield select(getCheckoutLinks);
    yield put(storeTempFailureMsg('Unable to delete address at this time.'));
    yield call(catchHandler, error, links[LIST_ADDRESS_STEP]);
  }
}

export function* watchFetchCheckoutContent() {
  yield takeEvery(CHECKOUT_FETCH_SYMPHONY_CONTENT, workFetchCheckoutContent);
}

export function* workFetchCheckoutContent() {
  try {
    const { mafia, credentials } = yield select(getMafiaAndCredentials);
    const response = yield call(getSymphonySlots, mafia, { pageName: 'checkout', pageLayout: 'checkout' }, credentials);
    const json = yield response.json();
    yield put({ type: CHECKOUT_RECIEVE_SYMPHONY_CONTENT, content: json?.slotData });
  } catch (error) {
    recordToSplunk(buildCheckoutErrorQueryString({ category: 'symphonyFetch', error: JSON.stringify(error) }));
  }
}

export function* watchConfigureCheckout() {
  yield takeEvery(CONFIGURE_CHECKOUT, workConfigureCheckout);
}

export function* workConfigureCheckout(actionPayload) {
  const links = yield select(getCheckoutLinks);
  try {
    const { configureParams } = actionPayload;
    const { advanceOnSuccess, reqData } = configureParams;
    const usePromoBalances = yield select(getUsePromoBalances);
    configureParams.reqData.useGCBalance = usePromoBalances;
    configureParams.reqData.useDiscount = usePromoBalances;

    if (!reqData.purchaseId) {
      const purchaseId = yield select(getPurchaseId);
      configureParams.reqData.purchaseId = purchaseId;
    }

    if (reqData.quantityUpdate) {
      yield call(clearCartLocalStorage);
      yield put({ type: CHECKOUT_UPDATED_QUANTITY });
      yield put({ type: CART_RESET_STATE });
    }

    const { mafia, credentials } = yield select(getMafiaAndCredentials);
    yield put({ type: SET_CHECKOUT_DATA_LOADING, payload: true, isRedeemingPromo: !!reqData.coupon });

    if (reqData.isSavingGiftOptions) {
      yield put(setGiftOptionsSaving({ isRemovingGiftOptions: !!reqData.isRemovingGiftOptions }));
    }

    const { payload } = yield call(withSession, [configureCheckout, mafia, configureParams, credentials]);
    const appState = yield select();

    if (reqData.quantityUpdate) {
      const { purchaseStatus: { productList } } = payload;
      const cart = { activeItems: productList.map(item => ({ ...item, ...item.gcCustomization })) };

      const { ['x-main']: xMain, ['session-id']: sessionId } = appState?.cookies || {};
      yield call(storeCartToLocalStorage, cart, xMain, sessionId);
    }

    // temporary hack to support filtering ship options on the client; once changes are made in mafia (no ticket yet), this can go away
    // this supports removing a DF or hazmat item from purchase or seeing new options based on changing ship address while on checkout
    if (configureParams.reqData.addressId || reqData.quantityUpdate || configureParams.filterShipOptionsOnFirstLoad) {
      yield put({ type: SET_SHIP_OPTIONS_NOT_LOADED });
    }

    yield put({ type: CONFIGURE_CHECKOUT_SUCCESS, payload });

    const { purchaseStatus: { constraintViolations = [] } = {} } = payload;
    const hasInvalidPromoCode = hasBadPromoCodeOrGiftCardFromCVList(constraintViolations);

    if (!hasInvalidPromoCode && advanceOnSuccess) {
      yield put({ type: REDIRECT, location: links[REVIEW_STEP] });
    }
  } catch (error) {
    recordToSplunk(buildCheckoutErrorQueryString({ function: 'workConfigureCheckout' }));
    yield put({ type: SET_CHECKOUT_DATA_LOADING, payload: false });
    yield call(catchHandler, error, links[LIST_ADDRESS_STEP]);
  }
}

export function* watchCheckoutRedeemRewardsPoints() {
  yield takeEvery(CHECKOUT_REDEEM_REWARDS_POINTS, workCheckoutRedeemRewardsPoints);
}

export function* workCheckoutRedeemRewardsPoints({ spendPoints }) {
  try {
    const result = yield call(workRedeemPoints, spendPoints);
    if (result) {
      yield put(onRequestRedeemableRewards());
      yield put(configurePurchase({}));
      yield put({ type: SET_REDEEMING_REWARDS_STATUS, redeemingRewardsStatus: REDEEM_REWARDS_SUCCESS });
    } else {
      yield put({ type: SET_REDEEMING_REWARDS_STATUS, redeemingRewardsStatus: REDEEM_REWARDS_TIMEOUT });
      yield put({ type: SET_CHECKOUT_DATA_LOADING, payload: false });
    }
  } catch (error) {
    recordToSplunk(buildCheckoutErrorQueryString({ function: 'workCheckoutRedeemRewardsPoints' }));
    // Based on where error happened, its possible the rewards have been applied if the error was
    // on checking the transaction.  Resetting the purchase will apply the reward in the event
    // it was actually redeemed.
    yield put(onRequestRedeemableRewards());
    yield put(configurePurchase({}));
    yield put({ type: SET_REDEEMING_REWARDS_STATUS, redeemingRewardsStatus: REDEEM_REWARDS_ERROR });
  }
}

export function* watchRequestCheckoutRedeemableRewards() {
  yield takeEvery(REQUEST_CHECKOUT_REDEEMABLE_REWARDS, workRequestCheckoutRedeemableRewards);
}

export function* workRequestCheckoutRedeemableRewards() {
  try {
    const akitaKey = yield select(getAkitaKey);
    const { mafia, credentials } = yield select(getMafiaAndCredentials);
    const { payload } = yield call(withSession, [getRedeemableRewards, mafia, akitaKey, credentials]);
    if (payload.data?.['redemption_increments']) {
      const { data: { redemption_increments: redeemableRewards, dollar_value: spendPointDollarValue, spend_points: spendPoints } } = payload;
      yield put({
        type: SET_CHECKOUT_REDEEMABLE_REWARDS,
        redeemableRewards,
        spendPointDollarValue,
        spendPoints
      });
      yield put(onDetermineIsEnrolledInRewards(true));
    } else {
      recordToSplunk(buildCheckoutErrorQueryString({ category: 'redeemableRewards', error: 'unexpected payload in workRequestCheckoutRedeemableRewards' }));
    }
  } catch (error) {
    recordToSplunk(buildCheckoutErrorQueryString({ function: 'workRequestCheckoutRedeemableRewards' }));
    yield call(catchHandler, error);
  }
}

export function* watchLoadCheckoutAutocompleteSuggestions() {
  yield takeEvery(CHECKOUT_LOAD_AUTOCOMPLETE_SUGGESTIONS, workLoadCheckoutAutocompleteSuggestions);
}

export function* workLoadCheckoutAutocompleteSuggestions({ query, near, countryCode }) {
  try {
    yield call(workLoadAutocompleteSuggestions, query, near, countryCode);
  } catch (error) {
    recordToSplunk(buildCheckoutErrorQueryString({ function: 'workLoadCheckoutAutocompleteSuggestionss' }));
    yield put({ type: ADDRESS_CLEAR_AAC_DATA });
    yield call(catchHandler, error);
  }
}

export function* watchRequestCheckoutAddressLatLong() {
  yield takeEvery(CHECKOUT_FETCH_LAT_LONG, workRequestCheckoutAddressLatLong);
}

export function* workRequestCheckoutAddressLatLong({ query }) {
  try {
    yield call(workFetchLatLong, query);
  } catch (error) {
    recordToSplunk(buildCheckoutErrorQueryString({ function: 'workRequestCheckoutAddressLatLong' }));
    yield put({ type: ADDRESS_CLEAR_AAC_DATA });
    yield call(catchHandler, error);
  }
}

export function* watchRequestCheckoutAddresses() {
  yield takeEvery(REQUEST_CHECKOUT_ADDRESSES, workRequestCheckoutAddresses);
}

export function* workRequestCheckoutAddresses() {
  try {
    yield call(workRequestAddresses);
  } catch (error) {
    recordToSplunk(buildCheckoutErrorQueryString({ function: 'workRequestCheckoutAddresses' }));
    const links = yield select(getCheckoutLinks);
    yield put({ type: SET_ADDRESS_DATA_LOADING, payload: false });
    yield call(catchHandler, error, links[LIST_ADDRESS_STEP]);
  }
}

export function* watchVerifyCheckoutCreditCard() {
  yield takeEvery(VERIFY_CHECKOUT_CREDIT_CARD, workVerifyCheckoutCreditCard);
}

export function* workVerifyCheckoutCreditCard({ number, paymentInstrumentId }) {
  try {
    const addressId = yield select(getPurchaseShippingAddress);
    const cvs = yield select(getFormattedConstraintViolations);
    const purchaseId = yield select(getPurchaseId);
    const isADigitalChallenge = yield call(isDigitalChallenge, cvs);
    const purchaseIdOnDigitalChallenge = isADigitalChallenge ? purchaseId : null;
    const status = yield call(workVerifyCreditCard, { number, paymentInstrumentId, addressId, purchaseId: purchaseIdOnDigitalChallenge });

    if (status) {
      const paymentMethods = [
        {
          paymentInstrumentId,
          paymentMethodCode: 'CC'
        }
      ];
      yield put(setHasVerifyCreditCardError(false));
      yield put(configurePurchase({ paymentMethods, advanceOnSuccess: true, includePaymentsAndAddresses: true }));
    } else {
      yield put(setHasVerifyCreditCardError(true));
    }
    yield put(clearPaymentErrors());
  } catch (error) {
    recordToSplunk(buildCheckoutErrorQueryString({ function: 'workVerifyCheckoutCreditCard' }));
    const links = yield select(getCheckoutLinks);
    yield put(setHasVerifyCreditCardError(false));
    yield call(catchHandler, error, links[PAYMENT_STEP]);
  }
}

export function* watchUpdateCheckoutAddress() {
  yield takeEvery(SAVE_CHECKOUT_ADDRESS, workUpdateCheckoutAddress);
}

export function* workUpdateCheckoutAddress() {
  try {
    const isBilling = yield select(getAddressFormItemIsBilling);
    const addressId = yield call(workUpdateAddress);
    const wasValidAddress = yield select(getWasAddressValid);

    if (wasValidAddress) {
      if (isBilling) {
        const instrument = yield select(getPurchaseCard);
        yield call(workSaveCheckoutPaymentInstrument, { instrument, addressId });
      } else {
        yield put(configurePurchase({ addressId, advanceOnSuccess: true, includePaymentsAndAddresses: true }));
      }
      yield put(onAddOrEditAddressEvent(true, addressId, isBilling ? 1 : 2));
    }
  } catch (error) {
    recordToSplunk(buildCheckoutErrorQueryString({ function: 'workUpdateCheckoutAddress' }));
    const links = yield select(getCheckoutLinks);
    const isBilling = yield select(getAddressFormItemIsBilling);
    const step = isBilling ? SELECT_BILLING_ADDRESS_STEP : LIST_ADDRESS_STEP;
    yield put(isBilling ? onAddOrEditBillingAddressErrorEvent() : onAddOrEditShippingAddressErrorEvent());
    yield put({ type: SET_ADDRESS_DATA_LOADING, payload: false });
    yield call(catchHandler, error, links[step]);
  }
}

export function* watchRequestCheckoutPayments() {
  yield takeEvery(REQUEST_CHECKOUT_PAYMENTS, workRequestCheckoutPayments);
}

export function* workRequestCheckoutPayments() {
  try {
    const addressId = yield select(getPurchaseShippingAddress);
    yield call(workRequestPayments, addressId);
  } catch (error) {
    recordToSplunk(buildCheckoutErrorQueryString({ function: 'workRequestCheckoutPayments' }));
    const links = yield select(getCheckoutLinks);
    yield put({ type: SET_PAYMENT_DATA_LOADING, payload: false });
    yield call(catchHandler, error, links[PAYMENT_STEP]);
  }
}

export function* watchSaveCheckoutPaymentInstrument() {
  yield takeEvery(SAVE_CHECKOUT_PAYMENT_METHOD, workSaveCheckoutPaymentInstrument);
}

export function* workSaveCheckoutPaymentInstrument({ instrument, addressId = 0, updatingAddress = false }) {
  const isAlsoBilling = yield select(getIsAlsoBilling);
  const shippingAddressId = yield select(getPurchaseShippingAddress);
  const addressIdToUse = isAlsoBilling ? shippingAddressId : addressId;
  const pid = yield select(getPurchaseId);
  const cartType = yield select(getCartType);
  const purchaseId = cartType === DIGITAL_GC_ONLY_CART ? pid : null;

  try {
    const paymentInstrumentId = yield call(workSavePaymentInstrument, { addressId: addressIdToUse, instrument, purchaseId });
    const paymentMethods = [
      {
        paymentInstrumentId: paymentInstrumentId,
        paymentMethodCode: 'CC'
      }
    ];
    const configureParams = {
      advanceOnSuccess: true,
      includePaymentsAndAddresses: true,
      reqData: {
        paymentMethods
      }
    };

    if (!updatingAddress) {
      yield put(onAddPaymentInstrumentEvent(paymentInstrumentId, instrument.isPrimary, true));
    }

    if (isAlsoBilling) {
      yield put(onToggleIsAlsoBilling(false));
    }

    yield put({ type: SET_SELECTED_PAYMENT_INSTRUMENT_ID, selectedPaymentInstrumentId: paymentInstrumentId });
    yield call(workConfigureCheckout, { configureParams });
    yield put(requestPayments());
  } catch (error) {
    recordToSplunk(buildCheckoutErrorQueryString({ function: 'workSaveCheckoutPaymentInstrument' }));
    const links = yield select(getCheckoutLinks);
    if (!updatingAddress) {
      yield put(onAddPaymentInstrumentErrorEvent(instrument.isPrimary));
    }
    yield put({ type: SET_PAYMENT_DATA_LOADING, payload: false });
    yield call(catchHandler, error, links[PAYMENT_STEP]);
  }
}

export function* watchPlaceOrder() {
  yield takeEvery(PLACE_ORDER, workPlaceOrder);
}

export function* workPlaceOrder() {
  try {
    const purchaseId = yield select(getPurchaseId);
    const { mafia, credentials } = yield select(getMafiaAndCredentials);
    const versionNumber = yield select(getVersionNumber);
    const shouldDefaultOptions = yield select(getUseAsDefaults);
    const purchaseData = yield select(getPurchaseData);
    const { purchase: { chargeSummary, productList } } = purchaseData;
    yield put({ type: SET_IS_PLACING_ORDER, payload: true });
    const { payload } = yield call(placeOrder, mafia, credentials, purchaseId, versionNumber, shouldDefaultOptions);
    const { orderId, digitalOrderId } = payload;
    const orderIds = [orderId, digitalOrderId].filter(item => item);
    window.parent.postMessage({ type: 'checkoutComplete', orderIds }, '*');
    yield call(clearCartLocalStorage);
    const orderConfirmationEventData = yield call(buildOrderConfirmationEventData, { chargeSummary, digitalOrderId, orderId, productList, purchaseId });
    yield call(trackOrderConfirmationEvent, orderConfirmationEventData);
    yield call(titaniteView);
    yield call(track, () => ([pvOrderConfirmation, { purchaseData, digitalOrderId, orderId }]));
    yield call(clearCartCount);
    yield put({ type: CART_RESET_STATE });
    yield put({ type: SET_SHOULD_FIRE_ORDER_CONFIRMATION_PIXEL, shouldFireOnOrderConfirmation: true });
    yield put({ type: REDIRECT, location: `/confirmation/${purchaseId}` });

    const infToken = yield call(getInfluencerToken);
    if (orderId && infToken) {
      yield call(track, () => ([evCheckoutFromInfluencer, { orderId, linkId: infToken }]));
    }
    yield call(clearInfluencerLocalStorage);
  } catch (error) {
    recordToSplunk(buildCheckoutErrorQueryString({ function: 'workPlaceOrder' }));
    const links = yield select(getCheckoutLinks);
    yield put({ type: SET_IS_PLACING_ORDER, payload: false });
    yield call(catchHandler, error, links[REVIEW_STEP]);
  }
}

export function* watchNotifyOutOfStockAsin() {
  yield takeEvery(CHECKOUT_ON_ASIN_HAS_GONE_OOS, workNotifyOutOfStockAsin);
}

export function* workNotifyOutOfStockAsin({ asin }) {
  const products = yield select(getCheckoutProducts);
  const { productName } = (products || []).find(item => item.asin === asin) || {};
  if (productName) {
    alert(`Sorry, an item has gone out of stock and will be removed from the purchase: ${productName}`);
  }
  yield put(resetCheckout());
  yield put(configurePurchase({}));
  yield put({ type: REDIRECT, location: '/checkout' });
}

export function* catchHandler(e, redirectPath = '/checkout/spc') {
  const { id, extraInformation, url } = e;
  switch (id) {
    case REDEEMABLE_REWARDS_NOT_FOUND: {
      yield put({ type: API_ERROR, pageType: CHECKOUT_PAGE, apiErrorType: API_ERROR_REDEEMABLE_REWARDS_NOT_FOUND });
      yield put(onDetermineIsEnrolledInRewards(false));
      return;
    }
    case ERROR_CANNOT_CONFIRM_PURCHASE_OOS: {
      yield put({ type: API_ERROR, pageType: CHECKOUT_PAGE, apiErrorType: API_ERROR_CANNOT_CONFIRM_PURCHASE_OOS });
      const { asin } = extraInformation[0];
      yield put(onAsinHasGoneOos(asin));
      return;
    }
    case ERROR_CANNOT_CONFIRM_PURCHASE_OTHER: {
      yield put({ type: API_ERROR, pageType: CHECKOUT_PAGE, apiErrorType: API_ERROR_CANNOT_CONFIRM_PURCHASE_OTHER });
      alert('Sorry, an error has occurred.  Please try placing your order again.');
      yield put(resetCheckout());
      yield put(configurePurchase({}));
      yield put({ type: REDIRECT, location: '/checkout' });
      return;
    }
    case ERROR_NOT_AUTHENTICATED:
      yield put({ type: API_ERROR, pageType: CHECKOUT_PAGE, apiErrorType: API_ERROR_NOT_AUTHORIZED, endpointUrl: url });
      if (marketplace.hasFederatedLogin) {
        yield put({
          type: SET_FEDERATED_LOGIN_MODAL_VISIBILITY,
          payload:  {
            isFederatedLoginModalShowing: true,
            redirectOnClose: '/',
            returnTo: redirectPath
          }
        });
      } else {
        yield put({ type: REDIRECT, location: buildAuthenticationRedirectUrl(redirectPath) });
      }
      break;
    case ERROR_PURCHASE_NOT_FOUND:
      yield put({ type: API_ERROR, pageType: CHECKOUT_PAGE, apiErrorType: API_ERROR_PURCHASE_NOT_FOUND });
      yield put({ type: REDIRECT, location: '/cart' });
      break;
    case ERROR_EMPTY_CART:
      yield put({ type: API_ERROR, pageType: CHECKOUT_PAGE, apiErrorType: API_ERROR_EMPTY_CART });
      yield put({ type: REDIRECT, location: '/cart' });
      break;
    case ERROR_REQUEST_VALIDATION:
      const container = document.getElementsByClassName('ReactModal__Content');
      if (container.length) {
        container[0].scrollTop = 0;
      }
      yield put({ type: API_ERROR, pageType: CHECKOUT_PAGE, apiErrorType: API_ERROR_REQUEST_VALIDATION, endpointUrl: url });
      yield put({ type: SET_FORM_ERRORS, payload: e.extraInformation });
      break;
    case ERROR_INVALID_GIFT_OPTIONS:
      yield put({ type: API_ERROR, pageType: CHECKOUT_PAGE, apiErrorType: API_ERROR_INVALID_GIFT_OPTIONS });
      logger('TODO: invalid gift options error');
      break;
    case ERROR_QUANTITY_CHANGE_REQUEST_VALIDATION:
      yield put({ type: API_ERROR, pageType: CHECKOUT_PAGE, apiErrorType: API_ERROR_QUANTITY_CHANGE_VALIDATION });
      logger('TODO: support quantity change error');
      break;
    case ERROR_EDIT_INACTIVE_ADDRESS:
      yield put({ type: API_ERROR, pageType: CHECKOUT_PAGE, apiErrorType: API_ERROR_EDIT_INACTIVE_ADDRESS });
      yield put(storeEditOfInactiveAddressError(true));
      break;
    default:
      yield put({ type: API_ERROR, pageType: CHECKOUT_PAGE, apiErrorType: API_ERROR_UNKNOWN, endpointUrl: url });
      logger('default error in catch: ', e);
      recordToSplunk(buildCheckoutErrorQueryString({ category: 'generic', error: JSON.stringify(e) }));
      return;
  }
}

export default [
  watchCheckoutRedeemRewardsPoints,
  watchConfigureCheckout,
  watchDeleteCheckoutAddress,
  watchLoadCheckoutAutocompleteSuggestions,
  watchOnFetchOrdersByPurchaseId,
  watchNotifyOutOfStockAsin,
  watchOnAddNewBillingAddressFromModalAddressList,
  watchOnAddNewShippingAddressFromModalAddressList,
  watchOnFetchAkitaEstimate,
  watchOnHideBillingAddressFromModalAddressList,
  watchOnHideBillingAddressModalClick,
  watchOnHideShippingAddressFromModalAddressList,
  watchOnHideNewShippingAddressModalClick,
  watchOnMaxStepIsCartStep,
  watchOnMoveToFavoritesClick,
  watchOnSendToNewAddressWhenNoSavedAddresses,
  watchOnShowNewShippingAddressModalClick,
  watchPlaceOrder,
  watchRequestCheckoutAddresses,
  watchRequestCheckoutAddressLatLong,
  watchRequestCheckoutPayments,
  watchRequestCheckoutRedeemableRewards,
  watchSaveCheckoutPaymentInstrument,
  watchSendToDesiredPage,
  watchSendToMaxAvailableStep,
  watchUpdateCheckoutAddress,
  watchVerifyCheckoutCreditCard,
  watchOnCheckoutJustLoaded,
  watchFetchCheckoutContent
];
