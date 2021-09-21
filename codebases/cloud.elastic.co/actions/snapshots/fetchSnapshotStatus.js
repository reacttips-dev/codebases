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

import { getEsProxyRequestsUrl } from '../../lib/api/v1/urls'
import asyncRequest from '../asyncRequests'
import { FETCH_SNAPSHOT_STATUS } from '../../constants/actions'

const repositoryName = `found-snapshots`

export function fetchSnapshotStatus(cluster, snapshotId) {
  return (dispatch) => {
    const regionId = cluster.regionId
    const clusterId = cluster.id

    const elasticsearchPath = `_snapshot/${repositoryName}/${snapshotId}/_status`
    const url = getEsProxyRequestsUrl({ clusterId, regionId, elasticsearchPath })

    return dispatch(
      asyncRequest({
        type: FETCH_SNAPSHOT_STATUS,
        url,
        meta: { regionId, clusterId, snapshotId },
        crumbs: [regionId, clusterId, snapshotId],

        // Required for v0 API
        requestSettings: {
          request: {
            headers: {
              'X-Management-Request': true,
            },
          },
        },
      }),
    )
  }
}
