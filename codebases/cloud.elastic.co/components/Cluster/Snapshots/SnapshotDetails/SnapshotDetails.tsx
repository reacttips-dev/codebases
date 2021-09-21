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

import React, { FunctionComponent } from 'react'

import SnapshotDetailsList from './SnapshotDetailsList'

import RestoreSnapshot from '../../../RestoreSnapshot'
import ClusterLockingGate from '../../../ClusterLockingGate'

import {
  ClusterSnapshot,
  ClusterSnapshotStatus,
  AsyncRequestState,
  ElasticsearchCluster,
} from '../../../../types'

type Props = {
  cluster: ElasticsearchCluster
  restore: { success: boolean; raw: any } | null
  isInProgress: boolean
  snapshot: ClusterSnapshot | null
  snapshotStatus: ClusterSnapshotStatus | null
  fetchSnapshots: (cluster: ElasticsearchCluster) => void
  fetchSnapshotsRequest: AsyncRequestState
  restoreSnapshotRequest: AsyncRequestState
  restoreSnapshot: (cluster: ElasticsearchCluster, snapshotName: string, payload: unknown) => void
  resetRestoreSnapshot: (cluster: ElasticsearchCluster) => void
}

const SnapshotDetails: FunctionComponent<Props> = ({
  cluster,
  restore,
  snapshot,
  snapshotStatus,
  fetchSnapshots,
  fetchSnapshotsRequest,
  restoreSnapshotRequest,
  restoreSnapshot,
  resetRestoreSnapshot,
  isInProgress,
}) => (
  <div>
    <SnapshotDetailsList
      cluster={cluster}
      fetchSnapshots={fetchSnapshots}
      fetchSnapshotsRequest={fetchSnapshotsRequest}
      snapshot={snapshot}
      snapshotStatus={snapshotStatus}
      isInProgress={isInProgress}
    />

    <ClusterLockingGate>
      <RestoreSnapshot
        snapshot={snapshot != null}
        restore={restore}
        restoreSnapshotRequest={restoreSnapshotRequest}
        restoreSnapshot={(payload: unknown) =>
          restoreSnapshot(cluster, snapshot!.snapshot, payload)
        }
        resetRestoreSnapshot={() => resetRestoreSnapshot(cluster)}
      />
    </ClusterLockingGate>
  </div>
)

export default SnapshotDetails
