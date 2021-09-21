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

import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'

import { createSaasUser } from '../../../actions/saasUsers'
import { loginAndRedirect, loginWithGoogle } from '../../../actions/auth'

import SignupForm from './UserRegistrationForm'

import { createSaasUserRequest, getLoginRequest, getTheme } from '../../../reducers'
import { OpenIdLoginArgs } from '../../../actions/auth/auth'

import { AsyncRequestState, ReduxState, ThunkDispatch } from '../../../types'
import { CreateSaasUserRequest } from '../../../lib/api/v1/types'
import { getConfigForKey } from '../../../selectors'
import { getRegistrationSource } from '../../../lib/urlUtils'
import { resendEmailVerificationLinkRequest } from '../../../apps/userconsole/reducers'
import { resendEmailVerificationLink } from '../../../apps/userconsole/actions/account'

interface ConsumerProps extends RouteComponentProps {}

interface DispatchProps {
  createUser: (user: CreateSaasUserRequest) => Promise<any>
  loginAndRedirect: ({ redirectTo, oktaRedirectUrl, email, password }) => Promise<any>
  loginWithGoogle: (args: OpenIdLoginArgs) => void
  resendEmailVerificationLink: (email: string) => void
}

interface StateProps {
  createUserRequest: AsyncRequestState
  loginRequest: AsyncRequestState
  source?: string
  theme: string
  resendEmailVerificationLinkRequest: AsyncRequestState
  googleAnalyticsEnabled: boolean
}

const mapStateToProps = (state: ReduxState, { location }: ConsumerProps): StateProps => {
  const { search } = location

  return {
    theme: getTheme(state),
    resendEmailVerificationLinkRequest: resendEmailVerificationLinkRequest(state),
    source: getRegistrationSource(search),
    createUserRequest: createSaasUserRequest(state),
    loginRequest: getLoginRequest(state),
    googleAnalyticsEnabled: getConfigForKey(state, `GOOGLE_ANALYTICS_TRACKING_ID`) !== null,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  createUser: (user) => dispatch(createSaasUser(user)),
  loginAndRedirect: ({ email, password, redirectTo, oktaRedirectUrl }) =>
    dispatch(loginAndRedirect({ oktaRedirectUrl, redirectTo, credentials: { email, password } })),
  loginWithGoogle: (args) => dispatch(loginWithGoogle(args)),
  resendEmailVerificationLink: (email) => dispatch(resendEmailVerificationLink(email)),
})

export default withRouter(
  connect<StateProps, DispatchProps, ConsumerProps>(
    mapStateToProps,
    mapDispatchToProps,
  )(SignupForm),
)
