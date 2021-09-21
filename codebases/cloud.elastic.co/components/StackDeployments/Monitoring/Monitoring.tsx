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

import React, { Component, FunctionComponent } from 'react'

import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui'
import { withErrorBoundary } from '../../../cui'

import EditMonitoring from './EditMonitoring'
import MonitoringDetails from './MonitoringDetails'

import { AsyncRequestState, StackDeployment } from '../../../types'
import {
  DeploymentGetResponse,
  DeploymentSearchResponse,
  DeploymentsSearchResponse,
  SearchRequest,
} from '../../../lib/api/v1/types'

import { getDeploymentStatus } from '../../../lib/stackDeployments/status'
import { getFirstSliderClusterFromGet } from '../../../lib/stackDeployments'

export type Props = {
  deployment: StackDeployment
  stopDeploymentMonitoring: (deploymentId: string) => void
  stopDeploymentMonitoringRequest: AsyncRequestState
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
  setDeploymentMonitoringRequest: AsyncRequestState
  monitoringDeploymentResult: DeploymentsSearchResponse | null
  monitoringDeploymentRequest: AsyncRequestState
}

type State = {
  isEditing: boolean
  selectedDeployment: DeploymentGetResponse | null
}

const MonitoringPanel: FunctionComponent = ({ children }) => (
  <EuiFlexGroup gutterSize='xl' direction='column'>
    <EuiFlexItem>{children}</EuiFlexItem>
  </EuiFlexGroup>
)

class Monitoring extends Component<Props, State> {
  state: State = {
    isEditing: false,
    selectedDeployment: null,
  }

  render() {
    const {
      deployment,
      setDeploymentMonitoringRequest,
      searchMonitoringDeployment,
      monitoringDeploymentResult,
      monitoringDeploymentRequest,
      stopDeploymentMonitoring,
      stopDeploymentMonitoringRequest,
    } = this.props

    const { isEditing, selectedDeployment } = this.state

    const cluster = getFirstSliderClusterFromGet({
      deployment,
      sliderInstanceType: `elasticsearch`,
    })

    if (!cluster) {
      return null
    }

    const status = getDeploymentStatus({ deployment })

    if (status.status === 'stopped') {
      return null
    }

    const { settings } = deployment
    const isMonitoring = settings?.observability?.metrics || settings?.observability?.logging
    const monitoringDeployment = this.getMonitoringDeployment({ monitoringDeploymentResult })

    if (!isMonitoring || isEditing) {
      return (
        <MonitoringPanel>
          <EditMonitoring
            cancelEditing={this.toggleEdit}
            deployment={deployment}
            isEditing={isEditing}
            monitoringDeployment={monitoringDeployment}
            setDeployment={this.setDeployment}
            status={status}
            toggleEdit={this.toggleEdit}
          />
        </MonitoringPanel>
      )
    }

    return (
      <MonitoringPanel>
        <MonitoringDetails
          deployment={deployment}
          monitoringDeploymentResult={monitoringDeploymentResult}
          monitoringDeploymentRequest={monitoringDeploymentRequest}
          searchMonitoringDeployment={searchMonitoringDeployment}
          selectedDeployment={selectedDeployment}
          setDeploymentMonitoringRequest={setDeploymentMonitoringRequest}
          status={status}
          stopDeploymentMonitoring={stopDeploymentMonitoring}
          stopDeploymentMonitoringRequest={stopDeploymentMonitoringRequest}
          toggleEdit={this.toggleEdit}
        />
      </MonitoringPanel>
    )
  }

  setDeployment = ({ selectedDeployment }) => {
    this.setState({
      selectedDeployment,
    })
  }

  toggleEdit = () => {
    this.setState({
      isEditing: !this.state.isEditing,
    })
  }

  getMonitoringDeployment = ({
    monitoringDeploymentResult,
  }: {
    monitoringDeploymentResult: DeploymentsSearchResponse | null
  }): DeploymentSearchResponse | null => {
    if (!monitoringDeploymentResult) {
      return null
    }

    if (monitoringDeploymentResult.deployments.length < 1) {
      return null
    }

    if (monitoringDeploymentResult.deployments.length === 1) {
      return monitoringDeploymentResult.deployments[0]
    }

    return null
  }
}

export default withErrorBoundary(Monitoring)
