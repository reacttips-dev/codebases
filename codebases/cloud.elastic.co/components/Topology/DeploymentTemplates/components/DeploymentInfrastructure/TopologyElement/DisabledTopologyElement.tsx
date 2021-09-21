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
import { FormattedMessage } from 'react-intl'

import { EuiPanel, EuiSpacer, EuiLink } from '@elastic/eui'

import { AnyTopologyElement } from '../../../../../../types'
import {
  DeploymentCreateRequest,
  DeploymentUpdateRequest,
  InstanceConfiguration,
} from '../../../../../../lib/api/v1/types'
import { TopologyElementDescription, TopologyElementTitle } from './helpers'
import { getUpsertVersion } from '../../../../../../lib/stackDeployments'

interface Props {
  id: string
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
  topologyElement: AnyTopologyElement
  templateTopologyElement?: AnyTopologyElement
  instanceConfiguration: InstanceConfiguration
  onChange?: (path: string[], value: any) => void
  descriptionOverride?: ReactNode
  extraContent?: ReactNode
}

export default class DisabledTopologyElement extends Component<Props> {
  render(): JSX.Element {
    const {
      deployment,
      topologyElement,
      templateTopologyElement,
      instanceConfiguration,
      onChange,
      descriptionOverride,
      extraContent,
    } = this.props

    const enableButtonText = (
      <FormattedMessage
        id='deploymentInfrastructure-topologyElement-disabled-enableButton'
        defaultMessage='Add capacity'
      />
    )

    const onEnable = onChange ? this.enable : undefined

    const version = getUpsertVersion({ deployment })

    return (
      <div data-test-subj='topologyElement' data-id={instanceConfiguration.name}>
        <EuiPanel className='deploymentInfrastructure-topologyElement disabled-topology-element'>
          <EuiSpacer size='s' />
          <TopologyElementTitle
            topologyElement={templateTopologyElement || topologyElement}
            instanceConfiguration={instanceConfiguration}
            version={version}
          />
          <EuiSpacer size='xs' />
          <TopologyElementDescription
            topologyElement={templateTopologyElement || topologyElement}
            instanceConfiguration={instanceConfiguration}
            descriptionOverride={descriptionOverride}
            version={version}
          />
          {onEnable && (
            <Fragment>
              <EuiSpacer size='s' />
              <EuiLink
                color='primary'
                data-test-id={`topologyElement-enableButton-${
                  templateTopologyElement ? templateTopologyElement.id : topologyElement.id
                }`}
                onClick={() => onEnable()}
              >
                + {enableButtonText}
              </EuiLink>
            </Fragment>
          )}
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

  enable = (): void => {
    const { templateTopologyElement, instanceConfiguration, onChange } = this.props

    const {
      discrete_sizes: { default_size, resource },
    } = instanceConfiguration

    const defaultZoneCountInTemplate = templateTopologyElement?.zone_count

    // Use the default number of zones from the template, or 1 if there is no
    // template, the count in there is zero for some reason, etc.
    const zoneCount = defaultZoneCountInTemplate || 1

    onChange!([`size`], { value: default_size, resource })
    onChange!([`zone_count`], zoneCount)
  }
}
