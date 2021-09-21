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
import cx from 'classnames'

import React, { Component, ReactElement } from 'react'
import { RouteComponentProps } from 'react-router'
import { defineMessages, FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl'

import { EuiSpacer } from '@elastic/eui'
import { withTransaction } from '@elastic/apm-rum-react'

import PasswordBasedLogin from './PasswordBasedLogin'
import EmailVerification from './EmailVerification'

import LandingPageContainer from '../LandingPageContainer/NewLandingPageContainer'
import LandingPage from '../LandingPage'
import GovCloudGate from '../GovCloudGate'
import UserAuthNotice from '../UserAuthNotice/UserAuthNotice'
import GovCloudNotice from '../UserAuthNotice/GovcloudNotice'

import { getConfigForKey } from '../../store'

import { RegistrationSource } from '../../actions/auth/auth'

import { buildRegisterUrl } from '../../lib/urlUtils'

import { SAD_hasUnexpiredSession, SAD_updateAuthTokenBits } from '../../lib/auth'

import { AsyncRequestState } from '../../types'
import { MfaState } from '../../reducers/auth/types'

type UserLogin = {
  email: string
  password: string
}

type AdminLogin = {
  username: string
  password: string
}

interface LoginParams {
  redirectTo?: string
  oktaRedirectUrl?: string
  credentials: UserLogin | AdminLogin
}

type Props = {
  location: RouteComponentProps['location']
  logout: ({ fromURI }: { fromURI?: string }) => void
  loginAndRedirect: (params: LoginParams) => Promise<any>
  loginRequest: AsyncRequestState
  redirectAfterLogin: (redirectTo?: string) => void
  redirectTo?: string
  newBearerToken: string | null
  fromURI?: string
  source?: RegistrationSource
  resendEmailVerificationLink: (email: string) => void
  resendEmailVerificationLinkRequest: AsyncRequestState
  mfa: MfaState
}

interface State {
  isUnverifiedUser: boolean
  unverifiedUserEmail: string
}

const messages = defineMessages({
  login: {
    id: `cloud-login-page-default-title`,
    defaultMessage: `Log in`,
  },
  mfa: {
    id: `login-page.title-mfa`,
    defaultMessage: `Multi-factor authentication`,
  },
  training: {
    id: `cloud-login-page.training.sub-title`,
    defaultMessage: `Official instructor-led, virtual, on-demand training for the Elastic Stack.`,
  },
  community: {
    id: `cloud-login-page.community.sub-title`,
    defaultMessage: `Connect with the Elastic community.`,
  },
  support: {
    id: `cloud-login-page.support.sub-title`,
    defaultMessage: `Support from the creators of the Elastic Stack.`,
  },
})

class UserconsoleLogin extends Component<Props & WrappedComponentProps, State> {
  state: State = {
    isUnverifiedUser: false,
    unverifiedUserEmail: '',
  }

  componentDidMount() {
    if (this.hasRedirectOnMount()) {
      this.redirectOnMount()
      return
    }
  }

  render() {
    if (this.hasRedirectOnMount()) {
      return null // the flow almost instantly redirects away from this page
    }

    const { loginRequest } = this.props

    const classes = cx({ 'login-form-sso': false })
    const isEssUserconsole =
      getConfigForKey(`APP_PLATFORM`) === `saas` && getConfigForKey(`APP_NAME`) === `userconsole`

    if (isEssUserconsole) {
      return this.renderUserConsoleFlow()
    }

    return (
      <LandingPage scrollPage={true} loading={loginRequest.inProgress} className={classes}>
        {this.renderContent()}
      </LandingPage>
    )
  }

  renderContent() {
    const { location, loginAndRedirect, mfa } = this.props
    const { search } = location

    // This is also displayed if all auth methods are disabled - because what else are we supposed to do?
    return (
      <PasswordBasedLogin
        location={location}
        loginAndRedirect={loginAndRedirect}
        canSwitchMethod={false}
        registerUrl={buildRegisterUrl({ search })}
        onUnverifiedUser={this.onUnverifiedUser}
        mfa={mfa}
      />
    )
  }

  renderUserConsoleFlow() {
    const { resendEmailVerificationLink, resendEmailVerificationLinkRequest } = this.props

    const shouldResetPassword = this.shouldResetPassword()
    const { isUnverifiedUser, unverifiedUserEmail } = this.state

    if (shouldResetPassword) {
      return (
        <EmailVerification
          onCancel={this.onCancelEmailVerification}
          email={unverifiedUserEmail}
          resendEmailVerificationLink={resendEmailVerificationLink}
          resendEmailVerificationLinkRequest={resendEmailVerificationLinkRequest}
          isPasswordNotice={true}
        />
      )
    }

    if (isUnverifiedUser) {
      return (
        <EmailVerification
          onCancel={this.onCancelEmailVerification}
          email={unverifiedUserEmail}
          resendEmailVerificationLink={resendEmailVerificationLink}
          resendEmailVerificationLinkRequest={resendEmailVerificationLinkRequest}
        />
      )
    }

    return (
      <LandingPageContainer
        type='signup'
        title={this.renderFormTitle()}
        subtitle={this.renderFormSubTitle()}
      >
        {this.renderContextMessage()}
        {this.renderContent()}

        <GovCloudGate reverse={true}>
          <EuiSpacer size='m' />

          <GovCloudNotice />
        </GovCloudGate>
      </LandingPageContainer>
    )
  }

  renderFormTitle(): ReactElement {
    const { mfa } = this.props

    const showMfaTitle = mfa.mfa_required

    if (showMfaTitle) {
      return <FormattedMessage {...messages.mfa} />
    }

    return <FormattedMessage data-test-id={messages.login.id} {...messages.login} />
  }

  renderFormSubTitle(): ReactElement | null {
    const { mfa, source } = this.props

    const showMfaTitle = mfa.mfa_required

    if (showMfaTitle || !source) {
      return null
    }

    const subtitle = messages[source]

    if (subtitle) {
      return <FormattedMessage data-test-id={subtitle.id} {...subtitle} />
    }

    return null
  }

  renderContextMessage(): ReactElement | null {
    const source = this.getContextIdentifier()

    if (!source) {
      return null
    }

    return (
      <div className='trial-message-login'>
        <UserAuthNotice source={source} />

        <EuiSpacer size='m' />
      </div>
    )
  }

  onUnverifiedUser = (email) => {
    this.setState({ isUnverifiedUser: true, unverifiedUserEmail: email })
  }

  onCancelEmailVerification = () => {
    this.setState({ isUnverifiedUser: false, unverifiedUserEmail: '' })
  }

  getContextIdentifier(): string {
    const { source } = this.props

    if (!source) {
      return ''
    }

    return source
  }

  shouldResetPassword() {
    const { loginRequest } = this.props
    const { error, inProgress } = loginRequest

    if (inProgress) {
      return false
    }

    if (!error) {
      return false
    }

    const errorReasons = get(error, [`body`, `errors`], [])
    const resetPassword = errorReasons.some((error) => error.code === `auth.expired_credentials`)
    const needsActivation = errorReasons.some((error) => error.code === `auth.activation_required`)

    return resetPassword || needsActivation
  }

  hasRedirectOnMount() {
    const { newBearerToken } = this.props

    // See `redirectOnMount` method below
    return Boolean(newBearerToken) || SAD_hasUnexpiredSession()
  }

  redirectOnMount() {
    const { fromURI, logout, redirectAfterLogin, redirectTo, newBearerToken } = this.props

    /*If users land on '/login' path and are coming from Okta (there's a fromURI parameter),
     * and we can assume Okta has already checked and there wasn't a SSO session cookie for them.
     * Even if we have a non-expired JWT token, user needs to re-authenticate.
     */
    if (fromURI) {
      logout({ fromURI })
      return
    }

    /* Allows us to receive Basic authentication requests.
     * 1. Server request to https://user:pass@cloud.elastic.co/login/_basic
     * 2. Server redirects to https://cloud.elastic.co/login#bearer_token=$API_BEARER_TOKEN
     * 3. Client persists the bearer token
     */
    if (newBearerToken) {
      SAD_updateAuthTokenBits(newBearerToken)
    }

    /* Besides being useful when we receive a Basic authentication token,
     * the original — and still intended — purpose of this redirect is
     * to not challenge authenticated users with a Login screen.
     */
    const hasSession = SAD_hasUnexpiredSession()

    if (hasSession) {
      redirectAfterLogin(redirectTo)
    }
  }
}

export default withTransaction(`UserconsoleLogin`, `component`)(injectIntl(UserconsoleLogin))
