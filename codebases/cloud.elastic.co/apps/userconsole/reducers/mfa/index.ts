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

import { get, includes, reject, uniqBy } from 'lodash'

import {
  ACTIVATE_MFA_DEVICE,
  DISABLE_MFA,
  ENABLE_MFA,
  ENROLL_MFA_DEVICE,
  FETCH_MFA_DEVICES,
  FETCH_MFA_STATUS,
  REMOVE_MFA_DEVICE,
} from '../../constants/actions'

import { ReduxState } from '../../../../types'
import { MfaDevice } from './types'

function makeDevice(device): MfaDevice {
  return {
    ...device,
    isActive: device.status === `ACTIVE`,
  }
}

export interface State {
  enabled?: boolean
  mfa_devices?: MfaDevice[]
}

const initialState = {}

export default function mfaReducer(state: State = initialState, action: any) {
  const { error, payload, type, meta } = action

  if (get(meta, [`state`]) === `success`) {
    // optimistic updates
    if (type === ENABLE_MFA) {
      return {
        ...state,
        enabled: true,
      }
    }

    if (type === DISABLE_MFA) {
      return {
        ...state,
        enabled: false,
      }
    }
  }

  if (payload && !error) {
    if (includes([FETCH_MFA_STATUS, ENABLE_MFA, DISABLE_MFA], type)) {
      return {
        ...state,
        ...payload,
      }
    }

    if (type === FETCH_MFA_DEVICES) {
      return {
        ...state,
        mfa_devices: payload.mfa_devices.map(makeDevice),
      }
    }

    if (includes([ENROLL_MFA_DEVICE, ACTIVATE_MFA_DEVICE], type)) {
      return {
        ...state,
        mfa_devices: uniqBy(
          [
            // there can only be one of each device type
            makeDevice(payload),
            ...(state.mfa_devices || []),
          ],
          (v) => v.device_type,
        ),
      }
    }

    if (type === REMOVE_MFA_DEVICE) {
      const { device_id } = meta
      return {
        ...state,
        mfa_devices: reject(state.mfa_devices, { device_id }),
      }
    }
  }

  return state
}

export function getMfaEnabled(state: ReduxState): boolean | null {
  return get(state, [`mfa`, `enabled`], null)
}

export function getMfaDevices(state: ReduxState): MfaDevice[] | null {
  return get(state, [`mfa`, `mfa_devices`], null)
}
