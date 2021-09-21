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

import { AUTH_TOKEN, LOG_OUT, REQUIRE_MFA } from '../../constants/actions'
import { Action as BasicAction, AsyncAction } from '../../types'

interface TokenResponse {
  token: string
}

type LogoutAction = BasicAction<typeof LOG_OUT>
type AuthTokenAction = AsyncAction<typeof AUTH_TOKEN, TokenResponse>

export enum DEVICE_TYPES {
  GOOGLE = `GOOGLE`,
  SMS = `SMS`,
}

interface RequireMfaAction extends BasicAction<typeof REQUIRE_MFA> {
  payload: MfaState
}

export type Action = LogoutAction | AuthTokenAction | RequireMfaAction

type MfaDeviceState = {
  device_id: string
  device_type: DEVICE_TYPES | null
  status: string
  qrCode?: {
    url: string
    mediaType: string
  }
  phoneNumber?: string
}

export interface MfaState {
  state_id?: string
  mfa_required?: boolean
  mfa_devices?: MfaDeviceState[]
}

export interface State {
  token: null // the `auth/token` reducer is governed by side-effects only, see: public/reducers/auth/token.ts
  mfa: MfaState
}
