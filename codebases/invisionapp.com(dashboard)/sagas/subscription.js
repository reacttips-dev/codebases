import { call, put, fork } from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import request from '../utils/API'
import * as ServerURLs from '../constants/ServerURLs'
import * as serverActions from '../actions/serverActions'
import * as ActionTypes from '../constants/ActionTypes'

function * getSubscription () {
  const endpoint = ServerURLs.GET_SUBSCRIPTION

  const { error, response } = yield call(request, endpoint, {
    method: 'GET',
    showErrorBody: true
  })

  if (error) {
    yield put(serverActions.getSubscription.failure(error))
  } else {
    yield put(serverActions.getSubscription.success(response))
  }
}

function * watchGetSubscriptionRequest () {
  yield takeLatest(ActionTypes.API_GET_SUBSCRIPTION.REQUEST, getSubscription)
}

export default function * subscriptionSaga () {
  yield [
    fork(watchGetSubscriptionRequest)
  ]
}
