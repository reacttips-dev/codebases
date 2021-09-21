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
import asyncRequest, { resetAsyncRequest } from '../asyncRequests'

import {
  CREATE_TRUST_RELATIONSHIP,
  DELETE_TRUST_RELATIONSHIP,
  FETCH_TRUST_RELATIONSHIP,
  FETCH_TRUST_RELATIONSHIPS,
  UPDATE_TRUST_RELATIONSHIP,
  RESET_ASYNC_REQUEST,
} from '../../constants/actions'
import { localTrustRelationshipId } from '../../constants/trustRelationships'

import {
  createTrustRelationshipUrl,
  deleteTrustRelationshipUrl,
  getTrustRelationshipUrl,
  getTrustRelationshipsUrl,
  updateTrustRelationshipUrl,
} from '../../lib/api/v1/urls'
import {
  TrustRelationshipCreateRequest,
  TrustRelationshipCreateResponse,
  TrustRelationshipGetResponse,
  TrustRelationshipsListResponse,
  TrustRelationshipUpdateRequest,
  TrustRelationshipUpdateResponse,
} from '../../lib/api/v1/types'

import { Action, ThunkAction } from '../../types'

export function fetchTrustRelationships({
  regionId,
  includeCertificate = false,
}: {
  regionId: string
  includeCertificate?: boolean
}): ThunkAction<Promise<TrustRelationshipsListResponse>> {
  const url = getTrustRelationshipsUrl({
    regionId,
    includeCertificate,
  })

  return asyncRequest({
    type: FETCH_TRUST_RELATIONSHIPS,
    method: `GET`,
    url,
    meta: { regionId },
    crumbs: [regionId],
  })
}

export function fetchTrustRelationship({
  regionId,
  trustRelationshipId,
  includeCertificate,
}: {
  regionId: string
  trustRelationshipId: string
  includeCertificate: boolean
}): ThunkAction<Promise<TrustRelationshipGetResponse>> {
  const url = getTrustRelationshipUrl({
    regionId,
    trustRelationshipId,
    includeCertificate,
  })

  return asyncRequest({
    type: FETCH_TRUST_RELATIONSHIP,
    method: `GET`,
    url,
    meta: { regionId, trustRelationshipId },
    crumbs: [regionId, trustRelationshipId],
  })
}

export function fetchLocalTrustRelationship({
  regionId,
  includeCertificate,
}: {
  regionId: string
  includeCertificate: boolean
}): ThunkAction<Promise<TrustRelationshipGetResponse>> {
  return fetchTrustRelationship({
    regionId,
    trustRelationshipId: localTrustRelationshipId,
    includeCertificate,
  })
}

export function createTrustRelationship({
  regionId,
  payload,
}: {
  regionId: string
  payload: TrustRelationshipCreateRequest
}): ThunkAction<Promise<TrustRelationshipCreateResponse>> {
  const url = createTrustRelationshipUrl({
    regionId,
  })

  return asyncRequest({
    type: CREATE_TRUST_RELATIONSHIP,
    method: `POST`,
    url,
    payload,
    meta: { regionId },
    crumbs: [regionId],
  })
}

export function deleteTrustRelationship({
  regionId,
  trustRelationshipId,
  version,
}: {
  regionId: string
  trustRelationshipId: string
  version?: number | null
}): ThunkAction<Promise<void>> {
  const url = deleteTrustRelationshipUrl({
    regionId,
    trustRelationshipId,
    version,
  })

  return asyncRequest({
    type: DELETE_TRUST_RELATIONSHIP,
    method: `DELETE`,
    url,
    meta: { regionId, trustRelationshipId },
    crumbs: [regionId, trustRelationshipId],
  })
}

export function updateTrustRelationship({
  regionId,
  trustRelationshipId,
  payload,
}: {
  regionId: string
  trustRelationshipId: string
  payload: TrustRelationshipUpdateRequest
}): ThunkAction<Promise<TrustRelationshipUpdateResponse>> {
  const url = updateTrustRelationshipUrl({
    regionId,
    trustRelationshipId,
  })

  return asyncRequest({
    type: UPDATE_TRUST_RELATIONSHIP,
    method: `PUT`,
    url,
    payload,
    meta: { regionId, trustRelationshipId },
    crumbs: [regionId, trustRelationshipId],
  })
}

export const resetFetchTrustRelationships = (
  ...crumbs: string[]
): Action<typeof RESET_ASYNC_REQUEST> => resetAsyncRequest(FETCH_TRUST_RELATIONSHIPS, crumbs)

export const resetFetchTrustRelationship = (
  ...[regionId, trustRelationshipId]: string[]
): Action<typeof RESET_ASYNC_REQUEST> =>
  resetAsyncRequest(FETCH_TRUST_RELATIONSHIP, [regionId, trustRelationshipId])

export const resetCreateTrustRelationship = (
  ...crumbs: string[]
): Action<typeof RESET_ASYNC_REQUEST> => resetAsyncRequest(CREATE_TRUST_RELATIONSHIP, crumbs)

export const resetFetchLocalTrustRelationship = (
  regionId: string,
): Action<typeof RESET_ASYNC_REQUEST> =>
  resetFetchTrustRelationship(regionId, localTrustRelationshipId)

export const resetUpdateTrustRelationship = (
  ...[regionId, trustRelationshipId]: string[]
): Action<typeof RESET_ASYNC_REQUEST> =>
  resetAsyncRequest(UPDATE_TRUST_RELATIONSHIP, [regionId, trustRelationshipId])
