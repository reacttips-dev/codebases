import { RECEIVE_CUSTOMER_AUTH_DETAILS } from 'constants/reduxActions';
import { err, setError } from 'actions/errors';
import { redirectToAuthenticationFor } from 'actions/redirect';
import { setSessionCookies } from 'actions/session';
import { getCustomerAuthentication } from 'apis/mafia';
import { parsePath } from 'helpers/LocationUtils';
import { processHeadersMiddleware } from 'middleware/processHeadersMiddlewareFactory';
import { fetchErrorMiddleware } from 'middleware/fetchErrorMiddleware';
export function receiveCustomerAuthDetails(response) {
  return {
    type: RECEIVE_CUSTOMER_AUTH_DETAILS,
    authObj: response
  };
}

export function fetchCustomerAuthDetails(customerAuthFetcher = getCustomerAuthentication) {
  return (dispatch, getState) => {
    const { cookies, environmentConfig: { api: { mafia } } } = getState();
    return customerAuthFetcher(mafia, cookies)
      .then(processHeadersMiddleware(setSessionCookies(dispatch, getState)))
      .then(fetchErrorMiddleware)
      .then(response => {
        dispatch(receiveCustomerAuthDetails(response));
        return response;
      })
      .catch(e => {
        dispatch(setError(err.GENERIC, e));
        return { success: false }; // emulate the response failure in case any caller is explicitly .then'ing the promise.
      });
  };
}

export function checkCustomerAuthentication(urlToReturnToOnFailure, callbackIfAuthenticated, {
  callbackIfNotAuthenticated = f => f,
  redirectOnClose,
  fetcherOfCustomerAuthDetails = fetchCustomerAuthDetails
} = {}) {
  return (dispatch, getState) => {
    const redirectLocation = typeof urlToReturnToOnFailure === 'object' ? urlToReturnToOnFailure : parsePath(urlToReturnToOnFailure);
    const { cookies, authentication } = getState();
    if (authentication === true) {
      callbackIfAuthenticated();
      return Promise.resolve();
    } else if (!cookies['x-main'] || authentication === false) {
      // TODO these redirect calls should have the option to be "push" rather than replace style once https://github01.zappos.net/mweb/marty/issues/3360 is implemented
      callbackIfNotAuthenticated();
      return dispatch(redirectToAuthenticationFor(redirectLocation, redirectOnClose));
    } else {
      // user has x-main, and we have not checked auth yet so we need to ask nicely the authentication status
      return dispatch(fetcherOfCustomerAuthDetails()).then(result => {
        if (result.success) {
          callbackIfAuthenticated();
        } else {
          callbackIfNotAuthenticated?.();
          return dispatch(redirectToAuthenticationFor(redirectLocation, redirectOnClose));
        }
      });
    }
  };
}
