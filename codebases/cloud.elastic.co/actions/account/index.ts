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

import asyncRequest, { resetAsyncRequest } from '../asyncRequests'

import {
  FETCH_CURRENT_ACCOUNT,
  UPDATE_CURRENT_ACCOUNT,
  RESET_ASYNC_REQUEST,
} from '../../constants/actions'

import { getCurrentAccountUrl, updateCurrentAccountUrl } from '../../lib/api/v1/urls'

import { AccountResponse, AccountUpdateRequest } from '../../lib/api/v1/types'
import { Action, ThunkAction } from '../../types'

export function fetchCurrentAccount(): ThunkAction<Promise<AccountResponse>> {
  const url = getCurrentAccountUrl()

  return asyncRequest({
    type: FETCH_CURRENT_ACCOUNT,
    method: `GET`,
    url,
  })
}

export function updateCurrentAccount({
  payload,
}: {
  payload: AccountUpdateRequest
}): ThunkAction<Promise<AccountResponse>> {
  const url = updateCurrentAccountUrl()

  return asyncRequest({
    type: UPDATE_CURRENT_ACCOUNT,
    method: `PUT`,
    url,
    payload,
  })
}

export const resetFetchCurrentAccount = (): Action<typeof RESET_ASYNC_REQUEST> =>
  resetAsyncRequest(FETCH_CURRENT_ACCOUNT)

export const resetUpdateCurrentAccount = (): Action<typeof RESET_ASYNC_REQUEST> =>
  resetAsyncRequest(UPDATE_CURRENT_ACCOUNT)
