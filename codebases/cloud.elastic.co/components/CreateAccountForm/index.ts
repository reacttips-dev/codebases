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
import { withRouter, RouteComponentProps } from 'react-router'
import { createSaasUser } from '../../actions/saasUsers'
import CreateAccountForm from './CreateAccountForm'
import { createSaasUserRequest, getLoginRequest, getTheme } from '../../reducers'

import { loginAndRedirect, loginWithGoogle } from '../../actions/auth'

import { StateProps, DispatchProps } from './types'
import { ThunkDispatch } from '../../types'
import {
  resendEmailVerificationLinkRequest,
  setInitialPasswordRequest,
} from '../../apps/userconsole/reducers'
import {
  resendEmailVerificationLink,
  setInitialPassword,
} from '../../apps/userconsole/actions/account'

type ConsumerProps = RouteComponentProps

const mapStateToProps = (state): StateProps => ({
  createUserRequest: createSaasUserRequest(state),
  loginRequest: getLoginRequest(state),
  theme: getTheme(state),
  resendEmailVerificationLinkRequest: resendEmailVerificationLinkRequest(state),
  setInitialPasswordRequest: setInitialPasswordRequest(state),
})

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  createUser: (user) => dispatch(createSaasUser(user)),
  loginAndRedirect: ({ email, password, redirectTo, oktaRedirectUrl }) =>
    dispatch(loginAndRedirect({ oktaRedirectUrl, redirectTo, credentials: { email, password } })),
  loginWithGoogle: (args) => dispatch(loginWithGoogle(args)),
  resendEmailVerificationLink: (email) => dispatch(resendEmailVerificationLink(email)),
  setInitialPassword: ({ email, expires, hash, password, redirectTo }) =>
    dispatch(setInitialPassword({ email, expires, hash, password, redirectTo })),
})

export default withRouter(
  connect<StateProps, DispatchProps, ConsumerProps>(
    mapStateToProps,
    mapDispatchToProps,
  )(CreateAccountForm),
)
