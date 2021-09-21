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

import React, { Fragment, Component } from 'react'
import { EuiFlexItem, EuiLink, EuiProgress, EuiText } from '@elastic/eui'
import { FormattedMessage } from 'react-intl'

import VerifyEmailError from './VerifyEmailError'
import VerifyEmailSuccess from './VerifyEmailSuccess'

import { AsyncRequestState, UserProfile } from '../../../../../types'

import './verifyEmailBanner.scss'

export type Props = {
  accountDetails: UserProfile
  resendEmailVerificationLink: (email: string) => void
  resendEmailVerificationLinkRequest: AsyncRequestState
  resetEmailVerificationLinkRequest: () => void
}

class VerifyEmailBanner extends Component<Props> {
  componentWillUnmount() {
    const { resetEmailVerificationLinkRequest } = this.props
    resetEmailVerificationLinkRequest()
  }

  render() {
    const { accountDetails, resendEmailVerificationLink, resendEmailVerificationLinkRequest } =
      this.props

    if (accountDetails.email_verified) {
      return null
    }

    const { email } = accountDetails

    if (resendEmailVerificationLinkRequest.error) {
      const errorMessage =
        resendEmailVerificationLinkRequest.error === 'string' ? (
          resendEmailVerificationLinkRequest.error
        ) : (
          <FormattedMessage
            id='verify-email-banner.error-link'
            defaultMessage='There was an error with the request'
          />
        )
      return <VerifyEmailError error={errorMessage} />
    }

    if (resendEmailVerificationLinkRequest.isDone) {
      return <VerifyEmailSuccess email={accountDetails.email} />
    }

    return (
      <Fragment>
        <EuiFlexItem className='verifyEmailBanner'>
          <EuiText textAlign='center' size='s'>
            <FormattedMessage
              id='verify-email-banner.message'
              defaultMessage='Verification email sent to {email}. Click the link to complete your registration. {resendEmail}?'
              values={{
                email,
                resendEmail: (
                  <EuiLink
                    disabled={resendEmailVerificationLinkRequest.inProgress}
                    className='resendEmailLink'
                    onClick={() => resendEmailVerificationLink(email)}
                  >
                    <FormattedMessage
                      id='verify-email-banner.resend-link'
                      defaultMessage='Resend email'
                    />
                  </EuiLink>
                ),
              }}
            />
          </EuiText>
        </EuiFlexItem>
        {resendEmailVerificationLinkRequest.inProgress && <EuiProgress size='xs' color='accent' />}
      </Fragment>
    )
  }
}

export default VerifyEmailBanner
