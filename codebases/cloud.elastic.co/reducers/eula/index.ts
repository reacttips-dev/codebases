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

import { FETCH_ROOT, ACCEPT_EULA } from '../../constants/actions'
import { AsyncAction } from '../../types'

export interface State {
  isAccepted: boolean
}

type FetchRootAction = AsyncAction<typeof FETCH_ROOT, { eula_accepted: boolean }>
type AcceptEulaAction = AsyncAction<typeof FETCH_ROOT, { eula_accepted: boolean }>

type Action = FetchRootAction | AcceptEulaAction

const initialState = {
  isAccepted: false,
}

export default function eulaReducer(state: State = initialState, action: Action): State {
  if (action.type === FETCH_ROOT || action.type === ACCEPT_EULA) {
    if (!action.error && action.payload) {
      return {
        isAccepted: action.payload.eula_accepted,
      }
    }
  }

  return state
}

export const isAccepted = (state: State) => state.isAccepted
