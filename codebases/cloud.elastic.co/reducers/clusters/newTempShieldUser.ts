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

import { NEW_TEMP_SHIELD_USER_SUCCESS, RESET_TEMP_SHIELD_USER } from '../../constants/actions'
import { ShieldUserAction } from './clusterTypes'

export type State = {
  username: string | null
  password: string | null
  validUntil: string | null
}

const initialState = {
  username: null,
  password: null,
  validUntil: null,
}

export default function newTempShieldUser(state: State = initialState, action: ShieldUserAction) {
  if (action.type === NEW_TEMP_SHIELD_USER_SUCCESS && action.payload != null) {
    return {
      username: action.payload.username,
      password: action.payload.password,
      validUntil: action.payload.validUntil,
    }
  }

  if (action.type === RESET_TEMP_SHIELD_USER) {
    return initialState
  }

  return state
}
