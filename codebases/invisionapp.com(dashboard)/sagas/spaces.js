/* global Headers */
import { call, fork, put, select } from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'

import * as ActionTypes from '../constants/ActionTypes'
import * as ServerURLs from '../constants/ServerURLs'

import * as serverActions from '../actions/serverActions'
import request from '../utils/API'
import getCookie from '../utils/getCookie'
import { SORT_ALPHA, SORT_RECENT } from '../constants/SortTypes'
import { navigate } from '../utils/navigation'
import { GenerateIDURL } from '../utils/urlIDParser'
import { trackEvent } from '../utils/analytics'
import { APP_SPACE_OPENED } from '../constants/TrackingEvents'
import queryString from 'query-string'
import filter from 'lodash/filter'
import generateGlobalSearchQueryParams from '../utils/generateGlobalSearchQueryParams'

export function * spaceCreated (action) {
  const { title, isPublic, cuid } = action.data.data

  navigate(`/spaces/${GenerateIDURL(cuid, title)}`)

  trackEvent(APP_SPACE_OPENED, {
    spaceId: cuid,
    spaceType: isPublic ? 'team' : 'invite-only',
    spaceContext: 'auto_nav'
  })
}

export function * createSpace (action) {
  const includeMembers = action.data.includeMembers
  const includePermissions = action.data.includePermissions
  const queryParams = queryString.stringify({
    includePermissions,
    includeMembers
  })

  const endpoint = `${ServerURLs.CREATE_SPACE}${queryParams.length > 0 ? '?' + queryParams : ''}`
  const XSRFToken = getCookie('XSRF-TOKEN')

  let newDoc = {
    title: action.data.data.title,
    isPublic: action.data.data.isPublic !== undefined ? action.data.data.isPublic : true
  }

  if (XSRFToken) {
    const state = yield select()
    const { pagingEnabled, userID } = state.config

    const { error, response } = yield call(request, endpoint, {
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      method: 'POST',
      body: JSON.stringify(newDoc),
      showErrorBody: true
    })

    if (error) {
      yield put(serverActions.createSpace.failure(error))
    } else {
      yield put(serverActions.createSpace.success({ data: { ...response.data, members: [{ userId: userID }], documents: response.documents || [] }, pagingEnabled }))
    }
  } else {
    yield put(serverActions.createSpace.failure({ msg: 'No XSRF Token provided' }))
  }
}

export function * deleteSpace (action) {
  const { cuid } = action.data
  const endpoint = ServerURLs.DELETE_SPACE.replace(':cuid', cuid)

  const XSRFToken = getCookie('XSRF-TOKEN')

  if (XSRFToken) {
    const { error, response } = yield call(request, endpoint, {
      method: 'DELETE',
      noBody: true
    })

    if (error) {
      yield put(serverActions.deleteSpace.failure({ cuid, error }))
    } else {
      yield put(serverActions.deleteSpace.success({ cuid, response }))
      navigate('/spaces/')
    }
  } else {
    yield put(serverActions.deleteSpace.failure({ cuid, error: { msg: 'No XSRF Token provided' } }))
  }
}

export function * fetchSearchResults (action) {
  const fetchStartTime = window.performance.now()
  const { reset, searchView, spaceId, searchTerm, filterType, cursor, frameSize = 50 } = action.data

  let query = generateGlobalSearchQueryParams({
    cursor: reset === true ? '' : cursor,
    spaceId,
    searchView,
    searchTerm,
    filterType
  })

  const endpoint = `${ServerURLs.SEARCH_RESOURCES}?${query}`
  const XSRFToken = getCookie('XSRF-TOKEN')

  if (XSRFToken) {
    const { error, response } = yield call(request, endpoint, {
      method: 'GET'
    })

    if (error) {
      yield put(serverActions.getSpacesSearchResource.failure(error))
    } else {
      const { spacesDetail } = yield select(state => state.spaces)
      const { projectsDetail } = yield select(state => state.projects)

      const listOfSpaceDetailToFetch = filter(response.resources, searchResult => searchResult.resourceType === 'space' && spacesDetail && !spacesDetail[searchResult.id]).map(space => space.id)
      const listOfProjectsDetailToFetch = filter(response.resources, searchResult => searchResult.resourceType === 'project' && projectsDetail && !projectsDetail[searchResult.id]).map(project => project.id)

      if (listOfSpaceDetailToFetch.length > 0) {
        yield put(serverActions.getSpacesDetail.request(listOfSpaceDetailToFetch))
      }

      if (listOfProjectsDetailToFetch.length > 0) {
        yield put(serverActions.getProjectsDetail.request(listOfProjectsDetailToFetch))
      }

      yield put(serverActions.getSpacesSearchResource.success({
        ...response,
        reset,
        fetchTime: window.performance.now() - fetchStartTime,
        metadataFetched: listOfSpaceDetailToFetch.length > 0,
        pageSize: frameSize
      }))
    }
  } else {
    yield put(serverActions.getSpacesResource.failure({ msg: 'No XSRF Token provided' }))
  }
}

export function * fetchSpacesResource (action) {
  const fetchStartTime = window.performance.now()
  const { reset, sortOrder, viewFilter, cursor, userId } = action.data
  const PAGE_FRAME_SIZE = 50
  const querySortOrder = {}
  const queryUserOnly = {}

  switch (sortOrder) {
    case SORT_ALPHA:
      querySortOrder.sortBy = 'title'
      querySortOrder.sortOrder = 'asc'
      break
    case SORT_RECENT:
      querySortOrder.sortBy = 'userLastAccessedAt'
      querySortOrder.sortOrder = 'desc'
      break
    default:
      querySortOrder.sortBy = 'title'
      querySortOrder.sortOrder = 'asc'
  }

  if (viewFilter === 'user') {
    queryUserOnly.createdBy = userId
  }

  const queryParams = `?${queryString.stringify({
    types: ['space'],
    includeHasContainers: true,
    limit: PAGE_FRAME_SIZE,
    cursor: reset === true ? '' : cursor,
    ...querySortOrder,
    ...queryUserOnly
  })}`

  const endpoint = `${ServerURLs.GET_RESOURCES}${queryParams}`

  const XSRFToken = getCookie('XSRF-TOKEN')

  if (XSRFToken) {
    const { error, response } = yield call(request, endpoint, {
      method: 'GET'
    })

    if (error) {
      yield put(serverActions.getSpacesResource.failure(error))
    } else {
      const spacesDetail = yield select(state => state.spaces.spacesDetail)
      const listOfSpaceDetailToFetch = filter(response.resources, space => !spacesDetail[space.id]).map(space => space.id)

      if (listOfSpaceDetailToFetch.length > 0) {
        yield put(serverActions.getSpacesDetail.request(listOfSpaceDetailToFetch))
      }

      yield put(serverActions.getSpacesResource.success({
        ...response,
        reset,
        fetchTime: window.performance.now() - fetchStartTime,
        metadataFetched: listOfSpaceDetailToFetch.length > 0,
        pageSize: PAGE_FRAME_SIZE
      }))
    }
  } else {
    yield put(serverActions.getSpacesResource.failure({ msg: 'No XSRF Token provided' }))
  }
}

export function * fetchSpacesDetail (action) {
  const fetchStartTime = window.performance.now()
  const listOfSpaceIds = action.data.spaceIds
  const queryParams = queryString.stringify({
    ids: listOfSpaceIds,
    includeDocumentCounts: true,
    includeMemberCounts: true,
    includeMembers: true,
    includePermissions: true
  })

  const endpoint = `${ServerURLs.GET_SPACES_DETAILS}?${queryParams}`

  const XSRFToken = getCookie('XSRF-TOKEN')

  if (XSRFToken) {
    const { error, response } = yield call(request, endpoint, {
      method: 'GET'
    })

    if (error) {
      yield put(serverActions.getSpacesDetail.failure(error))
    } else {
      yield put(serverActions.getSpacesDetail.success({ ...response, fetchTime: window.performance.now() - fetchStartTime }))
    }
  } else {
    yield put(serverActions.getSpacesDetail.failure({ msg: 'No XSRF Token provided' }))
  }
}

export function * fetchSpaceMemberDetail (action) {
  const fetchStartTime = window.performance.now()
  const { spaceId } = action.data

  const queryParams = queryString.stringify({
    limit: 10, offset: 5
  })

  const endpoint = `${ServerURLs.GET_SPACES_MEMBERS.replace(':spaceID', spaceId)}?${queryParams}`

  const XSRFToken = getCookie('XSRF-TOKEN')

  if (XSRFToken) {
    const { error, response } = yield call(request, endpoint, {
      method: 'GET'
    })

    if (error) {
      yield put(serverActions.getSpaceMembersDetail.failure(error))
    } else {
      yield put(serverActions.getSpaceMembersDetail.success({ ...response, id: spaceId, fetchTime: window.performance.now() - fetchStartTime }))
    }
  } else {
    yield put(serverActions.getSpaceMembersDetail.failure({ msg: 'No XSRF Token provided' }))
  }
}

export function * watchCreateSpaceRequest () {
  yield * takeLatest(ActionTypes.API_CREATE_SPACE.REQUEST, createSpace)
}

export function * watchCreateSpaceSuccess () {
  yield * takeLatest(ActionTypes.API_CREATE_SPACE.SUCCESS, spaceCreated)
}

export function * watchDeleteSpaceRequest () {
  yield * takeLatest(ActionTypes.API_DELETE_SPACE.REQUEST, deleteSpace)
}

export function * watchGetSpacesDetailRequest () {
  yield * takeLatest(ActionTypes.API_GET_SPACES_DETAIL.REQUEST, fetchSpacesDetail)
}

export function * watchGetSpaceMemberDetailRequest () {
  yield * takeLatest(ActionTypes.API_GET_SPACE_MEMBERS_DETAIL.REQUEST, fetchSpaceMemberDetail)
}

export function * watchGetSpacesResourceRequest () {
  yield * takeLatest(ActionTypes.API_GET_SPACES_RESOURCE.REQUEST, fetchSpacesResource)
}

export function * watchGetSpacesSearchResourceRequest () {
  yield * takeLatest(ActionTypes.API_GET_SPACES_SEARCH_RESOURCE.REQUEST, fetchSearchResults)
}

export default function * spacesSaga () {
  yield [
    fork(watchCreateSpaceRequest),
    fork(watchCreateSpaceSuccess),
    fork(watchDeleteSpaceRequest),
    fork(watchGetSpacesDetailRequest),
    fork(watchGetSpaceMemberDetailRequest),
    fork(watchGetSpacesResourceRequest),
    fork(watchGetSpacesSearchResourceRequest)
  ]
}
