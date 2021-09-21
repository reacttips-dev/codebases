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

import React, { Component, ReactNode } from 'react'
import { defineMessages, WrappedComponentProps, injectIntl } from 'react-intl'

import {
  EuiButtonIcon,
  EuiButtonIconProps,
  EuiPopover,
  EuiPopoverProps,
  EuiText,
  EuiTextProps,
  htmlIdGenerator,
} from '@elastic/eui'

import './HelpTipIcon.scss'

const makeId = htmlIdGenerator()

interface Props extends WrappedComponentProps {
  children: NonNullable<ReactNode>
  color?: EuiButtonIconProps['color']
  iconType?: EuiButtonIconProps['iconType']
  anchorPosition?: EuiPopoverProps['anchorPosition']
  textColor?: EuiTextProps['color']
  textSize?: EuiTextProps['size']
  width?: number
}

interface State {
  isPopoverOpen: boolean
}

const messages = defineMessages({
  showHelp: {
    id: 'cui.tooltip-icon.show-help',
    defaultMessage: 'Show help',
  },
})

class CuiHelpTipIcon extends Component<Props, State> {
  state: State = {
    isPopoverOpen: false,
  }

  render() {
    const {
      intl: { formatMessage },
      children,
      anchorPosition = 'leftCenter',
      textColor,
      textSize,
      width = 300,
      ...rest
    } = this.props

    const { isPopoverOpen } = this.state

    return (
      <EuiPopover
        className='cuiHelpTipIcon'
        id={makeId()}
        ownFocus={true}
        button={
          <EuiButtonIcon
            aria-label={formatMessage(messages.showHelp)}
            onClick={() => this.setState({ isPopoverOpen: true })}
            iconType='questionInCircle'
            color='subdued'
            {...rest}
          />
        }
        closePopover={() => this.setState({ isPopoverOpen: false })}
        isOpen={isPopoverOpen}
        panelPaddingSize='s'
        anchorPosition={anchorPosition}
      >
        <EuiText color={textColor} size={textSize} style={{ width }}>
          {children}
        </EuiText>
      </EuiPopover>
    )
  }
}

const CuiHelpTipIconWithIntl = injectIntl(CuiHelpTipIcon)

export { CuiHelpTipIconWithIntl as CuiHelpTipIcon }
