import { all, fork } from 'redux-saga/effects'
import analyticsSaga from './analytics'
import authenticationSaga from './authentication'
import pushSubscriptionSaga from './push_subscription'
import requesterSaga from './requester'
import v3RequesterSaga from './v3_requester'
import uploaderSaga from './uploader'
import { isElloAndroid } from '../lib/jello'

export default function* root() {
  yield all([
    fork(analyticsSaga),
    fork(authenticationSaga),
    fork(requesterSaga),
    fork(v3RequesterSaga),
    fork(uploaderSaga),
  ])
  if (isElloAndroid()) {
    yield fork(pushSubscriptionSaga)
  }
}
