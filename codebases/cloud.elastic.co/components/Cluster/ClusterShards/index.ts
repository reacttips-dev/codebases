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

import ClusterShards from './ClusterShards'

import { fetchClusterHealth, fetchShardCounts } from '../../../actions/clusters/fetchRecoveryInfo'

import { getClusterHealth, fetchShardCountsRequest } from '../../../reducers'

import { getFirstEsClusterFromGet } from '../../../lib/stackDeployments'

import schedule from '../../../lib/schedule'

import { AsyncRequestState, ClusterHealth } from '../../../types'
import { DeploymentGetResponse } from '../../../lib/api/v1/types'

type StateProps = {
  clusterHealth?: ClusterHealth | null
  fetchShardCountsRequest: AsyncRequestState
}

type DispatchProps = {
  fetchShardCounts: (deployment: DeploymentGetResponse) => void
  fetchClusterHealth: (deployment: DeploymentGetResponse) => void
}

type ConsumerProps = {
  deployment: DeploymentGetResponse
}

type ConnectedProps = StateProps & DispatchProps & ConsumerProps

const mapStateToProps = (state, { deployment }: ConsumerProps): StateProps => {
  const esCluster = getFirstEsClusterFromGet({ deployment })!
  const { region, id } = esCluster

  return {
    clusterHealth: getClusterHealth(state, region, id),
    fetchShardCountsRequest: fetchShardCountsRequest(state, region, id),
  }
}

const mapDispatchToProps: DispatchProps = {
  fetchShardCounts,
  fetchClusterHealth,
}

const scheduledComponent = schedule(
  ClusterShards,
  ({ fetchClusterHealth, fetchShardCounts, deployment }: ConnectedProps) => {
    fetchClusterHealth(deployment)
    fetchShardCounts(deployment)
  },
  [`id`],
)

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(scheduledComponent)
