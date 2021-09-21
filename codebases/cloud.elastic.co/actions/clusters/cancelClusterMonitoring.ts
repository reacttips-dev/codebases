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
import { CANCEL_CLUSTER_MONITORING } from '../../constants/actions'
import { cancelEsClusterMonitoringUrl } from '../../lib/api/v1/urls'

import { ElasticsearchCluster, ElasticsearchId, RegionId } from '../../types'

export function cancelClusterMonitoring(cluster: ElasticsearchCluster) {
  const clusterId = cluster.id
  const regionId = cluster.regionId

  const url = cancelEsClusterMonitoringUrl({ regionId, clusterId })

  return asyncRequest({
    type: CANCEL_CLUSTER_MONITORING,
    url,
    method: `delete`,
    meta: { regionId, clusterId },
    crumbs: [regionId, clusterId],
  })
}

export const resetCancelClusterMonitoringRequest = (
  regionId: RegionId,
  clusterId: ElasticsearchId,
) => resetAsyncRequest(CANCEL_CLUSTER_MONITORING, [regionId, clusterId])
