import ExecutionEnvironment from 'exenv';

import { LOCATION_ASSIGN } from 'constants/appConstants';
import { REDIRECT, RESET_ERROR, SET_ERROR } from 'constants/reduxActions';
import { setFederatedLoginModalVisibility } from 'actions/headerfooter';
import { fireMartyPixel } from 'actions/pixelServer';
import { postMartyPixel } from 'apis/martyPixel';
import { buildAuthenticationRedirectUrl } from 'utils/redirect';
import { ERROR_NOT_AUTHENTICATED } from 'middleware/fetchErrorMiddleware';
import marketplace from 'cfg/marketplace.json';

const { hasFederatedLogin } = marketplace;

export const err = {
  GENERIC: 'Oops, something went wrong! Please try again.',
  NETWORK: 'Oops, something went wrong! (Are we connected to Internet?)',
  BRAND_ID: 'Oops, not a valid brand id.',
  BRAND_INFO: 'Oops, something went wrong while loading the brand info.',
  PRODUCT_DETAILS: 'Oops, something went wrong while loading product details.',
  PRODUCT_OUT_OF_STOCK: 'The product has no styles in stock.',
  CART: 'Oops, something went wrong while updating your cart.',
  ERROR_ADDING_TO_EMAIL_LIST: 'Uh oh, it looks like we encountered an error adding you to the list.  This has been logged and we are working on a fix.'
};

export function buildError(errorMessage, errorEvent, statusCode) {
  let status = 500;
  // XXX do we ever want the public response status to be a non-404 or 500?
  if (statusCode) {
    status = statusCode;
  } else if (errorEvent && errorEvent.status) {
    status = errorEvent.status === 404 ? 404 : 500;
  }
  return {
    type: SET_ERROR,
    errorMessage,
    errorEvent,
    errorType: ExecutionEnvironment.canUseDOM ? 'CLIENT' : 'SERVER',
    statusCode: status
  };
}

export function setError(errorMessage, errorEvent, statusCode) {
  return function(dispatch, getState) {
    const { routing: { locationBeforeTransitions } } = getState();
    return dispatch({
      ...buildError(errorMessage, errorEvent, statusCode),
      location: locationBeforeTransitions
    });
  };

}

export function resetError() {
  return {
    type: RESET_ERROR
  };
}

export function redirectToAuth(redirectPath) {
  return function(dispatch) {
    if (hasFederatedLogin) {
      return dispatch(setFederatedLoginModalVisibility(true, { returnTo: redirectPath, redirectOnClose: '/' }));
    } else {
      return dispatch({ type: REDIRECT, location: buildAuthenticationRedirectUrl(redirectPath) });
    }
  };
}

export function redirectToAuthWithHistory(dispatch, redirectPath) {
  return dispatch({
    type: REDIRECT,
    location: buildAuthenticationRedirectUrl(redirectPath),
    method: LOCATION_ASSIGN
  });
}

export const authenticationErrorCatchHandlerFactory = (dispatch, redirectPath) => e => {
  switch (e.id) {
    case ERROR_NOT_AUTHENTICATED:
      return dispatch(redirectToAuth(redirectPath));
    default:
      return dispatch(setError(err.GENERIC, e));
  }
};

export const fetchOrderHistorySearchCatchHandler = (dispatch, redirectPath, alternateAction) => e => {
  if (e.id === ERROR_NOT_AUTHENTICATED) {
    return dispatch(redirectToAuth(redirectPath));
  } else if (alternateAction instanceof Function) {
    return dispatch(alternateAction());
  } else {
    return dispatch(setError(err.GENERIC, e));
  }
};

export function trackErrorToMartyPixel(qs, endpoints = { postMartyPixel }) {
  return function(dispatch) {
    dispatch(fireMartyPixel(qs, 'martyError', endpoints));
  };
}
