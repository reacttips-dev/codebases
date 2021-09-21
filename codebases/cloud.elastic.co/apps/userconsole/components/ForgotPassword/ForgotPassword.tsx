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
import ForgotPasswordForm from './ForgotPasswordForm'
import ForgotPasswordEmailSent from './ForgotPasswordEmailSent'

import { AsyncRequestState } from '../../../../types'

import './forgotPassword.scss'

type Props = {
  resetPasswordRequest: AsyncRequestState
  resetPasswordResetRequest: () => void
}

type State = {
  email: string
  forgotPasswordEmailSent: boolean
}

class ForgotPassword extends Component<Props, State> {
  state: State = {
    email: ``,
    forgotPasswordEmailSent: false,
  }

  componentWillUnmount(): void {
    this.props.resetPasswordResetRequest()
  }

  render(): ReactElement {
    const { email, forgotPasswordEmailSent } = this.state
    const { resetPasswordRequest } = this.props

    if (forgotPasswordEmailSent) {
      return <ForgotPasswordEmailSent email={email} />
    }

    return (
      <ForgotPasswordForm
        onResetPassword={this.onResetPassword}
        resetPasswordRequest={resetPasswordRequest}
        email={email}
        onChangeEmail={this.onChangeEmail}
      />
    )
  }

  onChangeEmail = (value: string): void => this.setState({ email: value })

  onResetPassword = (): void => {
    this.setState({ forgotPasswordEmailSent: true })
  }
}

export default ForgotPassword
