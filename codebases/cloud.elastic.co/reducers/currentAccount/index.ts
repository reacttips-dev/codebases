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

import { FETCH_CURRENT_ACCOUNT, UPDATE_CURRENT_ACCOUNT } from '../../constants/actions'

import { AccountResponse } from '../../lib/api/v1/types'

type FetchAction = {
  type: typeof FETCH_CURRENT_ACCOUNT
  error?: boolean
  payload?: AccountResponse
}

type UpdateAction = {
  type: typeof UPDATE_CURRENT_ACCOUNT
  error?: boolean
  payload?: AccountResponse
}

type Action = FetchAction | UpdateAction

export type State = AccountResponse | null

const initialState: State = null

export default function currentAccountReducer(state: State = initialState, action: Action): State {
  if (action.type === FETCH_CURRENT_ACCOUNT || action.type === UPDATE_CURRENT_ACCOUNT) {
    if (!action.error && action.payload) {
      return action.payload
    }
  }

  return state
}

export const getCurrentAccount = (state: State): AccountResponse | null => state
