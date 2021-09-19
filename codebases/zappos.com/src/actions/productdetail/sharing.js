import {
  RECEIVE_PRODUCT_ALL_SIZES,
  RECEIVE_REPORT_AN_ERROR_CAPTCHA,
  RECEIVE_TELL_A_FRIEND_CAPTCHA,
  REPORT_AN_ERROR_INVALID_CAPTCHA,
  RESET_REPORT_AN_ERROR,
  RESET_TELL_A_FRIEND,
  SEND_PRODUCT_NOTIFY_SUBSCRIPTION,
  SEND_PRODUCT_NOTIFY_SUBSCRIPTION_COMPLETE,
  SEND_REPORT_AN_ERROR,
  SEND_REPORT_AN_ERROR_COMPLETE,
  SEND_TELL_A_FRIEND,
  SEND_TELL_A_FRIEND_COMPLETE,
  TELL_A_FREND_INVALID_CAPTCHA,
  TOGGLE_BRAND_NOTIFY_MODAL,
  TOGGLE_PRODUCT_NOTIFY_MODAL,
  TOGGLE_REPORT_AN_ERROR_MODAL
} from 'constants/reduxActions';
import { SHAMELESS_PLUG_LIST_ID } from 'constants/appConstants';
import { setSessionCookies } from 'actions/session';
import { trackEvent } from 'helpers/analytics';
import { productBundle } from 'apis/cloudcatalog';
import {
  postReportAnError,
  postTellAFriend,
  requestReportAnErrorCaptcha,
  requestTellAFriendCaptcha,
  subscribeToBrand,
  subscribeToBrandZSub,
  subscribeToList,
  subscribeToListZSub,
  subscribeToStockNotification,
  subscribeToStockNotificationZSub
} from 'apis/mafia';
import { fetchErrorMiddleware, fetchErrorMiddlewareAllowedErrors } from 'middleware/fetchErrorMiddleware';
import { processHeadersMiddleware } from 'middleware/processHeadersMiddlewareFactory';
import { trackError } from 'helpers/ErrorUtils';
import { getSubsiteId } from 'helpers/ClientUtils';
import marketplace from 'cfg/marketplace.json';
import { isAssigned } from 'actions/ab';
import { HYDRA_SUBSCRIPTION_TEST } from 'constants/hydraTests';

const { siteId } = marketplace;

export function resetTellAFriend() {
  return { type: RESET_TELL_A_FRIEND };
}

export function setupTellAFriendCaptcha(captcha) {
  return { type: RECEIVE_TELL_A_FRIEND_CAPTCHA, captcha };
}

export function startSendTellAFriend() {
  return { type: SEND_TELL_A_FRIEND };
}

export function tellFriendComplete(successful) {
  return { type: SEND_TELL_A_FRIEND_COMPLETE, successful };
}

export function tellAFriendInvalidCaptcha() {
  return { type: TELL_A_FREND_INVALID_CAPTCHA };
}

export function sendTellAFriendEmail(data, captchaAnswer, apiCall = postTellAFriend) {
  const reportEventAsUnsuccessful = () => {
    trackEvent('TE_PDP_TELLAFRIEND_SEND_ERROR', `SKU:${data.productId}`);
  };
  const boundApiACall = ({ cookies, environmentConfig: { api: { mafia } } }) => apiCall(mafia, data, captchaAnswer, cookies);
  return performCaptchaProtectedApiCall(boundApiACall, startSendTellAFriend, tellAFriendInvalidCaptcha, initializeTellAFriendCaptcha, tellFriendComplete, reportEventAsUnsuccessful);
}

export function toggleBrandNotifyModal(modalShown) {
  return { type: TOGGLE_BRAND_NOTIFY_MODAL, modalShown };
}

export function toggleProductNotifyModal(modalShown) {
  return { type: TOGGLE_PRODUCT_NOTIFY_MODAL, modalShown };
}

export function startSendNotificationSubscription() {
  return { type: SEND_PRODUCT_NOTIFY_SUBSCRIPTION };
}

export function sendNotificationSubscriptionComplete(successful) {
  return { type: SEND_PRODUCT_NOTIFY_SUBSCRIPTION_COMPLETE, successful };
}

export function loadedOosProductStyleAndSizes(product) {
  return { type: RECEIVE_PRODUCT_ALL_SIZES, product };
}

export function sendNotificationSubscriptions(emailAddress, stockId, subscribeToNewsletter, brandToSubscribe) {
  return (dispatch, getState) => {
    const state = getState();
    const { cookies, environmentConfig: { api: { mafia } } } = state;
    const hydraNewSubscriptionService = isAssigned(HYDRA_SUBSCRIPTION_TEST, 1, state);

    const subsiteId = getSubsiteId(marketplace);
    dispatch(startSendNotificationSubscription());
    // based on what was supplied we need to make anywhere from one to three API calls
    const apiCalls = [];
    if (stockId) {
      const subscribe = hydraNewSubscriptionService ? subscribeToStockNotificationZSub : subscribeToStockNotification;
      apiCalls.push(subscribe(mafia, {
        emailAddress,
        stockIds: [stockId]
      }, cookies));
    }
    if (subscribeToNewsletter) {
      const subscribe = hydraNewSubscriptionService ? subscribeToListZSub : subscribeToList ;
      apiCalls.push(subscribe(mafia, {
        siteId,
        subsiteId,
        listIds: [SHAMELESS_PLUG_LIST_ID],
        emailAddress
      }, cookies));
    }
    if (brandToSubscribe) {
      const subscribe = hydraNewSubscriptionService ? subscribeToBrandZSub : subscribeToBrand;
      apiCalls.push(subscribe(mafia, {
        emailAddress,
        brandIds: [brandToSubscribe]
      }, cookies));
    }

    if (apiCalls.length) {
      return Promise.all(apiCalls)
        .then(responses => {
          const encounteredError = responses.some(resp => resp.status >= 400);
          dispatch(sendNotificationSubscriptionComplete(!encounteredError));
        });
    } else {
      dispatch(sendNotificationSubscriptionComplete(true));
      return Promise.resolve();
    }
  };
}

function initializeCaptcha(captchaRequestFunction, onSuccessAction, onErrorAction, onErrorEventName) {
  return (dispatch, getState) => {
    const { cookies, environmentConfig: { api: { mafia } } } = getState();
    return captchaRequestFunction(mafia, cookies)
      .then(fetchErrorMiddleware)
      .then(captchaData => {
        dispatch(onSuccessAction(captchaData));
      })
      .catch(() => {
        trackEvent(onErrorEventName);
        dispatch(onErrorAction(false));
      });
  };
}

export function initializeTellAFriendCaptcha() {
  return initializeCaptcha(requestTellAFriendCaptcha, setupTellAFriendCaptcha, tellFriendComplete, 'TE_PDP_TELLAFRIEND_SEND_ERROR');
}

export function fetchAllProductStyles(productId, productFetcher = productBundle) {
  return (dispatch, getState) => {
    const { environmentConfig: { api: { cloudcatalog } } } = getState();
    return productFetcher(cloudcatalog, { productId, includeOosSizing: true, includeOos: true })
      .then(fetchErrorMiddleware)
      .then(resp => {
        if (resp.product && resp.product.length === 1) {
          dispatch(loadedOosProductStyleAndSizes(resp.product[0]));
        } else {
          throw new Error('Unable to load oos style and stocks');
        }

      })
      .catch(e => {
        trackError('NON-FATAL', `could not load OOS style data for product ${productId}`, e);
        dispatch(sendNotificationSubscriptionComplete(false));
      });

  };
}

export function toggleReportAnErrorModal(modalShown) {
  return { type: TOGGLE_REPORT_AN_ERROR_MODAL, modalShown };
}

export function initializeReportAnErrorCaptcha() {
  return initializeCaptcha(requestReportAnErrorCaptcha, setupReportAnErrorCaptcha, reportAnErrorComplete, 'TE_PDP_REPORTANERROR_SEND_ERROR');
}

export function setupReportAnErrorCaptcha(captcha) {
  return { type: RECEIVE_REPORT_AN_ERROR_CAPTCHA, captcha };
}

export function startReportError() {
  return { type: SEND_REPORT_AN_ERROR };
}

export function reportAnErrorComplete(successful) {
  return { type: SEND_REPORT_AN_ERROR_COMPLETE, successful };
}

export function reportAnErrorInvalidCaptcha() {
  return { type: REPORT_AN_ERROR_INVALID_CAPTCHA };
}

export function resetReportAnError() {
  return { type: RESET_REPORT_AN_ERROR };
}

function performCaptchaProtectedApiCall(boundApiCall, startAction, invalidCaptchaAction, reinitializeCaptchaAction, completeAction, recordEventAsUnsuccessful) {
  return (dispatch, getState) => {
    dispatch(startAction());
    return boundApiCall(getState())
      .then(processHeadersMiddleware(setSessionCookies(dispatch, getState)))
      .then(fetchErrorMiddlewareAllowedErrors([401]))
      .then(resp => {
        if (resp.statusCode === 401) { // 401 for wrong captcha
          dispatch(invalidCaptchaAction());
          // get a new captcha, since an invalid request will make the original token invalid.
          dispatch(reinitializeCaptchaAction());
        } else {
          const { successful } = resp;
          if (!successful) {
            recordEventAsUnsuccessful();
          }
          dispatch(completeAction(successful));
        }
      })
      .catch(e => {
        trackError('NON-FATAL', 'Could make Captcha protected API Call.', e);
        recordEventAsUnsuccessful();
        dispatch(completeAction(false));
      });
  };
}

export function reportError(data, captchaAnswer, apiCall = postReportAnError) {
  data.siteId = siteId;
  data.subsiteId = getSubsiteId(marketplace);
  const reportEventAsUnsuccessful = () => {
    trackEvent('TE_PDP_TELLAFRIEND_SEND_ERROR', `SKU:${data.productId}`);
  };
  const boundApiACall = ({ cookies, environmentConfig: { api: { mafia } } }) => apiCall(mafia, data, captchaAnswer, cookies);
  return performCaptchaProtectedApiCall(boundApiACall, startReportError, reportAnErrorInvalidCaptcha, initializeReportAnErrorCaptcha, reportAnErrorComplete, reportEventAsUnsuccessful);
}
