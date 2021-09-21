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

import asyncRequest from '../../../../actions/asyncRequests'
import { FETCH_METRICS } from '../../constants/actions'
import { ElasticsearchCluster } from '../../../../types'

export function fetchMetrics(cluster: ElasticsearchCluster) {
  const { regionId, id: clusterId } = cluster

  const url = `/api/v0/clusters/${regionId}/${clusterId}/_metrics`

  return asyncRequest({
    type: FETCH_METRICS,
    url,
    meta: { regionId, clusterId },
    crumbs: [regionId, clusterId],
    includeHeaders: true,
  })
}
