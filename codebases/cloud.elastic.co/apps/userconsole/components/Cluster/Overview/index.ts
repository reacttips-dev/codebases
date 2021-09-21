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

import Overview from './Overview'

import { fetchKibana } from '../../../../../actions/kibana'

import { getCluster, getKibana, getStackDeployment } from '../../../../../reducers'

import { isFeatureActivated } from '../../../../../selectors'

import {
  withStackDeploymentRouteParams,
  WithStackDeploymentRouteParamsProps,
} from '../../../../../components/StackDeploymentEditor'

import Feature from '../../../../../lib/feature'

import { ElasticsearchCluster, KibanaCluster } from '../../../../../types'
import { DeploymentGetResponse } from '../../../../../lib/api/v1/types'

type StateProps = {
  deployment: DeploymentGetResponse
  cluster: ElasticsearchCluster
  kibana?: KibanaCluster | null
  saasClusterMetrics: boolean
  showNativeMemoryPressure: boolean
}

type DispatchProps = {
  fetchKibana: (regionId: string, kibanaId: string, esConvertedToDnt?: boolean) => void
}

type ConsumerProps = WithStackDeploymentRouteParamsProps & unknown

const mapStateToProps = (
  state,
  { regionId, deploymentId, stackDeploymentId }: ConsumerProps,
): StateProps => {
  const deployment = getStackDeployment(state, stackDeploymentId)!
  const cluster = getCluster(state, regionId, deploymentId!)!

  return {
    deployment,
    cluster,
    kibana: getKibana(state, regionId, cluster.kibana.id!),
    saasClusterMetrics: isFeatureActivated(state, Feature.saasClusterMetrics),
    showNativeMemoryPressure: isFeatureActivated(state, Feature.showNativeMemoryPressure),
  }
}

const mapDispatchToProps: DispatchProps = {
  fetchKibana,
}

export default withStackDeploymentRouteParams(
  connect<StateProps, DispatchProps, ConsumerProps>(
    mapStateToProps,
    mapDispatchToProps,
  )(withTransaction(`Elasticsearch overview`, `component`)(Overview)),
)
