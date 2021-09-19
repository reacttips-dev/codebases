import { stringify } from 'query-string';

import { MAFIA_CLIENT, MAFIA_RECOGNIZED_TOKEN } from 'constants/apis';
import timedFetch from 'middleware/timedFetch';
import {
  fetchOpts,
  withSession
} from 'apis/mafia';
import { formatCreditCard, formatCreditCardExpiration } from 'helpers/MyAccountUtils';
import {
  authError,
  CHECKOUT_CV_EXISTS_ON_FINALIZE_ERROR,
  CHECKOUT_EDIT_INACTIVE_ADDRESS,
  CHECKOUT_EMPTY_CART_ERROR,
  CHECKOUT_GIFT_OPTIONS_ERROR,
  CHECKOUT_PURCHASE_NOT_FOUND,
  CHECKOUT_QUANTITY_CHANGE_ERROR,
  ERROR_AKITA_ESTIMATE_NON_200,
  ERROR_CANNOT_CONFIRM_PURCHASE_OOS,
  ERROR_CANNOT_CONFIRM_PURCHASE_OTHER,
  ERROR_EDIT_INACTIVE_ADDRESS,
  ERROR_EMPTY_CART,
  ERROR_INVALID_GIFT_OPTIONS,
  ERROR_NOT_AUTHENTICATED,
  ERROR_PURCHASE_NOT_FOUND,
  ERROR_QUANTITY_CHANGE_REQUEST_VALIDATION,
  ERROR_REQUEST_VALIDATION,
  FetchError,
  REDEEMABLE_REWARDS_NOT_FOUND
} from 'middleware/fetchErrorMiddleware';
import { getMafiaClientHeaderPrefix, hasOutOfStockCV } from 'helpers/CheckoutUtils';
import marketplace from 'cfg/marketplace.json';

const { checkout: { mafiaClient } } = marketplace;

export const formValidationError = new Set([
  'address.validation.exception',
  'validation.exception',
  'input.invalid'
]);

export function validateAndThrowCheckoutResponse({ url, status, statusText }, { description, error, extraInformation, id, message }) {
  const hasAuthError = authError.has(id) || authError.has(error) || authError.has(message);
  const is400 = status === 400;
  const hasGiftOptionsError = is400 && id === CHECKOUT_GIFT_OPTIONS_ERROR;
  const hasQuantityChangeError = is400 && id === CHECKOUT_QUANTITY_CHANGE_ERROR;
  const hasEmptyCartError = is400 && id === CHECKOUT_EMPTY_CART_ERROR;
  const hasFormValidationError = is400 && formValidationError.has(id);
  const hasCannotConfirmPurchaseError = status === 200 && id === CHECKOUT_CV_EXISTS_ON_FINALIZE_ERROR;
  const cannotConfirmPurchaseErrorType = hasOutOfStockCV(extraInformation) ? ERROR_CANNOT_CONFIRM_PURCHASE_OOS : ERROR_CANNOT_CONFIRM_PURCHASE_OTHER;
  const hasPurchaseNotFound = status === 404 && id === CHECKOUT_PURCHASE_NOT_FOUND;
  const hasEditInactiveAddressError = is400 && id === CHECKOUT_EDIT_INACTIVE_ADDRESS;

  // order matters!
  switch (true) {
    case hasCannotConfirmPurchaseError:
      throw new FetchError(url, status, statusText, cannotConfirmPurchaseErrorType, extraInformation);
    case status === 200:
      return;
    case status === 403 && hasAuthError:
      throw new FetchError(url, status, statusText, ERROR_NOT_AUTHENTICATED);
    case hasFormValidationError:
      throw new FetchError(url, status, statusText, ERROR_REQUEST_VALIDATION, extraInformation);
    case hasGiftOptionsError:
      throw new FetchError(url, status, statusText, ERROR_INVALID_GIFT_OPTIONS, description);
    case hasQuantityChangeError:
      throw new FetchError(url, status, statusText, ERROR_QUANTITY_CHANGE_REQUEST_VALIDATION, description);
    case hasEmptyCartError:
      throw new FetchError(url, status, statusText, ERROR_EMPTY_CART);
    case hasPurchaseNotFound:
      throw new FetchError(url, status, statusText, ERROR_PURCHASE_NOT_FOUND, description);
    case hasEditInactiveAddressError:
      throw new FetchError(url, status, statusText, ERROR_EDIT_INACTIVE_ADDRESS, description);
    case status >= 400:
      throw new FetchError(url, status, statusText);
    default:
      return;
  }
}

export async function configureCheckout({ url }, params, credentials = {}, fetcher = timedFetch('checkoutConfigure')) {
  const {
    reqData,
    includeAssociated = true,
    includePaymentsAndAddresses = false
  } = params;

  const queryStringParams = {
    includeAssociated: includeAssociated,
    includePayments: includePaymentsAndAddresses,
    includeAddresses: includePaymentsAndAddresses,
    src: 'melody'
  };

  const queryString = stringify(queryStringParams);

  let reqUrl = `${url}/v1/checkout/configure`;
  reqUrl = queryString.length ? `${reqUrl}?${queryString}` : reqUrl;

  const headers = { 'Content-Type': 'application/json' };
  const mafiaClientPrefix = getMafiaClientHeaderPrefix();

  if (mafiaClientPrefix) {
    headers[MAFIA_CLIENT] = `${mafiaClientPrefix}${mafiaClient}`;
  }

  const opts = fetchOpts({
    method: 'post',
    headers,
    body: JSON.stringify(reqData)
  }, credentials);
  const response = await fetcher(reqUrl, opts);
  const json = await response.json();
  validateAndThrowCheckoutResponse(response, json);
  return withSession(json, response.headers);
}

export async function addToList({ url }, { itemId, subItemId }, credentials = {}, listId = 'h.', fetcher = timedFetch('addToHeartList')) {
  const opts = fetchOpts({
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    body: JSON.stringify({
      itemId,
      subItemId,
      listId
    })
  }, credentials);
  const reqUrl = `${url}/accountapi/cloudlist/v1/addToList`;
  const response = await fetcher(reqUrl, opts);
  const json = {}; // empty response when successful
  validateAndThrowCheckoutResponse(response, json);
  return withSession(json, response.headers);
}

export async function changeCart({ url }, data, credentials, fetcher = timedFetch('cart')) {
  const reqUrl = `${url}/v1/cart`;
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  if ('x-main' in credentials) {
    headers[MAFIA_RECOGNIZED_TOKEN] = credentials['x-main'];
  }
  const opts = fetchOpts({
    method: 'post',
    headers: headers,
    body: JSON.stringify(data)
  }, credentials);
  const response = await fetcher(reqUrl, opts);
  const json = await response.json();
  validateAndThrowCheckoutResponse(response, json);
  return withSession(json, response.headers);
}

export async function getAkitaEstimator({ url }, akitaKey, credentials = {}, fetcher = timedFetch('getAkitaEstimate')) {
  const headers = {
    'x-api-key': akitaKey,
    'Content-Type': 'application/json'
  };

  const opts = fetchOpts({
    method: 'post',
    headers,
    body: JSON.stringify({ shipping_speeds: 'next-wow,second,next-business,next' })
  }, credentials);

  const reqUrl = `${url}/akita/slotz/full/v1/estimate/order`;
  const response = await fetcher(reqUrl, opts);
  const { status } = response;
  const json = await response.json();

  if (status !== 200) {
    throw new FetchError(reqUrl, status, `Error in akita estimate: ${json?.error?.message}`, ERROR_AKITA_ESTIMATE_NON_200);
  }

  return withSession(json, response.headers);
}

export async function getRedeemableRewards({ url }, akitaKey, credentials = {}, fetcher = timedFetch('getRedeemableRewards')) {
  const opts = fetchOpts({
    headers: { 'x-api-key': akitaKey }
  }, credentials);
  const reqUrl = `${url}/akita/slotz/full/v1/customers/redeem`;
  const response = await fetcher(reqUrl, opts);
  if (response.status === 404) {
    throw new FetchError(reqUrl, 404, 'Customer not enrolled in rewards', REDEEMABLE_REWARDS_NOT_FOUND);
  }
  const json = await response.json();
  return withSession(json, response.headers);
}

export async function doRedeemRewardsPoints({ url }, akitaKey, credentials, spendPoints, fetcher = timedFetch('redeemReward')) {
  const opts = fetchOpts({
    method: 'post',
    headers: { 'Content-Type': 'application/json', 'x-api-key': akitaKey },
    body: JSON.stringify({ spend_points: spendPoints })
  }, credentials);
  const reqUrl = `${url}/akita/slotz/full/v1/customers/redeem`;
  const response = await fetcher(reqUrl, opts);
  const json = await response.json();
  validateAndThrowCheckoutResponse(response, json);
  return withSession(json, response.headers);
}

export async function getRedemptionTransactionStatus({ url }, akitaKey, credentials, txId, fetcher = timedFetch('redeemReward')) {
  const opts = fetchOpts({
    method: 'get',
    headers: { 'Content-Type': 'application/json', 'x-api-key': akitaKey }
  }, credentials);
  const reqUrl = `${url}/akita/slotz/full/v1/customers/transactions/?transaction_type=PROMOTION&reference_transaction_id=${txId}`;
  const response = await fetcher(reqUrl, opts);
  const json = await response.json();
  validateAndThrowCheckoutResponse(response, json);
  return withSession(json, response.headers);
}

export async function changeAddress({ url }, address, credentials = {}, fetcher = timedFetch('changeAddress')) {
  const { forceOriginal } = address;
  const reqUrl = `${url}/v1/address?saveInvalidAddress=false${forceOriginal ? '&forceOriginal=true' : ''}`;
  const opts = fetchOpts({
    method: address.addressId ? 'put' : 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(address)
  }, credentials);
  const response = await fetcher(reqUrl, opts);
  const json = await response.json();
  validateAndThrowCheckoutResponse(response, json);
  return withSession(json, response.headers);
}

export async function getAddressList({ url }, credentials = {}, fetcher = timedFetch('getAddressList')) {
  const reqUrl = `${url}/v1/address`;
  const response = await fetcher(reqUrl, fetchOpts({ method: 'get' }, credentials));
  const json = await response.json();
  validateAndThrowCheckoutResponse(response, json);
  return withSession(json, response.headers);
}

export async function getPaymentTypeList({ mafia: { url }, shippingAddressId }, credentials = {}, fetcher = timedFetch('getPaymentTypeList')) {
  let reqUrl = `${url}/v1/paymentInstruments`;
  if (shippingAddressId) {
    reqUrl += `?associatedAddressId=${shippingAddressId}`;
  }
  const response = await fetcher(reqUrl, fetchOpts({ method: 'get' }, credentials));
  const json = await response.json();
  validateAndThrowCheckoutResponse(response, json);
  return withSession(json, response.headers);
}

export async function setPrimaryPayment({ url }, paymentInstrumentId, credentials = {}, fetcher = timedFetch('setPrimaryPayment')) {
  const reqUrl = `${url}/v1/paymentInstruments`;
  const response = await fetcher(reqUrl, fetchOpts({
    method: 'put',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `paymentInstrumentId=${paymentInstrumentId}&isPrimary=true`
  }, credentials));
  const json = await response.json();
  validateAndThrowCheckoutResponse(response, json);
  return withSession(json, response.headers);
}

export async function setPrimaryAddress({ url }, address, credentials = {}, fetcher = timedFetch('setPrimaryAddress')) {
  const reqUrl = `${url}/v1/address`;
  const response = await fetcher(reqUrl, fetchOpts({
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(address)
  }, credentials));
  const json = await response.json();
  validateAndThrowCheckoutResponse(response, json);
  return withSession(json, response.headers);
}

export async function getShipOptionList({ url }, purchaseId, credentials = {}, fetcher = timedFetch('shipmentOptions')) {
  const reqUrl = `${url}/v2/shipmentOptions?purchaseId=${purchaseId}`;
  const response = await fetcher(reqUrl, fetchOpts({ method: 'get' }, credentials));
  const json = await response.json();
  validateAndThrowCheckoutResponse(response, json);
  return withSession(json, response.headers);
}

export async function savePaymentInstrument({ url }, params, credentials = {}, fetcher = timedFetch('savePaymentInstrument')) {
  const { instrument, addressId, purchaseId } = params;
  const reqUrl = `${url}/v1/paymentInstruments`;
  const {
    cc,
    expiration,
    name,
    fullName,
    isPrimary,
    paymentInstrumentId
  } = instrument;

  let expirationMonth;
  let expirationYear;

  if (expiration) {
    ({ expirationMonth, expirationYear } = formatCreditCardExpiration(expiration));
  } else {
    ({ expirationMonth, expirationYear } = instrument);
  }

  let payment = `fullName=${fullName || name}&expirationMonth=${expirationMonth}&expirationYear=${expirationYear}&addressId=${addressId}`;
  if (paymentInstrumentId) {
    payment += `&paymentInstrumentId=${paymentInstrumentId}`;
  } else {
    const formattedCreditCardValue = formatCreditCard(cc);
    const creditCardNumber = formattedCreditCardValue.length ? formattedCreditCardValue : cc;
    payment += `&addCreditCardNumber=${creditCardNumber}`;
  }

  if (purchaseId) {
    payment += `&purchaseId=${purchaseId}`;
  }

  // Always true since it isn't possible to set primary payment as non-primary, i.e. isPrimary=false
  if (isPrimary) {
    payment += '&isPrimary=true';
  }

  const opts = fetchOpts({
    method: paymentInstrumentId ? 'put' : 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: payment
  }, credentials);
  const response = await fetcher(reqUrl, opts);
  const json = await response.json();
  validateAndThrowCheckoutResponse(response, json);
  return withSession(json, response.headers);
}

export async function getPixelData({ url }, purchaseId, credentials = {}, fetcher = timedFetch('getPixel')) {
  const reqUrl = `${url}/v1/pixel?purchaseId=${purchaseId}`;
  const response = await fetcher(reqUrl, fetchOpts({ method: 'get' }, credentials));
  const json = await response.json();
  validateAndThrowCheckoutResponse(response, json);
  return withSession(json, response.headers);
}

export async function getAutocompleteSuggestions({ url }, query, near, countryCode, credentials = {}, fetcher = timedFetch('getLatLong')) {
  const reqUrl = `${url}/v1/radar/search/autocomplete`;
  const response = await fetcher(reqUrl, fetchOpts({
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, near, countryCode })
  }, credentials));
  const json = await response.json();
  validateAndThrowCheckoutResponse(response, json);
  return withSession(json, response.headers);
}

export async function getLatLong({ url }, query, credentials = {}, fetcher = timedFetch('getLatLong')) {
  const reqUrl = `${url}/v1/radar/geocode/forward?query=${query}`;
  const response = await fetcher(reqUrl, fetchOpts({ method: 'get' }, credentials));
  const json = await response.json();
  validateAndThrowCheckoutResponse(response, json);
  return withSession(json, response.headers);
}

export async function getOrdersByPurchaseId({ url }, purchaseId, credentials = {}, fetcher = timedFetch('getOrdersByPurchaseId')) {
  const version = 'v2';
  const reqUrl = `${url}/${version}/ordersByPurchaseId?includeTracking=true&purchaseId=${purchaseId}`;
  const response = await fetcher(reqUrl, fetchOpts({ method: 'get' }, credentials));
  const json = await response.json();
  validateAndThrowCheckoutResponse(response, json);
  return withSession(json, response.headers);
}

export async function placeOrder({ url }, credentials, purchaseId, versionNumber, shouldDefaultOptions, fetcher = timedFetch('checkoutFinalize')) {
  const reqUrl = `${url}/v1/checkout/finalize`;
  const data = { purchaseId, versionNumber, setDefault: shouldDefaultOptions };
  const response = await fetcher(reqUrl, fetchOpts({
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }, credentials));
  const json = await response.json();
  validateAndThrowCheckoutResponse(response, json);
  return withSession(json, response.headers);
}

export async function getGiftOptions({ url }, purchaseId, credentials = {}, fetcher = timedFetch('getGiftOptions')) {
  const response = await fetcher(`${url}/v1/giftOptions?purchaseId=${purchaseId}`, fetchOpts({ method: 'get' }, credentials));
  const json = await response.json();
  validateAndThrowCheckoutResponse(response, json);
  return withSession(json, response.headers);
}

export async function deletePaymentInstrument({ url }, paymentInstrumentId, credentials = {}, fetcher = timedFetch('deletePaymentInstrument')) {
  const reqUrl = `${url}/v1/paymentInstruments/${paymentInstrumentId}`;
  const response = await fetcher(reqUrl, fetchOpts({ method: 'DELETE' }, credentials));
  validateAndThrowCheckoutResponse(response, {});
  return withSession({}, response.headers);
}

export async function deleteAddress({ url }, addressId, credentials = {}, fetcher = timedFetch('deleteAddress')) {
  const reqUrl = `${url}/v1/address?addressIds=${addressId}`;
  const response = await fetcher(reqUrl, fetchOpts({ method: 'DELETE' }, credentials));
  const json = await response.json();
  validateAndThrowCheckoutResponse(response, json);
  return withSession(json, response.headers);
}

export function recordToSplunk(qs, fetcher = timedFetch('postMartyPixel')) {
  const reqUrl = `/martypixel?${qs}`;
  return fetcher(reqUrl, fetchOpts({ method: 'post' }));
}

export async function verifyCard({ url }, { number, paymentInstrumentId, addressId, purchaseId }, credentials = {}, fetcher = timedFetch('associatePaymentInstrument')) {
  const reqUrl = `${url}/v1/associatePaymentInstrument`;
  const formattedCreditCardValue = formatCreditCard(number);
  const creditCardNumber = formattedCreditCardValue.length ? formattedCreditCardValue : number;
  let data = `paymentInstrumentId=${paymentInstrumentId}&addCreditCardNumber=${creditCardNumber}`;

  if (addressId) {
    data += `&addressId=${addressId}`;
  }

  if (purchaseId) {
    data += `&purchaseId=${purchaseId}`;
  }

  const response = await fetcher(reqUrl, fetchOpts({
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: data
  }, credentials));
  const json = await response.json();
  validateAndThrowCheckoutResponse(response, json);
  return withSession(json, response.headers);
}
