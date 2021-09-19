import { call, put, select } from 'redux-saga/effects';

import {
  deletePaymentInstrument,
  getPaymentTypeList,
  savePaymentInstrument,
  setPrimaryPayment,
  verifyCard
} from 'apis/checkout';
import {
  GET_PAYMENTS_SUCCESS,
  SET_PAYMENT_DATA_LOADING
} from 'store/ducks/payment/types';
import { withSession } from 'store/ducks/session/sagas';
import { workSetPrimaryAddressIfNone } from 'store/ducks/address/sagas';
import { getMafiaAndCredentials } from 'store/ducks/readFromStore';

export function* workVerifyCreditCard(params) {
  const { mafia, credentials } = yield select(getMafiaAndCredentials);
  yield put({ type: SET_PAYMENT_DATA_LOADING, payload: true });
  const { payload: { status } } = yield call(withSession, [verifyCard, mafia, params, credentials]);
  return status;
}

export function* workRequestPayments(shippingAddressId) {
  const { mafia, credentials } = yield select(getMafiaAndCredentials);
  yield put({ type: SET_PAYMENT_DATA_LOADING, payload: true });
  const { payload } = yield call(withSession, [getPaymentTypeList, { mafia, shippingAddressId }, credentials]);
  yield put({ type: GET_PAYMENTS_SUCCESS, payload });
}

export function* workDeletePaymentInstrument({ paymentInstrumentId }) {
  const { mafia, credentials } = yield select(getMafiaAndCredentials);
  yield call(withSession, [deletePaymentInstrument, mafia, paymentInstrumentId, credentials]);
}

export function* workSavePaymentInstrument(params) {
  yield put({ type: SET_PAYMENT_DATA_LOADING, payload: true });
  const { instrument } = params;
  const { mafia, credentials } = yield select(getMafiaAndCredentials);
  const { payload } = yield call(withSession, [savePaymentInstrument, mafia, params, credentials]);
  const { paymentInstrumentId, isPrimarySuccess, response } = payload;

  // if adding a new card, payload.paymentInstrumentId will be the paymentInstrumentId
  // if editing a card, payload.response will be the paymentInstrumentId
  if (paymentInstrumentId) {
    // if no primary ship address, then this setting to primary failed and we must set a primary address first
    if (instrument.isPrimary && !isPrimarySuccess) {
      yield call(workSetPrimaryAddressIfNone);
      yield call(withSession, [setPrimaryPayment, mafia, paymentInstrumentId, credentials]);
    }

    yield put({ type: SET_PAYMENT_DATA_LOADING, payload: false });
    return paymentInstrumentId;
  } else {
    yield put({ type: SET_PAYMENT_DATA_LOADING, payload: false });
    return response;
  }
}

export default [];
