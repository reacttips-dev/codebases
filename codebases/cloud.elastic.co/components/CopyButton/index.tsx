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

import React, { Component, ReactElement } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { defineMessages, injectIntl, WrappedComponentProps } from 'react-intl'

import {
  EuiButtonEmpty,
  EuiButtonEmptyColor,
  EuiButtonEmptySizes,
  EuiButtonIcon,
  EuiButtonIconColor,
  EuiButtonIconProps,
  EuiIcon,
  EuiLink,
  EuiLinkColor,
  EuiToolTip,
} from '@elastic/eui'

type EuiButtonIconSizes = EuiButtonIconProps['size']

type CopyButtonProps = {
  'aria-label': string
  className?: string
  iconType: 'checkInCircleFilled' | 'copyClipboard'
}

interface Props extends WrappedComponentProps {
  value: string
  children?: ReactElement | ((props: CopyButtonProps) => ReactElement)
  className?: string
  asLink?: boolean
  asIconLink?: boolean
  color?: EuiButtonIconColor | EuiButtonEmptyColor
  size?: 's' | 'm'
}

interface State {
  copied: boolean
}

const messages = defineMessages({
  copyToClipboard: {
    id: `copy-button.copy-to-clipboard`,
    defaultMessage: `Copy to clipboard`,
  },
  copiedToClipboard: {
    id: `copy-button.copied-to-clipboard`,
    defaultMessage: `Copied!`,
  },
})

const TIMEOUT = 2500

class CopyButton extends Component<Props, State> {
  private _timeout: number

  state: State = {
    copied: false,
  }

  componentWillUnmount() {
    window.clearTimeout(this._timeout)
  }

  render() {
    const { value } = this.props

    const tooltipContent = this.getTooltipContent()

    return (
      <EuiToolTip content={tooltipContent}>
        <CopyToClipboard text={value} onCopy={this.onCopy}>
          {this.renderButton()}
        </CopyToClipboard>
      </EuiToolTip>
    )
  }

  renderButton() {
    const { asIconLink, asLink, className, color = `text`, size = `s`, children } = this.props
    const { copied } = this.state

    const tooltipContent = this.getTooltipContent()

    const iconType = copied ? `checkInCircleFilled` : `copyClipboard`

    const copyButtonProps: CopyButtonProps = {
      'aria-label': tooltipContent,
      iconType,
      className,
    }

    if (asIconLink) {
      return (
        <EuiLink aria-label={tooltipContent} color={color as EuiLinkColor}>
          <EuiIcon type={iconType} />
        </EuiLink>
      )
    }

    if (asLink) {
      return <EuiLink aria-label={tooltipContent}>{children}</EuiLink>
    }

    if (typeof children === 'function') {
      return children(copyButtonProps)
    }

    if (children) {
      return (
        <EuiButtonEmpty
          // since we infer the button type from the presence of children,
          // we can't know the correct types of the color or size props until runtime
          color={color as EuiButtonEmptyColor}
          size={size as EuiButtonEmptySizes}
          {...copyButtonProps}
        >
          {children}
        </EuiButtonEmpty>
      )
    }

    return (
      <EuiButtonIcon
        // since we infer the button type from the presence of children,
        // we can't know the correct types of the color or size props until runtime
        color={color}
        size={size as EuiButtonIconSizes}
        {...copyButtonProps}
      />
    )
  }

  getTooltipContent() {
    const {
      intl: { formatMessage },
    } = this.props
    const { copied } = this.state

    const tooltipContent = copied
      ? formatMessage(messages.copiedToClipboard)
      : formatMessage(messages.copyToClipboard)

    return tooltipContent
  }

  onCopy = () => {
    this.setState({ copied: true })

    this._timeout = window.setTimeout(() => {
      this.setState({ copied: false })
    }, TIMEOUT)
  }
}

export default injectIntl(CopyButton)
