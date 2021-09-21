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

import { get } from 'lodash'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { RouteComponentProps } from 'react-router'

import { UsernameAndPasswordForm as LoginForm } from './UsernameAndPasswordForm'
import { AsyncRequestState } from '../../../../types'
import { RegistrationSource } from '../../../../actions/auth/auth'
import { getStatus, getMessages, extractEmailFromError } from '../../../../lib/error'
import { MarketoParamsType } from '../../../../lib/urlUtils'

type Props = {
  location: RouteComponentProps['location']
  loginRequest: AsyncRequestState
  authorizeSaasOauthTokenRequest: AsyncRequestState
  resetAuthorizeSaasOauthTokenRequest: () => void
  registrationButtons: boolean
  registerUrl?: string
  onSubmit: (args: { username: string; password: string }) => void
  loginWithGoogle: (
    args?: { fromURI?: string; source?: RegistrationSource } & MarketoParamsType,
  ) => void
  loginWithAzure: (
    args?: { fromURI?: string; source?: RegistrationSource } & MarketoParamsType,
  ) => void
  isGovCloud?: boolean
}

type StateKey = keyof State

type State = {
  username: string
  password: string
}

export default class UsernameAndPasswordForm extends Component<Props, State> {
  state: State = {
    username: ``,
    password: ``,
  }

  render() {
    const {
      loginRequest,
      registrationButtons,
      registerUrl,
      loginWithGoogle,
      loginWithAzure,
      isGovCloud,
      location,
    } = this.props
    const { username, password } = this.state

    return (
      <LoginForm
        isGovCloud={isGovCloud}
        registrationButtons={registrationButtons}
        username={username}
        password={password}
        error={this.getLoginError()}
        inProgress={loginRequest.inProgress}
        updateUsername={this.updateField.bind(this, `username`)}
        updatePassword={this.updateField.bind(this, `password`)}
        onSubmit={this.login.bind(this)}
        registerUrl={registerUrl}
        loginWithGoogle={loginWithGoogle}
        loginWithAzure={loginWithAzure}
        location={location}
      />
    )
  }

  updateField(field: StateKey, e: React.ChangeEvent<HTMLInputElement>) {
    const nextState = {
      [field]: e.target.value!,
    } as Pick<State, StateKey>

    this.setState(nextState)
  }

  login(e) {
    e.preventDefault()
    this.props.resetAuthorizeSaasOauthTokenRequest()

    const { username, password } = this.state

    if (username.trim() === `` || password.trim() === ``) {
      return
    }

    this.props.onSubmit({ username, password })
  }

  getLoginError() {
    const { loginRequest, authorizeSaasOauthTokenRequest } = this.props
    const { error: loginError } = loginRequest
    const { error: oauthError } = authorizeSaasOauthTokenRequest

    if (!loginError && !oauthError) {
      return null
    }

    const responseStatusCode = getStatus(loginError)

    if (responseStatusCode >= 500) {
      return (
        <FormattedMessage
          id='username-and-password-form.internal-server-error-message'
          defaultMessage="It's not you, it's us - try again in a moment"
        />
      )
    }

    if (oauthError) {
      if (
        oauthError instanceof Error &&
        get(oauthError, [`body`, `errors`, `0`, `code`]) === `user.already_exists`
      ) {
        const message = getMessages(oauthError)
        const email = extractEmailFromError(message)
        return (
          <FormattedMessage
            id='username-and-password-form.user-already-exist-message'
            defaultMessage='{email} already exists and is not associated to a Google Sign-In account. Log in with your email address and password instead.'
            values={{
              email,
            }}
          />
        )
      }

      return oauthError
    }

    return (
      <FormattedMessage
        id='username-and-password-form.bad-request-message'
        defaultMessage='The email address or password you entered is incorrect. Please try again.'
      />
    )
  }
}
