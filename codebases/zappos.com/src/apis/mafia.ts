// @ts-nocheck
// Disable typechecking in this file so we can migrate it piecemeal, due to the file's sheer size
// While typing these functions in developement, remove the @ts-nocheck directive so you can see potential code errors/squigglies,
// and re-add it when you're finished.
import 'isomorphic-fetch';
import { stringify } from 'query-string';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import {
  MAFIA_AGENT_AUTH_REQ,
  MAFIA_AT_MAIN,
  MAFIA_AUTH_REQ,
  MAFIA_CAPTCHA_ANSWER,
  MAFIA_CAPTCHA_AUDIO_REQ,
  MAFIA_CAPTCHA_REQ,
  MAFIA_CAPTCHA_TOKEN,
  MAFIA_EMAIL_TOKEN,
  MAFIA_RECOGNIZED_TOKEN,
  MAFIA_SESSION_ID,
  MAFIA_SESSION_REQ,
  MAFIA_SESSION_TOKEN,
  MAFIA_UBID_MAIN
} from 'constants/apis';
import timedFetch from 'middleware/timedFetch';
import { cookieObjectToString } from 'helpers/Cookie';
import { formatCreditCard, formatCreditCardExpiration } from 'helpers/MyAccountUtils';
import { inIframe } from 'helpers/CheckoutUtils';
import { ENDPOINT_OPAL_EXPLICITFITS } from 'apis/opal';
import { processHeadersMiddleware } from 'middleware/processHeadersMiddlewareFactory';
import { setSessionCookies } from 'actions/session';
import { fetchErrorMiddleware } from 'middleware/fetchErrorMiddleware';
import { devLogger } from 'middleware/logger';
import marketplace from 'cfg/marketplace.json';
import { AppState } from 'types/app';
import { Cookies } from 'types/cookies';
import {
  JanusParams,
  Mafia,
  OrderQueryParams,
  OrdersResponse,
  Recos,
  SearchOrderQueryParams
} from 'types/mafia';

const { cart: { cartName } } = marketplace;
const TELL_A_FRIEND_ENDPOINT = '/email/v1/tellAFriend';
// TODO Update this once mafia slotz changes for report an error are deployed
const REPORT_AN_ERROR_ENDPOINT = '/email/v1/reportAnError';

/**
 * Given credentials, returns true if auth headers should be passed or false if
 * cookie auth should be requested.
 * @param  {Object} [credentials={}] mafia authentication credentials
 * @return {boolean}                 if auth headers should be passed
 */
export const authHeadersInUse = (credentials: Cookies = {}, queryParamCredentials = {}) => !!(credentials['at-main'] || queryParamCredentials['auth_token']);

/**
 * Adds the given header to the header request object if the corresponding cookie exists.  If the cookie does not exist, no header is added to request object.
 *
 * This is necessary since Edge 14 barfs on fetch headers that are blank (See https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8546263/).
 *
 * Mutates headers parameter.
 * @param {Object} headers map of headers name to values to include in the http request
 * @param {Object} cookies map of cookies names to values available in the execution context
 * @param {String} mafiaHeaderName the header name to put the cookie value
 * @param {String} cookieName the cookie name to lookup in `cookies` and put into `headers` if it exists.
 */
function translateCookieToMafiaHeader(headers, cookies, mafiaHeaderName, cookieName) {
  if (cookies[cookieName]) {
    headers[mafiaHeaderName] = cookies[cookieName];
  }
  return headers;
}

/**
 * Adds the given header to the header request object if the corresponding query param exists.  If the param does not exist, no header is added to request object.
 *
 * See Edge 14 note in translateCookieToMafiaHeader()
 *
 * Mutates headers parameter.
 * @param {Object} headers map of headers name to values to include in the http request
 * @param {Object} queryParams map of query param names to values available in the execution context
 * @param {String} mafiaHeaderName the header name to put the query param value
 * @param {String} paramName the query param name to lookup in `queryParams` and put into `headers` if it exists.
 */
function translateQueryParamToMafiaHeader(headers, queryParams, mafiaHeaderName, paramName) {
  if (queryParams[paramName]) {
    headers[mafiaHeaderName] = queryParams[paramName];
  }
  return headers;
}

/**
 * Given headers and credentials, return a new set of headers which includes
 * the appropriate auth-related headers.
 * @param  {Object} [initHeaders={}] inital set of headers
 * @param  {Object} [credentials={}] mafia auth credentials
 * @return {Object}                  init headers with auth headers
 */
export function withAuthHeaders(initHeaders = {}, credentials: Cookies = {}, queryParamCredentials = {}) {
  const headers = { ...initHeaders };
  headers[MAFIA_SESSION_REQ] = 'true';
  // headers for session-reliant mafia calls
  translateCookieToMafiaHeader(headers, credentials, MAFIA_SESSION_ID, 'session-id');
  translateCookieToMafiaHeader(headers, credentials, MAFIA_SESSION_TOKEN, 'session-token');
  translateCookieToMafiaHeader(headers, credentials, MAFIA_UBID_MAIN, 'ubid-main');
  translateCookieToMafiaHeader(headers, credentials, MAFIA_RECOGNIZED_TOKEN, 'x-main');
  translateQueryParamToMafiaHeader(headers, queryParamCredentials, MAFIA_EMAIL_TOKEN, 'auth_token');
  headers.Cookie = cookieObjectToString(credentials);

  if (!Object.keys(credentials).length) {
    devLogger('WARNING: You must send credential headers with your mafia request!');
  }

  if (authHeadersInUse(credentials)) {
    translateCookieToMafiaHeader(headers, credentials, MAFIA_AT_MAIN, 'at-main');
  } else {
    headers[MAFIA_AUTH_REQ] = true;
  }

  // CSC agents - only supporting client side calls with this
  if (inIframe()) {
    headers[MAFIA_AGENT_AUTH_REQ] = true;
    delete headers[MAFIA_AUTH_REQ];
    delete headers[MAFIA_SESSION_REQ];
  }
  return headers;
}

function sendJsonDataWithCreds(url, data, options = {}) {
  const { credentials, queryParamCredentials, method = 'post', fetcher, additionalHeaders = {} } = options;
  return fetcher(url, fetchOpts({
    method,
    headers: { 'Content-Type': 'application/json', ...additionalHeaders },
    body: JSON.stringify(data)
  }, credentials, queryParamCredentials));
}

/** Zappos Influencer APIs starts */
const commonInfluencerServiceHeaders = () => ({
  'X-Marty-InfAppEnv-Id' :  window.location.hostname
});

export function enrollInfluencer({ url }: Mafia, data, credentials: Cookies = {}, fetcher = timedFetch('enrollInfluencer')) {
  return sendJsonDataWithCreds(`${url}/influencer/enroll`, data, {
    credentials,
    fetcher,
    method:'post',
    additionalHeaders :commonInfluencerServiceHeaders()
  });
}

export function getInfluencerAppConfigurations({ url }: Mafia, credentials: Cookies = {}, fetcher = timedFetch('getInfluencerAppConfigurations')) {
  return fetcher(`${url}/influencer/apps`, fetchOpts({
    headers:commonInfluencerServiceHeaders()
  }, credentials));
}

export function getInfluencerStatus({ url }: Mafia, credentials: Cookies = {}, fetcher = timedFetch('getInfluencerStatus')) {
  return fetcher(`${url}/influencer/status`, fetchOpts({
    headers:commonInfluencerServiceHeaders()
  }, credentials));
}

export function getInfluencerDetails({ url }: Mafia, credentials: Cookies = {}, fetcher = timedFetch('getInfluencerDetails')) {
  return fetcher(`${url}/influencer/details`, fetchOpts({
    headers:commonInfluencerServiceHeaders()
  }, credentials));
}

export function getInfluencerToken({ url }: Mafia, data, credentials: Cookies = {}, fetcher = timedFetch('getInfluencerToken')) {
  return sendJsonDataWithCreds(`${url}/influencer/links`, data, {
    credentials,
    fetcher,
    method:'post',
    additionalHeaders :commonInfluencerServiceHeaders()
  });
}

export function addInfluencerSocialProfile({ url }: Mafia, data, credentials: Cookies = {}, fetcher = timedFetch('addInfluencerSocialProfile')) {
  return sendJsonDataWithCreds(`${url}/influencer/addsocialprofile`, data, {
    credentials,
    fetcher,
    method:'post',
    additionalHeaders :commonInfluencerServiceHeaders()
  });
}

export function updateInfluencerSocialProfile({ url }: Mafia, data, credentials: Cookies = {}, fetcher = timedFetch('updateInfluencerSocialProfile')) {
  return sendJsonDataWithCreds(`${url}/influencer/updatesocialprofile`, data, {
    credentials,
    fetcher,
    method:'post',
    additionalHeaders :commonInfluencerServiceHeaders()
  });
}

export function updateInfluencerDetails({ url }: Mafia, data, credentials: Cookies = {}, fetcher = timedFetch('updateInfluencerDetails')) {
  return sendJsonDataWithCreds(`${url}/influencer/details`, data, {
    credentials,
    fetcher,
    method:'post',
    additionalHeaders :commonInfluencerServiceHeaders()
  });
}

/** Zappos Influencer APIs ends */

const cartErrorTranslator = {
  'cart.validation.exception': 'Oops, something went wrong while updating your cart.',
  'cart.no.stock': 'Sorry, this product is out of stock.',
  'cart.no.style': 'Sorry, this style is out of stock.',
  'asin.not.available': 'Sorry, one of the products in your cart is out of stock, and has been removed.',
  'cannotAddMixedRetailAndEgc': 'Sorry, but e-Gift Cards may not be combined with other retail items. Please complete your purchase before adding to cart.',
  'max.cart.size.exceeded': `Oops! Your ${cartName} is too full. Please remove some items and try again.`
};

export function translateCartError(response) {
  // error responses from cart api contain a status code, otherwise it's an OK response
  if (response.statusCode) {
    return cartErrorTranslator[response.id] || 'Sorry, something went wrong!';
  }
  return null;
}
/**
 * Build a fetch options, given initial config and credentials. This will
 * populate necessary auth headers and fetch opts based on given credentials.
 * @param  {Object} [initOpts={}]    inital fetch opts
 * @param  {Object} [credentials={}] mafia credentials
 * @param  {Object} [queryParamCredentials={}] query param mafia credentials
 * @return {Object}                  fetch options
 */
export function fetchOpts(initOpts = {}, credentials: Cookies = {}, queryParamCredentials = {}) {
  const headers = withAuthHeaders(initOpts.headers || {}, credentials, queryParamCredentials);
  const credOpts: { credentials: RequestCredentials } = authHeadersInUse(credentials, queryParamCredentials) ? {} : { credentials: 'include' };
  return { ...initOpts, ...credOpts, headers };
}

export function addClientHeaders(request) {
  const headers = {};
  // if request is present, we _should_ have all three values
  if (request) {
    const { clientReferer, clientIp, clientUserAgent } = request;
    headers['x-referer'] = clientReferer;
    headers['x-ip'] = clientIp;
    headers['x-user-agent'] = clientUserAgent;
  }
  return headers;
}

function captchaHeaders({ token, answer }) {
  return {
    [MAFIA_CAPTCHA_TOKEN]: token,
    [MAFIA_CAPTCHA_ANSWER]: answer
  };
}

export function withSession(payload, headers) {
  return { payload, session: headers };
}

export function weblabTrigger({ url }: Mafia, weblab, credentials: Cookies, fetcher = timedFetch('weblabTrigger')) {
  const reqUrl = `${url}/v1/weblab?name=${weblab}`;
  return fetcher(reqUrl, fetchOpts({ method: 'get' }, credentials));
}

export function cartData({ url }: Mafia, querystring = '', credentials: Cookies, fetcher = timedFetch('cart')) {
  const reqUrl = `${url}/v1/cart${querystring}`;

  // if a customer has logged in, pass the header that syncs between desktop and mobile
  const headers = ('x-main' in credentials ? { [MAFIA_RECOGNIZED_TOKEN]: credentials['x-main'] } : {});

  return fetcher(reqUrl, fetchOpts({
    method: 'get',
    headers: headers
  }, credentials));
}

export function changeCart({ url }: Mafia, querystring = '', data, credentials: Cookies, fetcher = timedFetch('cart')) {
  const reqUrl = `${url}/v1/cart${querystring}`;
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  if ('x-main' in credentials) {
    headers[MAFIA_RECOGNIZED_TOKEN] = credentials['x-main'];
  }

  return fetcher(reqUrl, fetchOpts({
    method: 'post',
    headers: headers,
    body: JSON.stringify(data)
  }, credentials));
}

export function addresses({ url }: Mafia, credentials: Cookies = {}, fetcher = timedFetch('getAddresses')) {
  const reqUrl = `${url}/v1/address`;
  return fetcher(reqUrl, fetchOpts({ method: 'get' }, credentials));
}

export function paymentTypes({ url, shippingAddressId }, credentials: Cookies = {}, fetcher = timedFetch('getPaymentInstruments')) {
  let reqUrl = `${url}/v1/paymentInstruments`;

  if (shippingAddressId) {
    reqUrl += `?associatedAddressId=${shippingAddressId}`;
  }

  return fetcher(reqUrl, fetchOpts({ method: 'get' }, credentials));
}

export function shipOptions({ url }: Mafia, purchaseId, credentials: Cookies = {}, fetcher = timedFetch('shipmentOptions')) {
  const reqUrl = `${url}/v1/shipmentOptions?purchaseId=${purchaseId}`;
  return fetcher(reqUrl, fetchOpts({ method: 'get' }, credentials));
}

export function getPin({ url }: Mafia, credentials: Cookies = {}, fetcher = timedFetch('getPin')) {
  const reqUrl = `${url}/freja-laas/pin`;
  return fetcher(reqUrl, fetchOpts({ method: 'post' }, credentials));
}

export function validatePin({ url }: Mafia, pin, credentials: Cookies = {}, fetcher = timedFetch('validatePin')) {
  const reqUrl = `${url}/freja-laas/whitelist?pin=${pin}`;
  return fetcher(reqUrl, fetchOpts({ method: 'get' }, credentials));
}

export function getTrackingLabel({ url }: Mafia, data, credentials: Cookies = {}, fetcher = timedFetch('getTrackingLabel')) {
  const reqUrl = `${url}/freja-laas/generateLabel`;
  return fetcher(reqUrl, fetchOpts({
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }, credentials));
}

export function logoutCustomer({ url }: Mafia, credentials: Cookies, fetcher = timedFetch('logoutCustomer')) {
  return fetcher(`${url}/v1/zap/logout`, fetchOpts({ method: 'get', mode: 'no-cors' }, credentials));
}

export function changeAddress(params, credentials: Cookies = {}, saveInvalidAddress = true, fetcher = timedFetch('changeAddress')) {
  const { mafia: { url }, address, forceOriginal } = params;
  const reqUrl = `${url}/v1/address?saveInvalidAddress=${saveInvalidAddress}${forceOriginal ? '&forceOriginal=true' : ''}`;
  return fetcher(reqUrl, fetchOpts({
    method: address.addressId ? 'put' : 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(address)
  }, credentials));
}

export function deleteAddress({ url }: Mafia, credentials: Cookies = {}, addressId, fetcher = timedFetch('deleteAddress')) {
  return fetcher(`${url}/v1/address?addressIds=${addressId}`, fetchOpts({ method: 'DELETE' }, credentials));
}

export function savePayment({ url }: Mafia, params, credentials: Cookies = {}, fetcher = timedFetch('savePaymentInstrument')) {
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

  return fetcher(reqUrl, fetchOpts({
    method: paymentInstrumentId ? 'put' : 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: payment
  }, credentials));
}

export function creditCard({ url }: Mafia, credentials: Cookies = {}, number, paymentInstrumentId, addressId, purchaseId, fetcher = timedFetch('associatePaymentInstrument')) {
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

  return fetcher(reqUrl, fetchOpts({
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: data
  }, credentials));
}

export function primaryPayment({ url }: Mafia, fullName, pid, credentials: Cookies = {}, fetcher = timedFetch('makePrimaryPaymentInstrument')) {
  return fetcher(`${url}/v1/paymentInstruments`, fetchOpts({
    method: 'put',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `paymentInstrumentId=${pid}&isPrimary=true&fullName=${fullName}`
  }, credentials));
}

export function getCustomer({ url }: Mafia, credentials: Cookies = {}, fetcher = timedFetch('customerInfo')) {
  return fetcher(`${url}/v1/customerInfo`, fetchOpts({}, credentials));
}

export function getAdPreferences({ url }: Mafia, credentials: Cookies = {}, { isCustomer, adPreferenceCookie }, fetcher = timedFetch('getAdPreferences')) {
  const { adsPreferenceId } = adPreferenceCookie ? JSON.parse(adPreferenceCookie) : {};

  const reqUrl = isCustomer
    ? `${url}/cronkite/ads/customer/adOptOutStatus` // we get adPreference via x-main
    : `${url}/cronkite/ads/guest/adOptOutStatus/${adsPreferenceId}`; // no x-main, so manually pass it in

  return fetcher(reqUrl, fetchOpts({}, credentials));
}

export function saveAdPreferences({ url }: Mafia, optOutPreference, credentials: Cookies = {}, fetcher = timedFetch('setAdPreferences')) {
  const data = {
    optOutPreference
  };

  const isCustomer = 'x-main' in credentials;

  const reqUrl = `${url}/cronkite/ads/${isCustomer ? 'customer' : 'guest' }/adOptOutStatus`;

  return fetcher(reqUrl, fetchOpts({
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data
    })
  }, credentials));
}

export function getCustomerAuthentication({ url }: Mafia, credentials, fetcher = timedFetch('customerAuth')) {
  // if at-main is available, use it and ubid-main via queryString, else pass it via cookies
  let queryParams = '';
  if (authHeadersInUse(credentials)) {
    queryParams = `?${stringify(({ 'at-main': credentials['at-main'], 'ubid-main': credentials['ubid-main'] }))}`;
  }
  return fetcher(`${url}/auth/v1/atvalid${queryParams}`, fetchOpts({ method: 'get' }, credentials));
}

export function getGiftCard({ url }: Mafia, credentials: Cookies = {}, fetcher = timedFetch('getGiftCard')) {
  const sessionId = credentials['session-id'];
  return fetcher(`${url}/v1/giftCard?sessionId=${sessionId}`, fetchOpts({}, credentials));
}

export function claimGiftCard({ url }: Mafia, giftCardRedeemCode, credentials: Cookies = {}, fetcher = timedFetch('getGiftCard')) {
  return fetcher(`${url}/v1/giftCard`, fetchOpts({
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      claimCode: giftCardRedeemCode,
      sessionId: credentials['session-id']
    })
  }, credentials));
}

// My Account API Proxy
export function getOrdersV3({ url }: Mafia, { page = 1, pageSize = 10, gteDate, lteDate }: Partial<OrderQueryParams>, credentials: Cookies = {}, fetcher = timedFetch('getOrdersV3')): Promise<Response<OrdersResponse>> {
  return fetcher(`${url}/v3/orders?pageSize=${pageSize}&pageNum=${page}${gteDate ? `&gteDate=${gteDate}` : ''}${lteDate ? `&lteDate=${lteDate}` : ''}&includeTracking=true`, fetchOpts({}, credentials));
}

// My Account API Proxy
export function getOrderV3({ url }: Mafia, orderId, credentials: Cookies = {}, fetcher = timedFetch('getOrderV3')) {
  return fetcher(`${url}/v3/order?orderId=${orderId}&includeTracking=true`, fetchOpts({ method: 'get' }, credentials));
}

// My Account Order History Search
export function getOrdersBySearch({ url }: Mafia, { search, page = 1, pageSize = 10, gteDate, lteDate }: Partial<SearchOrderQueryParams>, credentials: Cookies = {}, fetcher = timedFetch('getOrdersV3')): Promise<Response<OrdersResponse>> {
  return fetcher(`${url}/accountapi/a/orders?${stringify({ search, pageSize, page, startDate: gteDate, endDate: lteDate, includeTracking:true })}`, fetchOpts({}, credentials));
}

export function getOrdersByPurchaseIdV2({ url }: Mafia, pId, credentials: Cookies = {}, fetcher = timedFetch('getOrdersByPurchaseIdV2')) {
  return getOrdersByPurchaseIdByVersion(url, pId, credentials, fetcher, 'v2');
}

function getOrdersByPurchaseIdByVersion(url, pId, credentials: Cookies, fetcher, version) {
  return fetcher(`${url}/${version}/ordersByPurchaseId?includeTracking=true&purchaseId=${pId}`, fetchOpts({ method: 'get' }, credentials));
}

export function getPixelData({ url }: Mafia, purchaseId, credentials: Cookies = {}, fetcher = timedFetch('getPixel')) {
  const reqUrl = `${url}/v1/pixel?purchaseId=${purchaseId}`;
  return fetcher(reqUrl, fetchOpts({ method: 'get' }, credentials));
}

export function cancelOrder({ url }: Mafia, { orderId, items }, credentials: Cookies = {}, fetcher = timedFetch('cancelOrder')) {
  return fetcher(`${url}/v2/order/cancel`, fetchOpts({
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, items })
  }, credentials));
}

// Delete payment instrument for a customer
export function deletePaymentInstrument({ url }: Mafia, paymentId, credentials: Cookies = {}, fetcher = timedFetch('deletePaymentInstrument')) {
  return fetcher(`${url}/v1/paymentInstruments/${paymentId}`, fetchOpts({ method: 'DELETE' }, credentials));
}

// Update payment method on an order
export function updatePayment({ url }: Mafia, { orderId, paymentInstrumentId }, credentials: Cookies = {}, fetcher = timedFetch('updatePayment')) {
  return fetcher(`${url}/v1/updatePayment?orderId=${orderId}&paymentInstrumentId=${paymentInstrumentId}`, fetchOpts({ method: 'POST' }, credentials));
}

export function fetchTransportationOptions({ url }: Mafia, data, credentials: Cookies = {}, fetcher = timedFetch('fetchTransportationOptions')) {
  const opts = fetchOpts({
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: JSON.stringify(data)
  }, credentials);
  return fetcher(`${url}/v1/return/transportOptions`, opts);
}

const VILLAGE_IDIOT_SUBSCRIPTION_PATH = '/email/auth/v1/subscriptions';
const MYACCOUNT_SUBSCRIPTION_PATH = '/subscriptionsapi';

export function getSubscriptionVillageIdiot({ url }: Mafia, credentials: Cookies = {}, emailCredentials = {}, fetcher = timedFetch('getSubscriptionVillageIdiot')) {
  const opts = fetchOpts({
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  }, credentials, emailCredentials);
  return fetcher(`${url}${VILLAGE_IDIOT_SUBSCRIPTION_PATH}`, opts);
}

export function updateSubscriptionVillageIdiot(subscriptionsDelta, { url }: Mafia, credentials: Cookies = {}, emailCredentials = {}, fetcher = timedFetch('updateSubscriptionVillageIdiot')) {
  const opts = fetchOpts({
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscriptionsDelta)
  }, credentials, emailCredentials);
  return fetcher(`${url}${VILLAGE_IDIOT_SUBSCRIPTION_PATH}`, opts);
}

function generateMyAccountUrl(mafiaUrl, token) {
  if (token) {
    return `${mafiaUrl}${MYACCOUNT_SUBSCRIPTION_PATH}/n/subscriptions?tokenType=${token.tokenTypeOrAction}&token=${token.token}`;
  } else {
    return `${mafiaUrl}${MYACCOUNT_SUBSCRIPTION_PATH}/a/subscriptions`;
  }
}

export function getSubscriptionMyAccount({ url }: Mafia, credentials: Cookies = {}, token = null, fetcher = timedFetch('getSubscriptionMyAccount')) {
  const opts = fetchOpts({
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  }, credentials);
  return fetcher(`${generateMyAccountUrl(url, token)}`, opts);
}

export function updateSubscriptionMyAccount(subscriptionsDelta, { url }: Mafia, credentials: Cookies = {}, token = null, fetcher = timedFetch('updateSubscriptionMyAccount')) {
  const opts = fetchOpts({
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: JSON.stringify(subscriptionsDelta)
  }, credentials);
  return fetcher(`${generateMyAccountUrl(url, token)}`, opts);
}

export function updateSubscriptionMyAccountUnsubscribeAll({ url }: Mafia, credentials: Cookies, token, fetcher = timedFetch('updateSubscriptionMyAccountUnsubscribeAll')) {
  const opts = fetchOpts({
    method: 'DELETE',
    headers: { 'Accept': 'application/json' }
  }, credentials);
  return fetcher(`${url}${MYACCOUNT_SUBSCRIPTION_PATH}/n/subscriptions/ou/${token}`, opts);
}

export function updateSubscriptionMyAccountOptOut({ url }: Mafia, credentials: Cookies, token, fetcher = timedFetch('updateSubscriptionMyAccountOptOut')) {
  const opts = fetchOpts({
    method: 'POST',
    headers: { 'Accept': 'application/json' }
  }, credentials);
  return fetcher(`${url}${MYACCOUNT_SUBSCRIPTION_PATH}/n/subscriptions/opt-out?token=${token}`, opts);
}

export function requestSubscriptionSignupCaptcha({ url }: Mafia, fetcher = timedFetch('requestSubscriptionSignupCaptcha')) {
  return requestCaptcha(url, `${MYACCOUNT_SUBSCRIPTION_PATH}/c/subscriptions`, fetcher, 'POST');
}

export function submitSubscriptionSignup({ url }: Mafia, credentials: Cookies, { recipientEmail, answer, token }, fetcher = timedFetch('submitSubscriptionSignup')) {
  const opts = fetchOpts({
    method: 'PUT',
    headers: { 'Accept': 'application/json', ...captchaHeaders({ token, answer }) },
    body: recipientEmail
  }, credentials);
  return fetcher(`${url}${MYACCOUNT_SUBSCRIPTION_PATH}/c/subscriptions`, opts);
}

// New Subscription service calls

const AUTH_ZSUBSCRIPTION_PATH = '/emailsubscriptions/subscriptionsapi/v2/a';
const TOKEN_ZSUBSCRIPTION_PATH = '/emailsubscriptions/subscriptionsapi/v2/n';
const CAPTCHA_ZSUBSCRIPTION_PATH = '/emailsubscriptions/subscriptionsapi/v2/c';

export function getSubscriptionVillageIdiotV2({ url }: Mafia, credentials: Cookies = {}, emailCredentials = {}, fetcher = timedFetch('getSubscriptionVillageIdiotV2')) {
  const opts = fetchOpts({
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  }, credentials, emailCredentials);
  return fetcher(`${url}${AUTH_ZSUBSCRIPTION_PATH}/subscriptions?isCustomerFacing=true`, opts);
}

export function updateSubscriptionVillageIdiotV2(subscriptionsDelta, { url }: Mafia, credentials: Cookies = {}, emailCredentials = {}, fetcher = timedFetch('updateSubscriptionVillageIdiotV2')) {
  const subscriptionData = { 'brandSubscriptions' : subscriptionsDelta.brandSubscriptions, 'emailSubscriptions' : subscriptionsDelta.emailLists, 'stockSubscriptions' : subscriptionsDelta.stockSubscriptions };
  const opts = fetchOpts({
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscriptionData)
  }, credentials, emailCredentials);
  return fetcher(`${url}${AUTH_ZSUBSCRIPTION_PATH}/subscriptions`, opts);
}

export function unsubscribeFromAll({ url }: Mafia, credentials: Cookies = {}, emailCredentials = {}, fetcher = timedFetch('unsubscribeFromAll')) {
  const opts = fetchOpts({
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  }, credentials, emailCredentials);
  return fetcher(`${url}${AUTH_ZSUBSCRIPTION_PATH}/subscriptions`, opts);
}

function generateZSubscriptionUrl(mafiaUrl, token) {
  if (token) {
    return `${mafiaUrl}${TOKEN_ZSUBSCRIPTION_PATH}/subscriptions?tokenType=${token.tokenTypeOrAction}&token=${token.token}`;
  } else {
    return `${mafiaUrl}${AUTH_ZSUBSCRIPTION_PATH}/subscriptions`;
  }
}

export function getSubscriptionMyAccountV2({ url }: Mafia, credentials: Cookies = {}, token = null, fetcher = timedFetch('getSubscriptionMyAccountV2')) {
  const opts = fetchOpts({
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  }, credentials);
  if (token) {
    return fetcher(`${generateZSubscriptionUrl(url, token)}`, opts);
  }
  return fetcher(`${generateZSubscriptionUrl(url, token)}?isCustomerFacing=true`, opts);
}

export function updateSubscriptionMyAccountV2(subscriptionsDelta, { url }: Mafia, credentials: Cookies = {}, token = null, fetcher = timedFetch('updateSubscriptionMyAccountV2')) {
  const opts = fetchOpts({
    method: token ? 'POST' : 'PUT',
    headers: { 'Accept': 'application/json' },
    body: JSON.stringify(subscriptionsDelta)
  }, credentials);
  return fetcher(`${generateZSubscriptionUrl(url, token)}`, opts);
}

export function updateSubscriptionMyAccountUnsubscribeAllV2({ url }: Mafia, credentials: Cookies, token, fetcher = timedFetch('updateSubscriptionMyAccountUnsubscribeAllV2')) {
  const opts = fetchOpts({
    method: 'DELETE',
    headers: { 'Accept': 'application/json' }
  }, credentials);
  return fetcher(`${url}${TOKEN_ZSUBSCRIPTION_PATH}/subscriptions/${token.tokenTypeOrAction}/${token.token}`, opts);
}

export function updateSubscriptionMyAccountOptOutV2({ url }: Mafia, credentials: Cookies, token, fetcher = timedFetch('updateSubscriptionMyAccountOptOutV2')) {
  const opts = fetchOpts({
    method: 'POST',
    headers: { 'Accept': 'application/json' }
  }, credentials);
  return fetcher(`${url}${TOKEN_ZSUBSCRIPTION_PATH}/subscriptions/opt-out?token=${token}`, opts);
}

export function requestSubscriptionSignupCaptchaV2({ url }: Mafia, fetcher = timedFetch('requestSubscriptionSignupCaptchaV2')) {
  return requestCaptcha(url, `${CAPTCHA_ZSUBSCRIPTION_PATH}/subscribeToMarketingList`, fetcher, 'POST');
}

export function submitSubscriptionSignupV2({ url }: Mafia, credentials: Cookies, { recipientEmail, answer, token }, fetcher = timedFetch('submitSubscriptionSignupV2')) {
  const opts = fetchOpts({
    method: 'POST',
    headers: { 'Accept': 'application/json', ...captchaHeaders({ token, answer }) },
    body: JSON.stringify({ emailAddress: recipientEmail })
  }, credentials);
  return fetcher(`${url}${CAPTCHA_ZSUBSCRIPTION_PATH}/subscribeToMarketingList`, opts);
}

// Returns
export function getPrereturnInfo({ url }: Mafia, orderId, orderItemIds, credentials: Cookies = {}, fetcher = timedFetch('getPrereturnInfo')) {
  return fetcher(`${url}/v1/return/initiate?orderId=${orderId}&asins=${orderItemIds}`, fetchOpts({}, credentials));
}

export function placeReturn({ url }: Mafia, reqData, credentials: Cookies, fetcher = timedFetch('placeReturn')) {
  const reqUrl = `${url}/v1/return/submit`;
  return fetcher(reqUrl, fetchOpts({
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reqData)
  }, credentials));
}

export function getRewardsTerms({ url }: Mafia, credentials: Cookies = {}, fetcher = timedFetch('getRewardsTerms')) {
  const pageName = 'rewards-terms-of-use';
  return fetcher(`${url}/v1/getPage?pageName=${pageName}`, fetchOpts({}, credentials));
}

export function returnLabelInfo({ url }: Mafia, { rmaId, contractId }, credentials: Cookies = {}, fetcher = timedFetch('returnLabelInfo')) {
  const labelParam = contractId ? `contractId=${contractId}` : `rmaId=${rmaId}`;
  return fetcher(`${url}/v1/return/fetch/label?${labelParam}`, fetchOpts({}, credentials));
}

export function getRewards({ url }: Mafia, akitaKey: string, includesBenefits: boolean, credentials: Cookies = {}, fetcher = timedFetch('getRewards')) {
  const opts = fetchOpts({
    headers: { 'x-api-key': akitaKey }
  }, credentials);

  let fetchUrl = `${url}/akita/slotz/recognized/v1/customers`;

  if (includesBenefits) {
    fetchUrl = `${fetchUrl}?includes=benefits`;
  }

  return fetcher(fetchUrl, opts);
}

export function enrollRewards({ url }: Mafia, akitaKey: string, credentials: Cookies = {}, fetcher = timedFetch('signupForRewards')) {
  return fetcher(`${url}/akita/slotz/full/v1/customers/enroll`, fetchOpts({
    method: 'post',
    headers: { 'Content-Type': 'application/json', 'x-api-key': akitaKey }
  }, credentials));
}

export function enrollRewardsWithEmailToken({ url }: Mafia, akitaKey: string, credentials: Cookies = {}, emailAuthToken, fetcher = timedFetch('signupForRewards')) {
  const queryParamCredentials = emailAuthToken ? { auth_token: emailAuthToken } : {};
  return fetcher(`${url}/akita/slotz/full/v1/customers/enroll`, fetchOpts({
    method: 'post',
    headers: { 'Content-Type': 'application/json', 'x-api-key': akitaKey }
  }, credentials, queryParamCredentials));
}

export function getRedeemableRewards({ url }: Mafia, akitaKey: string, credentials: Cookies = {}, fetcher = timedFetch('getRedeemableRewards')) {
  return fetcher(`${url}/akita/slotz/full/v1/customers/redeem`, fetchOpts({
    headers: { 'x-api-key': akitaKey }
  }, credentials));
}

export function getRewardsEstimate({ url }: Mafia, akitaKey: string, credentials: Cookies = {}, data, fetcher = timedFetch('getRewardsEstimate')) {
  return fetcher(`${url}/akita/slotz/optional/v2/estimate/orders`, fetchOpts({
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': akitaKey
    },
    body: JSON.stringify(data)
  }, credentials));
}

export function setRefundOnFirstScanPreference({ url }: Mafia, akitaKey: string, credentials: Cookies = {}, rofsPreference, fetcher = timedFetch('setRefundOnFirstScanPreference')) {
  const headers = {
    'x-api-key': akitaKey,
    'Content-Type': 'application/json'
  };

  const opts = fetchOpts({
    method: 'post',
    headers,
    body: JSON.stringify({ preference: rofsPreference })
  }, credentials);

  const reqUrl = `${url}/akita/slotz/full/v1/customers/rofs_preference`;
  return fetcher(reqUrl, opts);
}

export function getEGiftCardDesigns({ url }: Mafia, fetcher = timedFetch('getEGCDesigns')) {
  return fetcher(`${url}/v1/eGiftCardDesigns`);
}

export function registerNotifications({ url }: Mafia, subscription, credentials: Cookies = {}, fetcher = timedFetch('registerNotifications')) {
  const reqUrl = `${url}/v1/push/register`;

  return fetcher(reqUrl, fetchOpts({
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      'browserEndpoint': subscription.endpoint,
      'devicePlatform': subscription.devicePlatform, // CHROME || FIREFOX
      'publicKey': subscription.keys['p256dh'],
      'authKey': subscription.keys['auth'],
      'version': '0.1'
    })
  }, credentials));
}

export function getNotificationSubscriptions({ url }: Mafia, endpoint, credentials: Cookies = {}, fetcher = timedFetch('notificationSubscrptions')) {
  const reqUrl = `${url}/v1/push/subscriptions?deviceId=${endpoint}`;
  return fetcher(reqUrl, fetchOpts({
    headers: { 'Content-Type': 'application/json' }
  }, credentials));
}

export function subscribeNotifications({ url }: Mafia, subscriptionName, endpoint, credentials: Cookies = {}, fetcher = timedFetch('notificationSubscrptions')) {
  const reqUrl = `${url}/v1/push/subscribe`;

  return fetcher(reqUrl, fetchOpts({
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      'topic': subscriptionName,
      'deviceId': endpoint
    })
  }, credentials));
}

export function unSubscribeNotifications({ url }: Mafia, subscriptionName, endpoint, credentials: Cookies = {}, fetcher = timedFetch('registerNotifications')) {
  const reqUrl = `${url}/v1/push/unsubscribe?topic=${subscriptionName}&deviceId=${endpoint}`;

  return fetcher(reqUrl, fetchOpts({
    method: 'delete',
    headers: { 'Content-Type': 'application/json' }
  }, credentials));
}

export function getPrimeStatus({ url }: Mafia, credentials: Cookies = {}, fetcher = timedFetch('getPrimeStatus')) {
  const headers = {};

  if ('x-main' in credentials) {
    headers[MAFIA_RECOGNIZED_TOKEN] = credentials['x-main'];
  }

  return fetcher(`${url}/zap/lwa/customer/primeStatus`, { credentials: 'include', headers, fetcher });
}

export function getBrandPromo({ url }: Mafia, brandId: string, fetcher = timedFetch('getBrandPromo')) {
  return fetcher(`${url}/v1/content?pageLayout=Simple&slotName=primary-1&pageName=pdp-brand-promo-${brandId}`);
}

export function getZcsSlot({ url, siteId, subsiteId }: Mafia, credentials: Cookies = {}, params, fetcher = timedFetch('getZcsSlot')) {
  return fetcher(`${url}/v1/content?${stringify({ ...params, siteId, subsiteId })}`, fetchOpts({}, credentials));
}

export function subscribeToStockNotification({ url }: Mafia, data, credentials: Cookies = {}, fetcher = timedFetch('subscribeStockNotification')) {
  const additionalHeaders = {};
  if ('x-main' in credentials) {
    // for cart OOS notify me without being authed
    additionalHeaders[MAFIA_RECOGNIZED_TOKEN] = credentials['x-main'];
  }
  return sendJsonDataWithCreds(`${url}/email/subscriptions/v1/stocks`, data, { credentials, fetcher, additionalHeaders });
}

export function subscribeToList({ url }: Mafia, data, credentials: Cookies = {}, fetcher = timedFetch('subscribeToList')) {
  return sendJsonDataWithCreds(`${url}/email/subscriptions/v2/lists`, data, { credentials, fetcher });
}

export function subscribeToBrand({ url }: Mafia, data, credentials: Cookies = {}, fetcher = timedFetch('subscribeToBrand')) {
  return sendJsonDataWithCreds(`${url}/email/subscriptions/v1/brands`, data, { credentials, fetcher });
}

export function subscribeToMarketingList({ url }: Mafia, data, credentials: Cookies = {}, fetcher = timedFetch('subscribeToMarketingList')) {
  return sendJsonDataWithCreds(`${url}/email/auth/subscribeToMarketingList`, data, { credentials, fetcher });
}

// new ZSubscriptionService APIs

export function subscribeToStockNotificationZSub({ url }: Mafia, data, credentials: Cookies = {}, fetcher = timedFetch('subscribeToStockNotificationZSub')) {
  const additionalHeaders = {};
  if ('x-main' in credentials) {
    // for cart OOS notify me without being authed
    additionalHeaders[MAFIA_RECOGNIZED_TOKEN] = credentials['x-main'];
  }
  return sendJsonDataWithCreds(`${url}${AUTH_ZSUBSCRIPTION_PATH}/subscriptions/stocks`, data, { credentials, fetcher, additionalHeaders });
}

export function subscribeToListZSub({ url }: Mafia, data, credentials: Cookies = {}, fetcher = timedFetch('subscribeToListZSub')) {
  return sendJsonDataWithCreds(`${url}${AUTH_ZSUBSCRIPTION_PATH}/subscriptions/lists`, data, { credentials, fetcher });
}

export function subscribeToBrandZSub({ url }: Mafia, data, credentials: Cookies = {}, fetcher = timedFetch('subscribeToBrandZSub')) {
  return sendJsonDataWithCreds(`${url}${AUTH_ZSUBSCRIPTION_PATH}/subscriptions/brands`, data, { credentials, fetcher });
}

export function subscribeToMarketingListZSub({ url }: Mafia, data, credentials: Cookies = {}, fetcher = timedFetch('subscribeToMarketingListZSub')) {
  return sendJsonDataWithCreds(`${url}${AUTH_ZSUBSCRIPTION_PATH}/subscribeToMarketingList`, data, { credentials, fetcher });
}

export function postTellAFriend({ url }: Mafia, data, captchaResponseData, credentials: Cookies = {}, fetcher = timedFetch('tellAFriend')) {
  return sendJsonDataWithCreds(`${url}${TELL_A_FRIEND_ENDPOINT}`, data, { credentials, fetcher, additionalHeaders: captchaHeaders(captchaResponseData) });
}

function requestCaptcha(mafiaBaseUrl, path, fetcher, method = 'get', credentials: Cookies = {}) {
  return fetcher(`${mafiaBaseUrl}${path}`, fetchOpts({ method, headers: { [MAFIA_CAPTCHA_REQ]: 'v1', [MAFIA_CAPTCHA_AUDIO_REQ]: 'v1' } }, credentials));
}

export function requestTellAFriendCaptcha({ url }: Mafia, credentials: Cookies = {}, fetcher = timedFetch('requestCaptcha')) {
  return requestCaptcha(url, TELL_A_FRIEND_ENDPOINT, fetcher, 'post', credentials);
}

export function postReportAnError({ url }: Mafia, data, captchaResponseData, credentials: Cookies = {}, fetcher = timedFetch('reportAnAError')) {
  return sendJsonDataWithCreds(`${url}${REPORT_AN_ERROR_ENDPOINT}`, data, { credentials, fetcher, additionalHeaders: captchaHeaders(captchaResponseData) });
}

export function requestReportAnErrorCaptcha({ url }: Mafia, credentials: Cookies = {}, fetcher = timedFetch('requestCaptcha')) {
  return requestCaptcha(url, REPORT_AN_ERROR_ENDPOINT, fetcher, 'post', credentials);
}

// Called when MelodyNewsfeed component mounts
export function postNewsfeedImpression({ url }: Mafia, { type, eventId, lineItemId, completed }, credentials: Cookies = {}, fetcher = timedFetch('newsfeedImpression')) {
  const data = {
    [type]: [{
      lineItemId,
      eventId,
      completed
    }]
  };
  return sendJsonDataWithCreds(`${url}/cronkite/newsFeed`, data, { credentials, fetcher });
}

export function postFitSurveyReply({ url }: Mafia, data, credentials: Cookies = {}, fetcher = timedFetch('newsfeedFitSurveyReply')) {
  return sendJsonDataWithCreds(`${url}${ENDPOINT_OPAL_EXPLICITFITS}`, data, { credentials, fetcher });
}

export function updateFitSurveyReply({ url }: Mafia, { id, deleteFit }, data, credentials: Cookies = {}, fetcher = timedFetch('newsfeedUpdateFitSurveyReply')) {
  return sendJsonDataWithCreds(`${url}${ENDPOINT_OPAL_EXPLICITFITS}/${id}`, data, { credentials, fetcher, method: deleteFit ? 'delete' : 'put' });
}

export function dismissNewsfeed({ url }: Mafia, { type, eventId, lineItemId }, credentials: Cookies = {}, fetcher = timedFetch('dismissNewsfeed')) {
  const reqUrl = `${url}/cronkite/newsFeed?type=${type}&eventId=${eventId}&lineItemId=${lineItemId}`;
  return fetcher(reqUrl, fetchOpts({
    method: 'delete',
    headers: { 'Content-Type': 'application/json' }
  }, credentials));
}

export function cartCount({ url }: Mafia, credentials: Cookies = {}, fetcher = timedFetch('getCartCount')) {
  return fetcher(`${url}/v1/getCartItemsCount`, fetchOpts({}, credentials));
}

export function recommendationsSearch({ url }: Mafia, credentials: Cookies = {}, numberOfRecos = 25, slotName = 'zap-hp-vh', searchText = 'empty', fetcher = timedFetch('recommendationsSearch')) {
  return fetcher(`${url}/v1/recommendationsSearch?&searchText=${searchText}&slotName=${slotName}&numberOfRecos=${numberOfRecos}`, fetchOpts({}, credentials));
}

export function getExplicitFits({ url }: Mafia, credentials: Cookies = {}, fetcher = timedFetch('getExplicitFits')) {
  return fetcher(`${url}${ENDPOINT_OPAL_EXPLICITFITS}`, fetchOpts({}, credentials));
}

export function getLandingPageInfo({ url, siteId, subsiteId }: Mafia, { pageName }, credentials: Cookies = {}, request = {}, location = {}, fetcher = timedFetch('getLandingPageInfo')) {
  const qs = stringify({
    ...location.query, // pass query params to mafia
    siteId,
    subsiteId,
    pageName
  }, { sort: false }
  );
  const reqUrl = `${url}/v1/getPage?${qs}`;
  const headers = addClientHeaders(request);
  // Attatch 'geo' cookie to server-side marty calls as 'zfc-geo' header
  translateCookieToMafiaHeader(headers, credentials, 'zfc-geo', 'geo');
  return fetcher(reqUrl, fetchOpts({ headers }, credentials));
}

export function getTaxonomyBrandPageInfo({ url, siteId, subsiteId }: Mafia, brandId: string, credentials: Cookies = {}, request = {}, fetcher = timedFetch('getTaxonomyBrandPageInfo')) {
  const qs = stringify({
    pageName: 'generic-brands-template',
    brandId,
    siteId,
    subsiteId
  });
  const reqUrl = `${url}/v1/getPage?${qs}`;
  const headers = addClientHeaders(request);
  // Attatch 'geo' cookie to server-side marty calls as 'zfc-geo' header
  translateCookieToMafiaHeader(headers, credentials, 'zfc-geo', 'geo');
  return fetcher(reqUrl, fetchOpts({ headers }, credentials));
}

export function getSymphonyPreviewInfo({ url }: Mafia, slot, credentials: Cookies = {}, fetcher = timedFetch('getSymphonyPreviewInfo')) {
  const reqUrl = `${url}/zcs/preview?slot_center-1=${slot}`;
  return fetcher(reqUrl, fetchOpts({}, credentials));
}

export function getSymphonyPdpComponents({ url, siteId, subsiteId }: Mafia, { productId, styleId }, credentials: Cookies = {}, fetcher = timedFetch('getSymphonyPdpComponents')) {
  const qs = stringify({
    product: productId,
    style: styleId,
    siteId,
    subsiteId
  });
  const reqUrl = `${url}/zcs/productPage?${qs}`;
  return fetcher(reqUrl, fetchOpts({}, credentials));
}

export function getSymphonySlots({ url, siteId, subsiteId }: Mafia, { ...params } = {}, credentials: Cookies = {}, fetcher = timedFetch('getSymphonyPdpComponents')) {
  const qs = stringify({
    siteId,
    subsiteId,
    ...params
  });
  const reqUrl = `${url}/zcs/getSlots?${qs}`;
  return fetcher(reqUrl, fetchOpts({}, credentials));
}

export function getSymphonySearchComponents({ url }: Mafia, { term }, credentials: Cookies = {}, request = {}, fetcher = timedFetch('getSymphonySearchComponents')) {
  const reqUrl = `${url}/zcs/getSlots?pageName=${term}&pageLayout=search`;
  const headers = addClientHeaders(request);
  return fetcher(reqUrl, fetchOpts({ headers }, credentials));
}

interface JanusFetchOpts {
  params: JanusParams;
  widgets: string;
  limit?: number | string;
  credentials?: any; // TODO ts type this with creds;
  dispatch: ThunkDispatch<AppState, void, AnyAction>;
  getState: () => AppState;
}

export function getJanusRecos({ url }: Mafia, { params, widgets, limit = 5, credentials = {}, dispatch, getState }: JanusFetchOpts, fetcher = timedFetch('janusRecos')): Promise<Recos> {
  const query = stringify({
    widgets,
    limit,
    ...params
  }, { encode: false });
  return fetcher(`${url}/janus/recos/get?${query}`,
    fetchOpts({
      credentials: 'include'
    }, credentials))
    .then(processHeadersMiddleware(setSessionCookies(dispatch, getState)))
    .then(fetchErrorMiddleware);
}

export function submitRaffle({ url }: Mafia, credentials: Cookies = {}, data, fetcher = timedFetch('submitRaffle')) {
  return fetcher(`${url}/email/subscriptions/zen/v1/raffle`, fetchOpts({
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(data)
  }, credentials))
    .then(fetchErrorMiddleware);
}

export async function getSurveyQuestions({ url }: Mafia, surveyName, fetcher = timedFetch('getSurveyQuestions')) {
  const reqUrl = `${url}/auscult/unauth/survey/take/${surveyName}`;
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  const response = await fetcher(reqUrl, { headers });
  const json = await response.json();
  return json;
}

export async function saveSurveyQuestionResponse({ url }: Mafia, params, credentials: Cookies, fetcher = timedFetch('saveSurveyQuestionResponse')) {
  const { csrfToken, feedback, source, surveyId, questionId } = params;
  const reqUrl = `${url}/auscult/unauth/survey/take/${surveyId}`;
  const headers = { 'Content-Type': 'application/json' };
  const submission = {
    _csrf_token: csrfToken,
    id: surveyId,
    take_survey: {
      [`q${questionId}`]: feedback,
      [`qid${questionId}`]: `${questionId}`
    },
    metadata: { source }
  };
  const opts = fetchOpts({
    method: 'post',
    headers,
    body: JSON.stringify(submission)
  }, credentials);
  const response = await fetcher(reqUrl, opts);
  const json = await response.json();
  return json;
}

// Exchanges

export function initiateExchange({ url }: Mafia, orderId: string, orderItemIds, credentials: Cookies = {}, fetcher = timedFetch('initiateExchange')) {
  return fetcher(`${url}/v1/exchange/initiate?orderId=${orderId}&asins=${orderItemIds}`, fetchOpts({}, credentials));
}

export function placeExchange({ url }: Mafia, reqData, credentials: Cookies = {}, fetcher = timedFetch('placeExchange')) {
  const reqUrl = `${url}/v1/exchange/submit`;
  return fetcher(reqUrl, fetchOpts({
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reqData)
  }, credentials));
}

export function previewExchangeEligibility({ url }: Mafia, orderId: string, credentials: Cookies = {}, fetcher = timedFetch('previewExchangeEligibility')) {
  return fetcher(`${url}/v1/exchange/previewEligibility?orderId=${orderId}`, fetchOpts({}, credentials));
}

/**
 * Get product sizing prediction
 * @param  {object}   url             sizing prediction api endpoint
 * @param  {string}   productId       product id
 * @param  {function} [fetcher=fetch] fetch or fetch like implementation
 * @return {Promise}                   promise
 */
export function genericSizeBias({ url }: Mafia, productId: string, credentials: Cookies = {}, fetcher = timedFetch('genericSizingPrediction')) {

  const queryParams = {
    productId
  };

  const query = stringify(queryParams);
  const reqUrl = `${url}/zcs/getSizeBias?${query}`;
  return fetcher(reqUrl, fetchOpts({
    credentials: 'include'
  }, credentials));
}

export function fetchExchangeOrderId({ url }: Mafia, contractId: string, credentials: Cookies = {}, fetcher = timedFetch('viewExchangeOrderId')) {
  return fetcher(`${url}/v1/exchange/fetch?contractId=${contractId}`, fetchOpts({}, credentials));
}
