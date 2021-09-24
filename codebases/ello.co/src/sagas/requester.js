/* eslint-disable no-constant-condition,no-underscore-dangle */
import React from 'react'
import get from 'lodash/get'
import { camelizeKeys } from 'humps'
import { actionChannel, all, call, fork, put, select, take } from 'redux-saga/effects'
import { extractJSON, fetchCredentials, getHeaders, getHeadHeader, sagaFetch } from './api'
import { clearAuthToken, refreshAuthenticationToken } from '../actions/authentication'
import { openAlert } from '../actions/modals'
import Dialog from '../components/dialogs/Dialog'
import * as ACTION_TYPES from '../constants/action_types'
import { selectRefreshToken } from '../selectors/authentication'
import { selectLastNotificationCheck } from '../selectors/gui'
import { selectPathname } from '../selectors/routing'

export const requestTypes = [
  ACTION_TYPES.AUTHENTICATION.CHECK_CONFIRMATION_CODE,
  ACTION_TYPES.AUTHENTICATION.FORGOT_PASSWORD,
  ACTION_TYPES.AUTHENTICATION.RESET_PASSWORD,
  ACTION_TYPES.AUTHENTICATION.LOGOUT,
  ACTION_TYPES.AUTHENTICATION.REFRESH,
  ACTION_TYPES.AUTHENTICATION.SEND_EMAIL_FOR_CONFIRMATION,
  ACTION_TYPES.AUTHENTICATION.USER,
  ACTION_TYPES.AUTHENTICATION.PUBLIC,
  ACTION_TYPES.COMMENT.CREATE,
  ACTION_TYPES.COMMENT.DELETE,
  ACTION_TYPES.COMMENT.EDITABLE,
  ACTION_TYPES.COMMENT.FLAG,
  ACTION_TYPES.COMMENT.UPDATE,
  ACTION_TYPES.EDITOR.EMOJI_COMPLETER,
  ACTION_TYPES.EDITOR.LOAD_REPLY_ALL,
  ACTION_TYPES.EDITOR.POST_PREVIEW,
  ACTION_TYPES.EDITOR.USER_COMPLETER,
  ACTION_TYPES.HEAD,
  ACTION_TYPES.INVITATIONS.GET_EMAIL,
  ACTION_TYPES.INVITATIONS.INVITE,
  ACTION_TYPES.LOAD_NEXT_CONTENT,
  ACTION_TYPES.LOAD_STREAM,
  ACTION_TYPES.NOTIFICATIONS.MARK_ANNOUNCEMENT_READ,
  ACTION_TYPES.POST.COMMENT,
  ACTION_TYPES.POST.CREATE,
  ACTION_TYPES.POST.DELETE,
  ACTION_TYPES.POST.DETAIL,
  ACTION_TYPES.POST.EDITABLE,
  ACTION_TYPES.POST.FLAG,
  ACTION_TYPES.POST.LOVE,
  ACTION_TYPES.POST.UPDATE,
  ACTION_TYPES.POST_FORM,
  ACTION_TYPES.POST_JSON,
  ACTION_TYPES.POST.TRACK_VIEWS,
  ACTION_TYPES.POST.WATCH,
  ACTION_TYPES.PROFILE.AVAILABILITY,
  ACTION_TYPES.PROFILE.DELETE,
  ACTION_TYPES.PROFILE.EXPORT,
  ACTION_TYPES.PROFILE.FOLLOW_CATEGORIES,
  ACTION_TYPES.PROFILE.UNFOLLOW_CATEGORIES,
  ACTION_TYPES.PROFILE.LOAD,
  ACTION_TYPES.PROFILE.LOCATION_AUTOCOMPLETE,
  ACTION_TYPES.PROFILE.REGISTER_FOR_GCM,
  ACTION_TYPES.PROFILE.REQUEST_INVITE,
  ACTION_TYPES.PROFILE.SAVE,
  ACTION_TYPES.PROFILE.SIGNUP,
  ACTION_TYPES.PROFILE.SPLIT,
  ACTION_TYPES.PROFILE.UNREGISTER_FOR_GCM,
  ACTION_TYPES.PROFILE.VERIFY_EMAIL,
  ACTION_TYPES.PROMOTIONS.AUTHENTICATION,
  ACTION_TYPES.PROMOTIONS.LOGGED_IN,
  ACTION_TYPES.PROMOTIONS.LOGGED_OUT,
  ACTION_TYPES.RELATIONSHIPS.UPDATE,
  ACTION_TYPES.USER.COLLAB_WITH,
  ACTION_TYPES.USER.DETAIL,
  ACTION_TYPES.USER.FLAG,
  ACTION_TYPES.USER.HIRE_ME,
  ACTION_TYPES.USER.ADD_TO_CATEGORY,
  ACTION_TYPES.USER.REMOVE_FROM_CATEGORY,
]

// this is for requests that don't require any
// kind of authentication like .json file loads
const runningFetchesBlacklist = [
  ACTION_TYPES.EDITOR.EMOJI_COMPLETER,
  ACTION_TYPES.PROMOTIONS.AUTHENTICATION,
  ACTION_TYPES.PROMOTIONS.LOGGED_IN,
  ACTION_TYPES.PROMOTIONS.LOGGED_OUT,
]

let unauthorizedActionQueue = []
const runningFetches = {}

function updateRunningFetches(serverResponse) {
  if (!serverResponse) { return }
  const serverResponseUrl = serverResponse.url && serverResponse.url.length
    ? serverResponse.url
    : serverResponse.headers.get('X-Request-Url')

  if (runningFetches[serverResponseUrl]) {
    delete runningFetches[serverResponseUrl]
  } else {
    Object.keys(runningFetches).forEach((key) => {
      delete runningFetches[key]
    })
  }
}

function parseLink(linksHeader) {
  if (!linksHeader) { return {} }
  const result = {}
  const entries = linksHeader.split(',')
  // compile regular expressions ahead of time for efficiency
  const relsRegExp = /\brel="?([^"]+)"?\s*;?/
  const keysRegExp = /(\b[0-9a-z.-]+\b)/g
  const sourceRegExp = /^<(.*)>/
  entries.forEach((entry) => {
    const trimmed = entry.trim()
    const rels = relsRegExp.exec(trimmed)
    if (rels) {
      const keys = rels[1].match(keysRegExp)
      const source = sourceRegExp.exec(trimmed)[1]
      keys.forEach((key) => {
        result[key] = source
      })
    }
  })
  return result
}

export function* handleRequestError(error, action) {
  const { meta, payload, type } = action
  const FAILURE = `${type}_FAILURE`
  function* fireFailureAction() {
    if (meta && meta.failureAction) {
      if (typeof meta.failureAction === 'function') {
        yield call(meta.failureAction)
      } else {
        yield put(meta.failureAction)
      }
    }
  }

  if (error.response) {
    const { status } = error.response
    payload.serverStatus = status
    if (status === 401 &&
        type !== ACTION_TYPES.AUTHENTICATION.REFRESH &&
        type !== ACTION_TYPES.AUTHENTICATION.USER) {
      unauthorizedActionQueue.push(action)
      if (Object.keys(runningFetches).length === 0) {
        yield put(clearAuthToken())
        const refreshToken = yield select(selectRefreshToken)
        yield put(refreshAuthenticationToken(refreshToken))
      }
      return true
    }

    if (status === 420) {
      yield put(openAlert(
        <Dialog
          title="Take a breath. You're doing Ello way too fast. A few more seconds. That's better."
          body="More Ello? Refresh the page to continue."
        />,
      ))
      yield put({ error, meta, payload, type: FAILURE })
      return true
    }

    const contentType = error.response.headers.get('content-type')
    if (contentType && contentType.indexOf('application/json') > -1) {
      const errorJson = yield call(extractJSON, error.response)
      payload.response = camelizeKeys(errorJson)
    }
    yield put({ error, meta, payload, type: FAILURE })
    yield call(fireFailureAction)
  } else {
    if (/Failed to fetch/.test(error)) {
      payload.serverStatus = 404
    }
    yield put({ error, meta, payload, type: FAILURE })
    yield call(fireFailureAction)
  }
  return false
}

export function* performRequest(action) {
  const {
    type,
    meta,
    payload: { endpoint, method, body },
  } = action
  let { payload } = action
  const pathname = yield select(selectPathname)
  payload = {
    ...payload,
    pathname,
  }

  const options = {
    method: method || 'GET',
  }

  if (options.method !== 'GET' && options.method !== 'HEAD') {
    options.body = body || null
    if (options.body && typeof options.body !== 'string') {
      options.body = JSON.stringify(options.body)
    }
  }

  const REQUEST = `${type}_REQUEST`
  const SUCCESS = `${type}_SUCCESS`

  let tokenJSON = null
  if (action.type === ACTION_TYPES.AUTHENTICATION.REFRESH ||
    action.type === ACTION_TYPES.AUTHENTICATION.PUBLIC) {
    // access token not needed for refreshing the existing token.
    // This shortcuts a request to get a public token.
    tokenJSON = { token: { access_token: null } }
  } else {
    tokenJSON = yield call(fetchCredentials)
  }
  const accessToken = get(tokenJSON, 'token.access_token')

  yield put({ type: REQUEST, payload, meta })

  function* fireSuccessAction() {
    if (meta && meta.successAction) {
      if (typeof meta.successAction === 'function') {
        yield call(meta.successAction)
      } else {
        yield put(meta.successAction)
      }
    }
  }

  switch (method) {
    case 'HEAD':
      options.headers = getHeadHeader(
        accessToken,
        yield select(selectLastNotificationCheck),
      )
      break
    default:
      options.headers = getHeaders(accessToken)
      break
  }

  let response

  let endpointPath = endpoint.path
  if (/\/posts\/recent/.test(endpoint.path) && /\/trending$/.test(pathname)) {
    endpointPath = endpointPath.replace('/recent', '/trending')
  }

  try {
    response = yield call(sagaFetch, endpointPath, options)
  } catch (error) {
    updateRunningFetches(error.response)
    yield fork(handleRequestError, error, action)
    return false
  }

  const { json, serverResponse } = response

  updateRunningFetches(serverResponse)

  payload.serverStatus = serverResponse.status
  if (serverResponse.status === 200 || serverResponse.status === 201) {
    payload.response = camelizeKeys(json)
    const linkPagination = parseLink(serverResponse.headers.get('Link'))
    // for now these need to remain parseInt instead of Number cast
    // due to StreamContainer casting them as number and checking for 0
    // when you do Number(null) it equals 0, thanks javascript!
    linkPagination.totalCount = parseInt(serverResponse.headers.get('X-TotalCount'), 10)
    linkPagination.totalPages = parseInt(serverResponse.headers.get('X-Total-Pages'), 10)
    linkPagination.totalPagesRemaining = parseInt(serverResponse.headers.get('X-Total-Pages-Remaining'), 10)
    payload.pagination = linkPagination
  }
  yield put({ meta, payload, type: SUCCESS })
  yield call(fireSuccessAction)
  return true
}

export function* handleRequest(requestChannel) {
  while (true) {
    const action = yield take(requestChannel)
    const { payload: { endpoint } } = action

    if (!runningFetches[endpoint.path]) {
      if (runningFetchesBlacklist.indexOf(action.type) === -1) {
        runningFetches[endpoint.path] = true
      }
      yield fork(performRequest, action)
    }
  }
}

function* refireUnauthorizedActions(authSuccessChannel) {
  while (true) {
    const successAction = yield take(authSuccessChannel)
    if (successAction && unauthorizedActionQueue.length) {
      yield unauthorizedActionQueue.map(action => put(action))
      unauthorizedActionQueue = []
    }
  }
}

export default function* requester() {
  const requestChannel = yield actionChannel(requestTypes)
  const authSuccessChannel = yield actionChannel([
    ACTION_TYPES.AUTHENTICATION.REFRESH_SUCCESS,
    ACTION_TYPES.AUTHENTICATION.USER_SUCCESS,
  ])
  yield all([
    fork(refireUnauthorizedActions, authSuccessChannel),
    fork(handleRequest, requestChannel),
  ])
}

export { runningFetches }

