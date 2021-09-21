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

import asyncRequest from '../asyncRequests'

import {
  FETCH_SAAS_USER,
  CREATE_SAAS_USER_ADMIN,
  CREATE_SAAS_USER,
  UPDATE_SAAS_USER_PROFILE,
} from '../../constants/actions'
import {
  CreateSaasUserAdminRequest,
  CreateSaasUserRequest,
  SaasUserResponse,
  SaasUpdateProfileRequestData,
} from '../../lib/api/v1/types'

export function fetchSaasUser(userId: string) {
  const url = `api/v1/saas/users/${userId}`

  return asyncRequest<SaasUserResponse>({
    type: FETCH_SAAS_USER,
    url,
    meta: { userId },
    crumbs: [userId],
    handleUnauthorized: true,
  })
}

export function updateSaasUserProfile(userId: number, updates: SaasUpdateProfileRequestData) {
  const url = `api/v1/saas/users/${userId}/profile`

  return asyncRequest<SaasUserResponse>({
    type: UPDATE_SAAS_USER_PROFILE,
    method: `PUT`,
    url,
    meta: { userId },
    crumbs: [String(userId)],
    payload: updates,
    handleUnauthorized: true,
  })
}

export function createSaasUserAdmin(payload: CreateSaasUserAdminRequest) {
  const url = `api/v1/saas/users/`

  return asyncRequest({
    type: CREATE_SAAS_USER_ADMIN,
    method: 'POST',
    url,
    payload,
  })
}

export function createSaasUser(payload: CreateSaasUserRequest) {
  const url = `api/v1/users?activate=true`

  return asyncRequest({
    type: CREATE_SAAS_USER,
    method: 'POST',
    url,
    payload,
  })
}
