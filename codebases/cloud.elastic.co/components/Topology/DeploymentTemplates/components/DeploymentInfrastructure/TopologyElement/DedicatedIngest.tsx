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

import { EuiTextColor } from '@elastic/eui'

import { isEnabledConfiguration } from '../../../../../../lib/deployments/conversion'

import TopologyElement, { AllProps as TopologyElementProps } from './TopologyElement'
import DisabledTopologyElement from './DisabledTopologyElement'

export default class DedicatedIngest extends Component<TopologyElementProps> {
  render(): JSX.Element {
    const { topologyElement } = this.props

    return isEnabledConfiguration(topologyElement) ? this.renderEnabled() : this.renderDisabled()
  }

  renderEnabled(): JSX.Element {
    return <TopologyElement {...this.props} />
  }

  // hard-disable coordinating nodes in trials
  renderDisabled(): JSX.Element {
    const { onChange, inTrial } = this.props

    const extraContent = inTrial ? (
      <EuiTextColor color='subdued'>
        <em>
          <FormattedMessage
            id='deploymentInfrastructure-topologyElement-ingest-trial'
            defaultMessage='Not available in trial'
          />
        </em>
      </EuiTextColor>
    ) : undefined

    return (
      <DisabledTopologyElement
        {...this.props}
        onChange={inTrial ? undefined : onChange}
        extraContent={extraContent}
      />
    )
  }
}
