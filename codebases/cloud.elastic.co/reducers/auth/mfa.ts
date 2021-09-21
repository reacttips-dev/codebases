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

import { LOG_OUT, REQUIRE_MFA } from '../../constants/actions'
import { Action, MfaState } from './types'

const initialState: MfaState = {}

export default function mfaReducer(state: MfaState = initialState, action: Action): MfaState {
  switch (action.type) {
    case REQUIRE_MFA:
      return action.payload

    case LOG_OUT:
      return initialState

    default:
      return state
  }
}
