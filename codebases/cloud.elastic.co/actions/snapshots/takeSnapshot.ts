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

import { ThunkAction } from '../../types'
import asyncRequest, { resetAsyncRequest } from '../asyncRequests'
import { snapshotEsClusterUrl } from '../../lib/api/v1/urls'

import { TAKE_SNAPSHOT } from '../../constants/actions'
import { ElasticsearchResourceInfo } from '../../lib/api/v1/types'

export function takeSnapshot(resource: ElasticsearchResourceInfo): ThunkAction {
  const { region: regionId, id: clusterId } = resource
  const url = snapshotEsClusterUrl({ clusterId, regionId })

  return (dispatch) => {
    const req = dispatch(
      asyncRequest({
        type: TAKE_SNAPSHOT,
        method: `POST`,
        url,
        payload: {},
        meta: { regionId, clusterId },
        crumbs: [regionId, clusterId],
      }),
    )

    return req
  }
}

export function resetTakeSnapshotRequest(...crumbs) {
  return resetAsyncRequest(TAKE_SNAPSHOT, crumbs)
}
