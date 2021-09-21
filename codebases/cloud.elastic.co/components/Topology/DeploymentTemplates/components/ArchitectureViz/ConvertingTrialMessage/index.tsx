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

import React, { FunctionComponent, Fragment } from 'react'
import { FormattedMessage, injectIntl, WrappedComponentProps, defineMessages } from 'react-intl'
import { EuiCallOut, EuiSpacer, EuiText } from '@elastic/eui'

import ExceededTrialNodeList from './ExceededTrialNodeList'
import { AnyTopologyElement } from '../../../../../../types'

interface Props extends WrappedComponentProps {
  exceededTrialNodes: Array<Partial<AnyTopologyElement>>
  resetNodeToTrial: ({ nodeConfiguration, topologyElementProp }) => void
}

const messages = defineMessages({
  title: {
    id: 'converting-trial.title',
    defaultMessage: 'Ready to subscribe?',
  },
})
const ConvertingTrialMessage: FunctionComponent<Props> = ({
  exceededTrialNodes,
  resetNodeToTrial,
  intl: { formatMessage },
}) => (
  <Fragment>
    <EuiCallOut title={formatMessage(messages.title)} color='success'>
      <EuiText size='s'>
        <FormattedMessage
          id='ConvertingTrialMessage.trial-exceeded-message'
          defaultMessage="Some of your selections require a subscription, which ends the free trial for your account. After you save the changes, you'll be prompted to add a credit card."
        />
      </EuiText>
      <EuiText size='s'>
        <FormattedMessage
          id='ConvertingTrialMessage.trial-exceeded-message-subscription'
          defaultMessage='Here are the features that require a subscription:'
        />
      </EuiText>
      <EuiSpacer size='s' />
      <ExceededTrialNodeList
        exceededTrialNodes={exceededTrialNodes}
        resetNodeToTrial={resetNodeToTrial}
      />
    </EuiCallOut>
    <EuiSpacer size='m' />
  </Fragment>
)

export default injectIntl(ConvertingTrialMessage)
