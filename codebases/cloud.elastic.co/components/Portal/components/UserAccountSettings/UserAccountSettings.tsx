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

import cx from 'classnames'

import React, { PureComponent, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiHorizontalRule, EuiLoadingContent, EuiSpacer } from '@elastic/eui'

import PrivacySensitiveContainer from '../../../PrivacySensitiveContainer'
import DeviceAuthentication from '../../../DeviceAuthentication'

import PortalPage from '../PortalPage'

import UserProfileForm from './UserProfileForm'
import ChangePasswordForm from './ChangePasswordForm'

import { portalUserSettingsCrumbs } from '../../../../lib/portalCrumbBuilder'

import { messages as portalMessages } from '../../messages'

import { MfaDevice } from '../../../../apps/userconsole/reducers/mfa/types'
import { SaasUserProfile, SaasUserRules } from '../../../../lib/api/v1/types'
import { AccountUI, AsyncRequestState } from '../../../../types'

import './userAccountSettings.scss'

interface Props {
  accountDetails: SaasUserProfile & SaasUserRules
  ui: AccountUI
  fetchAccountDetailsIfNeeded: () => Promise<any>
  fetchAccountDetailsRequest: AsyncRequestState
  resetUpdateAccountDetailsRequest: () => void
  resetUpdateAccountPasswordRequest: () => void
  updateAccountDetailsRequest: AsyncRequestState
  updateAccountDetails: (accountDetails: SaasUserProfile & SaasUserRules) => any
  mfaEnabled: boolean | null
  mfaDevices: MfaDevice[] | null
  fetchMfaStatus: () => void
  enableMfa: () => void
  disableMfa: () => void
  fetchMfaDevices: () => void
  fetchMfaDevicesRequest: AsyncRequestState
  disableMfaDeviceRequest: AsyncRequestState
  enableMfaDeviceRequest: AsyncRequestState
  updateAccountPassword: (args: { oldPassword: string; newPassword: string; email: string }) => void
  updateAccountPasswordRequest: AsyncRequestState
}

class UserAccountSettings extends PureComponent<Props> {
  componentDidMount() {
    const { fetchAccountDetailsIfNeeded, fetchMfaStatus, fetchMfaDevices } = this.props

    fetchAccountDetailsIfNeeded()
    fetchMfaStatus()
    fetchMfaDevices()
  }

  componentWillUnmount() {
    this.props.resetUpdateAccountDetailsRequest()
    this.props.resetUpdateAccountPasswordRequest()
  }

  render() {
    const isLoading = this.isLoading()

    return (
      <PortalPage
        breadcrumbs={portalUserSettingsCrumbs()}
        className={cx('cloud-portal-user-account-settings', {
          'cloud-portal-page-loading': isLoading,
        })}
        contentHeader={<FormattedMessage {...portalMessages.userSettings} />}
      >
        {this.renderContent()}
      </PortalPage>
    )
  }

  renderContent() {
    const {
      accountDetails,
      disableMfa,
      enableMfa,
      disableMfaDeviceRequest,
      enableMfaDeviceRequest,
      mfaDevices,
      mfaEnabled,
      updateAccountDetailsRequest,
      updateAccountPassword,
      updateAccountPasswordRequest,
      resetUpdateAccountPasswordRequest,
      ui,
    } = this.props

    const isLoading = this.isLoading()

    if (!accountDetails && isLoading) {
      return <EuiLoadingContent />
    }

    const { is_profile_editable } = accountDetails

    return (
      <PrivacySensitiveContainer>
        <div className='profile-wrapper'>
          <UserProfileForm
            ui={ui}
            updateAccountDetailsRequest={updateAccountDetailsRequest}
            accountDetails={accountDetails}
            updateAccountDetails={this.updateAccountDetails}
            resetUpdateAccountDetailsRequest={this.props.resetUpdateAccountDetailsRequest}
          />

          <EuiSpacer size='m' />
          {is_profile_editable && (
            <Fragment>
              <EuiHorizontalRule margin='xs' />

              <EuiSpacer size='m' />

              <ChangePasswordForm
                accountDetails={accountDetails}
                updateAccountPassword={updateAccountPassword}
                updateAccountPasswordRequest={updateAccountPasswordRequest}
                resetUpdateAccountPasswordRequest={resetUpdateAccountPasswordRequest}
              />

              <EuiSpacer />
              <EuiHorizontalRule margin='xs' />

              <EuiSpacer size='m' />

              <DeviceAuthentication
                mfaDevices={mfaDevices}
                enableMfa={enableMfa}
                disableMfa={disableMfa}
                mfaEnabled={mfaEnabled}
                disableMfaDeviceRequest={disableMfaDeviceRequest}
                enableMfaDeviceRequest={enableMfaDeviceRequest}
              />
            </Fragment>
          )}
        </div>
      </PrivacySensitiveContainer>
    )
  }

  updateAccountDetails = (fieldValues) =>
    this.props.updateAccountDetails({
      ...fieldValues,
    })

  isLoading = (): boolean => {
    const { accountDetails, fetchAccountDetailsRequest } = this.props

    const isLoading = !accountDetails || fetchAccountDetailsRequest.inProgress

    return isLoading
  }
}

export default UserAccountSettings
