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

import ClusterConsole from './ClusterConsole'

import { clearClusterProxyResponse } from '../../actions/clusterProxy'

import {
  clearClusterConsoleHistory,
  queryClusterProxyForConsole,
  setClusterConsoleRequest,
} from '../../actions/clusterConsole'

import {
  getCluster,
  getClusterProxyRequest,
  getClusterProxyRequestHistory,
  getClusterProxyResponse,
  queryClusterProxyRequest,
} from '../../reducers'

import {
  withStackDeploymentRouteParams,
  WithStackDeploymentRouteParamsProps,
} from '../StackDeploymentEditor'

import { ConsoleRequestState } from '../../reducers/clusterConsole'
import { AsyncRequestState, ElasticsearchCluster, EsProxyResponseConsole } from '../../types'

type StateProps = {
  cluster?: ElasticsearchCluster | null
  consoleRequest?: ConsoleRequestState | null
  consoleRequestHistory: ConsoleRequestState[]
  consoleResponse: EsProxyResponseConsole | null
  queryClusterProxyRequest: AsyncRequestState
}

type DispatchProps = {
  clearClusterConsoleHistory: () => void
  clearClusterProxyResponse: (regionId: string, clusterId: string) => void
  queryClusterProxyForConsole: (
    cluster: ElasticsearchCluster,
    consoleRequest: ConsoleRequestState,
  ) => void
  setClusterConsoleRequest: (request: ConsoleRequestState, cluster: ElasticsearchCluster) => void
}

type ConsumerProps = WithStackDeploymentRouteParamsProps

const mapStateToProps = (state, { regionId, deploymentId }: ConsumerProps): StateProps => ({
  cluster: getCluster(state, regionId, deploymentId!),
  consoleRequest: getClusterProxyRequest(state, regionId, deploymentId!),
  consoleRequestHistory: getClusterProxyRequestHistory(state),
  consoleResponse: getClusterProxyResponse(state, regionId, deploymentId!),
  queryClusterProxyRequest: queryClusterProxyRequest(state, regionId, deploymentId),
})

const mapDispatchToProps: DispatchProps = {
  clearClusterConsoleHistory,
  clearClusterProxyResponse,
  queryClusterProxyForConsole,
  setClusterConsoleRequest,
}

export default withStackDeploymentRouteParams(
  connect<StateProps, DispatchProps, ConsumerProps>(
    mapStateToProps,
    mapDispatchToProps,
  )(withTransaction(`Elasticsearch console`, `component`)(ClusterConsole)),
)
