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

import { FETCH_API_KEYS } from '../../constants/actions'
import { ApiKeyResponse, ApiKeysResponse } from '../../lib/api/v1/types'
import { AsyncAction } from '../../types'

export interface State {
  apiKeys: ApiKeyResponse[]
}

type FetchApiKeysAction = AsyncAction<typeof FETCH_API_KEYS, ApiKeysResponse>

const initialState: State = {
  apiKeys: [],
}

export default function apiKeysReducer(
  state: State = initialState,
  { type, payload, error }: FetchApiKeysAction,
): State {
  if (payload && !error) {
    if (type === FETCH_API_KEYS) {
      return {
        ...state,
        apiKeys: payload.keys,
      }
    }
  }

  return state
}

export function getApiKeys(state: State) {
  return state.apiKeys
}

export function getManagedApiKeys(state: State) {
  return state
}
