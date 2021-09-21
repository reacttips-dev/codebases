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

import React, { PureComponent } from 'react'
import {
  defineMessages,
  FormattedMessage,
  injectIntl,
  MessageDescriptor,
  WrappedComponentProps,
} from 'react-intl'

import {
  EuiHealth,
  EuiText,
  // @ts-ignore
  TextColor,
} from '@elastic/eui'

import { hasStoppedRoutingRequests, isNodePausedByUser } from '../../../../lib/stackDeployments'

import { InstanceSummary, StackDeployment } from '../../../../types'

type InstanceHealthStatus =
  | 'healthy'
  | 'unhealthy'
  | 'paused-by-user'
  | 'stopped'
  | 'stopped-routing-requests'
  | 'starting-instance'
  | 'pausing-instance'

type InstanceHealthStatusDisplayType = 'success' | 'subdued' | 'danger' | 'warning' | 'processing'

type InstanceTypeName = 'node' | 'instance'

interface InstanceHealthStatusDisplay {
  type: InstanceHealthStatusDisplayType
  statusMessage: MessageDescriptor
  values?: (type: InstanceTypeName) => { values: { type: InstanceTypeName } }
}

interface Props extends WrappedComponentProps {
  deployment: StackDeployment
  instanceSummary: InstanceSummary
}

interface State {
  healthStatus: InstanceHealthStatusDisplay
}

const messages = defineMessages({
  statusHealthyMessage: {
    id: 'instances-card.status.healthy',
    defaultMessage: 'Healthy',
  },
  statusPausedByUserMessage: {
    id: 'instances-card.status.paused-by-user',
    defaultMessage: 'Paused by user',
  },
  statusPausingInstanceMessage: {
    id: 'instances-card.status.pausing-instance',
    defaultMessage: 'Pausing instance',
  },
  statusStoppedMessage: {
    id: 'instances-card.status.stopped',
    defaultMessage: 'Stopped',
  },
  statusStoppedRoutingRequestsMessage: {
    id: 'instances-card.status.not-routing-requests-message',
    defaultMessage: 'Not routing requests',
  },
  statusStartingInstanceMessage: {
    id: 'instances-card.status.starting-instance',
    defaultMessage: 'Starting instance',
  },
  statusUnhealthyMessage: {
    id: 'instances-card.status.unhealthy',
    defaultMessage: 'Unhealthy',
  },
  statusRefreshingMessage: {
    id: 'instances-card.status.refreshing',
    defaultMessage: 'refreshing',
  },
  statusUnknownMessage: {
    id: 'instances-card.status.unknown',
    defaultMessage: 'Unknown {type} status',
  },
})

class NodeInstanceStatus extends PureComponent<Props, State> {
  state = {
    healthStatus: this.getDefaultState(),
  }

  static getDerivedStateFromProps(props, state) {
    const healthStatus = NodeInstanceStatus.getHealthStatus(props)
    const currentHealthStatus = state.healthStatus

    if (currentHealthStatus.type !== healthStatus.type) {
      return { healthStatus }
    }

    return null
  }

  render() {
    const { healthStatus } = this.state
    const { statusMessage, type } = healthStatus

    let textColor: TextColor = 'default'

    if (type === 'danger' || type === 'warning') {
      textColor = type as TextColor
    }

    return (
      <EuiHealth
        color={type}
        className={`node-instance-status-${type}`}
        data-test-id='node-instance-status'
      >
        <EuiText size='xs' color={textColor}>
          <FormattedMessage {...statusMessage} />
        </EuiText>
      </EuiHealth>
    )
  }

  getDefaultState(): InstanceHealthStatusDisplay {
    return NodeInstanceStatus.getHealthStatus(this.props)
  }

  static getHealthStatus(props): InstanceHealthStatusDisplay {
    const { instanceSummary } = props
    const { instance } = instanceSummary

    if (isNodePausedByUser(instance)) {
      return NodeInstanceStatus.getHealthStatusDisplay('paused-by-user')
    }

    if (hasStoppedRoutingRequests(instance)) {
      return NodeInstanceStatus.getHealthStatusDisplay('stopped-routing-requests')
    }

    return NodeInstanceStatus.getHealthStatusDisplay(instance.healthy ? 'healthy' : 'unhealthy')
  }

  static getHealthStatusDisplay(status: InstanceHealthStatus): InstanceHealthStatusDisplay {
    switch (status) {
      case 'healthy':
        return {
          type: 'success',
          statusMessage: messages.statusHealthyMessage,
        }
      case 'paused-by-user':
        return {
          type: 'subdued',
          statusMessage: messages.statusPausedByUserMessage,
        }
      case `stopped`:
        return {
          type: 'danger',
          statusMessage: messages.statusStoppedMessage,
        }
      case `stopped-routing-requests`:
        return {
          type: 'warning',
          statusMessage: messages.statusStoppedRoutingRequestsMessage,
        }
      case `unhealthy`:
        return {
          type: 'danger',
          statusMessage: messages.statusUnhealthyMessage,
        }
      default:
        return {
          type: 'subdued',
          statusMessage: messages.statusUnknownMessage,
          values: (type: InstanceTypeName) => ({
            values: { type },
          }),
        }
    }
  }
}

export default injectIntl(NodeInstanceStatus)
