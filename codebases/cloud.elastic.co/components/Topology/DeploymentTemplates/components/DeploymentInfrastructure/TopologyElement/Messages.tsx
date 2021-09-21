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

import { EuiCallOut, EuiText, EuiSpacer } from '@elastic/eui'

import DocLink from '../../../../../DocLink'
import prettySize from '../../../../../../lib/prettySize'

import { AnyTopologyElement } from '../../../../../../types'
import { InstanceConfiguration } from '../../../../../../lib/api/v1/types'
import { getEuiColor, SeverityLevel } from '../../../../../../lib/healthProblems'
import { isRiskyWithSingleZone, isData } from '../../../../../../lib/stackDeployments'

export interface Props {
  id: string
  topologyElement: AnyTopologyElement
  instanceConfiguration: InstanceConfiguration
  inTrial: boolean
}

type MessageWithLevel = { level: SeverityLevel; message: ReactNode }

export default class Messages extends Component<Props> {
  render(): JSX.Element | null {
    const messages = this.getMessages()

    if (messages.length === 0) {
      return null
    }

    const calloutColor = getEuiColor(messages)

    const content = (
      <EuiText>
        {messages.length === 1 ? (
          messages[0].message
        ) : (
          <ul>
            {messages.map((message, i) => (
              <li key={i}>{message.message}</li>
            ))}
          </ul>
        )}
      </EuiText>
    )

    return (
      <Fragment>
        <EuiSpacer size='m' />
        <EuiCallOut color={calloutColor} title={content} />
      </Fragment>
    )
  }

  getMessages = (): MessageWithLevel[] =>
    [this.getDataLossWarningMessage(), this.getTrialMessage()].filter(
      (v) => v,
    ) as MessageWithLevel[]

  getDataLossWarningMessage = (): MessageWithLevel | undefined => {
    const { topologyElement } = this.props

    const dataLossRisk =
      isRiskyWithSingleZone({ topologyElement }) && topologyElement.zone_count === 1

    if (!dataLossRisk) {
      return
    }

    return {
      level: `warning`,
      message: (
        <FormattedMessage
          id='zone-info.one-zone-configurations'
          defaultMessage='You are at risk of data loss with fault tolerance set to a single zone. { learnMore }'
          values={{
            learnMore: (
              <DocLink link='faultToleranceDocLink'>
                <FormattedMessage
                  id='uc.configure-instance.fault-tolerance-link'
                  defaultMessage='Learn more …'
                />
              </DocLink>
            ),
          }}
        />
      ),
    }
  }

  getTrialMessage(): MessageWithLevel | undefined {
    const { topologyElement, instanceConfiguration, inTrial } = this.props

    const isDataNode = isData({ topologyElement })
    const smallTrial = inTrial && isDataNode

    if (!smallTrial) {
      return
    }

    const {
      discrete_sizes: { default_size: defaultSize },
    } = instanceConfiguration

    return {
      level: `info`,
      message: (
        <FormattedMessage
          id='zone-info.size-configurations'
          defaultMessage='During a trial, you can have a cluster with up to {defaultSize} RAM across 2 zones. Using less could adversely affect the performance of the deployment. { learnMore }'
          values={{
            defaultSize: prettySize(defaultSize),
            learnMore: (
              <DocLink link='planForProduction'>
                <FormattedMessage
                  id='uc.configure-instance.fault-tolerance-link'
                  defaultMessage='Learn more …'
                />
              </DocLink>
            ),
          }}
        />
      ),
    }
  }
}
