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

import React, { Fragment, PureComponent, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import { EuiButtonEmpty, EuiSpacer, EuiTextAlign } from '@elastic/eui'

import { CuiAlert } from '../../../../../cui'

import SpinButton from '../../../../../components/SpinButton'
import LandingPageContainer from '../../../../../components/LandingPageContainer/NewLandingPageContainer'

import history from '../../../../../lib/history'
import { loginUrl } from '../../../../../lib/urlBuilder'
import { AsyncRequestState } from '../../../../../types'

import verifyEmailDark from '../../../../../files/illustration-check-email-dark.svg'
import verifyEmailLight from '../../../../../files/illustration-check-email-light.svg'

interface Props {
  email: string
  resetPassword: (email: string) => void
  resetPasswordRequest: AsyncRequestState
}

class ForgotPasswordEmailSent extends PureComponent<Props> {
  render(): ReactElement {
    const { resetPasswordRequest } = this.props

    return (
      <LandingPageContainer
        image={verifyEmailLight}
        darkImage={verifyEmailDark}
        title={this.renderTitle()}
        subtitle={this.renderSubTitle()}
      >
        <SpinButton
          data-test-id='email-verification-resend-email-button'
          color='primary'
          fill={true}
          onClick={this.resendResetPasswordLink}
          spin={resetPasswordRequest.inProgress}
          buttonProps={{ fullWidth: true }}
        >
          <FormattedMessage id='forgot-password.resend-email' defaultMessage='Resend email' />
        </SpinButton>

        <EuiSpacer size='l' />

        <EuiTextAlign textAlign='center'>
          <EuiButtonEmpty
            onClick={() => history.push(loginUrl())}
            data-test-id='email-verification-back-button'
          >
            <FormattedMessage
              id='forgot-password.back-to-login-page'
              defaultMessage='Back to login'
            />
          </EuiButtonEmpty>
        </EuiTextAlign>

        {resetPasswordRequest.error && (
          <Fragment>
            <EuiSpacer size='m' />
            <CuiAlert type='danger' iconType='alert'>
              {resetPasswordRequest.error}
            </CuiAlert>
          </Fragment>
        )}
      </LandingPageContainer>
    )
  }

  renderTitle(): ReactElement {
    return (
      <FormattedMessage
        data-test-id='reset-password-email-sent'
        id='forgot-password.check-your-email'
        defaultMessage='Check your email'
      />
    )
  }

  renderSubTitle(): ReactElement {
    const { email } = this.props

    return (
      <FormattedMessage
        id='forgot-password.sent-email-reset'
        defaultMessage="Reset link sent to {email}. Don't see it? Not in your spam folder? You might have signed up with a different email address."
        values={{ email: <strong>{email}</strong> }}
      />
    )
  }

  resendResetPasswordLink = (): void => {
    const { email, resetPassword } = this.props
    resetPassword(email)
  }
}

export default ForgotPasswordEmailSent
