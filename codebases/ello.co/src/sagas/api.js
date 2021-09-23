/* eslint-disable no-use-before-define */
import 'isomorphic-fetch'
import { push } from 'react-router-redux'
import { call, put, select, take } from 'redux-saga/effects'
import {
  refreshAuthenticationToken,
  fetchPublicToken,
} from '../actions/authentication'
import { AUTHENTICATION } from '../constants/action_types'
import {
  selectUnexpiredAccessToken,
  selectValidRefreshToken,
  selectUnexpiredPublicToken,
} from '../selectors/authentication'

export function getHeaders(accessToken) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }
  return headers
}

export function getHeadHeader(accessToken, lastCheck) {
  return {
    ...getHeaders(accessToken),
    'If-Modified-Since': lastCheck,
  }
}

function* useRefreshToken(refreshToken) {
  yield put(refreshAuthenticationToken(refreshToken))
  // Wait for the refresh to resolve
  const result = yield take([AUTHENTICATION.REFRESH_SUCCESS, AUTHENTICATION.REFRESH_FAILURE])
  if (result.type === AUTHENTICATION.REFRESH_FAILURE) {
    return yield put(push('/enter'))
  }
  // If successful, call fetchCredentials again to setup access_token.
  return yield call(fetchCredentials)
}

function* getPublicToken() {
  yield put(fetchPublicToken())
  // Wait for the token to be fetched
  yield take([AUTHENTICATION.PUBLIC_SUCCESS, AUTHENTICATION.PUBLIC_FAILURE])
  // If successful, call fetchCredentials again to setup access_token.
  // If not successful, call fetchCredentials again and hope for the best.
  return yield call(fetchCredentials)
}

// We have 5 possible credential states:
// 1. Unexpired access token
// 2. Expired access token, refresh success
// 3. Expired access token, refresh fail
// 4. Unexpired public token
// 5. No token, get and store public token
export function* fetchCredentials() {
  const accessToken = yield select(selectUnexpiredAccessToken)
  if (accessToken) {
    return yield { token: { access_token: accessToken } }
  }

  const refreshToken = yield select(selectValidRefreshToken)
  if (refreshToken) {
    return yield call(useRefreshToken, refreshToken)
  }

  const publicToken = yield select(selectUnexpiredPublicToken)
  if (publicToken) {
    return yield { token: { access_token: publicToken } }
  }

  return yield call(getPublicToken)
}

function checkStatus(response) {
  if (response.ok) {
    return response
  }
  const error = new Error(response.statusText)
  error.response = response
  throw error
}

export function extractJSON(response) {
  return response ? response.json() : response
}

export function* sagaFetch(path, options) {
  const response = yield call(fetch, path, options)
  checkStatus(response)

  // allow for the json to be empty for a 202/204
  let json = {}
  if ((response.status === 200 || response.status === 201) &&
      /application\/json/.test(response.headers.get('content-type'))) {
    json = yield call(extractJSON, response)
  }
  return { serverResponse: response, json }
}
