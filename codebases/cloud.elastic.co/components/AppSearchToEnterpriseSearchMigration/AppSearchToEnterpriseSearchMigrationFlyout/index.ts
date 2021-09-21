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

import AppSearchToEnterpriseSearchMigrationFlyout from './AppSearchToEnterpriseSearchMigrationFlyout'

import {
  fetchAppSearchReadOnlyMode,
  setAppSearchReadOnlyMode,
  watchAppSearchMigrationSnapshot,
  stopAppSearchToEnterpriseSearchMigration,
} from '../../../actions/appSearchToEnterpriseSearchMigration'
import {
  fetchSnapshotStatus,
  resetExecuteSlmPolicyRequest,
  resetTakeSnapshotRequest,
} from '../../../actions/snapshots/'

import {
  getAppSearchToEnterpriseSearchMigrationProgress,
  executeSlmPolicyRequest,
  takeSnapshotRequest,
  getSnapshotStatus,
} from '../../../reducers'
import { getFirstEsClusterFromGet, hasSlm } from '../../../lib/stackDeployments'

import { ReduxState, ThunkDispatch } from '../../../types'
import { StateProps, DispatchProps, ConsumerProps } from './types'
import withPolling from '../../../lib/withPolling'

const mapStateToProps: (state: ReduxState, consumerProps: ConsumerProps) => StateProps = (
  state,
  { deployment },
) => {
  const esResource = getFirstEsClusterFromGet({ deployment })!
  const { region: regionId, id: clusterId } = esResource
  const useSlm = hasSlm({ resource: esResource })

  const progress = deployment.id
    ? getAppSearchToEnterpriseSearchMigrationProgress(state, deployment.id)
    : undefined

  return {
    progress: deployment.id
      ? getAppSearchToEnterpriseSearchMigrationProgress(state, deployment.id)
      : undefined,
    takeSnapshotRequest: useSlm
      ? executeSlmPolicyRequest(state, clusterId, regionId)
      : takeSnapshotRequest(state, regionId, clusterId),
    snapshotStatus: progress?.snapshotToWatch
      ? getSnapshotStatus(state, regionId, clusterId, progress.snapshotToWatch)
      : undefined,
  }
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch,
  { deployment }: ConsumerProps,
): DispatchProps => {
  const esResource = getFirstEsClusterFromGet({ deployment })!
  const { region: regionId, id: clusterId } = esResource
  const useSlm = hasSlm({ resource: esResource })

  return {
    fetchAppSearchReadOnlyMode: (args) => dispatch(fetchAppSearchReadOnlyMode(args)),
    setAppSearchReadOnlyMode: (args) => dispatch(setAppSearchReadOnlyMode(args)),
    watchAppSearchMigrationSnapshot: (args) => dispatch(watchAppSearchMigrationSnapshot(args)),
    fetchSnapshotStatus: (cluster, snapshotName) =>
      dispatch(fetchSnapshotStatus(cluster, snapshotName)),
    stopAppSearchToEnterpriseSearchMigration: (args) =>
      dispatch(stopAppSearchToEnterpriseSearchMigration(args)),
    resetTakeSnapshotRequest: () =>
      dispatch(
        useSlm
          ? resetExecuteSlmPolicyRequest(clusterId, regionId)
          : resetTakeSnapshotRequest(regionId, clusterId),
      ),
  }
}

const pollingComponent = withPolling(
  AppSearchToEnterpriseSearchMigrationFlyout,
  ({ fetchSnapshotStatus, deployment, progress }) => ({
    onPoll: () => {
      if (progress?.snapshotToWatch) {
        const esResource = getFirstEsClusterFromGet({ deployment })!
        return fetchSnapshotStatus(
          { regionId: esResource.region, id: esResource.id },
          progress.snapshotToWatch,
        )
      }

      return Promise.resolve()
    },
    pollImmediately: [[`progress`, `snapshotToWatch`]],
    interval: 10,
  }),
)

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(pollingComponent)
