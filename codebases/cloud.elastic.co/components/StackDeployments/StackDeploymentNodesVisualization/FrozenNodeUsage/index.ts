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

import FrozenNodeUsage from './FrozenNodeUsage'

import { getFirstEsClusterFromGet } from '../../../../lib/stackDeployments'
import { getNodeStats } from '../../../../reducers'

import { StackDeployment, NodeStats } from '../../../../types'

import { ClusterInstanceInfo } from '../../../../lib/api/v1/types'

type StateProps = {
  nodeStats: NodeStats | undefined
}
interface DispatchProps {}

type ConsumerProps = {
  deployment: StackDeployment
  instance: ClusterInstanceInfo
}

const mapStateToProps = (state: any, { deployment, instance }: ConsumerProps): StateProps => {
  const esCluster = getFirstEsClusterFromGet({ deployment })!
  const { region, id } = esCluster

  return {
    nodeStats: instance.service_id
      ? getNodeStats(state, region, id, instance.service_id)
      : undefined,
  }
}

const mapDispatchToProps = (): DispatchProps => ({})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(FrozenNodeUsage)
