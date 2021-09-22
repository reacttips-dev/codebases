import { call, fork, put, select } from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import queryString from 'query-string'

import * as ActionTypes from '../constants/ActionTypes'

import * as ServerURLs from '../constants/ServerURLs'

import * as actions from '../actions'
import * as serverActions from '../actions/serverActions'
import request from '../utils/API'
import getCookie from '../utils/getCookie'

import { navigate } from '../utils/navigation'

export function * getSpace (action) {
  const { cuid, joined } = action.data

  const state = yield select()
  const { pagingEnabled } = state.config

  const endpoint = ServerURLs.GET_SPACE.replace(':id', cuid)

  const updateLastViewedEndpoint = ServerURLs.VIEW_SPACE.replace(':cuid', cuid)

  const XSRFToken = getCookie('XSRF-TOKEN')

  if (XSRFToken) {
    let { error, response } = yield call(request, endpoint, {
      method: 'GET'
    })

    if (error) {
      yield put(serverActions.getSpace.failure(error))
    } else {
      yield call(request, updateLastViewedEndpoint, { method: 'POST' })

      const spaceContext = {
        space: response.cuid,
        spaceType: response.data.isPublic ? 'team' : 'invite-only',
        spaceContext: 'space'
      }
      yield put(actions.analyticsSetContext(spaceContext))
      if (!joined) {
        yield put(actions.joinedSpace({ ...response, pagingEnabled }))
      }
      yield put(serverActions.getSpace.success({ ...response, pagingEnabled }))

      if (
        !pagingEnabled &&
        response.data.documents && response.data.documentCount &&
        response.data.documentCount !== response.data.documents.length
      ) {
        // Get archived docs if the doc count doesn't match the visible docs
        yield put(serverActions.getArchivedSpaceDocuments.request(cuid))
      }
    }
  } else {
    yield put(serverActions.getSpace.failure({ msg: 'No XSRF Token provided' }))
  }
}

export function * getSpaceV2 (action) {
  const { spaceId, autoJoin } = action.data

  const queryParams = {
    includeDocumentCounts: true,
    includeMemberCounts: true,
    includeMembers: true,
    includePermissions: true
  }

  if (autoJoin) {
    queryParams.autoJoin = autoJoin
  }

  const state = yield select()
  const { pagingEnabled, enableSpacesIndexPagination } = state.config

  const endpoint = `${ServerURLs.GET_SPACE_V2.replace(':spaceId', spaceId)}?${queryString.stringify(queryParams)}`

  const updateLastViewedEndpoint = ServerURLs.VIEW_SPACE.replace(':cuid', spaceId)

  const XSRFToken = getCookie('XSRF-TOKEN')

  if (XSRFToken) {
    let { error, response } = yield call(request, endpoint, {
      method: 'GET'
    })

    if (error) {
      yield put(serverActions.getSpaceV2.failure(error))
    } else {
      yield call(request, updateLastViewedEndpoint, { method: 'POST' })

      if (response.autoJoined) {
        yield put(actions.joinedSpace(spaceId, pagingEnabled))
      }

      const spaceContext = {
        space: response.cuid,
        spaceType: response.data.isPublic ? 'team' : 'invite-only',
        spaceContext: 'space'
      }
      yield put(actions.analyticsSetContext(spaceContext))
      yield put(serverActions.getSpaceV2.success({ ...response, pagingEnabled, enableSpacesIndexPagination }))
    }
  } else {
    yield put(serverActions.getSpaceV2.failure({ msg: 'No XSRF Token provided' }))
  }
}

export function * leaveSpace (action) {
  const { cuid, isPublic } = action.data

  const endpoint = ServerURLs.LEAVE_SPACE.replace(':id', cuid)
  const XSRFToken = getCookie('XSRF-TOKEN')

  if (XSRFToken) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    })

    const state = yield select()
    const { pagingEnabled, enableSpacesIndexPagination } = state.config

    const { error, response } = yield call(request, endpoint, {
      method: 'POST',
      headers
    })

    if (error) {
      yield put(serverActions.leaveSpace.failure(error))
    } else {
      yield put(serverActions.leaveSpace.success({ response, cuid, isPublic, pagingEnabled, enableSpacesIndexPagination }))
      navigate('/spaces/')
    }
  }
}

export function * updateDescription (action) {
  const { cuid } = action.data

  const endpoint = ServerURLs.UPDATE_SPACE.replace(':id', cuid)

  const XSRFToken = getCookie('XSRF-TOKEN')

  if (XSRFToken) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    })

    const state = yield select()
    const { pagingEnabled } = state.config

    const requestBody = {
      cuid: action.data.cuid,
      ...action.data.data
    }

    const { error, response } = yield call(request, endpoint, {
      method: 'PUT',
      headers,
      body: JSON.stringify(requestBody)
    })

    if (error) {
      yield put(serverActions.updateDescription.failure(error))
    } else {
      yield put(serverActions.updateDescription.success({ ...response, pagingEnabled }))
    }
  } else {
    yield put(serverActions.updateDescription.failure({ msg: 'No XSRF Token provided' }))
  }
}

export function * updateSpace (action) {
  const { cuid } = action.data

  const endpoint = ServerURLs.UPDATE_SPACE.replace(':id', cuid)

  const XSRFToken = getCookie('XSRF-TOKEN')

  if (XSRFToken) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    })

    const requestBody = {
      cuid: action.data.cuid,
      ...action.data.data
    }

    const state = yield select()
    const { pagingEnabled } = state.config

    const { error, response } = yield call(request, endpoint, {
      method: 'PUT',
      headers,
      body: JSON.stringify(requestBody)
    })

    if (error) {
      yield put(serverActions.updateSpace.failure(error))
    } else {
      yield put(serverActions.updateSpace.success({ ...response, pagingEnabled }))
    }
  } else {
    yield put(serverActions.updateSpace.failure({ msg: 'No XSRF Token provided' }))
  }
}

export function * watchGetSpaceRequest () {
  yield * takeLatest(ActionTypes.API_GET_SPACE.REQUEST, getSpace)
}

export function * watchGetSpaceV2Request () {
  yield * takeLatest(ActionTypes.API_GET_SPACE_V2.REQUEST, getSpaceV2)
}

export function * watchLeaveSpaceRequest () {
  yield * takeLatest(ActionTypes.API_LEAVE_SPACE.REQUEST, leaveSpace)
}

export function * watchUpdateDescriptionRequest () {
  yield * takeLatest(ActionTypes.API_UPDATE_DESCRIPTION.REQUEST, updateDescription)
}

export function * watchUpdateSpaceRequest () {
  yield * takeLatest(ActionTypes.API_UPDATE_SPACE.REQUEST, updateSpace)
}

export default function * space () {
  yield [
    fork(watchGetSpaceRequest),
    fork(watchGetSpaceV2Request),
    fork(watchLeaveSpaceRequest),
    fork(watchUpdateDescriptionRequest),
    fork(watchUpdateSpaceRequest)
  ]
}
