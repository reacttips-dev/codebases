import { all, call, put, takeLatest } from 'redux-saga/effects'

import * as ActionTypes from '../constants/action-types'
import * as ServerURLs from '../constants/server-urls'

import * as serverActions from '../actions/server-actions'
import { request } from '../utils/API'

export function * getPermissions () {
  const endpoint = ServerURLs.GET_PERMISSIONS
  const { error, response } = yield call(request, endpoint, { method: 'GET' }, 'global-navigation-web-v1-permissions')

  if (error) {
    yield put(serverActions.getPermissions.failure(error))
  } else {
    const permissions = {
      createDocuments: response.data[0]['Document.Create'].allow,
      createSpaces: response.data[0]['Space.Create'].allow
    }

    yield put(serverActions.getPermissions.success(permissions))
  }
}

export function * watchGetPermissions () {
  yield takeLatest(ActionTypes.API_GET_PERMISSIONS.REQUEST, getPermissions)
}

export default function * permissions () {
  yield all([
    watchGetPermissions()
  ])
}
