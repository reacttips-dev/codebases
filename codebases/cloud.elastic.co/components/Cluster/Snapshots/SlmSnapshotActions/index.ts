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

import SlmSnapshotActions from './SlmSnapshotActions'

import {
  setSnapshotRepository,
  resetSetSnapshotRepositoryRequest,
  disableSnapshotsForCluster,
  resetDisableSnapshotsForClusterRequest,
} from '../../../../actions/clusters'
import { fetchDeployment } from '../../../../actions/stackDeployments'
import { resetExecuteSlmPolicyRequest } from '../../../../actions/snapshots'
import { fetchSnapshotRepositories } from '../../../../actions/snapshotRepositories'

import {
  disableSnapshotsForClusterRequest,
  executeSlmPolicyRequest,
  fetchSnapshotRepositoriesRequest,
  getCluster,
  getSnapshotRepositories,
  setSnapshotRepositoryRequest,
} from '../../../../reducers'

import Feature from '../../../../lib/feature'
import { isFeatureActivated } from '../../../../selectors'

import { RepositoryConfig } from '../../../../lib/api/v1/types'
import {
  AsyncRequestState,
  ElasticsearchCluster,
  ReduxState,
  RegionId,
  StackDeployment,
} from '../../../../types'

type StateProps = {
  deployment: ElasticsearchCluster
  snapshotRepositories?: { [repoId: string]: RepositoryConfig }
  fetchSnapshotRepositoriesRequest: AsyncRequestState
  setSnapshotRepositoryRequest: AsyncRequestState
  disableSnapshotsForClusterRequest: AsyncRequestState
  executeSlmPolicyRequest: AsyncRequestState
  showTakeSnapshotButton: boolean
}

type DispatchProps = {
  resetExecuteSlmPolicyRequest: (regionId: RegionId, deploymentId: string) => void
  setSnapshotRepository: (cluster: ElasticsearchCluster, snapshotRepositoryId: string) => void
  resetSetSnapshotRepositoryRequest: (regionId: RegionId, clusterId: string) => void
  disableSnapshotsForCluster: (cluster: ElasticsearchCluster) => void
  resetDisableSnapshotsForClusterRequest: (regionId: RegionId, clusterId: string) => void
  fetchSnapshotRepositories: (regionId: RegionId) => void
  fetchDeployment: ({ deploymentId: string }) => void
}

type ConsumerProps = {
  deploymentId: string
  stackDeployment: StackDeployment
  regionId: RegionId
  snapshotsEnabled: boolean
  showRestoreSnapshotButton: boolean
  canManageRepos: boolean
}

const mapStateToProps = (
  state: ReduxState,
  { regionId, deploymentId, snapshotsEnabled }: ConsumerProps,
): StateProps => {
  const deployment = getCluster(state, regionId, deploymentId)!

  return {
    deployment,
    showTakeSnapshotButton:
      snapshotsEnabled && isFeatureActivated(state, Feature.showTakeSnapshotButton),
    snapshotRepositories: getSnapshotRepositories(state, regionId),
    fetchSnapshotRepositoriesRequest: fetchSnapshotRepositoriesRequest(state, regionId),
    executeSlmPolicyRequest: executeSlmPolicyRequest(state, deploymentId, regionId),
    setSnapshotRepositoryRequest: setSnapshotRepositoryRequest(state, regionId, deploymentId),
    disableSnapshotsForClusterRequest: disableSnapshotsForClusterRequest(
      state,
      regionId,
      deploymentId,
    ),
  }
}

const mapDispatchToProps: DispatchProps = {
  setSnapshotRepository,
  resetSetSnapshotRepositoryRequest,
  disableSnapshotsForCluster,
  resetDisableSnapshotsForClusterRequest,
  resetExecuteSlmPolicyRequest,
  fetchSnapshotRepositories,
  fetchDeployment,
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(SlmSnapshotActions)
