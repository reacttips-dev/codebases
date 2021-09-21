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

import ShardDataMigrationTable from './ShardDataMigrationTable'

import { fetchRecoveryInfo, fetchClusterHealth } from '../../actions/clusters'

import {
  getFetchRecoveryInfoRequest,
  getClusterRecoveryInfo,
  getClusterHealth,
} from '../../reducers'

import { getFirstEsClusterFromGet } from '../../lib/stackDeployments'

import { AsyncRequestState, StackDeployment } from '../../types'
import { ClusterHealth, RecoveryInfo } from '../../reducers/clusters/clusterTypes'

type StateProps = {
  recoveryInfoRequest: AsyncRequestState
  recoveryInfo?: RecoveryInfo[] | null
  clusterHealth?: ClusterHealth | null
}

type DispatchProps = {
  fetchRecoveryInfo: () => Promise<any>
  fetchClusterHealth: () => Promise<any>
}

type ConsumerProps = {
  deployment: StackDeployment
}

const mapStateToProps = (state, { deployment }: ConsumerProps): StateProps => {
  const esCluster = getFirstEsClusterFromGet({ deployment })!
  const { region, id } = esCluster

  return {
    recoveryInfoRequest: getFetchRecoveryInfoRequest(state, region, id),
    recoveryInfo: getClusterRecoveryInfo(state, region, id),
    clusterHealth: getClusterHealth(state, region, id),
  }
}

const mapDispatchToProps = (dispatch, { deployment }): DispatchProps => ({
  fetchRecoveryInfo: () => dispatch(fetchRecoveryInfo(deployment)),
  fetchClusterHealth: () => dispatch(fetchClusterHealth(deployment)),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(ShardDataMigrationTable)
