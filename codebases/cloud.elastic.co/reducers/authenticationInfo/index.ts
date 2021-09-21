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

import { FETCH_AUTHENTICATION_INFO, ENABLE_TWO_FACTOR_AUTH } from '../../constants/actions'

import { AuthenticationInfo } from '../../lib/api/v1/types'

export type State = AuthenticationInfo | null

const initialState = null

export default function authenticationInfoReducer(state: State = initialState, action) {
  if (action.type === FETCH_AUTHENTICATION_INFO) {
    if (!action.error && action.payload) {
      return action.payload
    }
  }

  if (action.type === ENABLE_TWO_FACTOR_AUTH) {
    if (!action.error && action.payload) {
      return {
        ...state,
        has_totp_device: action.payload.totp,
      }
    }
  }

  return state
}

export function getAuthenticationInfo(state: State) {
  return state
}
