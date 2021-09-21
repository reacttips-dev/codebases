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

import asyncRequest, { resetAsyncRequest } from '../../../../actions/asyncRequests'

import { SaasAuthMfaEnrollDeviceRequest } from '../../../../lib/api/v1/types'

import {
  ACTIVATE_MFA_DEVICE,
  DISABLE_MFA,
  ENABLE_MFA,
  ENROLL_MFA_DEVICE,
  FETCH_MFA_DEVICES,
  FETCH_MFA_STATUS,
  REMOVE_MFA_DEVICE,
} from '../../constants/actions'

import { ThunkAction } from '../../../../types'
import { MfaDevice } from '../../reducers/mfa/types'

export function fetchMfaStatus(): ThunkAction {
  const url = `/api/v1/users/mfa`

  return asyncRequest({
    type: FETCH_MFA_STATUS,
    url,
  })
}

export function enableMfa(): ThunkAction {
  const url = `/api/v1/users/mfa`

  return asyncRequest({
    type: ENABLE_MFA,
    method: `PUT`,
    url,
    payload: { enabled: true },
  })
}

export function disableMfa(): ThunkAction {
  const url = `/api/v1/users/mfa`

  return asyncRequest({
    type: DISABLE_MFA,
    method: `PUT`,
    url,
    payload: { enabled: false },
  })
}

export function fetchMfaDevices(): ThunkAction {
  const url = `/api/v1/users/mfa/devices`

  return asyncRequest({
    type: FETCH_MFA_DEVICES,
    url,
  })
}

export type EnrollMfaDevice = (request: SaasAuthMfaEnrollDeviceRequest) => ThunkAction

export const enrollMfaDevice: EnrollMfaDevice = ({ device_type, phone_number }) => {
  const url = `/api/v1/users/mfa/devices`

  return asyncRequest({
    type: ENROLL_MFA_DEVICE,
    method: `POST`,
    url,
    payload: { device_type, phone_number },
    crumbs: [device_type],
  })
}

export type ActivateMfaDevice = (args: { device_id: string; pass_code: string }) => ThunkAction

export const activateMfaDevice: ActivateMfaDevice = ({ device_id, pass_code }) => {
  const url = `/api/v1/users/mfa/devices/${device_id}`

  return asyncRequest({
    type: ACTIVATE_MFA_DEVICE,
    method: `PUT`,
    url,
    payload: { pass_code },
    crumbs: [device_id],
  })
}

export const resetMfaEnrollment =
  ({ device_type, device_id }: { device_type: string; device_id: string }): ThunkAction<any> =>
  (dispatch) => {
    dispatch(resetAsyncRequest(ENROLL_MFA_DEVICE, [device_type]))
    return dispatch(resetAsyncRequest(ACTIVATE_MFA_DEVICE, [device_id]))
  }

export function removeMfaDevice({ device_id }: MfaDevice): ThunkAction {
  const url = `/api/v1/users/mfa/devices/${device_id}`

  return asyncRequest({
    type: REMOVE_MFA_DEVICE,
    method: `DELETE`,
    url,
    meta: { device_id },
    crumbs: [device_id],
  })
}
