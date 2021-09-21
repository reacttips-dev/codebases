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

import { UPDATE_PHONE_HOME_ENABLED, FETCH_PHONE_HOME_ENABLED } from '../../constants/actions'
import { AsyncAction } from '../../types'

export interface State {
  isEnabled: boolean
}

type FetchPhoneHomeEnabledAction = AsyncAction<
  typeof FETCH_PHONE_HOME_ENABLED,
  { enabled: boolean }
>

type UpdatePhoneHomeEnabledAction = AsyncAction<
  typeof UPDATE_PHONE_HOME_ENABLED,
  { enabled: boolean }
>

type Action = FetchPhoneHomeEnabledAction | UpdatePhoneHomeEnabledAction

const initialState: State = {
  isEnabled: true,
}

export default function phoneHomeConfigReducer(state: State = initialState, action: Action): State {
  if (action.type === FETCH_PHONE_HOME_ENABLED || action.type === UPDATE_PHONE_HOME_ENABLED) {
    if (!action.error && action.payload) {
      return {
        isEnabled: action.payload.enabled,
      }
    }
  }

  return state
}

export const isEnabled = (state: State) => state.isEnabled
