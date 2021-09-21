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
import { RouteComponentProps } from 'react-router'

import PasswordBasedLogin from './PasswordBasedLogin'

import {
  sendMfaChallenge,
  submitMfaResponse,
  resetSubmitMfaResponseRequest,
  resetAuthorizeSaasOauthTokenRequest,
  loginWithGoogle,
  loginWithAzure,
} from '../../../actions/auth'

import { getLoginRequest, getSubmitMfaResponseRequest } from '../../../reducers'
import { authorizeSaasOauthTokenRequest } from '../../../apps/userconsole/reducers'

import { isFeatureActivated } from '../../../selectors'
import Feature from '../../../lib/feature'
import { AsyncRequestState } from '../../../types'
import { MfaState } from '../../../reducers/auth/types'
import { RegistrationSource } from '../../../actions/auth/auth'
import { MarketoParamsType } from '../../../lib/urlUtils'

type StateProps = {
  loginRequest: AsyncRequestState
  submitMfaResponseRequest: AsyncRequestState
  authorizeSaasOauthTokenRequest: AsyncRequestState
  registrationButtons: boolean
  isGovCloud?: boolean
}

type DispatchProps = {
  sendMfaChallenge: (args: { device_id: string; state_id: string | undefined }) => void
  submitMfaResponse: (args: {
    redirectTo?: string
    device_id: string
    state_id: string
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
}

type ConsumerProps = {
  location: RouteComponentProps['location']
  loginAndRedirect: (args: {
    redirectTo?: string
    oktaRedirectUrl?: string
    credentials: { email: string; password: string }
  }) => Promise<any>
  isCheckingAuthMethods?: boolean
  canSwitchMethod: boolean
  registerUrl?: string
  onUnverifiedUser?: (email: string) => void
  mfa?: MfaState
}

const mapStateToProps = (state): StateProps => ({
  loginRequest: getLoginRequest(state),
  submitMfaResponseRequest: getSubmitMfaResponseRequest(state),
  authorizeSaasOauthTokenRequest: authorizeSaasOauthTokenRequest(state),
  registrationButtons: isFeatureActivated(state, Feature.registrationButtons),
  isGovCloud: isFeatureActivated(state, Feature.hideIrrelevantSectionsFromGovCloud),
})

const mapDispatchToProps = {
  sendMfaChallenge,
  submitMfaResponse,
  resetSubmitMfaResponseRequest,
  resetAuthorizeSaasOauthTokenRequest,
  loginWithGoogle,
  loginWithAzure,
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(PasswordBasedLogin)
