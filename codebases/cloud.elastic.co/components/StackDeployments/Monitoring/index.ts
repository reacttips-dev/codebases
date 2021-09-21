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

import Monitoring from './Monitoring'

import {
  setDeploymentMonitoring,
  stopDeploymentMonitoring,
  resetStopDeploymentMonitoringRequest,
  resetSetDeploymentMonitoringRequest,
  searchDeployments,
} from '../../../actions/stackDeployments'

import {
  getCluster,
  setDeploymentMonitoringRequest,
  stopDeploymentMonitoringRequest,
  getStackDeploymentsFromSearch,
  searchStackDeploymentsRequest,
} from '../../../reducers'

import { AsyncRequestState, StackDeployment } from '../../../types'
import { DeploymentsSearchResponse, SearchRequest } from '../../../lib/api/v1/types'

type StateProps = {
  stopDeploymentMonitoringRequest: AsyncRequestState
  setDeploymentMonitoringRequest: AsyncRequestState
  monitoringDeploymentResult: DeploymentsSearchResponse | null
  monitoringDeploymentRequest: AsyncRequestState
}

type DispatchProps = {
  resetStopDeploymentMonitoringRequest: (deploymentId: string) => void
  resetSetDeploymentMonitoringRequest: (deploymentId: string) => void
  stopDeploymentMonitoring: (deploymentId: string) => void
  setDeploymentMonitoring: ({
    deploymentFrom,
    deploymentTo,
    logsMonitoring,
    metricsMonitoring,
  }: {
    deploymentFrom: StackDeployment
    deploymentTo: StackDeployment
    logsMonitoring: boolean
    metricsMonitoring: boolean
  }) => void
  searchMonitoringDeployment: (query: SearchRequest) => void
}

type ConsumerProps = {
  regionId: string
  clusterId: string
  deploymentId: string
}

const mapStateToProps = (state, { regionId, clusterId, deploymentId }: ConsumerProps) => ({
  cluster: getCluster(state, regionId, clusterId),
  stopDeploymentMonitoringRequest: stopDeploymentMonitoringRequest(state, deploymentId),
  setDeploymentMonitoringRequest: setDeploymentMonitoringRequest(state, deploymentId),
  monitoringDeploymentResult: getStackDeploymentsFromSearch(state, `monitoringDeployment`),
  monitoringDeploymentRequest: searchStackDeploymentsRequest(state, `monitoringDeployment`),
})

const mapDispatchToProps = (dispatch, { deploymentId }: ConsumerProps): DispatchProps => ({
  resetStopDeploymentMonitoringRequest: () =>
    dispatch(resetStopDeploymentMonitoringRequest(deploymentId)),
  resetSetDeploymentMonitoringRequest: () =>
    dispatch(resetSetDeploymentMonitoringRequest(deploymentId)),
  setDeploymentMonitoring: (settings) => dispatch(setDeploymentMonitoring(settings)),
  stopDeploymentMonitoring: () => dispatch(stopDeploymentMonitoring(deploymentId)),
  searchMonitoringDeployment: (query: SearchRequest) =>
    dispatch(searchDeployments({ queryId: `monitoringDeployment`, query })),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Monitoring)
