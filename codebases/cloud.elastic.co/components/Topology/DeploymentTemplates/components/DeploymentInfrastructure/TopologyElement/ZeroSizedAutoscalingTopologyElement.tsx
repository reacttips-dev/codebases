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

import React, { Component, ReactNode, Fragment } from 'react'
import { defineMessages, FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl'

import { EuiBetaBadge, EuiFlexGroup, EuiFlexItem, EuiPanel, EuiSpacer } from '@elastic/eui'

import { getUpsertVersion, isDedicatedML, isFrozen } from '../../../../../../lib/stackDeployments'

import { AnyTopologyElement } from '../../../../../../types'
import {
  ElasticsearchClusterTopologyElement,
  InstanceConfiguration,
  DeploymentGetResponse,
  DeploymentCreateRequest,
  DeploymentUpdateRequest,
} from '../../../../../../lib/api/v1/types'
import { TopologyElementDescription, TopologyElementTitle } from './helpers'

import AutoscalingEditSettings from '../../../../../Autoscaling/AutoscalingEditSettings'
import NormalizeSizing from './NormalizeSizing'

export interface Props {
  id: string
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
  topologyElement: ElasticsearchClusterTopologyElement
  templateTopologyElement?: AnyTopologyElement
  instanceConfiguration: InstanceConfiguration
  onChange: (path: string[], value: any) => void
  descriptionOverride?: ReactNode
  extraContent?: ReactNode
  deploymentUnderEdit?: DeploymentGetResponse
}

const messages = defineMessages({
  autoscaling: {
    id: 'zero-sized-topology-element.autoscaling',
    defaultMessage: 'Autoscaling',
  },
})

class ZeroSizedAutoscalingTopologyElement extends Component<Props & WrappedComponentProps> {
  render(): JSX.Element {
    const {
      deployment,
      topologyElement,
      templateTopologyElement,
      instanceConfiguration,
      descriptionOverride,
      extraContent,
      intl: { formatMessage },
    } = this.props

    const version = getUpsertVersion({ deployment })

    return (
      <div data-test-subj='topologyElement' data-id={instanceConfiguration.name}>
        <EuiPanel className='deploymentInfrastructure-topologyElement'>
          <EuiFlexGroup responsive={false}>
            <EuiFlexItem>
              <TopologyElementTitle
                topologyElement={templateTopologyElement || topologyElement}
                instanceConfiguration={instanceConfiguration}
                version={version}
              />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiBetaBadge
                data-test-id='autoscaling-badge'
                label={formatMessage(messages.autoscaling)}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiSpacer size='xs' />
          <TopologyElementDescription
            topologyElement={templateTopologyElement || topologyElement}
            instanceConfiguration={instanceConfiguration}
            descriptionOverride={descriptionOverride}
            version={version}
          />
          {this.renderAutoscalingSettings()}
          {extraContent && (
            <Fragment>
              <EuiSpacer size='s' />
              {extraContent}
            </Fragment>
          )}
        </EuiPanel>
      </div>
    )
  }

  renderAutoscalingSettings(): JSX.Element {
    const { instanceConfiguration, topologyElement, deploymentUnderEdit } = this.props

    return (
      <NormalizeSizing {...this.props} capMaxNodeCount={true}>
        {(normalizeSizingProps) => (
          <AutoscalingEditSettings
            {...normalizeSizingProps}
            topologyElement={topologyElement}
            name={instanceConfiguration.name}
            autoscalingMax={topologyElement.autoscaling_max!.value}
            autoscalingMin={topologyElement.autoscaling_min?.value}
            autoscalingPolicyOverrideJson={topologyElement.autoscaling_policy_override_json}
            isMachineLearning={isDedicatedML({ topologyElement })}
            minimumSizeForElement={topologyElement.topology_element_control?.min.value}
            buttonText={
              <FormattedMessage
                id='autoscaling-edit-settings.autoscaled-ml.edit'
                defaultMessage='Edit capacity and settings'
              />
            }
            isLink={true}
            deploymentUnderEdit={deploymentUnderEdit}
            isFrozen={isFrozen({ topologyElement })}
          />
        )}
      </NormalizeSizing>
    )
  }
}

export default injectIntl(ZeroSizedAutoscalingTopologyElement)
