import isEqual from 'lodash/isEqual'
import { takeEvery } from 'redux-saga'
import { select, put, fork } from 'redux-saga/effects'
import * as ActionTypes from '../constants/ActionTypes'
import { getActiveMQs } from '../utils/mediaQueries'

export function * checkIfMQsChanged () {
  const state = yield select()
  const { mqs } = state
  const newMQs = getActiveMQs()

  if (!isEqual(mqs, newMQs)) {
    yield put({
      type: ActionTypes.BROWSER_MQS_CHANGED,
      payload: newMQs
    })
  }
}

export function * watchMediaQueryChecks () {
  yield * takeEvery(ActionTypes.CHECK_IF_BROWSER_MQS_CHANGED, checkIfMQsChanged)
}

export default function * mediaQueriesSaga () {
  yield [
    fork(watchMediaQueryChecks)
  ]
}
