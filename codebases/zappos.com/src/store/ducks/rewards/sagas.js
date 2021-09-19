import { call, put, select, takeEvery } from 'redux-saga/effects';

import {
  doRedeemRewardsPoints,
  getRedemptionTransactionStatus
} from 'apis/checkout';
import {
  getRewardsEstimate
} from 'apis/mafia';
import { trackError } from 'helpers/ErrorUtils';
import { dashOrSnakeCaseToCamelCaseDeep } from 'helpers/DataFormatUtils';
import {
  LOOKUP_REWARDS_TRANSPARENCY_POINTS_FOR_ITEM,
  SET_IS_REDEEMING_REWARDS,
  STORE_REWARDS_TRANSPARENCY_POINTS_FOR_ITEM
} from 'store/ducks/rewards/types';
import {
  getAkitaKey,
  getMafiaAndCredentials,
  getProductBrandIdProductIdPriceForAkita
} from 'store/ducks/readFromStore';
import { withSession } from 'store/ducks/session/sagas';

export const delay = ms => new Promise(res => setTimeout(res, ms));

export function* watchLookupRewardsTransparencyPointsForItem() {
  yield takeEvery(LOOKUP_REWARDS_TRANSPARENCY_POINTS_FOR_ITEM, workLookupRewardsTransparencyPointsForItem);
}

export function* workLookupRewardsTransparencyPointsForItem() {
  const state = yield select();
  const akitaKey = getAkitaKey(state);
  const { mafia, credentials } = getMafiaAndCredentials(state);

  try {
    // Clear out number so we don't show old points while we make our call
    yield put({ type: STORE_REWARDS_TRANSPARENCY_POINTS_FOR_ITEM, transparencyPointsForItem: null });
    const data = getProductBrandIdProductIdPriceForAkita(state);
    const res = yield call(getRewardsEstimate, mafia, akitaKey, credentials, data);
    const jsonSnakeCase = yield res.json();
    const json = dashOrSnakeCaseToCamelCaseDeep(jsonSnakeCase);
    const { isEnrolled } = json;
    const transparencyPointsForItem = json.orderPoints[0];
    yield put({ type: STORE_REWARDS_TRANSPARENCY_POINTS_FOR_ITEM, transparencyPointsForItem, isEnrolled });
  } catch (error) {
    // clear any points, aka hide related component from rendering
    yield put({ type: STORE_REWARDS_TRANSPARENCY_POINTS_FOR_ITEM, transparencyPointsForItem: null });
    trackError('NON-FATAL', 'Could not load rewards transparency data.', error);
  }
}

export function* workRedeemPoints(spendPoints) {
  const akitaKey = yield select(getAkitaKey);
  const { mafia, credentials } = yield select(getMafiaAndCredentials);
  yield put({ type: SET_IS_REDEEMING_REWARDS, isRedeemingRewards: true });
  const { payload: { transaction_id: txId } } = yield call(withSession, [doRedeemRewardsPoints, mafia, akitaKey, credentials, spendPoints]);
  const result = yield call(workGetRedemptionStatus, txId, 0);
  yield put({ type: SET_IS_REDEEMING_REWARDS, isRedeemingRewards: false });
  return result;
}

export function* workGetRedemptionStatus(txId, callNumber) {
  if (callNumber === 3) { // allow max of 3 attempts (0, 1, 2)
    return false;
  }

  yield call(delay, 1000 * (3 + callNumber)); // need a base 3 second delay

  const akitaKey = yield select(getAkitaKey);
  const { mafia, credentials } = yield select(getMafiaAndCredentials);
  const { payload: { data } } = yield call(withSession, [getRedemptionTransactionStatus, mafia, akitaKey, credentials, txId]);
  let status;

  if (data.length === 1 && data[0].status === 'skip') {
    status = true;
  } else {
    status = yield call(workGetRedemptionStatus, txId, callNumber + 1);
  }

  return status;
}

export default [watchLookupRewardsTransparencyPointsForItem];
