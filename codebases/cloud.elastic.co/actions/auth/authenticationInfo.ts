/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import { FETCH_AUTHENTICATION_INFO } from '../../constants/actions'

import asyncRequest from '../asyncRequests'

import { getAuthenticationInfo } from '../../reducers'

import { getAuthenticationInfoUrl } from '../../lib/api/v1/urls'

import { ThunkAction } from '../../types'

export function fetchAuthenticationInfo(): ThunkAction {
  return asyncRequest({
    type: FETCH_AUTHENTICATION_INFO,
    url: getAuthenticationInfoUrl(),
  })
}

function shouldFetchAuthenticationInfo(state) {
  return !getAuthenticationInfo(state)
}

export function fetchAuthenticationInfoIfNeeded(): ThunkAction {
  return (dispatch, getState) => {
    if (!shouldFetchAuthenticationInfo(getState())) {
      return Promise.resolve()
    }

    return dispatch(fetchAuthenticationInfo())
  }
}
