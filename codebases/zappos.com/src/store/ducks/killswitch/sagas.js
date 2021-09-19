import { call, put, takeEvery } from 'redux-saga/effects';

import { SET_HF_DATA } from 'constants/reduxActions';
import { SET_KILLSWITCHES } from 'store/ducks/killswitch/types';
import { cleanKillswitches } from 'helpers/killswitch';
import { trackError } from 'helpers/ErrorUtils';

export function* watchSetKillswitches() {
  yield takeEvery(SET_HF_DATA, workSetKillswitches);
}

export function* workSetKillswitches(action) {
  try {
    const cleaned = cleanKillswitches(action?.data);
    const { Global: { slotData: { killswitch = {} } = {} } = {} } = cleaned;
    yield put({ type: SET_KILLSWITCHES, payload: killswitch });
  } catch (error) {
    yield put({ type: SET_KILLSWITCHES, payload: {} });
    yield call(trackError, 'NON-FATAL', 'Could not set killswitches', error);
  }
}

export default [watchSetKillswitches];
