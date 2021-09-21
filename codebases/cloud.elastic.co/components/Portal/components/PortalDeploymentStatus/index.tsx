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

import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { EuiFlexGroup, EuiFlexItem, EuiHealth, EuiFormHelpText } from '@elastic/eui'

import { CuiTimeAgo } from '../../../../cui'

import { getClusterPlanInfo } from '../../../../lib/stackDeployments/selectors'
import { getDeploymentStatus } from '../../../../lib/stackDeployments/status'

import { DeploymentSearchResponse } from '../../../../lib/api/v1/types'
import { DeploymentStatus } from '../../../../types'

import './PortalDeploymentStatus.scss'

interface Props {
  deployment?: DeploymentSearchResponse
}

const PortalDeploymentStatus: FunctionComponent<Props> = ({ deployment }) => {
  if (!deployment) {
    return null
  }

  const status = getDeploymentStatus({ deployment })
  const statusDisplay = getStatusDisplay({ deployment, status })
  const { color, label, planAttemptEndTime } = statusDisplay

  return (
    <div className='portal-deployment-status'>
      <EuiFlexGroup direction='column' gutterSize='none'>
        <EuiFlexItem>
          <EuiHealth color={color}>{label}</EuiHealth>
        </EuiFlexItem>

        {color !== 'success' && planAttemptEndTime && (
          <EuiFlexItem>
            <EuiFormHelpText className='portal-deployment-status-time-elapsed'>
              <CuiTimeAgo date={planAttemptEndTime} />
            </EuiFormHelpText>
          </EuiFlexItem>
        )}
      </EuiFlexGroup>
    </div>
  )
}

function getStatusConfig(options: DeploymentStatus) {
  const statusMap = {
    healthy: {
      color: 'success',
      label: <FormattedMessage id='portal-deployment-status.healthy' defaultMessage='Healthy' />,
    },
    warning: {
      color: 'warning',
      label: (
        <FormattedMessage
          id='portal-deployment-status.healthy-with-warnings'
          defaultMessage='Healthy, with warnings'
        />
      ),
    },
    pending: {
      color: 'warning',
      label: <FormattedMessage id='portal-deployment-status.pending' defaultMessage='Pending' />,
    },
    stopping: {
      color: 'warning',
      label: (
        <FormattedMessage id='portal-deployment-status.terminating' defaultMessage='Terminating' />
      ),
    },
    stopped: {
      color: 'subdued',
      label: (
        <FormattedMessage id='portal-deployment-status.terminated' defaultMessage='Terminated' />
      ),
    },
    unhealthy: {
      color: 'danger',
      label: (
        <FormattedMessage id='portal-deployment-status.unhealthy' defaultMessage='Unhealthy' />
      ),
    },
  }

  const { healthy, status } = options

  if (status) {
    return statusMap[status]
  }

  return statusMap[healthy ? 'healthy' : 'unhealthy']
}

function getStatusDisplay({
  deployment,
  status,
}: {
  deployment: DeploymentSearchResponse
  status: DeploymentStatus
}) {
  const lastPlanAttempt = getClusterPlanInfo({ deployment, sliderInstanceType: `elasticsearch` })

  return {
    ...getStatusConfig(status),
    healthy: deployment.healthy,
    planAttemptEndTime: lastPlanAttempt && lastPlanAttempt.attempt_end_time,
  }
}

export default PortalDeploymentStatus
