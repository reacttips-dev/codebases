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
import asyncRequest, { resetAsyncRequest } from '../asyncRequests'
import { RESTORE_SNAPSHOT } from '../../constants/actions'

// This is not the same as the name in the UI when configuring a snapshot
// repository. That name is used to identify the config in the UI, but when
// it is passed to Elasticsearch then the name below is used.
const repositoryName = `found-snapshots`

export function restoreSnapshot(cluster, snapshotName, payload) {
  return (dispatch) => {
    const regionId = cluster.regionId
    const clusterId = cluster.id

    const elasticsearchPath = `_snapshot/${repositoryName}/${snapshotName}/_restore`
    const url = getEsProxyRequestsUrl({ clusterId, regionId, elasticsearchPath })

    return dispatch(
      asyncRequest({
        type: RESTORE_SNAPSHOT,
        url,
        method: `post`,
        payload,
        meta: { regionId, clusterId },
        crumbs: [regionId, clusterId],
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

export function resetRestoreSnapshot(cluster) {
  return resetAsyncRequest(RESTORE_SNAPSHOT, [cluster.regionId, cluster.id])
}
