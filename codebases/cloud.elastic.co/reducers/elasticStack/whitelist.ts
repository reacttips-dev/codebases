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
  DELETE_WHITELISTED_VERSION,
  FETCH_WHITELISTED_VERSIONS,
  PUT_WHITELISTED_VERSION,
} from '../../constants/actions'

import {
  ClearVersionsAction,
  DeleteWhitelistedVersionAction,
  FetchVersionAction,
  FetchVersionsAction,
  FetchWhitelistedVersionAction,
  PutWhitelistedVersionAction,
  WhitelistState,
} from './stackTypes'

type Action =
  | FetchVersionsAction
  | FetchVersionAction
  | ClearVersionsAction
  | DeleteWhitelistedVersionAction
  | PutWhitelistedVersionAction
  | FetchWhitelistedVersionAction

export default function whitelistReducer(
  state: WhitelistState = {},
  action: Action,
): WhitelistState {
  switch (action.type) {
    case PUT_WHITELISTED_VERSION:
      if (!action.error && action.payload) {
        const regionId = action.meta.regionId
        return {
          ...state,
          [regionId]: action.payload.whitelisted_versions
            ? action.payload.whitelisted_versions
            : [],
        }
      }

      break
    case FETCH_WHITELISTED_VERSIONS:
      if (!action.error && action.payload) {
        const regionId = action.meta.regionId
        return {
          ...state,
          [regionId]: action.payload.whitelisted_versions
            ? action.payload.whitelisted_versions
            : [],
        }
      }

      break
    case DELETE_WHITELISTED_VERSION:
      if (!action.error && action.payload) {
        const regionId = action.meta.regionId

        return {
          ...state,
          [regionId]: action.payload.whitelisted_versions
            ? action.payload.whitelisted_versions
            : [],
        }
      }

      break

    default:
      break
  }

  return state
}
