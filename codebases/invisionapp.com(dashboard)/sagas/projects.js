import { call, fork, put } from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'

import * as ActionTypes from '../constants/ActionTypes'
import * as serverActions from '../actions/serverActions'

import * as ServerURLs from '../constants/ServerURLs'

import queryString from 'query-string'
import getCookie from '../utils/getCookie'

import request from '../utils/API'

export function * getProjects (action) {
  const { spaceId, limit = 50, includeDetails = true } = action.data

  const params = {
    spaceID: spaceId,
    sortBy: 'title',
    sortOrder: 'asc',
    limit
  }
  const listEndpoint = `${ServerURLs.GET_RESOURCES}?types=project&${queryString.stringify(params)}`

  const headers = new global.Headers({
    'Content-Type': 'application/json'
  })

  const { error, response } = yield call(request, listEndpoint, {
    method: 'GET',
    showErrorBody: true,
    headers
  })

  if (error) {
    yield put(serverActions.getProjects.failure(error))
  } else {
    if (includeDetails) {
      yield put(serverActions.getProjectsDetail.request(response.resources.map(project => project.id)))
    }

    yield put(serverActions.getProjects.success({ spaceId, projects: response.resources }))
  }
}

export function * getProjectsDetail (action) {
  const fetchStartTime = window.performance.now()
  const listOfProjectIds = action.data.projectIds
  const queryParams = queryString.stringify({
    ids: listOfProjectIds,
    includeDocumentCounts: true
  })

  const endpoint = `${ServerURLs.GET_PROJECTS_DETAIL}?${queryParams}`

  const XSRFToken = getCookie('XSRF-TOKEN')

  if (XSRFToken) {
    const { error, response } = yield call(request, endpoint, {
      method: 'GET'
    })

    if (error) {
      yield put(serverActions.getProjectsDetail.failure(error))
    } else {
      yield put(serverActions.getProjectsDetail.success({ ...response, fetchTime: window.performance.now() - fetchStartTime }))
    }
  } else {
    yield put(serverActions.getProjectsDetail.failure({ msg: 'No XSRF Token provided' }))
  }
}

export function * watchGetProjectsRequest () {
  yield takeLatest(ActionTypes.API_GET_PROJECTS.REQUEST, getProjects)
}

export function * watchGetProjectsDetailRequest () {
  yield takeLatest(ActionTypes.API_GET_PROJECTS_DETAIL.REQUEST, getProjectsDetail)
}

export default function * projectsSaga () {
  yield [
    fork(watchGetProjectsRequest),
    fork(watchGetProjectsDetailRequest)
  ]
}
