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

import SnapshotRestoreFlyout from '../SnapshotRestoreFlyout'

import ClusterLockingGate from '../../../ClusterLockingGate'

import { ClusterSnapshot, ElasticsearchCluster } from '../../../../types'

type Props = {
  cluster: ElasticsearchCluster
  snapshot: ClusterSnapshot
  readonly?: boolean
}

const SnapshotTableRowActions: FunctionComponent<Props> = ({ cluster, snapshot, readonly }) => {
  const { state } = snapshot

  const canRestore = state === `PARTIAL` || state === `SUCCESS`

  if (!canRestore || readonly) {
    return null
  }

  const { regionId, id, stackDeploymentId } = cluster
  const deploymentRouteId = stackDeploymentId!
  const snapshotName = snapshot.snapshot

  return (
    <ClusterLockingGate>
      <SnapshotRestoreFlyout
        regionId={regionId}
        clusterId={id}
        deploymentRouteId={deploymentRouteId}
        snapshotName={snapshotName}
      />
    </ClusterLockingGate>
  )
}

export default SnapshotTableRowActions
