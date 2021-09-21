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
import { uniqueId } from 'lodash'

import asyncRequest, { resetAsyncRequest } from '../asyncRequests'

import {
  FETCH_CCS_ELIGIBLE_REMOTES,
  FETCH_CCS_SETTINGS,
  UPDATE_CCS_SETTINGS,
  RESET_ASYNC_REQUEST,
} from '../../constants/actions'

import {
  getDeploymentEsResourceEligibleRemoteClustersUrl,
  getDeploymentEsResourceRemoteClustersUrl,
  setDeploymentEsResourceRemoteClustersUrl,
  searchEligibleRemoteClustersUrl,
} from '../../lib/api/v1/urls'

import { RemoteResources, SearchRequest } from '../../lib/api/v1/types'
import { Action, ThunkAction } from '../../types'

type FetchCcsSettingsParams = {
  deploymentId: string
  refId: string
}

type UpdateCcsSettingsParams = {
  deploymentId: string
  refId: string
  settings: RemoteResources
}

type FetchCcsEligibleRemotesForVersionParams = {
  version: string
  payload?: SearchRequest
}

type FetchCcsEligibleRemotesForDeploymentParams = FetchCcsEligibleRemotesForVersionParams & {
  deploymentId: string
  refId: string
}

export function fetchCcsSettings({
  deploymentId,
  refId,
}: FetchCcsSettingsParams): ThunkAction<Promise<void>> {
  const url = getDeploymentEsResourceRemoteClustersUrl({
    deploymentId,
    refId,
  })

  return asyncRequest({
    type: FETCH_CCS_SETTINGS,
    method: `GET`,
    url,
    meta: { deploymentId },
    crumbs: [deploymentId],
  })
}

export function updateCcsSettings({
  deploymentId,
  refId,
  settings,
}: UpdateCcsSettingsParams): ThunkAction<Promise<void>> {
  const url = setDeploymentEsResourceRemoteClustersUrl({
    deploymentId,
    refId,
  })

  return asyncRequest({
    type: UPDATE_CCS_SETTINGS,
    method: `PUT`,
    url,
    payload: settings,
    meta: { deploymentId, settings },
    crumbs: [deploymentId],
  })
}

export function fetchCcsEligibleRemotesForVersion({
  version,
  payload,
}: FetchCcsEligibleRemotesForVersionParams): ThunkAction<Promise<void>> {
  const url = searchEligibleRemoteClustersUrl({ version })

  return fetchCcsEligibleRemotes({ url, version, payload })
}

export function fetchCcsEligibleRemotesForDeployment({
  deploymentId,
  refId,
  version,
  payload,
}: FetchCcsEligibleRemotesForDeploymentParams): ThunkAction<Promise<void>> {
  const url = getDeploymentEsResourceEligibleRemoteClustersUrl({
    deploymentId,
    refId,
  })

  return fetchCcsEligibleRemotes({ url, version, payload })
}

function fetchCcsEligibleRemotes({
  url,
  version,
  payload,
}: {
  url: string
  version: string
  payload?: SearchRequest
}): ThunkAction<Promise<void>> {
  const requestNonce = uniqueId(`fetchCcsEligibleRemotes`)

  return asyncRequest({
    type: FETCH_CCS_ELIGIBLE_REMOTES,
    method: `POST`,
    url,
    meta: { version, requestNonce },
    crumbs: [version],
    payload,
  })
}

export const resetUpdateCcsSettingsRequest = (
  ...crumbs: string[]
): Action<typeof RESET_ASYNC_REQUEST> => resetAsyncRequest(UPDATE_CCS_SETTINGS, crumbs)

export const resetFetchCcsEligibleRemotes = (
  ...crumbs: string[]
): Action<typeof RESET_ASYNC_REQUEST> => resetAsyncRequest(FETCH_CCS_ELIGIBLE_REMOTES, crumbs)
