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

import { isEmpty } from 'lodash'

import {
  FETCH_CURRENT_USER,
  UPDATE_CURRENT_USER,
  CLEAR_CURRENT_USER,
} from '../../constants/actions'

import Permission from '../../lib/api/v1/permissions'

import { User } from '../../lib/api/v1/types'
import { AsyncAction } from '../../types'

type PermissionsLookup = {
  [permission in Permission]?: boolean
}

export type State = null | {
  user: User
  permissions: PermissionsLookup
}

type FetchAction = AsyncAction<typeof FETCH_CURRENT_USER, User>
type UpdateAction = AsyncAction<typeof UPDATE_CURRENT_USER, User>
type ClearAction = AsyncAction<typeof CLEAR_CURRENT_USER, User>

type Action = FetchAction | UpdateAction | ClearAction

const initialState: State = null

export default function usersReducer(state: State = initialState, action: Action): State {
  if (action.type === CLEAR_CURRENT_USER) {
    return initialState
  }

  if (action.type === FETCH_CURRENT_USER || action.type === UPDATE_CURRENT_USER) {
    if (!action.error && action.payload) {
      return {
        user: action.payload,
        permissions: buildPermissionsLookup(action.payload.security.permissions),
      }
    }
  }

  return state
}

function buildPermissionsLookup(permissions: string[] = []): PermissionsLookup {
  const lookup: PermissionsLookup = {}

  for (const permission of permissions) {
    lookup[permission] = true
  }

  return lookup
}

export function getCurrentUser(state: State): User | null {
  return state ? state.user : null
}

export function isCurrentUser(state: State, username: string): boolean {
  const currentUser = getCurrentUser(state)
  return !!currentUser && currentUser.user_name === username
}

export function hasPermission(state: State, expectedPermissions: Permission[]): boolean {
  if (state == null) {
    return true
  }

  const { user, permissions } = state
  const { security } = user

  // same logic as in the API
  const legacyUser =
    isEmpty(security.permissions) && isEmpty(security.roles) && isEmpty(security.security_realm)

  /* the API isn't advertising permissions for this user,
   * so we assume they have all the permissions.
   */
  if (legacyUser) {
    return true
  }

  return expectedPermissions.every((permission) => permissions[permission])
}
