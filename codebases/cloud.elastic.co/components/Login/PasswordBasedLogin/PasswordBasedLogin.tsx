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

import React, { Component, Fragment } from 'react'
import { RouteComponentProps } from 'react-router'

import { FormattedMessage } from 'react-intl'
import { parse } from 'query-string'

import { EuiLoadingSpinner, EuiSpacer, EuiText, EuiFlexGroup, EuiFlexItem } from '@elastic/eui'

import UsernameAndPasswordForm from './UsernameAndPasswordForm'
import MfaForm from './MfaForm'
import PrivacySensitiveContainer from '../../PrivacySensitiveContainer'

import { CuiRouterLinkButtonEmpty } from '../../../cui'

import { RegistrationSource } from '../../../actions/auth/auth'

import { MarketoParamsType } from '../../../lib/urlUtils'

import { MfaState } from '../../../reducers/auth/types'
import { AsyncRequestState } from '../../../types'

type UserLogin = {
  email: string
  password: string
}

type AdminLogin = {
  username: string
  password: string
}

export type Props = {
  location: RouteComponentProps['location']
  loginAndRedirect: (args: {
    redirectTo?: string
    oktaRedirectUrl?: string
    credentials: UserLogin | AdminLogin
  }) => Promise<any>
  isCheckingAuthMethods?: boolean
  canSwitchMethod: boolean
  registerUrl?: string
  onUnverifiedUser?: (email: string) => void
  mfa?: MfaState

  loginRequest: AsyncRequestState
  submitMfaResponseRequest: AsyncRequestState
  authorizeSaasOauthTokenRequest: AsyncRequestState
  registrationButtons: boolean

  sendMfaChallenge: (args: { device_id: string; state_id: string | undefined }) => Promise<any>
  submitMfaResponse: (args: {
    redirectTo?: string
    device_id: string
    state_id: string | undefined
    pass_code: string
  }) => void
  resetSubmitMfaResponseRequest: () => void
  resetAuthorizeSaasOauthTokenRequest: () => void
  loginWithGoogle: (
    args?: { fromURI?: string; source?: RegistrationSource } & MarketoParamsType,
  ) => void
  loginWithAzure: (
    args?: { fromURI?: string; source?: RegistrationSource } & MarketoParamsType,
  ) => void
  isGovCloud: boolean
}

export default class PasswordBasedLogin extends Component<Props> {
  render() {
    return (
      <div>
        {this.renderForm()}
        {this.renderCheckingAuthMethods()}
        {this.renderSwitchMethod()}
      </div>
    )
  }

  renderSwitchMethod() {
    const { canSwitchMethod, location } = this.props

    if (!canSwitchMethod) {
      return null
    }

    return (
      <Fragment>
        <EuiSpacer />
        <div style={{ textAlign: `center` }}>
          <CuiRouterLinkButtonEmpty
            data-test-id='switch-to-sso'
            to={{ pathname: '/login/sso', search: location.search }}
          >
            <EuiText size='s'>
              <FormattedMessage
                id='log-in.switch-to-sso'
                defaultMessage='Switch to Single Sign-On'
              />
            </EuiText>
          </CuiRouterLinkButtonEmpty>
        </div>
      </Fragment>
    )
  }

  renderCheckingAuthMethods() {
    const { isCheckingAuthMethods } = this.props

    if (!isCheckingAuthMethods) {
      return null
    }

    return (
      <Fragment>
        <EuiSpacer />
        <div data-test-id='checking-for-sso'>
          <EuiFlexGroup gutterSize='s' justifyContent='center'>
            <EuiFlexItem grow={false}>
              <EuiText size='s'>
                <FormattedMessage
                  id='log-in.checking-for-sso'
                  defaultMessage='Checking whether SSO is available'
                />
              </EuiText>
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <EuiLoadingSpinner size='m' />
            </EuiFlexItem>
          </EuiFlexGroup>
        </div>
      </Fragment>
    )
  }

  renderForm() {
    const {
      loginRequest,
      registrationButtons,
      mfa,
      submitMfaResponseRequest,
      resetSubmitMfaResponseRequest,
      resetAuthorizeSaasOauthTokenRequest,
      authorizeSaasOauthTokenRequest,
      registerUrl,
      loginWithGoogle,
      loginWithAzure,
      isGovCloud,
      location,
    } = this.props

    if (mfa && mfa.mfa_required) {
      return (
        <PrivacySensitiveContainer>
          <MfaForm
            mfa={mfa}
            sendMfaChallenge={this.sendMfaChallenge}
            submitMfaResponseRequest={submitMfaResponseRequest}
            resetSubmitMfaResponseRequest={resetSubmitMfaResponseRequest}
            onSubmit={this.submitMfaResponse}
          />
        </PrivacySensitiveContainer>
      )
    }

    return (
      <UsernameAndPasswordForm
        isGovCloud={isGovCloud}
        loginRequest={loginRequest}
        registrationButtons={registrationButtons}
        onSubmit={this.login}
        registerUrl={registerUrl}
        loginWithGoogle={loginWithGoogle}
        loginWithAzure={loginWithAzure}
        resetAuthorizeSaasOauthTokenRequest={resetAuthorizeSaasOauthTokenRequest}
        authorizeSaasOauthTokenRequest={authorizeSaasOauthTokenRequest}
        location={location}
      />
    )
  }

  getUrlParams() {
    const { location } = this.props
    const query = parse(location.search.slice(1))
    const { fromURI, redirectTo: redirectRaw } = query

    const oktaRedirectUrl = typeof fromURI === `string` ? fromURI : undefined
    const redirectTo = typeof redirectRaw === `string` ? redirectRaw : undefined

    return { oktaRedirectUrl, redirectTo }
  }

  getRedirectUrl() {
    const { oktaRedirectUrl, redirectTo } = this.getUrlParams()
    return { oktaRedirectUrl, redirectTo }
  }

  login = ({ username, password }) => {
    const { loginAndRedirect, onUnverifiedUser } = this.props

    const params = {
      ...this.getRedirectUrl(),
      credentials: { username, password },
    }

    loginAndRedirect(params).then((res) => {
      if (res && res.isUnverifiedUser && onUnverifiedUser) {
        onUnverifiedUser(username)
      }
    })
  }

  sendMfaChallenge = (device_id) => {
    const { sendMfaChallenge, mfa } = this.props
    return sendMfaChallenge({
      device_id,
      state_id: mfa ? mfa.state_id : undefined,
    })
  }

  submitMfaResponse = ({ pass_code, device_id }) => {
    const { submitMfaResponse, mfa } = this.props

    submitMfaResponse({
      ...this.getRedirectUrl(),
      device_id,
      state_id: mfa ? mfa.state_id : undefined,
      pass_code,
    })
  }
}
