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
import { FormattedMessage, defineMessages, injectIntl, IntlShape } from 'react-intl'

import { EuiButtonIcon, EuiFormHelpText, EuiPopover } from '@elastic/eui'

import { CuiLink } from '../../../cui'

type Props = {
  intl: IntlShape
  resetPasswordUrl: string
}

type State = {
  isHelpPopoverOpen: boolean
}

const messages = defineMessages({
  helpIcon: {
    id: `cluster-application-links.how-to-log-in-aria-label`,
    defaultMessage: `Opens a popover with instructions on how to log in to the application.`,
  },
})

class ApplicationLinkHelpPopover extends Component<Props, State> {
  state: State = {
    isHelpPopoverOpen: false,
  }

  render() {
    const {
      intl: { formatMessage },
      resetPasswordUrl,
    } = this.props

    const { isHelpPopoverOpen } = this.state

    return (
      <EuiPopover
        ownFocus={true}
        button={
          <EuiButtonIcon
            aria-label={formatMessage(messages.helpIcon)}
            onClick={() => this.setState({ isHelpPopoverOpen: true })}
            iconType='questionInCircle'
            color='primary'
          />
        }
        isOpen={isHelpPopoverOpen}
        panelClassName='applicationLink-help'
        panelPaddingSize='m'
        closePopover={() => this.setState({ isHelpPopoverOpen: false })}
        anchorPosition='rightCenter'
      >
        <EuiFormHelpText>
          <FormattedMessage
            id='cluster-application-links.how-to-log-in'
            defaultMessage="To log in to the application you will need to have your deployment's credentials from when it was created."
          />

          <span>{` `}</span>

          <CuiLink to={resetPasswordUrl}>
            <FormattedMessage
              id='cluster-application-links.reset-password-link'
              defaultMessage="Reset your password if you've lost it."
            />
          </CuiLink>
        </EuiFormHelpText>
      </EuiPopover>
    )
  }
}

export default injectIntl(ApplicationLinkHelpPopover)
