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

import { connect } from 'react-redux'

import { withTransaction } from '@elastic/apm-rum-react'

import SnapshotDetails from './SnapshotDetails'

import {
  fetchSnapshots,
  fetchSnapshotStatus,
  restoreSnapshot,
  resetRestoreSnapshot,
} from '../../../../actions/snapshots'

import {
  fetchSnapshotsRequest,
  getCluster,
  getClusterSnapshotByName,
  getSnapshotRestore,
  getSnapshotStatus,
  restoreSnapshotRequest,
} from '../../../../reducers'

import schedule from '../../../../lib/schedule'

import { isFeatureActivated } from '../../../../selectors'

import { SAD_hasUnexpiredSudo } from '../../../../lib/auth'

import { withStackDeploymentRouteParams } from '../../../StackDeploymentEditor'

import Feature from '../../../../lib/feature'

const terminalSnapshotStates = [`ABORTED`, `SUCCESS`, `FAILED`, `PARTIAL`]

const mapStateToProps = (
  state,
  {
    regionId,
    deploymentId,
    match: {
      params: { snapshotName },
    },
  },
) => {
  const cluster = getCluster(state, regionId, deploymentId)
  const snapshotStatus = getSnapshotStatus(state, regionId, deploymentId, snapshotName)
  const isInProgress = snapshotStatus && !terminalSnapshotStates.includes(snapshotStatus.state)

  return {
    cluster,
    snapshotName,
    snapshot: getClusterSnapshotByName(state, regionId, deploymentId, snapshotName),
    snapshotStatus,
    restore: getSnapshotRestore(state, regionId, deploymentId),
    fetchSnapshotsRequest: fetchSnapshotsRequest(state, regionId, deploymentId),
    restoreSnapshotRequest: restoreSnapshotRequest(state, regionId, deploymentId),
    shouldRefresh:
      (!isFeatureActivated(state, Feature.sudo) || SAD_hasUnexpiredSudo()) &&
      (!snapshotStatus || isInProgress),
    isInProgress,
  }
}

const mapDispatchToProps = {
  fetchSnapshots,
  fetchSnapshotStatus,
  restoreSnapshot,
  resetRestoreSnapshot,
}

const scheduledComponent = schedule(
  SnapshotDetails,
  ({ cluster, fetchSnapshotStatus: refreshSnapshot, snapshotName, shouldRefresh }) => {
    if (shouldRefresh) {
      refreshSnapshot(cluster, snapshotName)
    }
  },
  [`canRefresh`, [`snapshotStatus`, `state`]],
)

export default withStackDeploymentRouteParams(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(withTransaction(`Elasticsearch snapshot details`, `component`)(scheduledComponent)),
)
