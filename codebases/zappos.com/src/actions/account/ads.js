import { getAdPreferences, saveAdPreferences } from 'apis/mafia';
import { fetchErrorMiddleware } from 'middleware/fetchErrorMiddleware';
import { tryParse } from 'helpers/DataFormatUtils';
import { setAndStoreCookie } from 'actions/session';
import { RECEIVE_AD_PREFERENCE_ERROR, RECEIVE_AD_PREFERENCES } from 'constants/reduxActions';
import { AD_PREFERENCE_COOKIE } from 'constants/cookies';

export const receiveAdPreferences = ads => ({
  type: RECEIVE_AD_PREFERENCES,
  ads
});

export const receiveAdPreferenceError = err => ({
  type: RECEIVE_AD_PREFERENCE_ERROR,
  err
});

export const getUserAdPreference = ({ cookies }) => {
  const adPreferenceCookie = cookies[AD_PREFERENCE_COOKIE];

  // if no preference is available, default to opted into personalized ads
  if (!adPreferenceCookie) {
    return { optOutPreference: true };
  }

  return tryParse(adPreferenceCookie, {}); // adPreferenceCookie was unparsable / malformed, just return with an empty object
};

export const setAdPreferenceCookie = ({ adsPreferenceId, optOutPreference }, isCustomer) => {
  const inAnHour = new Date();
  inAnHour.setHours(inAnHour.getHours() + 1);

  return (
    setAndStoreCookie(
      AD_PREFERENCE_COOKIE,
      JSON.stringify({ adsPreferenceId, isCustomer, optOutPreference }),
      inAnHour
    )
  );
};

export const fetchAdPreferences = () => (dispatch, getState) => {
  const { cookies, environmentConfig: { api: { mafia } } } = getState();
  const isCustomer = 'x-main' in cookies;
  const adPreferenceCookie = cookies[AD_PREFERENCE_COOKIE];

  // if you're a guest
  if (!isCustomer) {
    if (adPreferenceCookie) {
      return; // you're a guest with a cookie, bail early
    } else {
      dispatch(receiveAdPreferences()); // default the experience (which makes calls to ads)
      return;
    }
  }

  const parsedCookie = adPreferenceCookie ? JSON.parse(adPreferenceCookie) : null;

  /*
  * if you're a customer
  * a preference cookie exists
  * and the cookie was set as a recognized customer
  */

  if (parsedCookie?.isCustomer) {
    return;
  }

  getAdPreferences(mafia, cookies, { isCustomer, adPreferenceCookie })
    .then(fetchErrorMiddleware)
    .then(resp => {
      dispatch(setAdPreferenceCookie(resp, isCustomer));
      return resp;
    })
    .catch(err => {
      dispatch(receiveAdPreferenceError(err));
    });
};

export const setAdPreferences = optOutPreference => (dispatch, getState) => {
  const { cookies, environmentConfig: { api: { mafia } } } = getState();
  const isCustomer = 'x-main' in cookies;

  if (typeof optOutPreference === 'string') {
    optOutPreference = optOutPreference === 'true' ? true : false;
  }

  return saveAdPreferences(mafia, optOutPreference, cookies)
    .then(fetchErrorMiddleware)
    .then(resp => {
      dispatch(setAdPreferenceCookie(resp, isCustomer));
      return resp;
    })
    // response to post is what we receive in the get
    // return the dispatch so ZapposForm can read it
    .then(() => dispatch(receiveAdPreferences({ success: true })))
    .catch(err => dispatch(receiveAdPreferenceError(err)));
};
