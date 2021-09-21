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

import SpinButton from '../../SpinButton'
import LandingPageContainer from '../../LandingPageContainer/NewLandingPageContainer'

import { AsyncRequestState } from '../../../types'

import verifyEmailDark from '../../../files/illustration-check-email-dark.svg'
import verifyEmailLight from '../../../files/illustration-check-email-light.svg'

import './emailVerification.scss'

interface Props {
  onCancel: () => void
  email: string
  resendEmailVerificationLink: (email: string) => void
  resendEmailVerificationLinkRequest: AsyncRequestState
  isPasswordNotice?: boolean
}

class EmailVerification extends PureComponent<Props> {
  render(): ReactElement {
    return (
      <LandingPageContainer
        image={verifyEmailLight}
        darkImage={verifyEmailDark}
        title={this.renderTitle()}
        subtitle={this.renderSubTitle()}
      >
        {this.renderContent()}
      </LandingPageContainer>
    )
  }

  renderTitle(): ReactElement {
    const { resendEmailVerificationLinkRequest, isPasswordNotice } = this.props

    if (resendEmailVerificationLinkRequest.isDone) {
      return (
        <FormattedMessage
          data-test-id='email-verification-verification-email-sent'
          id='email-verification.verification-email-sent'
          defaultMessage='Email sent'
        />
      )
    }

    if (isPasswordNotice) {
      return (
        <FormattedMessage
          data-test-id='email-verification-verify-email-title'
          id='email-verification.check-email-title'
          defaultMessage='Check your email'
        />
      )
    }

    return (
      <FormattedMessage
        data-test-id='email-verification-verify-email-title'
        id='email-verification.verify-email-title'
        defaultMessage='Verify your email'
      />
    )
  }

  renderSubTitle(): ReactElement {
    const { email, isPasswordNotice } = this.props

    const checkSpam = (
      <FormattedMessage
        id='email-verification.check-spam-folder'
        defaultMessage="Can't find it? Make sure you check your spam folder."
      />
    )

    if (isPasswordNotice) {
      return (
        <FormattedMessage
          id='email-verification.sent-password-notice'
          defaultMessage='To ensure that your account stays secure, we sent an email with a link to set a new password. {checkSpam}'
          values={{
            checkSpam,
          }}
        />
      )
    }

    return (
      <FormattedMessage
        id='email-verification.sent-email-verification'
        defaultMessage='We sent you a verification link to {email}. {checkSpam}'
        values={{ email: <strong>{email}</strong>, checkSpam }}
      />
    )
  }

  renderContent(): ReactElement | null {
    const { isPasswordNotice, onCancel, resendEmailVerificationLinkRequest } = this.props

    if (isPasswordNotice) {
      return null
    }

    return (
      <Fragment>
        <SpinButton
          data-test-id='email-verification-resend-email-button'
          color='primary'
          fill={true}
          onClick={this.resendEmailVerificationLink}
          spin={resendEmailVerificationLinkRequest.inProgress}
          buttonProps={{ fullWidth: true }}
        >
          <FormattedMessage id='email-verification.resend-email' defaultMessage='Resend email' />
        </SpinButton>

        <EuiSpacer />

        <EuiTextAlign textAlign='center'>
          <EuiButtonEmpty onClick={onCancel} data-test-id='email-verification-back-button'>
            <FormattedMessage
              id='email-verification.back-to-login-page'
              defaultMessage='Back to login page'
            />
          </EuiButtonEmpty>
        </EuiTextAlign>
      </Fragment>
    )
  }

  resendEmailVerificationLink = (): void => {
    const { email } = this.props
    this.props.resendEmailVerificationLink(email)
  }
}

export default EmailVerification
