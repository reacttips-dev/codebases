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

import { Action } from 'redux'

import { getCurrentUserUrl, updateCurrentUserUrl } from '../../lib/api/v1/urls'
import { ThunkAction } from '../../types'

import asyncRequest, { resetAsyncRequest } from '../asyncRequests'
import {
  FETCH_CURRENT_USER,
  UPDATE_CURRENT_USER,
  CLEAR_CURRENT_USER,
} from '../../constants/actions'
import { User } from '../../lib/api/v1/types'
import { DeepPartial } from '../../lib/ts-essentials'

export function fetchCurrentUser(): ThunkAction<Promise<User>> {
  const url = getCurrentUserUrl()

  return asyncRequest({
    type: FETCH_CURRENT_USER,
    url,
  })
}

export function updateCurrentUser(
  user: DeepPartial<User>,
  crumb: 'change_password' | 'update_profile',
): ThunkAction<Promise<User>> {
  const url = updateCurrentUserUrl()

  return asyncRequest({
    type: UPDATE_CURRENT_USER,
    method: 'PATCH',
    url,
    payload: user,
    crumbs: [crumb],
  })
}

export function clearCurrentUser(): Action<typeof CLEAR_CURRENT_USER> {
  return {
    type: CLEAR_CURRENT_USER,
  }
}

export function resetFetchCurrentUser() {
  return resetAsyncRequest(FETCH_CURRENT_USER)
}
