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

import React, { PureComponent } from 'react'
import { defineMessages, FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'
import {
  // @ts-ignore
  EuiHeaderSectionItemButton,
  EuiIcon,
  EuiLink,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPopover,
  EuiPopoverTitle,
  EuiSpacer,
} from '@elastic/eui'
import ExternalLink from '../../components/ExternalLink'

import history from '../../lib/history'

interface State {
  isOpen: boolean
}

const messages = defineMessages({
  help: {
    id: 'chrome-header-help-title',
    defaultMessage: 'Help',
  },
  essHelp: {
    id: 'chrome-header-ess-help-title',
    defaultMessage: 'Support',
  },
  giveFeedback: {
    id: 'chrome-header.help-give-feedback-link',
    defaultMessage: 'Give feedback',
  },
})

class Help extends PureComponent<WrappedComponentProps, State> {
  state = {
    isOpen: false,
  }

  render() {
    const { intl } = this.props
    const { formatMessage } = intl
    const { isOpen } = this.state

    const feedbackUrl = 'https://www.elastic.co/kibana/feedback'
    return (
      <EuiPopover
        id='chrome-header-help-popover'
        ownFocus={true}
        button={
          <EuiHeaderSectionItemButton
            onClick={this.toggleMenu}
            aria-label={formatMessage(messages.help)}
          >
            <EuiIcon type='help' />
          </EuiHeaderSectionItemButton>
        }
        isOpen={isOpen}
        closePopover={this.closeMenu}
        anchorPosition='downLeft'
      >
        <EuiPopoverTitle>
          <FormattedMessage {...messages.help} />
        </EuiPopoverTitle>
        <EuiFlexGroup alignItems='center' gutterSize='s' responsive={false}>
          <EuiFlexItem grow={false}>
            <EuiIcon type='logoElasticsearch' size='m' />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiLink onClick={this.onClick} color='text' data-test-id='chrome-header-help-btn'>
              <FormattedMessage {...messages.essHelp} />
            </EuiLink>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size='m' />

        <EuiFlexGroup alignItems='center' gutterSize='s' responsive={false}>
          <EuiFlexItem grow={false}>
            <ExternalLink
              href={feedbackUrl}
              showExternalLinkIcon={true}
              color='text'
              data-test-id='chrome-header-help-give-feedback-link'
            >
              <FormattedMessage {...messages.giveFeedback} />
            </ExternalLink>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPopover>
    )
  }

  onClick = () => {
    this.closeMenu()
    history.push('/support')
  }

  toggleMenu = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }))
  }

  closeMenu = () => {
    this.setState({ isOpen: false })
  }
}

export default injectIntl(Help)
