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

import SnapshotRestoreFlyout from './SnapshotRestoreFlyout'

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

import { isFeatureActivated } from '../../../../selectors'

import { SAD_hasUnexpiredSudo } from '../../../../lib/auth'

import Feature from '../../../../lib/feature'
import { ReduxState } from '../../../../types'

const terminalSnapshotStates = [`ABORTED`, `SUCCESS`, `FAILED`, `PARTIAL`]

const mapStateToProps = (state: ReduxState, { regionId, clusterId, snapshotName }) => {
  const cluster = getCluster(state, regionId, clusterId)
  const snapshot = getClusterSnapshotByName(state, regionId, clusterId, snapshotName)
  const snapshotStatus = getSnapshotStatus(state, regionId, clusterId, snapshotName)
  const isInProgress = snapshotStatus && !terminalSnapshotStates.includes(snapshotStatus.state)

  return {
    cluster,
    snapshotName,
    snapshot,
    snapshotStatus,
    restore: getSnapshotRestore(state, regionId, clusterId),
    restoreSnapshotRequest: restoreSnapshotRequest(state, regionId, clusterId),
    fetchSnapshotsRequest: fetchSnapshotsRequest(state, regionId, clusterId),
    shouldRefresh:
      (!isFeatureActivated(state, Feature.sudo) || SAD_hasUnexpiredSudo()) &&
      (!snapshotStatus || isInProgress),
    isInProgress,
  }
}

const mapDispatchToProps = (dispatch, { regionId, clusterId, snapshotName }) => ({
  fetchSnapshots: (...rest) => dispatch(fetchSnapshots(...rest)),
  fetchSnapshotStatus: (...rest) => dispatch(fetchSnapshotStatus(...rest)),
  restoreSnapshot: (payload) =>
    dispatch(restoreSnapshot({ regionId, id: clusterId }, snapshotName, payload)),
  resetRestoreSnapshot: () => dispatch(resetRestoreSnapshot({ regionId, id: clusterId })),
})

export default connect(mapStateToProps, mapDispatchToProps)(SnapshotRestoreFlyout)
