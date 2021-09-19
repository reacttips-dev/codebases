import { UPDATE_IFRAME_SHEERID_SOURCE } from 'constants/reduxActions';
import { fetchErrorMiddleware } from 'middleware/fetchErrorMiddleware';
import { getCustomer } from 'apis/mafia';
import { err, setError } from 'actions/errors';

export function updateIframeSrc(href) {
  return {
    type: UPDATE_IFRAME_SHEERID_SOURCE,
    href
  };
}

export function appendDirectedId(href, customerInfo) {
  const { directedId } = customerInfo;
  const dirIdPostfix = directedId.split('.')[2];
  return `${href}?customerID=${dirIdPostfix}`;
}

export function fetchCustomerDirectedIdAndAppend(href, getCustomerInfoApi = getCustomer) {
  return (dispatch, getState) => {
    const state = getState();
    const { cookies, environmentConfig: { api: { mafia } } } = state;
    return getCustomerInfoApi(mafia, cookies)
      .then(fetchErrorMiddleware)
      .then(response => {
        const { customerInfo } = response;
        dispatch(updateIframeSrc(appendDirectedId(href, customerInfo)));
      })
      .catch(() => {
        dispatch(setError(err.GENERIC, new Error('Fetching customer info v1/customerInfo')));
      });
  };
}

