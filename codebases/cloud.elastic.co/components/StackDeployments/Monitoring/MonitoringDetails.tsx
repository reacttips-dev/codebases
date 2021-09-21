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
  EuiButton,
  EuiCallOut,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormLabel,
  EuiIcon,
  EuiIconTip,
  EuiLink,
  EuiLoadingContent,
  EuiSpacer,
  EuiText,
} from '@elastic/eui'

import {
  CuiAlert,
  CuiDeploymentName,
  CuiTable,
  CuiTableColumn,
  withErrorBoundary,
} from '../../../cui'

import HeaderMessage from './HeaderMessage'
import HealthIssues from './HealthIssues'
import DangerButton from '../../DangerButton'

import { AsyncRequestState, DeploymentStatus, StackDeployment } from '../../../types'
import {
  DeploymentGetResponse,
  DeploymentSearchResponse,
  DeploymentsSearchResponse,
  SearchRequest,
} from '../../../lib/api/v1/types'
import { getFirstEsRefId } from '../../../lib/stackDeployments'

import { getDeploymentByIdQuery } from '../../../lib/deploymentQuery'

export type Props = {
  deployment: StackDeployment
  searchMonitoringDeployment: (query: SearchRequest) => void
  monitoringDeploymentResult: DeploymentsSearchResponse | null
  monitoringDeploymentRequest: AsyncRequestState
  setDeploymentMonitoringRequest: AsyncRequestState
  stopDeploymentMonitoring: (deploymentId: string) => void
  stopDeploymentMonitoringRequest: AsyncRequestState
  toggleEdit: () => void
  status: DeploymentStatus
  selectedDeployment: DeploymentGetResponse | null
}

type State = {
  deploymentMonitoringId: string | null
}

type LogsMetricsList = {
  key: string
  data: string
  enabled: string | undefined
  kibanaLink: string
}

class MonitoringDetails extends Component<Props> {
  state: State = {
    deploymentMonitoringId: null,
  }

  componentDidMount() {
    const { deployment } = this.props
    this.updateDeployment({ deployment })
  }

  componentDidUpdate(nextProps) {
    const { deployment } = nextProps
    this.updateDeployment({ deployment })
  }

  render() {
    const { deployment, monitoringDeploymentResult } = this.props

    return (
      <div>
        <HealthIssues deployment={deployment} />
        <HeaderMessage />
        <EuiSpacer size='l' />
        {monitoringDeploymentResult?.return_count === 0 ? this.renderDeploymentMissing() : null}
        <Fragment>{this.renderMonitoringDetails()}</Fragment>
      </div>
    )
  }

  renderMonitoringDetails() {
    const {
      monitoringDeploymentResult,
      setDeploymentMonitoringRequest,
      stopDeploymentMonitoringRequest,
      selectedDeployment,
    } = this.props

    const monitoringDeployment = this.getMonitoringDeployment({ monitoringDeploymentResult })

    if (this.state.deploymentMonitoringId === null) {
      return (
        <div>
          <EuiLoadingContent lines={3} />
        </div>
      )
    }

    if (
      (selectedDeployment && selectedDeployment.id !== monitoringDeployment?.id) ||
      (setDeploymentMonitoringRequest && setDeploymentMonitoringRequest.inProgress)
    ) {
      return (
        <div>
          <EuiLoadingContent lines={3} />
        </div>
      )
    }

    return (
      <div>
        <EuiFlexGroup gutterSize='m' justifyContent='flexStart' alignItems='center'>
          <EuiFlexItem grow={false} style={{ width: `400px`, maxWidth: `100%` }}>
            <EuiFormLabel>
              <FormattedMessage
                id='deployment-monitoring-enable.shipping-data-to'
                defaultMessage='Shipping data to'
                data-test-id='shipping-deployment-label'
              />
            </EuiFormLabel>

            <EuiSpacer size='s' />

            {this.renderDeploymentName({ monitoringDeployment, monitoringDeploymentResult })}

            <EuiSpacer size='m' />

            {this.renderTable()}

            <EuiSpacer size='m' />

            {this.renderButtons()}

            {stopDeploymentMonitoringRequest.error !== undefined && (
              <Fragment>
                <EuiSpacer size='m' />
                <CuiAlert type='error'>{stopDeploymentMonitoringRequest.error}</CuiAlert>
              </Fragment>
            )}
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
    )
  }

  renderDeploymentName({ monitoringDeployment, monitoringDeploymentResult }) {
    if (monitoringDeploymentResult?.deployments.length === 0) {
      return (
        <div>
          <EuiText size='s' color='danger'>
            <FormattedMessage
              id='deployment-monitoring-enable.deployment-missing'
              defaultMessage='Deployment missing'
            />
          </EuiText>
        </div>
      )
    }

    if (
      monitoringDeployment !== null &&
      monitoringDeployment.id === this.state.deploymentMonitoringId
    ) {
      return (
        <CuiDeploymentName
          data-test-id='shipping-deployment-name'
          deployment={monitoringDeployment}
        />
      )
    }

    return <EuiLoadingContent data-test-id='shipping-deployment-loading-content' lines={1} />
  }

  renderTable() {
    const { deployment } = this.props

    if (!deployment) {
      return null
    }

    const metricsDeployment =
      deployment.settings?.observability?.metrics?.destination?.deployment_id

    const loggingDeployment =
      deployment.settings?.observability?.logging?.destination?.deployment_id

    const enabledDot = (
      <div>
        <EuiFlexGroup alignItems='center' justifyContent='center' gutterSize='s'>
          <EuiFlexItem grow={1}>
            <EuiIcon type='dot' color='secondary' title='Enabled' />
          </EuiFlexItem>
          <EuiFlexItem grow={4}>
            <EuiText size='s'>
              <FormattedMessage
                data-test-id='deployment-monitoring.enabled'
                id='deployment-monitoring.enabled'
                defaultMessage='Enabled'
              />
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
    )

    const notEnabledDot = (
      <div>
        <EuiFlexGroup alignItems='center' justifyContent='center' gutterSize='s' wrap={false}>
          <EuiFlexItem grow={1}>
            <EuiIcon type='dot' color='subdued' title='Not enabled' />
          </EuiFlexItem>
          <EuiFlexItem grow={6}>
            <EuiText size='s' color='subdued'>
              <FormattedMessage
                data-test-id='deployment-monitoring.not-enabled'
                id='deployment-monitoring.not-enabled'
                defaultMessage='Not Enabled'
              />
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
    )

    const monitoringTable: Array<CuiTableColumn<LogsMetricsList>> = [
      {
        key: 'data',
        label: <FormattedMessage id='deployment-monitoring.type' defaultMessage='Type' />,
        render: ({ data }) => <EuiText size='s'>{data}</EuiText>,
      },
      {
        key: 'enabled',
        label: <FormattedMessage id='deployment-monitoring.enabled' defaultMessage='Enabled' />,
        render: ({ enabled }) => <Fragment>{enabled ? enabledDot : notEnabledDot}</Fragment>,
      },
      {
        key: 'viewLink',
        label: (
          <div>
            <EuiFlexGroup gutterSize='s' justifyContent='center' alignItems='center'>
              <EuiFlexItem>
                <FormattedMessage id='deployment-monitoring.view-data' defaultMessage='View data' />
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiIconTip
                  aria-label='information'
                  size='s'
                  type='iInCircle'
                  data-test-id='monitoring-view-link'
                  content={
                    <FormattedMessage
                      id='deployment-monitoring.view-data-tooltip'
                      defaultMessage='Logs or metrics must be enabled and Kibana must be available in the monitoring deployment.'
                    />
                  }
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </div>
        ),
        render: ({ kibanaLink }) => this.getKibanaLink(deployment, kibanaLink),
      },
    ]

    const noLogging = (
      <Fragment>
        <FormattedMessage
          id='deployment-monitoring.loading-logs-monitoring'
          defaultMessage='Loading logs and monitoring status'
        />
      </Fragment>
    )

    const logsMetricsList: LogsMetricsList[] = [
      {
        key: 'logs',
        data: 'Logs',
        enabled: loggingDeployment,
        kibanaLink: 'logging',
      },
      {
        key: 'metrics',
        data: 'Metrics',
        enabled: metricsDeployment,
        kibanaLink: 'metrics',
      },
    ]

    return (
      <Fragment>
        <EuiFormLabel>
          <FormattedMessage
            id='deployment-monitoring-enable.data-being-shipped'
            defaultMessage='Data being shipped'
          />
        </EuiFormLabel>

        <EuiSpacer size='s' />

        <CuiTable<LogsMetricsList>
          emptyMessage={noLogging}
          data-test-id='logs-monitoring-list-table'
          rows={logsMetricsList}
          columns={monitoringTable}
        />
      </Fragment>
    )
  }

  renderButtons() {
    const { stopDeploymentMonitoringRequest, status, toggleEdit } = this.props
    const { inProgress } = stopDeploymentMonitoringRequest
    const pendingStatus = status && status?.status === 'pending'

    return (
      <EuiFlexGroup
        gutterSize='s'
        justifyContent='flexStart'
        alignItems='center'
        direction='row'
        wrap={false}
      >
        <EuiFlexItem grow={false}>
          <EuiButton
            className='monitoring-buttons'
            disabled={pendingStatus}
            data-test-id='edit-monitoring-button'
            size='s'
            onClick={() => toggleEdit()}
          >
            <FormattedMessage id='deployment-monitoring.edit' defaultMessage='Edit' />
          </EuiButton>
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <DangerButton
            size='s'
            fill={false}
            requiresSudo={true}
            className='monitoring-buttons'
            data-test-id='stop-monitoring-button'
            disabled={pendingStatus}
            modal={{
              body: (
                <FormattedMessage
                  id='deployment-monitoring.confirm-to-stop.body'
                  defaultMessage='Stops shipping metrics to the monitoring deployment.'
                />
              ),
              title: (
                <FormattedMessage
                  id='deployment-monitoring.confirm-to-stop'
                  defaultMessage='Stop monitoring this deployment?'
                />
              ),
              confirmButtonText: (
                <FormattedMessage
                  id='deployment-monitoring.stop-monitoring'
                  defaultMessage='Stop'
                />
              ),
            }}
            isBusy={inProgress}
            onConfirm={() => this.cancelMonitoring()}
          >
            <FormattedMessage id='deployment-monitoring.stop-monitoring' defaultMessage='Stop' />
          </DangerButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    )
  }

  renderDeploymentMissing() {
    return (
      <div>
        <EuiCallOut
          data-test-id='deployment-missing'
          title={
            <FormattedMessage
              id='deployment-monitoring.deployment-missing'
              defaultMessage='Deployment missing'
            />
          }
          color='danger'
          iconType='alert'
        >
          <FormattedMessage
            id='deployment-monitoring.deployment-missing-message'
            defaultMessage='We are unable to locate the deployment that was set to receive logs and metrics, as a result no data is being sent. We recommend you select a new deployment immediately.'
          />
        </EuiCallOut>
        <EuiSpacer size='m' />
      </div>
    )
  }

  getKibanaLink = (deployment, logMetricOption = 'logging') => {
    if (!deployment.observability) {
      return null
    }

    const refId = getFirstEsRefId({ deployment }) || ''
    const message = <FormattedMessage id='deployment-monitoring.view' defaultMessage='View' />
    const kibanaLink = deployment.observability?.[logMetricOption]?.urls?.[refId]

    if (!kibanaLink) {
      return (
        <EuiText
          color='subdued'
          size='s'
          data-test-id={`monitoring-kibana-link-${logMetricOption}-disabled`}
        >
          {message}
        </EuiText>
      )
    }

    return (
      <EuiText size='s'>
        <EuiLink
          href={kibanaLink}
          target='_blank'
          data-test-id={`monitoring-kibana-link-${logMetricOption}-enabled`}
        >
          {message}
        </EuiLink>
      </EuiText>
    )
  }

  cancelMonitoring() {
    const { deployment, stopDeploymentMonitoring } = this.props

    stopDeploymentMonitoring(deployment.id)
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

  updateDeployment({ deployment }) {
    const monitoringDeploymentIds = [
      deployment.settings?.observability?.metrics?.destination?.deployment_id,
      deployment.settings?.observability?.logging?.destination?.deployment_id,
    ]

    const currentDeploymentMonitoringId = monitoringDeploymentIds.find(
      (monitoringId) => monitoringId !== undefined,
    )

    if (
      currentDeploymentMonitoringId !== null &&
      currentDeploymentMonitoringId !== this.state.deploymentMonitoringId
    ) {
      this.setState({
        deploymentMonitoringId: currentDeploymentMonitoringId,
      })

      const getDeploymentQuery = getDeploymentByIdQuery({
        deploymentId: currentDeploymentMonitoringId,
      })

      this.props.searchMonitoringDeployment(getDeploymentQuery)
    }
  }
}

export default withErrorBoundary(MonitoringDetails)
