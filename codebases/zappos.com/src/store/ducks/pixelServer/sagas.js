import { put, select } from 'redux-saga/effects';

import { makePixelServerAction } from 'actions/pixelServer';

export function* firePixelServer({ pageType, trackingPayload = {}, pageId = '' }) {
  const state = yield select();
  const action = makePixelServerAction(state, pageType, trackingPayload, pageId);
  yield put(action);
}

export default [];
