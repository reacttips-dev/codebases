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
import { FormattedMessage } from 'react-intl'
import { get } from 'lodash'

import { EuiSpacer, EuiFlexGroup, EuiFlexItem, EuiFormLabel, EuiPanel } from '@elastic/eui'

import EmailDisplay from './EmailDisplay'
import EmailForm from './EmailForm'
import PasswordDisplay from './PasswordDisplay'
import PasswordForm from './PasswordForm'
import ContactForm from './ContactForm'
import Outcome from './Outcome'

import Header from '../../../../components/Header'
import PrivacySensitiveContainer from '../../../../components/PrivacySensitiveContainer'

import { accountContactsCrumbs } from '../../../../lib/crumbBuilder'

import { replaceIn } from '../../../../lib/immutability-helpers'

import { AsyncRequestState, AccountUI } from '../../../../types'
import { SaasUserRules, SaasUserProfile } from '../../../../lib/api/v1/types'

import './accountDetails.scss'

export type Props = {
  ui: AccountUI
  fetchAccountDetailsRequest: AsyncRequestState
  updateAccountDetailsRequest: AsyncRequestState
  addMonitoringWhitelistEmailRequest: AsyncRequestState
  updateAccountEmailRequest: AsyncRequestState
  updateAccountPasswordRequest: AsyncRequestState
  confirmEmailChangeRequest: AsyncRequestState
  accountDetails: SaasUserProfile & SaasUserRules
  isPortalFeatureEnabled: boolean
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
  showBillingFeature: boolean
}

type State = {
  editing: string | null
}

class AccountDetails extends Component<Props, State> {
  state: State = {
    editing: null,
  }

  componentDidUpdate(prevProps: Props) {
    const { updateAccountEmailRequest, updateAccountPasswordRequest } = this.props

    const didUpdateEmail =
      !prevProps.updateAccountEmailRequest.isDone && updateAccountEmailRequest.isDone

    const didUpdatePassword =
      !prevProps.updateAccountPasswordRequest.isDone && updateAccountPasswordRequest.isDone

    if (didUpdateEmail || didUpdatePassword) {
      this.stopEditing()
    }
  }

  componentWillUnmount() {
    this.props.resetUpdateAccountEmailRequest()
    this.props.resetUpdateAccountPasswordRequest()
    this.props.resetSaveMonitoringEmailWhitelist()

    if (this.props.ui.emailDidChange) {
      this.props.clearEmailChangeConfirmation()
    }
  }

  render() {
    const {
      accountDetails,
      saveMonitoringEmailWhitelist,
      addMonitoringWhitelistEmailRequest,
      isPortalFeatureEnabled,
      showBillingFeature,
    } = this.props

    const billingContacts = get(accountDetails, [`data`, `notifications`, `billing`], ``)
    const operationalContacts = get(accountDetails, [`data`, `notifications`, `operational`], ``)

    return (
      <PrivacySensitiveContainer>
        {!isPortalFeatureEnabled && (
          <Header
            name={
              <FormattedMessage id='uc.accountDetails.heading' defaultMessage='Account profile' />
            }
            breadcrumbs={accountContactsCrumbs()}
          />
        )}
        <Outcome {...this.props} />

        {!isPortalFeatureEnabled && (
          <Fragment>
            <EuiFormLabel data-test-id='uc-accountDetails-email-label'>
              <FormattedMessage
                id='uc.accountDetails.emailLabel'
                defaultMessage='Primary email address'
              />
            </EuiFormLabel>

            <EuiSpacer size='s' />

            {this.renderEmail()}

            <EuiSpacer size='m' />

            <EuiFormLabel data-test-id='uc-accountDetails-password-label'>
              <FormattedMessage id='uc.accountDetails.passwordLabel' defaultMessage='Password' />
            </EuiFormLabel>

            <EuiSpacer size='s' />

            {this.renderPassword()}
            <EuiSpacer size='l' />
          </Fragment>
        )}

        <ContactForm
          operationalContacts={operationalContacts}
          billingContacts={billingContacts}
          onSave={this.saveContacts}
          addMonitoringWhitelistEmailRequest={addMonitoringWhitelistEmailRequest}
          saveMonitoringEmailWhitelist={saveMonitoringEmailWhitelist}
          showBillingFeature={showBillingFeature}
        />
      </PrivacySensitiveContainer>
    )
  }

  renderEmail() {
    const { editing } = this.state
    const { accountDetails, updateAccountEmail, updateAccountEmailRequest } = this.props
    const email = get(accountDetails, [`email`])

    if (editing === `email`) {
      return (
        <Fragment>
          <EuiSpacer size='s' />

          <EuiFlexGroup
            data-test-id='uc-accountDetails-email-display'
            className='accountDetails-emailFormContainer'
          >
            <EuiFlexItem>
              <EuiPanel>
                <EmailForm
                  email={email}
                  error={updateAccountEmailRequest.error}
                  onSave={updateAccountEmail}
                  onCancel={this.stopEditing}
                />
              </EuiPanel>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiSpacer />
        </Fragment>
      )
    }

    return <EmailDisplay email={email} onEdit={this.startEditingEmail} />
  }

  renderPassword() {
    const { editing } = this.state
    const { updateAccountPasswordRequest } = this.props

    if (editing === `password`) {
      return (
        <Fragment>
          <EuiSpacer size='s' />

          <EuiFlexGroup
            data-test-id='uc-accountDetails-password-display'
            className='accountDetails-passwordFormContainer'
          >
            <EuiFlexItem>
              <EuiPanel>
                <PasswordForm
                  error={updateAccountPasswordRequest.error}
                  onSave={this.savePassword}
                  onCancel={this.stopEditing}
                />
              </EuiPanel>
            </EuiFlexItem>
          </EuiFlexGroup>
        </Fragment>
      )
    }

    return <PasswordDisplay onEdit={this.startEditingPassword} />
  }

  savePassword = ({ oldPassword, newPassword }) => {
    const email = this.props.accountDetails.email
    this.props.updateAccountPassword({ oldPassword, newPassword, email })
  }

  saveContacts = (type, contacts) => {
    const accountDetails = replaceIn(
      this.props.accountDetails,
      [`data`, `notifications`, type],
      contacts,
    )

    return this.props.updateContacts(accountDetails)
  }

  startEditingEmail = () => {
    this.props.resetUpdateAccountEmailRequest()
    this.setState({ editing: `email` })
  }

  startEditingPassword = () => {
    this.props.resetUpdateAccountPasswordRequest()
    this.setState({ editing: `password` })
  }

  stopEditing = () => {
    this.setState({ editing: null })
  }
}

export default AccountDetails
