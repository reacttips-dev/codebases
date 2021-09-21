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

import React, { Fragment, ReactElement, FunctionComponent } from 'react'
import { defineMessages, FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl'
import cx from 'classnames'

import { EuiFlexItem, EuiText, EuiToolTip } from '@elastic/eui'

import RatioLabel from '../../Topology/DeploymentTemplates/components/RatioLabel'

import { InstanceConfigurationAggregates } from '../../../types'

type Props = WrappedComponentProps & {
  instanceConfig?: InstanceConfigurationAggregates
  name?: string
  memorySum?: number
  diskSum?: number
  resource?: string
  zones?: number
}

const messages = defineMessages({
  availabilityZones: {
    id: `deployment-cards.configurations.availabilityZones`,
    defaultMessage: `in {availabilityZones, number} {availabilityZones, plural, one {zone} other {zones}}`,
  },
})

const DeploymentConfiguration: FunctionComponent<Props> = ({
  intl: { formatMessage },
  instanceConfig,
  name,
  memorySum,
  diskSum,
  resource,
  zones,
}) => {
  const features: Array<string | ReactElement<any>> = []

  if (resource === 'storage' && diskSum) {
    features.push(<RatioLabel resource='storage' size={diskSum} />)
  } else if (resource === 'memory' && memorySum) {
    features.push(<RatioLabel resource='memory' size={memorySum} />)
  }

  if (zones) {
    features.push(
      <span data-test-id='deployment-configuration-zones'>
        &nbsp;
        {formatMessage(messages.availabilityZones, { availabilityZones: zones })}
      </span>,
    )
  }

  if (features.length === 0) {
    return null
  }

  return (
    <EuiFlexItem>
      {renderConfigName({ name, instanceConfig })}
      {renderConfigurationDetails(features)}
    </EuiFlexItem>
  )
}

type RenderConfigNameProps = {
  instanceConfig?: InstanceConfigurationAggregates
  name?: string
}

function renderConfigName({ name, instanceConfig }: RenderConfigNameProps) {
  const isProblemTopology =
    instanceConfig != null &&
    (instanceConfig.maintModeInstances.nodeCount > 0 ||
      instanceConfig.unHealthyInstances.nodeCount > 0)

  if (isProblemTopology) {
    const classes = cx(`deploymentCard-problemNodesText`, {
      // @ts-ignore `isProblemTopology` says that instanceConfig != null
      'deploymentCard-problemNodesText--red': instanceConfig.unHealthyInstances.nodeCount > 0,
    })

    return (
      <EuiToolTip content={getTooltipText(instanceConfig)}>
        <EuiText size='s' color='default'>
          <strong className={classes} data-test-id='configuration-name'>
            {name}
          </strong>
        </EuiText>
      </EuiToolTip>
    )
  }

  return (
    <EuiText color='default' size='s'>
      <strong data-test-id='configuration-name'>{name}</strong>
    </EuiText>
  )
}

function renderConfigurationDetails(features: Array<string | ReactElement<any>>) {
  return (
    <EuiText size='s' color='subdued'>
      {features.map((feature, index) => (
        <Fragment key={index}>{feature}</Fragment>
      ))}
    </EuiText>
  )
}

function getTooltipText(instanceConfig?: InstanceConfigurationAggregates) {
  if (instanceConfig == null) {
    return null
  }

  const { unHealthyInstances, maintModeInstances } = instanceConfig

  if (unHealthyInstances.nodeCount > 0 && maintModeInstances.nodeCount > 0) {
    return (
      <Fragment>
        <FormattedMessage
          id='deployment-cards.configurations.multiple-issues'
          defaultMessage='This configuration has multiple issues:'
        />
        <br />
        <FormattedMessage
          id='deployment-cards.configurations.unhealthy'
          defaultMessage='Unhealthy: {count, number} {count, plural, one {instance} other {instances}}'
          values={{
            count: unHealthyInstances.nodeCount,
          }}
        />
        <br />
        <FormattedMessage
          id='deployment-cards.configurations.maintenance'
          defaultMessage='Maintenance: {count, number} {count, plural, one {instance} other {instances}}'
          values={{
            count: maintModeInstances.nodeCount,
          }}
        />
      </Fragment>
    )
  }

  if (unHealthyInstances.nodeCount > 0) {
    return (
      <Fragment>
        <FormattedMessage
          id='deployment-cards.configurations.unhealthy-full'
          defaultMessage='This configuration has {count, number} unhealthy {count, plural, one {instance} other {instances}}'
          values={{
            count: unHealthyInstances.nodeCount,
          }}
        />
      </Fragment>
    )
  }

  if (maintModeInstances.nodeCount > 0) {
    return (
      <Fragment>
        <FormattedMessage
          id='deployment-cards.configurations.maintenance-full'
          defaultMessage='This configuration has {count, number} {count, plural, one {instance} other {instances}} under maintenance'
          values={{
            count: maintModeInstances.nodeCount,
          }}
        />
      </Fragment>
    )
  }
}

export default injectIntl(DeploymentConfiguration)
