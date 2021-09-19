import { call, put, select, takeEvery } from 'redux-saga/effects';
import queryString from 'query-string';

import { EXCHANGE_INITIATE_PAGE } from 'constants/amethystPageTypes';
import timedFetch from 'middleware/timedFetch';
import { fetchOpts } from 'apis/mafia';
import {
  API_ERROR_EDIT_INACTIVE_ADDRESS,
  API_ERROR_NOT_AUTHORIZED,
  API_ERROR_REQUEST_VALIDATION,
  API_ERROR_UNKNOWN
} from 'constants/apiErrors';
import {
  EXCHANGES_STEP_MAP,
  LIST_ADDRESS_STEP,
  NEW_ADDRESS_STEP,
  REVIEW_STEP
} from 'constants/exchangesFlow';
import { API_ERROR, REDIRECT } from 'constants/reduxActions';
import { buildAuthenticationRedirectUrl } from 'utils/redirect';
import logger from 'middleware/logger';
import {
  ERROR_EDIT_INACTIVE_ADDRESS,
  ERROR_NOT_AUTHENTICATED,
  ERROR_REQUEST_VALIDATION
} from 'middleware/fetchErrorMiddleware';
import {
  storeEditOfInactiveAddressError,
  storeTempFailureMsg,
  storeTempSuccessMsg
} from 'store/ducks/address/actions';
import {
  SET_FORM_ERRORS
} from 'store/ducks/checkout/types';
import { SET_ADDRESS_DATA_LOADING } from 'store/ducks/address/types';
import { workDeleteAddress, workRequestAddresses, workUpdateAddress } from 'store/ducks/address/sagas';
import {
  onAddOrEditAddressEvent,
  onAddOrEditShippingAddressErrorEvent
} from 'store/ducks/exchanges/actions';
import {
  EXCHANGES_DELETE_ADDRESS,
  EXCHANGES_ON_HIDE_NEW_SHIPPING_ADDRESS_MODAL_CLICK,
  EXCHANGES_ON_SHOW_ADD_NEW_SHIPPING_ADDRESS_MODAL_CLICK,
  EXCHANGES_ON_USE_SHIPPING_ADDRESS_CLICK,
  EXCHANGES_REQUEST_ALL_ADDRESSES,
  EXCHANGES_SAVE_ADDRESS,
  EXCHANGES_SET_PRIMARY_SHIPPING_ADDRESS
} from 'store/ducks/exchanges/types';
import {
  getWasAddressValid
} from 'store/ducks/readFromStore';

export function* watchOnShowNewShippingAddressModalClick() {
  yield takeEvery(EXCHANGES_ON_SHOW_ADD_NEW_SHIPPING_ADDRESS_MODAL_CLICK, workGoToStep, { step: NEW_ADDRESS_STEP });
}

export function* watchOnHideNewShippingAddressModalClick() {
  yield takeEvery(EXCHANGES_ON_HIDE_NEW_SHIPPING_ADDRESS_MODAL_CLICK, workGoToStep, { step: LIST_ADDRESS_STEP });
}

export function* workGoToStep(params) {
  const { step } = params;
  const links = EXCHANGES_STEP_MAP;
  const location = links[step];
  yield put({ type: REDIRECT, location });
}

export function* watchDeleteExchangesAddress() {
  yield takeEvery(EXCHANGES_DELETE_ADDRESS, workDeleteExchangesAddress);
}

export function* workDeleteExchangesAddress({ addressId }) {
  try {
    const success = yield call(workDeleteAddress, addressId);
    yield call(workGoToStep, { step: LIST_ADDRESS_STEP });

    if (success) {
      yield call(workRequestAddresses);
      yield put(storeTempSuccessMsg('Address was deleted!'));
    } else {
      yield put(storeTempFailureMsg('Unable to delete address at this time.'));
    }
  } catch (error) {
    const links = EXCHANGES_STEP_MAP;
    yield put(storeTempFailureMsg('Unable to delete address at this time.'));
    yield call(catchHandler, error, links[LIST_ADDRESS_STEP]);
  }
}

export function* watchUseShippingAddressClick() {
  yield takeEvery(EXCHANGES_ON_USE_SHIPPING_ADDRESS_CLICK, workUseShippingAddressClick);
}

export function* workUseShippingAddressClick({ selectedAddressId, isValid }) {
  yield put({ type: EXCHANGES_SET_PRIMARY_SHIPPING_ADDRESS, selectedAddressId });
  const links = EXCHANGES_STEP_MAP;
  if (isValid) {
    yield put({ type: REDIRECT, location: links[REVIEW_STEP] });
  } else {
    yield put({ type: REDIRECT, location: links[LIST_ADDRESS_STEP] });
  }
}

export function* watchRequestExchangesAddresses() {
  yield takeEvery(EXCHANGES_REQUEST_ALL_ADDRESSES, workRequestExchangesAddresses);
}

export function* workRequestExchangesAddresses() {
  try {
    yield call(workRequestAddresses);
  } catch (error) {
    const links = EXCHANGES_STEP_MAP;
    yield put({ type: SET_ADDRESS_DATA_LOADING, payload: false });
    yield call(catchHandler, error, links[LIST_ADDRESS_STEP]);
  }
}

export function* watchUpdateExchangesAddress() {
  yield takeEvery(EXCHANGES_SAVE_ADDRESS, workUpdateExchangesAddress);
}

export function* workUpdateExchangesAddress() {
  try {
    const addressId = yield call(workUpdateAddress);
    const wasValidAddress = yield select(getWasAddressValid);

    if (wasValidAddress) {
      yield call(workRequestAddresses);
      yield put(onAddOrEditAddressEvent(true, addressId, 2));
      const links = EXCHANGES_STEP_MAP;
      yield put({ type: REDIRECT, location: links[REVIEW_STEP] });
    }
  } catch (error) {
    const links = EXCHANGES_STEP_MAP;
    const step = LIST_ADDRESS_STEP;
    yield put(onAddOrEditShippingAddressErrorEvent());
    yield put({ type: SET_ADDRESS_DATA_LOADING, payload: false });
    yield call(catchHandler, error, links[step]);
  }
}

export function buildExchangeErrorQueryString(params) {
  return `type=martyExchangesError&${queryString.stringify(params)}`;
}

export function recordExchangesError(qs, fetcher = timedFetch('postMartyPixel')) {
  const reqUrl = `/martypixel?${qs}`;
  return fetcher(reqUrl, fetchOpts({ method: 'post' }));
}

export function* catchHandler(e, redirectPath = '/exchange') {
  switch (e.id) {

    case ERROR_NOT_AUTHENTICATED:
      yield put({ type: API_ERROR, pageType: EXCHANGE_INITIATE_PAGE, apiErrorType: API_ERROR_NOT_AUTHORIZED });
      yield put({ type: REDIRECT, location: buildAuthenticationRedirectUrl(redirectPath) });
      break;

    case ERROR_REQUEST_VALIDATION:
      yield put({ type: API_ERROR, pageType: EXCHANGE_INITIATE_PAGE, apiErrorType: API_ERROR_REQUEST_VALIDATION });
      yield put({ type: SET_FORM_ERRORS, payload: e.extraInformation });
      break;

    case ERROR_EDIT_INACTIVE_ADDRESS:
      yield put({ type: API_ERROR, pageType: EXCHANGE_INITIATE_PAGE, apiErrorType: API_ERROR_EDIT_INACTIVE_ADDRESS });
      yield put(storeEditOfInactiveAddressError(true));
      break;
    default:
      yield put({ type: API_ERROR, pageType: EXCHANGE_INITIATE_PAGE, apiErrorType: API_ERROR_UNKNOWN });
      logger('default error in catch: ', e);
      recordExchangesError(buildExchangeErrorQueryString({ category: 'generic', error: JSON.stringify(e) }));
      return;
  }
}

export default [

  watchDeleteExchangesAddress,
  watchOnHideNewShippingAddressModalClick,
  watchOnShowNewShippingAddressModalClick,
  watchRequestExchangesAddresses,
  watchUpdateExchangesAddress,
  watchUseShippingAddressClick
];
