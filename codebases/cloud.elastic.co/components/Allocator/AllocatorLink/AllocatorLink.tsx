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
import { defineMessages, FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'

import { EuiFlexGroup, EuiFlexItem, EuiLoadingSpinner, EuiText, EuiTextProps } from '@elastic/eui'

import { isPermitted } from '../../../lib/requiresPermission'
import Permission from '../../../lib/api/v1/permissions'
import { hostAllocatorUrl } from '../../../lib/urlBuilder'
import { AsyncRequestState } from '../../../types'
import { DeploymentAllocatorExternalLinksList } from '../../StackDeployments/ResourceExternalLinks/ExternalLinksList'
import { ExternalHyperlink } from '../../../lib/api/v1/types'

interface Props {
  allocatorId: string
  externalLinks?: ExternalHyperlink[]
  fetchDeploymentAllocatorsRequest: AsyncRequestState
  healthy?: boolean
  regionId: string
}

type ColorKey = 'healthy' | 'inProgress' | 'onError' | 'unhealthy'

type TextColor = EuiTextProps['color']

type ColorMap = {
  [key in ColorKey]: TextColor
}

const colors: ColorMap = {
  healthy: 'default',
  inProgress: 'subdued',
  onError: 'warning',
  unhealthy: 'danger',
}

const messages = defineMessages({
  healthy: {
    id: `allocator-link.healthy`,
    defaultMessage: `Allocator {ip}`,
  },
  inProgress: {
    id: `allocator-link.healthy`,
    defaultMessage: `Allocator {ip}`,
  },
  onError: {
    id: `allocator-link.healthy`,
    defaultMessage: `Allocator {ip}`,
  },
  unhealthy: {
    id: `allocator-link.unhealthy`,
    defaultMessage: `Unhealthy allocator {ip}`,
  },
})

class AllocatorLink extends Component<Props> {
  render() {
    const { allocatorId, externalLinks, fetchDeploymentAllocatorsRequest, regionId } = this.props

    const health = this.getAllocatorHealth()

    return (
      <EuiFlexGroup gutterSize='xs' responsive={false} wrap={true}>
        <EuiFlexItem grow={false}>
          <EuiText size='xs' color={health.color} className='node-visualization-allocator-link'>
            <FormattedMessage
              id={health.message.id}
              defaultMessage={health.message.defaultMessage}
              values={{
                ip: isPermitted(Permission.getAllocator) ? (
                  <Link data-test-id='allocator-link' to={hostAllocatorUrl(regionId, allocatorId)}>
                    {allocatorId}
                  </Link>
                ) : (
                  allocatorId
                ),
              }}
            />
          </EuiText>
        </EuiFlexItem>
        {isPermitted(Permission.getAllocator) && (
          <EuiFlexItem grow={false}>
            <EuiText size='xs'>
              <ExternalLinksList
                externalLinks={externalLinks}
                fetchDeploymentAllocatorsRequest={fetchDeploymentAllocatorsRequest}
              />
            </EuiText>
          </EuiFlexItem>
        )}
      </EuiFlexGroup>
    )
  }

  getAllocatorHealth() {
    const { fetchDeploymentAllocatorsRequest, healthy } = this.props

    if (fetchDeploymentAllocatorsRequest.inProgress || healthy === undefined) {
      return {
        message: messages.inProgress,
        color: colors.inProgress,
      }
    }

    if (fetchDeploymentAllocatorsRequest.error) {
      return {
        message: messages.onError,
        color: colors.onError,
      }
    }

    if (!healthy) {
      return {
        message: messages.unhealthy,
        color: colors.unhealthy,
      }
    }

    return {
      message: messages.healthy,
      color: colors.healthy,
    }
  }
}

const ExternalLinksList: FunctionComponent<{
  externalLinks?: ExternalHyperlink[]
  fetchDeploymentAllocatorsRequest: AsyncRequestState
}> = ({ externalLinks, fetchDeploymentAllocatorsRequest }) => {
  if (fetchDeploymentAllocatorsRequest.inProgress) {
    return <EuiLoadingSpinner size='s' />
  }

  if (externalLinks === undefined || externalLinks.length === 0) {
    return null
  }

  return <DeploymentAllocatorExternalLinksList links={externalLinks} />
}

export default AllocatorLink
