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

import { get } from 'lodash'

import { FETCH_MFA_DEVICES, RESET_MFA } from '../../constants/actions'

import { SaasAuthMfaDeviceResponse, SaasAuthMfaDevicesResponse } from '../../lib/api/v1/types'

import { replaceIn } from '../../lib/immutability-helpers'

export interface State {
  [userId: string]: {
    devices: SaasAuthMfaDeviceResponse[]
  }
}

type FetchAction = {
  type: 'FETCH_MFA_DEVICES'
  error: Error | null
  payload: SaasAuthMfaDevicesResponse | null
  meta: {
    userId: string
  }
}

type ResetAction = {
  type: 'RESET_MFA'
  error: Error | null
  payload: SaasAuthMfaDevicesResponse | null
  meta: {
    userId: string
  }
}

export default function mfaDevicesReducer(
  state: State = {},
  action: FetchAction | ResetAction,
): State {
  if (action.type === FETCH_MFA_DEVICES) {
    if (action.payload && !action.error) {
      const { userId } = action.meta

      return replaceIn(state, [userId], {
        devices: get(action.payload, [`mfa_devices`], []),
      })
    }
  }

  if (action.type === RESET_MFA) {
    if (action.payload && !action.error) {
      const { userId } = action.meta

      return replaceIn(state, [userId, `devices`], [])
    }
  }

  return state
}

export const getMfaDevices = (state, userId) => get(state, [userId, `devices`])
