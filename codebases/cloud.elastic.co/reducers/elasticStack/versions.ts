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

import { CLEAR_VERSIONS, FETCH_VERSION, FETCH_VERSIONS } from '../../constants/actions'

import {
  ClearVersionsAction,
  DeleteWhitelistedVersionAction,
  FetchVersionAction,
  FetchVersionsAction,
  FetchWhitelistedVersionAction,
  PutWhitelistedVersionAction,
  VersionsState,
} from './stackTypes'

type Action =
  | ClearVersionsAction
  | DeleteWhitelistedVersionAction
  | FetchVersionAction
  | FetchVersionsAction
  | FetchWhitelistedVersionAction
  | PutWhitelistedVersionAction

export default function versionsReducer(state: VersionsState = {}, action: Action): VersionsState {
  switch (action.type) {
    case FETCH_VERSIONS:
      if (!action.error && action.payload) {
        const regionId = action.meta.regionId

        if (!regionId) {
          return state
        }

        return {
          ...state,
          [regionId]: action.payload.stacks,
        }
      }

      break

    case FETCH_VERSION:
      if (!action.error && action.payload) {
        const regionId = action.meta.regionId

        if (!regionId) {
          return state
        }

        return {
          ...state,
          [regionId]: [action.payload],
        }
      }

      break

    case CLEAR_VERSIONS:
      return {}

    default:
      break
  }

  return state
}
