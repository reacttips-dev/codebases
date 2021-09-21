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

import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

import { isEnabledConfiguration } from '../../../../../../lib/deployments/conversion'
import { getAutoEnabledDedicatedMastersNotifier } from '../../../../../../lib/deployments/masters'

import TopologyElement, { AllProps as TopologyElementProps } from './TopologyElement'
import DisabledTopologyElement from './DisabledTopologyElement'

export interface Props extends TopologyElementProps {
  dedicatedMasterThreshold?: number
}

export default class DedicatedMaster extends Component<Props> {
  notifyAboutAutoEnabledDedicatedMasters: (props: any) => void =
    getAutoEnabledDedicatedMastersNotifier()

  componentDidMount(): void {
    this.notify(this.props)
  }

  componentDidUpdate(): void {
    this.notify(this.props)
  }

  render(): JSX.Element {
    const { topologyElement } = this.props

    return isEnabledConfiguration(topologyElement) ? this.renderEnabled() : this.renderDisabled()
  }

  renderEnabled(): JSX.Element {
    return <TopologyElement {...this.props} maxInstanceCount={1} />
  }

  renderDisabled(): JSX.Element {
    const { dedicatedMasterThreshold } = this.props

    if (dedicatedMasterThreshold == null) {
      return <DisabledTopologyElement {...this.props} />
    }

    const description = (
      <FormattedMessage
        id='deploymentInfrastructure-topologyElement-master-automatic'
        defaultMessage='Dedicated master nodes will be automatically added once you reach {count} Elasticsearch nodes across all zones.'
        values={{
          count: dedicatedMasterThreshold,
        }}
      />
    )

    return (
      <DisabledTopologyElement
        {...this.props}
        onChange={undefined}
        descriptionOverride={description}
      />
    )
  }

  notify = (props: Props): void => {
    const { topologyElement, dedicatedMasterThreshold } = props

    this.notifyAboutAutoEnabledDedicatedMasters({
      nodeConfiguration: topologyElement,
      dedicatedMasterThreshold,
    })
  }
}
