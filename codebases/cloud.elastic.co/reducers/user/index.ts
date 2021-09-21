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

import { FETCH_USER, ENABLE_TWO_FACTOR_AUTH } from '../../constants/actions'
import { AsyncAction } from '../../types'

export type State = null | {
  username: string
  canSudo: boolean
  level: string | undefined
}

export interface FetchUserResponse {
  ok: boolean
  user: string
  canSudo: boolean
  level?: string
}

type FetchUserAction = AsyncAction<typeof FETCH_USER, FetchUserResponse>
type EnableTwoFactorAuthAction = AsyncAction<typeof ENABLE_TWO_FACTOR_AUTH>

type Action = FetchUserAction | EnableTwoFactorAuthAction

function createUser(source: FetchUserResponse): State {
  return {
    username: source.user,
    canSudo: source.canSudo,
    level: source.level,
  }
}

export default function userReducer(user: State = null, action: Action): State {
  if (action.type === FETCH_USER) {
    if (!action.error && action.payload) {
      return createUser(action.payload)
    }
  }

  return user
}

export function getUser(state: State): State {
  return state
}
