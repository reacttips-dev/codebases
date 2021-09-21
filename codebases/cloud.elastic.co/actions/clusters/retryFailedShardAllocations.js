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
import { getEsProxyRequestsUrl } from '../../lib/api/v1/urls'
import { RETRY_FAILED_SHARD_ALLOCATIONS } from '../../constants/actions'

export function retryFailedShardAllocations(cluster) {
  const { regionId, id: clusterId } = cluster
  const elasticsearchPath = `_cluster/reroute?retry_failed`
  const url = getEsProxyRequestsUrl({ clusterId, regionId, elasticsearchPath })

  return asyncRequest({
    type: RETRY_FAILED_SHARD_ALLOCATIONS,
    method: `POST`,
    url,
    meta: { regionId, clusterId },
    crumbs: [regionId, clusterId],
    requestSettings: {
      request: {
        headers: {
          'X-Management-Request': true,
        },
      },
    },
  })
}

export const resetRetryFailedShardAllocationsRequest = (...crumbs) =>
  resetAsyncRequest(RETRY_FAILED_SHARD_ALLOCATIONS, crumbs)
