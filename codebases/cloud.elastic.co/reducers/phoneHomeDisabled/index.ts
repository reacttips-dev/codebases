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

import { DISABLE_PHONE_HOME } from '../../constants/actions'
import { Action } from '../../types'

export interface State {
  isPhoneHomeDisabled: boolean
}

type DisablePhoneHome = Action<typeof DISABLE_PHONE_HOME>

const initialState: State = {
  isPhoneHomeDisabled: false,
}

export default function phoneHomeDisabledReducer(
  state: State = initialState,
  action: DisablePhoneHome,
): State {
  if (action.type === DISABLE_PHONE_HOME) {
    return {
      isPhoneHomeDisabled: true,
    }
  }

  return state
}

export const isPhoneHomeDisabled = (state: State) => state.isPhoneHomeDisabled
