import { call, fork, put } from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'

import * as ActionTypes from '../constants/ActionTypes'
import * as ServerURLs from '../constants/ServerURLs'

import * as serverActions from '../actions/serverActions'
import request from '../utils/API'
import getCookie from '../utils/getCookie'
import { navigate } from '../utils/navigation'

export function * getAccount (action) {
  const XSRFToken = getCookie('XSRF-TOKEN')

  if (XSRFToken) {
    const headers = new Headers({
      'X-XSRF-TOKEN': XSRFToken
    })

    const [user, team, userV2] = yield [
      call(request, ServerURLs.GET_ACCOUNT, { headers, method: 'GET', showErrorBody: true }, 'home-v1-account'),
      call(request, ServerURLs.GET_TEAM, { headers, method: 'GET', showErrorBody: true }, 'home-v1-team'),
      call(request, ServerURLs.GET_ACCOUNT_V2, { headers, method: 'GET', showErrorBody: true }, 'global-navigation-web-v1-account')
    ]

    if (user.error || team.error || userV2.error) {
      let authError =
        (user.error && (user.error === 401 || user.error === 403)) ||
        (team.error && (team.error === 401 || team.error === 403)) ||
        (userV2.error && (userV2.error === 401 || userV2.error === 403))
      yield put(serverActions.getAccount.failure({ msg: 'There was an error loading your account information', authError }))
    } else {
      yield put(serverActions.getAccount.success({
        user: user.response,
        team: team.response,
        userV2: userV2.response
      }))
    }
  } else {
    yield put(serverActions.getAccount.failure({ msg: 'No XSRF Token provided' }))
  }
}

export function * getAccountPermissions () {
  const endpoint = ServerURLs.GET_ACCOUNT_PERMISSIONS

  const { error, response } = yield call(request, endpoint, {
    method: 'GET',
    showErrorBody: true
  })

  if (error) {
    yield put(serverActions.getAccountPermissions.failure(error))
  } else {
    yield put(serverActions.getAccountPermissions.success(response))
  }
}

export function * getConfig () {
  const endpoint = ServerURLs.GET_CONFIG

  const XSRFToken = getCookie('XSRF-TOKEN')
  if (!XSRFToken) {
    navigate(`/auth/sign-in?redirectTo=${window.location.pathname}`)
    return
  }
  const { error, response } = yield call(request, endpoint, { method: 'GET', showErrorBody: true }, 'home-v1-config')

  // sidebarEnabled config is handled by App Shell, so we override it
  const responseWithCloudUiSidebarFlag = {
    ...response,
    sidebarEnabled: true
  }

  if (error) {
    let authError = error === 401 || error === 403
    yield put(serverActions.getConfig.failure({ authError }))
  } else {
    yield put(serverActions.getConfig.success(responseWithCloudUiSidebarFlag))
  }
}

export function * watchGetAccountRequest () {
  yield * takeLatest(ActionTypes.API_GET_ACCOUNT.REQUEST, getAccount)
}

export function * watchGetAccountPermissionsRequest () {
  yield * takeLatest(ActionTypes.API_GET_ACCOUNT_PERMISSIONS.REQUEST, getAccountPermissions)
}

export function * watchGetConfigRequest () {
  yield * takeLatest(ActionTypes.API_GET_CONFIG.REQUEST, getConfig)
}

export default function * account () {
  yield [
    fork(watchGetAccountRequest),
    fork(watchGetAccountPermissionsRequest),
    fork(watchGetConfigRequest)
  ]
}
