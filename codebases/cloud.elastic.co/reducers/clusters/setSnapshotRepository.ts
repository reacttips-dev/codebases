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

import { get } from 'lodash'

import { dataPaths } from '../../config/clusterPaths'
import { ElasticsearchCluster } from '../../types'
import { SetSnapshotRepositoryAction } from './clusterTypes'

export default function setSnapshotRepository(
  cluster: ElasticsearchCluster,
  action: SetSnapshotRepositoryAction,
): ElasticsearchCluster {
  const pathForConfig = [`payload`].concat(dataPaths.snapshot)
  const pathForId = [`payload`].concat(dataPaths.snapshotRepository).concat(`repository_id`)
  const snapshotConfig = get(action, pathForConfig)
  const snapshotId = get(action, pathForId)

  return {
    ...cluster,
    snapshots: {
      ...cluster.snapshots,
      snapshotRepositoryId: snapshotId,
      enabled: true,
      status: cluster.snapshots.status
        ? cluster.snapshots.status
        : {
            currentStatusHealthy: true,
            pendingInitialSnapshot: true,
            totalCount: 0,

            // A first snapshot is scheduled immediately. We'll get an accurate value
            // when the cluster data next refreshes.
            nextSnapshotAt: new Date().toISOString(),
            latestSuccessAt: null,
            hasRecentEnoughSuccess: false,
          },
      latest: {
        state: null,
        success: false,
        time: null,
      },
    },
    _raw: {
      ...cluster._raw,
      data: {
        ...cluster._raw.data,
        raw: {
          ...cluster._raw.data.raw,
          snapshot: snapshotConfig,
        },
      },
    },
  }
}
