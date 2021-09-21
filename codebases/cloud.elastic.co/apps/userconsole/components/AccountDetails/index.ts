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

import withLoading from '../../../../lib/apm/withLoading'
import AccountDetails from './AccountDetails'

import {
  getAccountDetails,
  getAccountUI,
  fetchAccountDetailsRequest,
  updateAccountEmailRequest,
  updateAccountPasswordRequest,
  updateAccountDetailsRequest,
  addMonitoringWhitelistEmailRequest,
  confirmEmailChangeRequest,
} from '../../reducers'

import {
  fetchAccountDetailsIfNeeded,
  updateAccountEmail,
  updateAccountPassword,
  updateAccountDetails,
  updateContacts,
  resetUpdateAccountEmailRequest,
  resetUpdateAccountPasswordRequest,
  resetUpdateAccountDetailsRequest,
  saveMonitoringEmailWhitelist,
  resetSaveMonitoringEmailWhitelist,
  clearEmailChangeConfirmation,
} from '../../actions/account'

import { isFeatureActivated } from '../../../../selectors'
import Feature from '../../../../lib/feature'

import { AsyncRequestState, AccountUI } from '../../../../types'
import { SaasUserRules, SaasUserProfile } from '../../../../lib/api/v1/types'

type StateProps = {
  ui: AccountUI
  fetchAccountDetailsRequest: AsyncRequestState
  updateAccountDetailsRequest: AsyncRequestState
  addMonitoringWhitelistEmailRequest: AsyncRequestState
  updateAccountEmailRequest: AsyncRequestState
  updateAccountPasswordRequest: AsyncRequestState
  confirmEmailChangeRequest: AsyncRequestState
  accountDetails: SaasUserProfile & SaasUserRules
  isPortalFeatureEnabled: boolean
  showBillingFeature: boolean
}

type DispatchProps = {
  fetchAccountDetailsIfNeeded: () => void
  resetUpdateAccountEmailRequest: () => void
  resetUpdateAccountPasswordRequest: () => void
  resetUpdateAccountDetailsRequest: () => void
  resetSaveMonitoringEmailWhitelist: () => void
  clearEmailChangeConfirmation: () => void
  updateAccountPassword: (args: { oldPassword: string; newPassword: string; email: string }) => void
  updateAccountEmail: (args: { oldEmail: string; newEmail: string; password: string }) => void
  saveMonitoringEmailWhitelist: (email: string) => void
  updateAccountDetails: (accountDetails: SaasUserProfile & SaasUserRules) => void
  updateContacts: (accountDetails: SaasUserProfile & SaasUserRules) => void
}

interface ConsumerProps {}

type Props = StateProps & DispatchProps & ConsumerProps

const mapStateToProps = (state): StateProps => ({
  accountDetails: getAccountDetails(state),
  ui: getAccountUI(state),
  fetchAccountDetailsRequest: fetchAccountDetailsRequest(state),
  updateAccountEmailRequest: updateAccountEmailRequest(state),
  updateAccountPasswordRequest: updateAccountPasswordRequest(state),
  updateAccountDetailsRequest: updateAccountDetailsRequest(state),
  addMonitoringWhitelistEmailRequest: addMonitoringWhitelistEmailRequest(state),
  confirmEmailChangeRequest: confirmEmailChangeRequest(state),
  isPortalFeatureEnabled: isFeatureActivated(state, Feature.cloudPortalEnabled),
  showBillingFeature: isFeatureActivated(state, Feature.showBillingPage),
})

const mapDispatchToProps: DispatchProps = {
  fetchAccountDetailsIfNeeded,
  updateAccountEmail,
  updateAccountPassword,
  updateAccountDetails,
  updateContacts,
  resetUpdateAccountEmailRequest,
  resetUpdateAccountPasswordRequest,
  resetUpdateAccountDetailsRequest,
  saveMonitoringEmailWhitelist,
  resetSaveMonitoringEmailWhitelist,
  clearEmailChangeConfirmation,
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(
  withLoading<Props>(AccountDetails, (props) => {
    const {
      fetchAccountDetailsIfNeeded: fetch,
      fetchAccountDetailsRequest: request,
      accountDetails,
    } = props

    return {
      transaction: `Account details`,
      fetch,
      request,
      result: accountDetails,
      blockWhileLoading: false,
    }
  }),
)
