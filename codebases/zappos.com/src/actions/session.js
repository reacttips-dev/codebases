import { REMOVE_COOKIE, SET_COOKIE } from 'constants/reduxActions';
import {
  MAFIA_SESSION_ID,
  MAFIA_SESSION_TOKEN,
  MAFIA_UBID_MAIN
} from 'constants/apis';
import { cookieDomain } from 'cfg/marketplace.json';

export function sessionExpiration() {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 20);
  date.setMonth(0);
  date.setDate(1); // the only 1-indexed setter..
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

export const setSessionCookies = (dispatch, getState) => responseHeaders => {
  const state = getState();
  const responseUbidMain = responseHeaders.get(MAFIA_UBID_MAIN);
  const responseSessionId = responseHeaders.get(MAFIA_SESSION_ID);
  const responseSessionToken = responseHeaders.get(MAFIA_SESSION_TOKEN);

  if (state.cookies && responseUbidMain && responseSessionId && responseSessionToken) {
    const { cookies: { 'session-id': sessionId, 'ubid-main': ubidMain, 'session-token': sessionToken } } = state;

    // mafia and marty sessions match - so don't set cookies
    if (ubidMain === responseUbidMain && sessionId === responseSessionId && sessionToken === responseSessionToken) {
      return;
    }
  }

  const expiration = sessionExpiration();
  responseSessionId && dispatch(setAndStoreCookie('session-id', responseSessionId, expiration));
  responseSessionToken && dispatch(setAndStoreCookie('session-token', responseSessionToken, expiration));
  responseUbidMain && dispatch(setAndStoreCookie('ubid-main', responseUbidMain, expiration));
};

// This is the action creator, to do a raw cookie set see helpers#setCookie
export function setAndStoreCookie(cookieName, cookieValue, expires) {
  return {
    type: SET_COOKIE,
    cookie: {
      name: cookieName,
      value: cookieValue,
      options: {
        domain: cookieDomain,
        expires
      }
    }
  };
}

// This is the action creator.  It's tied to browserMetadataMiddleware's REMOVE_COOKIE
export function removeFromStoredCookies(cookieName) {
  return {
    type: REMOVE_COOKIE,
    cookie: {
      name: cookieName,
      domain: cookieDomain
    }
  };
}
