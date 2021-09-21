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
import { defineMessages, injectIntl, WrappedComponentProps } from 'react-intl'
import {
  EuiButtonIcon,
  EuiButtonIconColor,
  EuiPopover,
  EuiPopoverTitle,
  IconType,
} from '@elastic/eui'

import './iconTip.scss'

interface Props extends WrappedComponentProps {
  content: React.ReactChild
  title?: React.ReactChild
  iconType?: IconType
  color?: EuiButtonIconColor
}

interface State {
  isPopoverOpen: boolean
}

const messages = defineMessages({
  helpIcon: {
    id: `cost-analysis.icon-tip-aria-label`,
    defaultMessage: `Learn more`,
  },
})

class IconTip extends PureComponent<Props, State> {
  state = {
    isPopoverOpen: false,
  }

  render() {
    const { content, title } = this.props
    const { isPopoverOpen } = this.state

    return (
      <EuiPopover
        anchorPosition='upRight'
        button={this.getIconTip()}
        className='cost-analysis-icon-tip'
        closePopover={this.closePopover}
        isOpen={isPopoverOpen}
      >
        {title && (
          <EuiPopoverTitle data-test-id='cost-analysis-icon-tip-title'>{title}</EuiPopoverTitle>
        )}
        <div data-test-id='cost-analysis-icon-tip-content'>{content}</div>
      </EuiPopover>
    )
  }

  getIconTip() {
    const {
      iconType,
      color,
      intl: { formatMessage },
    } = this.props

    return (
      <EuiButtonIcon
        color={color || 'subdued'}
        iconType={iconType || 'iInCircle'}
        aria-label={formatMessage(messages.helpIcon)}
        onClick={this.togglePopover}
      />
    )
  }

  togglePopover = () => {
    this.setState((prevState: State) => {
      const { isPopoverOpen } = prevState
      return {
        isPopoverOpen: !isPopoverOpen,
      }
    })
  }

  closePopover = () => {
    this.setState({ isPopoverOpen: false })
  }
}

export default injectIntl(IconTip)
