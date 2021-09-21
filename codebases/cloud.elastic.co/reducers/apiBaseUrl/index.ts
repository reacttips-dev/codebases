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

import { get } from 'lodash'

import { FETCH_API_BASE_URL, UPDATE_API_BASE_URL } from '../../constants/actions'

export type State = {
  apiBaseUrl?: string | null
}

export default function apiBaseUrlReducer(state: State = {}, action) {
  if (action.type === FETCH_API_BASE_URL) {
    if (action.error && get(action, ['payload', 'response', 'status']) === 404) {
      return { ...state, apiBaseUrl: null }
    }

    if (!action.error && action.payload) {
      return { ...state, apiBaseUrl: action.payload.value }
    }
  }

  if (action.type === UPDATE_API_BASE_URL) {
    if (!action.error && action.payload) {
      return { ...state, apiBaseUrl: action.payload.value }
    }
  }

  return state
}

export function getApiBaseUrl(state: State) {
  return state.apiBaseUrl
}
