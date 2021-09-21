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

import {
  CREATE_USER,
  DELETE_USER,
  FETCH_ALL_USERS,
  FETCH_LOCAL_USER,
  UPDATE_USER,
} from '../../constants/actions'
import { User, UserList } from '../../lib/api/v1/types'
import { AsyncAction } from '../../types'

export type State = User[] | null

type FetchAllAction = AsyncAction<typeof FETCH_ALL_USERS, UserList>
type FetchAction = AsyncAction<typeof FETCH_LOCAL_USER, User>
type CreateAction = AsyncAction<typeof CREATE_USER, User>
type UpdateAction = AsyncAction<typeof UPDATE_USER, User>
interface DeleteAction extends AsyncAction<typeof DELETE_USER, any> {
  meta: {
    user_name: string
  }
}

type Action = FetchAllAction | FetchAction | CreateAction | DeleteAction | UpdateAction

const initialState: State = null

export default function usersReducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case FETCH_ALL_USERS:
      if (!action.error && action.payload) {
        return action.payload.users
      }

      break

    case CREATE_USER:
      if (!action.error && action.payload) {
        const createdUser = action.payload

        if (state) {
          // If we poll the list of users while waiting for the create API call to return,
          // sometimes we end up with a user appearing twice in the list until we refresh
          // again. To avoid this, only add the new user to the state if it's not already
          // there. User names are unique.
          if (state.find((each) => each.user_name === createdUser.user_name)) {
            return state
          }

          return state.concat(action.payload)
        }

        return [action.payload]
      }

      break

    case FETCH_LOCAL_USER:
    case UPDATE_USER:
      if (!action.error && action.payload) {
        const { payload } = action

        if (state) {
          if (state.find((each) => each.user_name === payload.user_name)) {
            return state.map((user) => {
              if (user.user_name !== payload.user_name) {
                return user
              }

              return { ...user, ...payload }
            })
          }

          return state.concat(action.payload)
        }
      }

      break

    case DELETE_USER:
      if (!action.error && action.payload) {
        const { user_name } = action.meta

        if (state) {
          return state.filter((each) => each.user_name !== user_name)
        }
      }

      break

    default:
      break
  }

  return state
}

export function getUsers(state: State): User[] | null {
  return state
}

export function getUser(state: State, username): User | undefined {
  return state ? state.find((each) => each.user_name === username) : undefined
}
