import { call, put, select, takeEvery } from 'redux-saga/effects';

import logger from 'middleware/logger';
import { getGiftOptions } from 'apis/checkout';
import { GET_GIFT_OPTIONS_SUCCESS, REQUEST_GIFT_OPTIONS } from 'store/ducks/giftoptions/types';
import { withSession } from 'store/ducks/session/sagas';
import { getMafiaAndCredentials, getPurchaseId } from 'store/ducks/readFromStore';

export function* watchRequestGiftOptions() {
  yield takeEvery(REQUEST_GIFT_OPTIONS, workRequestGiftOptions);
}

export function* workRequestGiftOptions() {
  try {
    const { mafia, credentials } = yield select(getMafiaAndCredentials);
    const purchaseId = yield select(getPurchaseId);
    const { payload } = yield call(withSession, [getGiftOptions, mafia, purchaseId, credentials]);
    yield put({ type: GET_GIFT_OPTIONS_SUCCESS, payload });
  } catch (e) {
    logger('error in workRequestGiftOptions: ', e);
  }
}

export default [
  watchRequestGiftOptions
];
