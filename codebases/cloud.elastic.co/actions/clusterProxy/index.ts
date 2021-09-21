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
import { trimStart } from 'lodash'

import asyncRequest, { resetAsyncRequest, Method } from '../asyncRequests'

import { QUERY_CLUSTER_PROXY, CLEAR_CLUSTER_PROXY_RESPONSE } from '../../constants/actions'

import { getEsProxyRequestsUrl } from '../../lib/api/v1/urls'

export function queryClusterProxy({
  regionId,
  clusterId,
  method,
  path,
  body,
  meta = {},
}: {
  regionId: string
  clusterId: string
  method: Method
  path: string
  body: any
  meta?: any
}) {
  const headers = {
    'X-Management-Request': true, // For v0 API
    Accept: `*/*`,
  }

  const elasticsearchPath = trimStart(path, `/`)
  const url = getEsProxyRequestsUrl({ clusterId, regionId, elasticsearchPath })

  // the payload might not be JSON at all, as is the case with `POST /_msearch`
  const payload = method !== `GET` ? parseBody(body) : undefined
  const json = typeof payload !== `string`

  const now = Date.now()

  return asyncRequest({
    type: QUERY_CLUSTER_PROXY,
    method,
    payload,
    url,
    meta: { regionId, clusterId, ...meta },
    crumbs: [regionId, clusterId],
    handleUnauthorized: true,
    requestSettings: {
      json,
      request: {
        headers,
      },
      response: {
        fullStatus: true,
      },
    },
    responseMapper: (response) => {
      const requestDuration = Date.now() - now

      return {
        requestDuration,
        ...response,
      }
    },
  })
}

export function clearClusterProxyResponse(regionId: string, clusterId: string) {
  return {
    type: CLEAR_CLUSTER_PROXY_RESPONSE,
    meta: { regionId, clusterId },
  }
}

export function resetQueryClusterProxyRequest(...params) {
  return resetAsyncRequest(QUERY_CLUSTER_PROXY, ...params)
}

function parseBody(body) {
  if (typeof body !== `string`) {
    return body
  }

  try {
    return JSON.parse(body)
  } catch (e) {
    return body
  }
}
