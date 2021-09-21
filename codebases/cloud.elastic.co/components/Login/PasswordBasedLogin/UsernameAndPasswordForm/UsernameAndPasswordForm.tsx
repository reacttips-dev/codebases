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

import React, { Component, Fragment, ReactElement, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'
import { RouteComponentProps } from 'react-router'

import { stringify } from 'query-string'
import { isEmpty, omit } from 'lodash'

import {
  EuiFieldText,
  EuiFieldPassword,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiSpacer,
  EuiText,
} from '@elastic/eui'

import { CuiAlert, CuiLink } from '../../../../cui'

import GoogleSignUp from '../../../CreateAccountForm/GoogleSignUp'
import MicrosoftSignUp from '../../../CreateAccountForm/MicrosoftSignUp'
import SpinButton from '../../../SpinButton'

import PrivacySensitiveContainer from '../../../PrivacySensitiveContainer'

import { getConfigForKey } from '../../../../store'

import { RegistrationSource } from '../../../../actions/auth/auth'

import { forgotPasswordUrl } from '../../../../lib/urlBuilder'
import { buildSignInQuery, MarketoParamsType, SignInQueryParams } from '../../../../lib/urlUtils'

export type Props = {
  location: RouteComponentProps['location']
  error: ReactNode | null
  username: string
  password: string
  updateUsername
  updatePassword
  onSubmit: () => void
  inProgress: boolean
  registrationButtons: boolean
  registerUrl?: string
  loginWithGoogle: (
    args?: { fromURI?: string; source?: RegistrationSource } & MarketoParamsType,
  ) => void
  loginWithAzure: (
    args?: { fromURI?: string; source?: RegistrationSource } & MarketoParamsType,
  ) => void
  isGovCloud?: boolean
}

const usernameText = <FormattedMessage id='login.username-text' defaultMessage='Username' />
const emailText = <FormattedMessage id='login.email-text' defaultMessage='Email' />
const passwordText = <FormattedMessage id='login.password-text' defaultMessage='Password' />

export class UsernameAndPasswordForm extends Component<Props> {
  usernameInput: HTMLInputElement | null

  componentDidMount(): void {
    if (this.usernameInput != null) {
      this.usernameInput.focus()
    }
  }

  render(): ReactElement {
    const {
      error,
      username,
      password,
      updateUsername,
      updatePassword,
      onSubmit,
      inProgress,
      registrationButtons,
      registerUrl,
      isGovCloud,
      location: { search },
    } = this.props

    const isEce = getConfigForKey(`CLOUD_UI_APP`) === `cloud-enterprise-adminconsole`
    const isPrivate = getConfigForKey(`APP_FAMILY`) === `essp`

    const query = buildSignInQuery({ search, withReferrer: true })

    const usernameLabel = isEce ? usernameText : emailText

    return (
      <form onSubmit={onSubmit} className='login-form-password'>
        <PrivacySensitiveContainer>
          <EuiFormRow
            label={usernameLabel}
            className='login-form-email'
            data-test-id='username-form-row'
          >
            <EuiFieldText
              data-test-id='login-username'
              inputRef={(el) => {
                this.usernameInput = el
              }}
              icon='user'
              value={username}
              onChange={updateUsername}
            />
          </EuiFormRow>

          <EuiSpacer size='l' />

          <EuiFormRow className='login-form-password-field' label={passwordText}>
            <EuiFieldPassword
              data-test-id='login-password'
              value={password}
              onChange={updatePassword}
              type='dual'
            />
          </EuiFormRow>
        </PrivacySensitiveContainer>

        <EuiSpacer />

        <SpinButton
          type='submit'
          data-test-id='login-button'
          className='cloud-landing-page-form-submit-button'
          color={error ? `danger` : `primary`}
          fill={true}
          spin={inProgress}
          disabled={!this.isSubmittable()}
          buttonProps={{ fullWidth: true }}
        >
          <FormattedMessage id='login-login-form.log-in' defaultMessage='Log in' />
        </SpinButton>

        {registrationButtons && (
          <Fragment>
            <EuiSpacer />

            <EuiText textAlign='center' size='s' className='forgotPasswordLink'>
              <CuiLink
                to={this.buildForgotPasswordLinkUrl(omit(query, 'referrer'))}
                data-test-id='forgot-password-link'
              >
                <FormattedMessage
                  id='login-form.forgot-password'
                  defaultMessage='Forgot password?'
                />
              </CuiLink>
            </EuiText>
          </Fragment>
        )}

        {error && (
          <Fragment>
            <EuiSpacer />
            <CuiAlert data-test-id='login-error' type='error'>
              {error}
            </CuiAlert>
          </Fragment>
        )}

        {registrationButtons && registerUrl && !isPrivate && !isGovCloud && (
          <Fragment>
            <EuiSpacer />

            <div className='social-signup-form-separator'>
              <EuiText size='s'>
                <FormattedMessage id='login-form.or-google' defaultMessage='Or log in with' />
              </EuiText>
            </div>

            <EuiSpacer />

            {!isGovCloud && (
              <EuiFlexGroup alignItems='center' gutterSize='s'>
                <EuiFlexItem>
                  <GoogleSignUp fullText={false} />
                </EuiFlexItem>

                <EuiFlexItem>
                  <MicrosoftSignUp fullText={false} />
                </EuiFlexItem>
              </EuiFlexGroup>
            )}
          </Fragment>
        )}
      </form>
    )
  }

  buildForgotPasswordLinkUrl(query?: SignInQueryParams): string {
    const forgotPasswordLinkUrl = forgotPasswordUrl()

    if (!query || isEmpty(query)) {
      return forgotPasswordLinkUrl
    }

    return `${forgotPasswordLinkUrl}?${stringify(query)}`
  }

  isSubmittable(): boolean {
    const { username, password } = this.props
    return !!username.trim() && !!password.trim()
  }
}
