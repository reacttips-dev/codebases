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

import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  EuiButtonEmpty,
  EuiCheckbox,
  EuiFormHelpText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormLabel,
  EuiLoadingContent,
  EuiSpacer,
} from '@elastic/eui'

import { CuiAlert, CuiPermissibleControl, withErrorBoundary } from '../../../../cui'

import ClusterLockingGate from '../../../ClusterLockingGate'
import SpinButton from '../../../SpinButton'

import HeaderMessage from '../HeaderMessage'
import HealthIssues from '../HealthIssues'
import SearchForMonitoringDeployments from '../SearchForMonitoringDeployments'

import { getVersion, hasEnabledMonitoring } from '../../../../lib/stackDeployments'
import { major, gte } from '../../../../lib/semver'

import { AsyncRequestState, DeploymentStatus, StackDeployment } from '../../../../types'
import Permission from '../../../../lib/api/v1/permissions'
import { DeploymentGetResponse } from '../../../../lib/api/v1/types'

export type Props = {
  cancelEditing: () => void
  deployment: StackDeployment
  isHeroku: boolean
  isEditing: boolean
  monitoringDeployment: DeploymentGetResponse | null
  setDeployment: ({
    selectedDeployment,
  }: {
    selectedDeployment: DeploymentGetResponse | null
  }) => void
  setDeploymentMonitoring: ({
    deploymentFrom,
    deploymentTo,
    logsMonitoring,
    metricsMonitoring,
  }: {
    deploymentFrom: DeploymentGetResponse
    deploymentTo: DeploymentGetResponse | null
    logsMonitoring: boolean
    metricsMonitoring: boolean
  }) => void
  setDeploymentMonitoringRequest: AsyncRequestState
  status: DeploymentStatus
  toggleEdit: () => void
}

type State = {
  enabling: boolean
  clusterMonitoring: boolean
  logsDisabled: boolean
  logsIncompatibleVersion: boolean
  logsMonitoring: boolean
  metricsMonitoring: boolean
  saveInitiated: boolean
  selectedDeployment: DeploymentGetResponse | null
}

class EditMonitoring extends Component<Props, State> {
  state: State = this.getInitialState()

  getInitialState(): State {
    const { deployment, isEditing, monitoringDeployment } = this.props

    const isMonitoring = hasEnabledMonitoring({ deployment })

    const stackVersion = getVersion({ deployment })!
    const logsDisabled = major(stackVersion) < 6

    return {
      enabling: isEditing,
      clusterMonitoring: false,
      logsMonitoring: !logsDisabled,
      metricsMonitoring: true,
      // note: monitoringDeployment may be cached so need to verify with isMonitoring
      selectedDeployment: isMonitoring ? monitoringDeployment : null,
      logsDisabled,
      logsIncompatibleVersion: false,
      saveInitiated: false,
    }
  }

  render() {
    const { isEditing } = this.props

    if (isEditing) {
      return this.renderEnabling()
    }

    return this.renderEnable()
  }

  renderEnable() {
    const { deployment, status, setDeploymentMonitoringRequest } = this.props
    const isStatusPending = status?.status === 'pending' || this.state.saveInitiated

    if (this.state.selectedDeployment && isStatusPending && !setDeploymentMonitoringRequest.error) {
      return (
        <div data-test-id='monitoring-pending-status'>
          <HeaderMessage />

          <EuiSpacer size='s' />

          <EuiLoadingContent lines={3} />
        </div>
      )
    }

    return (
      <div>
        <HealthIssues deployment={deployment} />

        <HeaderMessage />

        <EuiSpacer size='l' />

        <ClusterLockingGate>
          <Fragment>
            <CuiPermissibleControl permissions={Permission.setEsClusterMonitoring}>
              <SpinButton
                size='s'
                disabled={isStatusPending && !setDeploymentMonitoringRequest.error}
                data-test-id='enableMonitoring-btn'
                color='primary'
                spin={false}
                requiresSudo={true}
                onClick={() => this.toggleEnable()}
              >
                <FormattedMessage
                  id='deployment-monitoring-enable.enable'
                  defaultMessage='Enable'
                />
              </SpinButton>
            </CuiPermissibleControl>
          </Fragment>
        </ClusterLockingGate>

        {this.renderErrorMessage()}
      </div>
    )
  }

  renderErrorMessage() {
    const { setDeploymentMonitoringRequest } = this.props

    if (setDeploymentMonitoringRequest.error) {
      return (
        <Fragment>
          <EuiSpacer size='m' />
          <CuiAlert data-test-id='setDeploymentMonitoringRequest' type='error'>
            {setDeploymentMonitoringRequest.error}
          </CuiAlert>
        </Fragment>
      )
    }

    return null
  }

  renderEnabling() {
    const { deployment, setDeploymentMonitoringRequest } = this.props
    const { selectedDeployment, logsMonitoring, metricsMonitoring } = this.state
    const checkObervabilityOptions = logsMonitoring || metricsMonitoring

    return (
      <div>
        <HealthIssues deployment={deployment} />

        <HeaderMessage />

        <EuiSpacer size='l' />

        <EuiFlexGroup gutterSize='s' justifyContent='flexStart' alignItems='flexStart'>
          <EuiFlexItem grow={false} style={{ minWidth: 300 }}>
            {this.renderContent()}

            <EuiSpacer size='m' />
            <EuiFlexGroup gutterSize='s'>
              <EuiFlexItem grow={false}>
                <SpinButton
                  className='monitoring-buttons'
                  fill={true}
                  requiresSudo={true}
                  color='primary'
                  size='s'
                  data-test-id='enableMonitoring-save'
                  disabled={
                    selectedDeployment == null ||
                    !checkObervabilityOptions ||
                    (setDeploymentMonitoringRequest.inProgress &&
                      !setDeploymentMonitoringRequest.isDone)
                  }
                  onClick={this.enableMonitoring}
                  spin={
                    setDeploymentMonitoringRequest.inProgress &&
                    !setDeploymentMonitoringRequest.isDone
                  }
                >
                  <FormattedMessage id='deployment-monitoring-enable.save' defaultMessage='Save' />
                </SpinButton>
              </EuiFlexItem>

              <EuiFlexItem grow={false}>
                <EuiButtonEmpty
                  size='s'
                  className='monitoring-buttons cancel-button'
                  onClick={this.reset}
                >
                  <FormattedMessage
                    id='deployment-monitoring-enable.discard-changes'
                    defaultMessage='Discard changes'
                  />
                </EuiButtonEmpty>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>

        {this.renderErrorMessage()}
      </div>
    )
  }

  renderContent() {
    const { deployment } = this.props
    const { selectedDeployment } = this.state

    return (
      <EuiFlexGroup direction='column' gutterSize='m' alignItems='flexStart'>
        <EuiFlexItem>
          <div>
            <EuiFormLabel>
              <FormattedMessage
                id='deployment-monitoring-enable.ship-data-to'
                defaultMessage='Ship data to'
              />
            </EuiFormLabel>

            <EuiSpacer size='s' />

            <div data-test-id='log-monitoring'>
              <SearchForMonitoringDeployments
                data-test-id='enable-monitoring-search'
                searchId='search-monitoring-deployments'
                deployment={deployment}
                selectedDeployment={selectedDeployment}
                onChange={this.selectDeployment}
                onlyAlreadyMonitoring={false}
                noneAlreadyMonitoring={false}
              />
            </div>
          </div>
        </EuiFlexItem>
        <EuiFlexItem>
          <div>{this.renderMonitoringOptions()}</div>
        </EuiFlexItem>
      </EuiFlexGroup>
    )
  }

  renderMonitoringOptions() {
    return (
      <Fragment>
        <EuiSpacer size='s' />

        <EuiFormLabel>
          <FormattedMessage
            id='deployment-monitoring-enable.data-being-shipped'
            defaultMessage='Data being shipped'
          />
        </EuiFormLabel>

        <EuiSpacer size='s' />

        <EuiCheckbox
          id='logs-monitoring-option'
          label='Logs'
          data-test-id='checkbox-logs-monitoring'
          onChange={() => this.toggleLogsMonitoring()}
          checked={this.state.logsMonitoring}
          disabled={this.state.logsDisabled}
        />

        {this.renderLogsVersionMessage()}

        <EuiCheckbox
          id='metrics-monitoring-option'
          label='Metrics'
          data-test-id='checkbox-metrics-monitoring'
          onChange={() => this.toggleMetricsMonitoring()}
          checked={this.state.metricsMonitoring}
        />
      </Fragment>
    )
  }

  renderLogsVersionMessage() {
    if (!this.state.logsIncompatibleVersion) {
      return null
    }

    return (
      <Fragment>
        <EuiFormHelpText>
          <FormattedMessage
            id='deployment-monitoring-enable.deployment-version-warning'
            defaultMessage='Deployment must be at version 6.5.0 or later to send logs'
          />
        </EuiFormHelpText>
        <EuiSpacer size='m' />
      </Fragment>
    )
  }

  toggleEnable = () => {
    this.props.toggleEdit()
    this.setState({ enabling: true })
  }

  reset = () => {
    if (this.props.isEditing) {
      this.setState({ enabling: false, selectedDeployment: null })
      this.props.cancelEditing()
    }
  }

  selectDeployment = (selectedDeployment: StackDeployment | null) => {
    const checkLogsDisabled = this.checkVersion(selectedDeployment)
    const logsMonitoringStatus = checkLogsDisabled ? false : this.state.logsMonitoring

    this.setState({
      selectedDeployment,
      logsDisabled: checkLogsDisabled,
      logsMonitoring: logsMonitoringStatus,
      logsIncompatibleVersion: checkLogsDisabled,
    })
  }

  checkVersion = (selectedDeployment: StackDeployment | null): boolean => {
    if (selectedDeployment === null) {
      return false
    }

    const searchVersion = getVersion({ deployment: selectedDeployment })!

    if (searchVersion === null) {
      return false
    }

    if (gte(searchVersion, `6.5.0`)) {
      return false
    }

    return true
  }

  setSelectedDeployment = ({ monitoringDeployment }) => {
    this.setState({
      selectedDeployment: monitoringDeployment,
    })
  }

  toggleLogsMonitoring = () => {
    this.setState({
      logsMonitoring: !this.state.logsMonitoring,
    })
  }

  toggleMetricsMonitoring = () => {
    this.setState({
      metricsMonitoring: !this.state.metricsMonitoring,
    })
  }

  enableMonitoring = () => {
    const { selectedDeployment, logsMonitoring, metricsMonitoring } = this.state
    const { deployment, setDeploymentMonitoring, toggleEdit, setDeployment } = this.props

    setDeploymentMonitoring({
      deploymentFrom: deployment,
      deploymentTo: selectedDeployment,
      logsMonitoring,
      metricsMonitoring,
    })

    toggleEdit()
    setDeployment({ selectedDeployment })

    this.setState({
      saveInitiated: true,
    })
  }
}

export default withErrorBoundary(EditMonitoring)
