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

import React, { BaseSyntheticEvent, Fragment, PureComponent, ReactNode } from 'react'
import { RouteComponentProps } from 'react-router'
import { defineMessages, FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl'

import { EuiFieldText, EuiForm, EuiFormRow, EuiSpacer } from '@elastic/eui'

import PasswordField from '../PasswordField'
import SpinButton from '../SpinButton'
import OpenIdSignUp from '../UserRegistration/OpenIdSignUp'
import TermsOfService from './TermsOfService'
import CreateAccountFormErrorCallout from './ErrorCallout'
import ChangePasswordFormErrorCallout from '../../apps/userconsole/components/ChangePasswordForm/ErrorCallout'

import { buildFirstSignInRedirectUrl } from '../../lib/urlUtils'
import validateEmail from '../../lib/validateEmail'
import { getThemeColors } from '../../lib/theme'
import { getCreateUserPayload } from './lib'

import { StagedUserArgs, StateProps, DispatchProps } from './types'

interface Props extends StateProps, DispatchProps, WrappedComponentProps {
  location: RouteComponentProps['location']
  onCreateUser?: ({ token: string }) => void
  stagedUser?: StagedUserArgs
}

export interface State {
  email: string
  password: string
  error: string | null
  isValidPassword: boolean
  pristine: boolean
  createdButVerificationRequired: boolean
}

const messages = defineMessages({
  emailError: {
    id: `registration-page.email-error`,
    defaultMessage: `Please use a valid email`,
  },
})

class CreateAccountForm extends PureComponent<Props> {
  emailInput: HTMLInputElement | null

  state: State = {
    password: '',
    email: '',
    error: null,
    isValidPassword: false,
    pristine: true,
    createdButVerificationRequired: false,
  }

  componentDidMount() {
    if (this.emailInput != null) {
      this.emailInput.focus()
    }
  }

  render(): ReactNode {
    const { loginRequest, createUserRequest, setInitialPasswordRequest } = this.props
    const { error, isValidPassword } = this.state

    return (
      <Fragment>
        <form onSubmit={this.onSubmit} className='create-account-form'>
          <EuiForm>
            <EuiFormRow
              isInvalid={!!error}
              error={error}
              label={<FormattedMessage id='create-account-form.email' defaultMessage='Email' />}
            >
              {this.renderEmailField()}
            </EuiFormRow>

            <PasswordField
              hideLockIcon={true}
              name='newPassword'
              label={
                <FormattedMessage id='create-account-form.new-password' defaultMessage='Password' />
              }
              onChange={this.onChangePassword}
              hasStrengthIndicator={true}
            />
            {this.renderErrorCallout()}

            <EuiFormRow>
              <SpinButton
                type='submit'
                disabled={!isValidPassword || !this.isValidEmail()}
                spin={
                  createUserRequest.inProgress ||
                  loginRequest.inProgress ||
                  setInitialPasswordRequest.inProgress
                }
                buttonProps={{ fullWidth: true }}
                data-test-id='create-account-form-button'
                fill={true}
              >
                <FormattedMessage
                  id='create-account-form.create-button'
                  defaultMessage='Create account'
                />
              </SpinButton>
            </EuiFormRow>
          </EuiForm>
        </form>

        <OpenIdSignUp />

        <EuiSpacer />

        <TermsOfService />
      </Fragment>
    )
  }

  renderErrorCallout() {
    const { stagedUser, createUserRequest, setInitialPasswordRequest } = this.props

    if (stagedUser) {
      return <ChangePasswordFormErrorCallout error={setInitialPasswordRequest.error} />
    }

    return <CreateAccountFormErrorCallout error={createUserRequest.error} />
  }

  renderEmailField() {
    const { stagedUser } = this.props
    const { error } = this.state
    const { euiColorMediumShade } = getThemeColors()

    if (stagedUser) {
      return (
        <EuiFieldText
          readOnly={true}
          name='email'
          value={stagedUser.email}
          style={{ color: euiColorMediumShade }}
        />
      )
    }

    return (
      <EuiFieldText
        isInvalid={!!error}
        onFocus={this.clearError}
        onBlur={this.validateField}
        onChange={this.onChangeEmail}
        name='email'
        inputRef={(el) => {
          this.emailInput = el
        }}
      />
    )
  }

  onChangePassword = (input, { isValidPassword }) => {
    this.setState({ password: input.value, isValidPassword })
  }

  onChangeEmail = ({ target: { value } }: BaseSyntheticEvent) => {
    this.setState({
      email: value,
    })
  }

  isValidEmail = () => {
    const { stagedUser } = this.props

    if (stagedUser) {
      return true
    }

    return validateEmail(this.state.email)
  }

  clearError = () => {
    this.setState({
      error: null,
    })
  }

  validateField = (e) => {
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

  onSubmit = (e) => {
    e.preventDefault()
    const { stagedUser } = this.props

    if (stagedUser) {
      return this.activateStagedUser(stagedUser)
    }

    return this.createUser()
  }

  activateStagedUser({ email, expires, activationHash, redirectTo }: StagedUserArgs) {
    const { password } = this.state

    if (!email) {
      return
    }

    if (!expires) {
      return
    }

    if (!activationHash) {
      return
    }

    this.props.setInitialPassword({
      email,
      expires,
      hash: activationHash,
      password,
      redirectTo,
    })
  }

  createUser() {
    const {
      createUser,
      location: { search },
    } = this.props
    const { password, email, error } = this.state

    if (error) {
      this.setState({ pristine: false })
      return
    }

    createUser({
      password,
      email,
      ...getCreateUserPayload(search),
    }).then(() =>
      this.login({ username: email, password }).then((payload) => {
        const { onCreateUser } = this.props

        if (onCreateUser) {
          onCreateUser(payload)
        }
      }),
    )
  }
}

export default injectIntl(CreateAccountForm)
