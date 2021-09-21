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

import UserAccountSettings from './UserAccountSettings'

import {
  fetchAccountDetailsIfNeeded,
  resetUpdateAccountDetailsRequest,
  resetUpdateAccountPasswordRequest,
  updateAccountDetails,
  updateAccountPassword,
} from '../../../../apps/userconsole/actions/account'
import {
  disableMfaDeviceRequest,
  enableMfaDeviceRequest,
  getMfaDevices,
  getMfaEnabled,
  getAccountDetails,
  getAccountUI,
  fetchAccountDetailsRequest,
  updateAccountDetailsRequest,
  updateAccountPasswordRequest,
} from '../../../../apps/userconsole/reducers'
import { fetchMfaDevicesRequest } from '../../../../reducers'
import {
  disableMfa,
  enableMfa,
  fetchMfaDevices,
  fetchMfaStatus,
} from '../../../../apps/userconsole/actions/mfa'

import { AccountUI, AsyncRequestState, ThunkDispatch, UserProfile } from '../../../../types'
import { SaasUserProfile, SaasUserRules } from '../../../../lib/api/v1/types'

interface StateProps {
  accountDetails: UserProfile
  ui: AccountUI
  fetchAccountDetailsRequest: AsyncRequestState
  updateAccountDetailsRequest: AsyncRequestState
  updateAccountPasswordRequest: AsyncRequestState
}

interface DispatchProps {
  fetchAccountDetailsIfNeeded: () => Promise<any>
  updateAccountDetails: (accountDetails: SaasUserProfile & SaasUserRules) => void
  resetUpdateAccountDetailsRequest: () => void
  resetUpdateAccountPasswordRequest: () => void
}

type ConsumerProps = RouteComponentProps

const mapStateToProps = (state) => ({
  accountDetails: getAccountDetails(state),
  ui: getAccountUI(state),
  fetchAccountDetailsRequest: fetchAccountDetailsRequest(state),
  updateAccountDetailsRequest: updateAccountDetailsRequest(state),
  updateAccountPasswordRequest: updateAccountPasswordRequest(state),
  mfaEnabled: getMfaEnabled(state),
  mfaDevices: getMfaDevices(state),
  fetchMfaDevicesRequest: fetchMfaDevicesRequest(state),
  disableMfaDeviceRequest: disableMfaDeviceRequest(state),
  enableMfaDeviceRequest: enableMfaDeviceRequest(state),
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  fetchAccountDetailsIfNeeded: () => dispatch(fetchAccountDetailsIfNeeded()),
  fetchMfaStatus: () => dispatch(fetchMfaStatus()),
  fetchMfaDevices: () => dispatch(fetchMfaDevices()),
  resetUpdateAccountDetailsRequest: () => dispatch(resetUpdateAccountDetailsRequest()),
  resetUpdateAccountPasswordRequest: () => dispatch(resetUpdateAccountPasswordRequest()),
  updateAccountDetails: (accountDetails) => dispatch(updateAccountDetails(accountDetails)),
  updateAccountPassword: (data) => dispatch(updateAccountPassword(data)),
  enableMfa: () => dispatch(enableMfa()),
  disableMfa: () => dispatch(disableMfa()),
})

export default withRouter(
  connect<StateProps, DispatchProps, ConsumerProps>(
    mapStateToProps,
    mapDispatchToProps,
  )(UserAccountSettings),
)
