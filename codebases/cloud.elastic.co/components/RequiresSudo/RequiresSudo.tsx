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

import React, { Component, ComponentType, Fragment, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { omit } from 'lodash'

import { EuiButton, EuiFormHelpText } from '@elastic/eui'

import UserSudoModal from '../UserSudoModal'

type RenderSudoGateFn = (props: { children: ReactNode; openSudoModal: () => void }) => ReactNode

export type Props = {
  buttonType?: ComponentType<any>
  isSudoFeatureActivated: boolean
  hasSudo: boolean
  to?: string | ReactNode
  children?: ReactNode
  helpText?: boolean
  actionPrefix?: boolean
  onSudo?: (result: any) => void
  renderSudoGate?: RenderSudoGateFn | boolean
  [buttonProp: string]: any
}

type SudoGateProps = {
  buttonText?: any
  buttonProps: any
}

type State = {
  isSudoModalOpen: boolean
}

class RequiresSudo extends Component<Props, State> {
  static defaultProps = {
    helpText: true,
    actionPrefix: true,
    buttonType: EuiButton,
    renderSudoGate: true,
  }

  state: State = {
    isSudoModalOpen: false,
  }

  render() {
    const { onSudo } = this.props
    const { isSudoModalOpen } = this.state

    return (
      <Fragment>
        {this.renderContent()}

        {isSudoModalOpen && <UserSudoModal onSudo={onSudo} close={this.closeSudoModal} />}
      </Fragment>
    )
  }

  renderContent() {
    const {
      isSudoFeatureActivated,
      hasSudo,
      to: message,
      children,
      helpText,
      actionPrefix,
      ...rest
    } = this.props

    const buttonProps = omit(rest, [`buttonType`, `onSudo`, `renderSudoGate`])

    if (isSudoFeatureActivated && !hasSudo) {
      if (!helpText) {
        if (!actionPrefix) {
          return this.renderUnprivilegedMessage({ buttonProps, buttonText: message })
        }

        return this.renderUnprivilegedMessage({
          buttonProps,
          buttonText: (
            <FormattedMessage
              id='requires-sudo.enable-sudo-to-act'
              defaultMessage='Enable sudo to { message }'
              values={{ message }}
            />
          ),
        })
      }

      return this.renderUnprivilegedMessage({ buttonProps })
    }

    if (!children) {
      return null
    }

    return <Fragment>{children}</Fragment>
  }

  renderUnprivilegedMessage(sudoGateProps: SudoGateProps) {
    const renderSudoGate = this.props.renderSudoGate!

    if (renderSudoGate === false) {
      return null
    }

    const contents = this.renderSudoGateContents(sudoGateProps)

    if (renderSudoGate === true) {
      return contents
    }

    return renderSudoGate({
      children: contents,
      openSudoModal: () => this.openSudoModal(),
    })
  }

  renderSudoGateContents({ buttonText, buttonProps }: SudoGateProps) {
    const { buttonType: Button, to: message, helpText } = this.props

    if (!Button) {
      return null
    }

    return (
      <div>
        <Button onClick={this.openSudoModal} {...buttonProps}>
          {buttonText || (
            <FormattedMessage id='requires-sudo.enable-sudo' defaultMessage='Enable sudo' />
          )}
        </Button>

        {helpText && (
          <EuiFormHelpText>
            <FormattedMessage
              id='requires-sudo.enable-sudo-reason'
              defaultMessage="In order to { message }, you'll need sudo powers."
              values={{ message }}
            />
          </EuiFormHelpText>
        )}
      </div>
    )
  }

  openSudoModal = () => {
    this.setState({ isSudoModalOpen: true })
  }

  closeSudoModal = () => {
    this.setState({ isSudoModalOpen: false })
  }
}

export default RequiresSudo
