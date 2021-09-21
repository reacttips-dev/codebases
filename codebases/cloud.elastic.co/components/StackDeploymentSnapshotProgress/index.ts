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
import { find } from 'lodash'

import DeploymentSnapshotProgress from './DeploymentSnapshotProgress'

import { fetchSnapshots } from '../../actions/snapshots'

import { fetchSnapshotsRequest, getClusterSnapshots } from '../../reducers'

import { getFirstEsClusterFromGet } from '../../lib/stackDeployments'

import { StackDeployment, AsyncRequestState, ClusterSnapshot } from '../../types'

type StateProps = {
  fetchSnapshotsRequest: AsyncRequestState
  snapshot: ClusterSnapshot | null
}

type DispatchProps = {
  fetchSnapshots: () => void
}

type ConsumerProps = {
  deployment: StackDeployment
}

const mapStateToProps = (state, { deployment }: ConsumerProps): StateProps => {
  const esCluster = getFirstEsClusterFromGet({ deployment })!
  const { region, id } = esCluster
  const snapshots = getClusterSnapshots(state, region, id)
  const snapshot = find<ClusterSnapshot>(snapshots, { state: `IN_PROGRESS` }) || null

  return {
    fetchSnapshotsRequest: fetchSnapshotsRequest(state),
    snapshot,
  }
}

const mapDispatchToProps = (dispatch, { deployment }: ConsumerProps): DispatchProps => {
  const esCluster = getFirstEsClusterFromGet({ deployment })!
  const { region, id } = esCluster
  const cluster = { regionId: region, id }
  return {
    fetchSnapshots: () => dispatch(fetchSnapshots(cluster)),
  }
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(DeploymentSnapshotProgress)
