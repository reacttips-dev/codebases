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

import React from 'react'
import { FormattedMessage } from 'react-intl'
import { EuiSpacer, EuiText, EuiEmptyPrompt } from '@elastic/eui'
import PrivacySensitiveContainer from '../../../../components/PrivacySensitiveContainer'

import verifyEmailDark from '../../../../files/illustration-check-email-dark.svg'
import verifyEmailLight from '../../../../files/illustration-check-email-light.svg'

export default function PartnerSignupComplete({ email, theme }) {
  const iconType = theme === 'light' ? verifyEmailLight : verifyEmailDark

  return (
    <EuiEmptyPrompt
      iconType={iconType}
      className='email-verification-prompt'
      title={
        <EuiText>
          <h2>
            <FormattedMessage
              id='email-verification.verify-email-title'
              defaultMessage='Verify your email'
            />
          </h2>
        </EuiText>
      }
      body={
        <div className='partnerSignup-complete'>
          <EuiSpacer size='m' />
          <PrivacySensitiveContainer>
            <EuiText>
              <p>
                <FormattedMessage
                  id='uc.partnerSignupComplete.para1'
                  defaultMessage="We've sent a confirmation email to {email}. Open it and follow the instructions to activate and sign in to your account."
                  values={{
                    email: <strong>{email}</strong>,
                  }}
                />
              </p>
              <p>
                <FormattedMessage
                  id='uc.partnerSignupComplete.para2'
                  defaultMessage="If you for some reason haven't received the email within a few minutes, please check your spam folder."
                />
              </p>
            </EuiText>
          </PrivacySensitiveContainer>
        </div>
      }
    />
  )
}
