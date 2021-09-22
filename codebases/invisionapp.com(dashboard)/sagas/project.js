import { call, fork, put } from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import qs from 'query-string'

import * as ActionTypes from '../constants/ActionTypes'

import * as ServerURLs from '../constants/ServerURLs'

import * as actions from '../actions'
import * as serverActions from '../actions/serverActions'
import request from '../utils/API'

import { trackEvent } from '../utils/analytics'
import { APP_PROJECT_DELETED } from '../constants/TrackingEvents'

export function * getProject (action) {
  const { id, autoJoin = true } = action.data

  const endpoint = ServerURLs.GET_PROJECT.replace(':id', id)

  const headers = new Headers({
    'Content-Type': 'application/json'
  })

  const { response, error } = yield call(request, endpoint, {
    method: 'GET',
    headers
  })

  if (error) {
    yield put(serverActions.getProject.failure({ type: 'Project', error }))
  } else {
    const spaceId = response.data.project.spaceId
    if (!spaceId) {
      yield put(serverActions.getProject.failure({ type: 'No Space', error: 'No space returned ' }))
      return
    }

    const queryParams = {
      includeDocumentCounts: true,
      includeMemberCounts: false,
      includeMembers: false,
      includePermissions: true,
      autoJoin
    }

    const spaceEndpoint = `${ServerURLs.GET_SPACE_V2.replace(':spaceId', spaceId)}?${qs.stringify(queryParams)}`
    const { response: spaceResponse, error: spaceError } = yield call(request, spaceEndpoint, {
      method: 'GET',
      headers
    })

    if (spaceError) {
      yield put(serverActions.getProject.failure({ type: 'Space', error: spaceError }))
    } else {
      if (autoJoin) {
        yield put(actions.joinedSpace({ ...response }))
        yield put(actions.expandSpaceInSidebar(spaceId))
      }
      yield put(serverActions.getProject.success({
        project: response.data.project,
        space: {
          ...spaceResponse.data,
          permissions: spaceResponse.permissions
        }
      }))
    }
  }
}

export function * updateProject (action) {
  const { id, spaceId, data } = action.data

  const endpoint = ServerURLs.UPDATE_PROJECT.replace(':id', id)

  const headers = new Headers({
    'Content-Type': 'application/json'
  })

  const { error, response } = yield call(request, endpoint, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data)
  })

  if (error) {
    yield put(serverActions.updateProject.failure(error))
  } else {
    const resp = {
      response,
      title: data.title || '',
      id,
      spaceId,
      isDescriptionUpdate: data.isDescriptionUpdate
    }

    if (data.hasOwnProperty('description')) {
      resp.description = data.description
    }

    yield put(serverActions.updateProject.success(resp))
  }
}

export function * deleteProject (action) {
  const { id, spaceId } = action.data

  const endpoint = ServerURLs.DELETE_PROJECT.replace(':id', id)

  const headers = new Headers({
    'Content-Type': 'application/json'
  })

  const { error, response } = yield call(request, endpoint, {
    method: 'DELETE',
    headers
  })

  if (error) {
    yield put(serverActions.deleteProject.failure(error))
  } else {
    trackEvent(APP_PROJECT_DELETED, { projectID: id })
    yield put(serverActions.deleteProject.success({
      id,
      spaceId,
      ...response
    }))
  }
}

export function * watchGetProjectRequest () {
  yield takeLatest(ActionTypes.API_GET_PROJECT.REQUEST, getProject)
}

export function * watchUpdateProjectRequest () {
  yield takeLatest(ActionTypes.API_UPDATE_PROJECT.REQUEST, updateProject)
}

export function * watchDeleteProjectRequest () {
  yield takeLatest(ActionTypes.API_DELETE_PROJECT.REQUEST, deleteProject)
}

export default function * project () {
  yield [
    fork(watchGetProjectRequest),
    fork(watchUpdateProjectRequest),
    fork(watchDeleteProjectRequest)
  ]
}
