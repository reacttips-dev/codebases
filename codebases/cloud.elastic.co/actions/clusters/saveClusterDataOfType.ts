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

import { getClusterMetadataVersion } from '../../reducers/clusters'
import asyncRequest, { resetAsyncRequest } from '../asyncRequests'

import { getLink } from '../../lib/links'
import { Action, ElasticsearchCluster, ThunkAction } from '../../types'
import { RESET_ASYNC_REQUEST } from '../../constants/actions'

interface SaveClusterDataActions {
  save: (cluster: ElasticsearchCluster, data: unknown) => ThunkAction<Promise<any>>
  reset: (...crumbs: string[]) => Action<typeof RESET_ASYNC_REQUEST>
}

export default function saveClusterDataOfType<T extends string>(type: T): SaveClusterDataActions {
  return {
    save(cluster, data) {
      const { regionId, id: clusterId } = cluster

      const version = getClusterMetadataVersion(cluster)
      const url = `${getLink(cluster, `data`)}?version=${version}`

      return asyncRequest({
        type,
        method: `POST`,
        url,
        payload: data,
        meta: { regionId, clusterId },
        crumbs: [regionId, clusterId],
        includeHeaders: true,
      })
    },
    reset(...crumbs) {
      return resetAsyncRequest(type, crumbs)
    },
  }
}
