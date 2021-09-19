import { call, put, select, takeEvery } from 'redux-saga/effects';

import logger from 'middleware/logger';
import { weblabTrigger } from 'apis/mafia';
import { SYNC_WEBLAB_TO_HYDRA, TRIGGER_WEBLAB_ASSIGNMENT } from 'store/ducks/weblab/types';
import { getMafiaAndCredentials } from 'store/ducks/readFromStore';
import { withSession } from 'store/ducks/session/sagas';

export function* watchRequestTriggerWeblabAssignment() {
  yield takeEvery(TRIGGER_WEBLAB_ASSIGNMENT, workRequestTriggerWeblabAssignment);
}

export function* workRequestTriggerWeblabAssignment({ hydraTest, weblab }) {
  try {
    const { mafia, credentials } = yield select(getMafiaAndCredentials);
    const { payload } = yield call(withSession, [weblabTrigger, mafia, weblab, credentials]);
    if (hydraTest) {
      yield put({ type: SYNC_WEBLAB_TO_HYDRA, hydraTest, experiment: payload });
    }
    return payload;
  } catch (e) {
    logger('Error in workRequestTriggerWeblabAssignment: ', e);
  }
}

export default [watchRequestTriggerWeblabAssignment];
