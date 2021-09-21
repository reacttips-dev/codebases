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

import { AUTH_TOKEN, LOG_OUT } from '../../constants/actions'

import { SAD_clearAuthTokenBits, SAD_updateAuthTokenBits } from '../../lib/auth'

import { Action } from './types'

type State = null

/* This reducer "exists" only as a means of creating side effects backed by localStorage
 * long-term the idea was to manage session purely through the session cookie, but unfortunately in some cases
 * we still require to decode the authentication JWT token and rely on the details encoded into it to figure out
 * some data about the currently logged in user. All `SAD_*` helpers reflect this aspect of our legacy.
 * See also: public/lib/auth.ts
 */
export default function tokenReducer(_state: State, action: Action): State {
  if (action.type === AUTH_TOKEN && action.payload && !action.error) {
    SAD_updateAuthTokenBits(action.payload.token)
    return null
  }

  if (action.type === LOG_OUT) {
    SAD_clearAuthTokenBits()
    return null
  }

  return null
}
