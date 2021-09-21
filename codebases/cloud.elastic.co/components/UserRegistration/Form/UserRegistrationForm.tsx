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

import React, { PureComponent, ReactElement, Fragment } from 'react'
import { defineMessages, FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl'
import { RouteComponentProps } from 'react-router'
import { EuiFieldText, EuiFormRow, EuiSpacer } from '@elastic/eui'
import { noop } from 'lodash'

import SpinButton from '../../SpinButton'
import OpenIdSignUp from '../OpenIdSignUp'
import TermsOfService from '../../CreateAccountForm/TermsOfService'
import PasswordField from '../../PasswordField'
import CreateAccountFormErrorCallout from '../../CreateAccountForm/ErrorCallout'
import GovcloudNotice from '../../UserAuthNotice/GovcloudNotice'
import EmailVerification from '../../Login/EmailVerification'

import validateEmail from '../../../lib/validateEmail'
import { buildFirstSignInRedirectUrl, buildLoginUrl } from '../../../lib/urlUtils'
import history from '../../../lib/history'
import { getCreateUserPayload } from '../../CreateAccountForm/lib'
import PrivacySensitiveContainer from '../../PrivacySensitiveContainer'

import { AsyncRequestState } from '../../../types'
import { CreateSaasUserRequest } from '../../../lib/api/v1/types'
import { gtag } from '../../../apps/userconsole/lib/googleTracking'

import './userRegistrationForm.scss'

interface Props extends WrappedComponentProps {
  createUser: (user: CreateSaasUserRequest) => Promise<any>
  createUserRequest: AsyncRequestState
  loginRequest: AsyncRequestState
  loginAndRedirect: ({ redirectTo, oktaRedirectUrl, email, password }) => Promise<any>
  isGovCloud?: boolean
  source?: string
  resendEmailVerificationLink: (email: string) => void
  resendEmailVerificationLinkRequest: AsyncRequestState
  location: RouteComponentProps['location']
  googleAnalyticsEnabled: boolean
}

export interface State {
  email: string
  password: string
  error: string | null
  isValidPassword: boolean
  createdButVerificationRequired: boolean
}

const messages = defineMessages({
  emailError: {
    id: `cloud-sign-up-form.email-error`,
    defaultMessage: `Please use a valid email`,
  },
})

class UserRegistrationForm extends PureComponent<Props, State> {
  emailInput: HTMLInputElement | null

  state: State = {
    password: '',
    email: '',
    error: null,
    isValidPassword: false,
    createdButVerificationRequired: false,
  }

  componentDidMount(): void {
    if (this.emailInput != null) {
      this.emailInput.focus()
    }
  }

  render(): ReactElement {
    const {
      loginRequest,
      createUserRequest,
      isGovCloud,
      source,
      location,
      resendEmailVerificationLink,
      resendEmailVerificationLinkRequest,
    } = this.props
    const { error, isValidPassword, createdButVerificationRequired, email } = this.state
    const useSecondaryButtonLabel =
      source === `training` || source === `community` || source === `support`

    if (createdButVerificationRequired) {
      const { search } = location
      return (
        <EmailVerification
          onCancel={() => history.push(buildLoginUrl({ locationQueryString: search }))}
          email={email}
          resendEmailVerificationLink={resendEmailVerificationLink}
          resendEmailVerificationLinkRequest={resendEmailVerificationLinkRequest}
        />
      )
    }

    return (
      <div className='cloud-signup-form-wrapper'>
        <form onSubmit={this.onSubmit} className='cloud-signup-form'>
          <PrivacySensitiveContainer>
            <EuiFormRow
              isInvalid={!!error}
              error={error}
              fullWidth={true}
              display='rowCompressed'
              label={<FormattedMessage id='cloud-signup-page.form.email' defaultMessage='Email' />}
            >
              <EuiFieldText
                name='email'
                icon='user'
                fullWidth={true}
                isInvalid={!!error}
                onFocus={this.clearError}
                onBlur={this.validateField}
                onChange={this.onChangeEmail}
                inputRef={(el) => {
                  this.emailInput = el
                }}
              />
            </EuiFormRow>

            <EuiSpacer />

            <PasswordField
              fullWidth={true}
              hidePlaceholder={true}
              name='newPassword'
              label={
                <FormattedMessage id='cloud-signup-page.form.password' defaultMessage='Password' />
              }
              onChange={this.onChangePassword}
              hasStrengthIndicator={true}
            />

            <CreateAccountFormErrorCallout error={createUserRequest.error} />
          </PrivacySensitiveContainer>
          {!createUserRequest.error && <EuiSpacer />}

          <SpinButton
            type='submit'
            disabled={!isValidPassword || !this.isValidEmail()}
            fill={true}
            buttonProps={{ fullWidth: true }}
            spin={createUserRequest.inProgress || loginRequest.inProgress}
            className='cloud-landing-page-form-submit-button'
            data-test-id='create-account-form-button'
          >
            {useSecondaryButtonLabel ? (
              <FormattedMessage
                data-test-id='cloud-signup-secondary-button'
                id='cloud-signup.secondary-button-label'
                defaultMessage='Create account'
              />
            ) : (
              <FormattedMessage
                data-test-id='cloud-signup-default-button'
                id='cloud-signup-page.form.button-submit'
                defaultMessage='Start free trial'
              />
            )}
          </SpinButton>
        </form>

        {!isGovCloud && <OpenIdSignUp />}

        <EuiSpacer />

        <TermsOfService />

        {isGovCloud && (
          <Fragment>
            <EuiSpacer />

            <GovcloudNotice isSignup={true} />
          </Fragment>
        )}
      </div>
    )
  }

  onChangePassword = (
    input: HTMLInputElement,
    { isValidPassword }: { isValidPassword: boolean },
  ): void => {
    this.setState({ password: input.value, isValidPassword })
  }

  onChangeEmail = (e: React.BaseSyntheticEvent): void => {
    if (e.target) {
      const input = e.target
      this.setState({
        email: input.value,
      })
    }
  }

  isValidEmail = (): boolean => validateEmail(this.state.email)

  validateField = (e: React.BaseSyntheticEvent): void => {
    const {
      intl: { formatMessage },
    } = this.props

    const {
      target: { value },
    } = e

    if (value && !validateEmail(value)) {
      this.setState({
        error: formatMessage(messages.emailError),
      })
    }
  }

  clearError = () => {
    this.setState({ error: null })
  }

  onSubmit = (e) => {
    e.preventDefault()
    return this.createUser()
  }

  createUser() {
    const {
      createUser,
      location: { search, pathname },
      googleAnalyticsEnabled,
    } = this.props
    const { password, email } = this.state

    createUser({
      password,
      email,
      ...getCreateUserPayload(search),
    })
      .then(() => {
        if (googleAnalyticsEnabled) {
          // @ts-ignore
          gtag('event', 'Registration', {
            event_category: 'Cloud',
            event_label: pathname,
          })
        }

        return this.login({ username: email, password }).then((response) => {
          if (!response) {
            return
          }

          const { token } = response

          // @elastic.co users have to verify their email before login,
          // these users get 200 but no jwt in the response, so we send them to the please verify page
          if (!token) {
            this.setState({ createdButVerificationRequired: true })
          }
        })
      })
      .catch(noop)
  }

  login = ({ username, password }) => {
    const {
      loginAndRedirect,
      location: { search },
    } = this.props
    // For current implementation, when OKTA sends the user back to our signup page, there is no user session,
    // it expects that on success we redirect the user back to them(OKTA). The fromURI encodes where the user
    // should be redirected to from OKTA on authentication
    const redirectTo = buildFirstSignInRedirectUrl(search)

    return loginAndRedirect({ oktaRedirectUrl: redirectTo, redirectTo, email: username, password })
  }
}

export default injectIntl(UserRegistrationForm)
