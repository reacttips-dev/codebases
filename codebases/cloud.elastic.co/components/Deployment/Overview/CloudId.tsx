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
import { FormattedMessage, injectIntl, defineMessages, IntlShape } from 'react-intl'

import {
  EuiButtonIcon,
  EuiCode,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormHelpText,
  EuiFormLabel,
  EuiPopover,
  EuiSpacer,
} from '@elastic/eui'

import CopyButton from '../../CopyButton'
import DocLink from '../../DocLink'
import PrivacySensitiveContainer from '../../PrivacySensitiveContainer'

const messages = defineMessages({
  help: {
    id: `cluster-manage-index.cloud-id-help`,
    defaultMessage: `Learn more about Cloud ID …`,
  },
})

export type Props = {
  intl: IntlShape
  cloudId: string
}

type State = {
  isPopoverOpen: boolean
}

class CloudId extends Component<Props, State> {
  state: State = {
    isPopoverOpen: false,
  }

  render() {
    const { intl, cloudId } = this.props

    return (
      <div>
        <EuiFormLabel>
          <EuiFlexGroup gutterSize='none' alignItems='center' responsive={false}>
            <EuiFlexItem grow={false}>
              <FormattedMessage id='cluster-manage-index.cloud-id' defaultMessage='Cloud ID' />
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <EuiPopover
                id='cloud-id'
                ownFocus={true}
                button={
                  <EuiButtonIcon
                    onClick={this.showPopover}
                    iconType='questionInCircle'
                    color='primary'
                    aria-label={intl.formatMessage(messages.help)}
                  />
                }
                isOpen={this.state.isPopoverOpen}
                panelClassName='cloudId-description'
                panelPaddingSize='m'
                closePopover={this.hidePopover}
                anchorPosition='rightCenter'
              >
                <EuiFormHelpText>
                  <FormattedMessage
                    id='cluster-manage-index.cloud-id-description'
                    defaultMessage='Get started with Beats and Logstash quickly. The Cloud ID simplifies sending data to your cluster on Elastic Cloud.'
                  />
                  {` `}
                  <DocLink link='cloudIdDocLink'>
                    <FormattedMessage
                      id='cluster-manage-index.cloud-id-description-link'
                      defaultMessage='Learn more'
                    />
                  </DocLink>
                </EuiFormHelpText>
              </EuiPopover>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFormLabel>

        <EuiSpacer size='s' />

        <div className='cloudId-container'>
          <PrivacySensitiveContainer>
            <EuiCode className='cloudId'>{cloudId}</EuiCode>
            <CopyButton value={String(cloudId)} className='elasticPassword-copy' />
          </PrivacySensitiveContainer>
        </div>
      </div>
    )
  }

  showPopover = () => this.setState({ isPopoverOpen: true })

  hidePopover = () => this.setState({ isPopoverOpen: false })
}

export default injectIntl(CloudId)
