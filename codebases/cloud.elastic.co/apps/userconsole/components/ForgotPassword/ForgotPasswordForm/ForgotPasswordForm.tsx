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

import React, { BaseSyntheticEvent, Component, Fragment, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'

import { EuiFormRow, EuiFieldText, EuiSpacer, EuiTextAlign } from '@elastic/eui'

import { CuiAlert } from '../../../../../cui'
import PrivacySensitiveContainer from '../../../../../components/PrivacySensitiveContainer'
import SpinButton from '../../../../../components/SpinButton'
import LandingPageContainer from '../../../../../components/LandingPageContainer/NewLandingPageContainer'

import validateEmail from '../../../../../lib/validateEmail'
import { AsyncRequestState } from '../../../../../types'

import lightLock from '../../../../../files/cloud-lock-white.svg'
import darkLock from '../../../../../files/cloud-lock-dark.svg'

type Props = {
  onResetPassword: () => void
  resetPasswordRequest: AsyncRequestState
  onChangeEmail: (e: string) => void
  email: string
  resetPassword: (email: string) => Promise<any>
  loginUrl: string
}

type State = {
  emailError: boolean
}

class ForgotPasswordForm extends Component<Props, State> {
  state = {
    emailError: false,
  }

  render(): ReactElement {
    const { resetPasswordRequest, onChangeEmail, email, loginUrl } = this.props
    const { emailError } = this.state

    const label = <FormattedMessage id='uc.forgotPassword.emailLabel' defaultMessage='Email' />

    return (
      <LandingPageContainer
        image={lightLock}
        darkImage={darkLock}
        title={
          <FormattedMessage id='uc.forgotPassword.formTitle' defaultMessage='Reset your password' />
        }
        subtitle={
          <FormattedMessage
            id='uc.forgotPasswordForm.instructions'
            defaultMessage="Tell us the email for your account and we'll send a password reset link."
          />
        }
      >
        <EuiFormRow label={label}>
          <PrivacySensitiveContainer>
            <EuiFieldText
              data-test-id='forgotPasswordForm-email'
              value={email}
              onChange={(e) => onChangeEmail(e.target.value)}
              onBlur={this.validateField}
              onFocus={this.clearError}
            />
          </PrivacySensitiveContainer>
        </EuiFormRow>

        <EuiSpacer size='l' />

        <SpinButton
          data-test-id='forgotPasswordForm-submitButton'
          fill={true}
          spin={resetPasswordRequest.inProgress}
          disabled={email.length === 0 || resetPasswordRequest.inProgress}
          onClick={this.save}
          buttonProps={{ fullWidth: true }}
        >
          <FormattedMessage
            id='uc.forgotPasswordForm.submitButton'
            defaultMessage='Reset password'
          />
        </SpinButton>

        <EuiSpacer size='l' />

        <EuiTextAlign textAlign='center'>
          <Link to={loginUrl} data-test-id='forgot-password-cancel-button'>
            <FormattedMessage
              id='uc.forgotPasswordForm.cancelButton'
              defaultMessage='Back to login'
            />
          </Link>
        </EuiTextAlign>

        {emailError && (
          <div data-test-id='forgot-password-invalid-email'>
            <EuiSpacer size='l' />

            <CuiAlert type='danger' iconType='alert'>
              <FormattedMessage
                id='uc.forgotPassword.emailFormatError'
                defaultMessage='Invalid email address'
              />
            </CuiAlert>
          </div>
        )}

        {resetPasswordRequest.error && (
          <Fragment>
            <EuiSpacer size='l' />

            <CuiAlert type='danger' iconType='alert'>
              {resetPasswordRequest.error}
            </CuiAlert>
          </Fragment>
        )}
      </LandingPageContainer>
    )
  }

  save = (): void => {
    const { onResetPassword, resetPassword } = this.props
    const { emailError } = this.state

    if (emailError) {
      return
    }

    resetPassword(this.props.email).then(() => {
      onResetPassword()
    })
  }

  clearError = (): void => {
    this.setState({
      emailError: false,
    })
  }

  validateField = (e: BaseSyntheticEvent): void => {
    const {
      target: { value },
    } = e

    if (!validateEmail(value)) {
      this.setState({
        emailError: true,
      })
    }
  }
}

export default ForgotPasswordForm
