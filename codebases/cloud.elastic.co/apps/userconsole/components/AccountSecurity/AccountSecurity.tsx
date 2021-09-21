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

import { EuiLoadingSpinner, EuiSpacer, EuiText } from '@elastic/eui'

import Header from '../../../../components/Header'
import DeviceAuthentication from '../../../../components/DeviceAuthentication'
import IpFilter from '../../../../components/IpFilter'
import { accountSecurityCrumbs } from '../../../../lib/crumbBuilder'

import { MfaDevice } from '../../reducers/mfa/types'
import { AsyncRequestState } from '../../../../types'

export type Props = {
  mfaEnabled: boolean | null
  mfaDevices: MfaDevice[] | null
  isIpFilteringEnabled: boolean | null
  fetchMfaStatus: () => void
  enableMfa: () => void
  disableMfa: () => void
  fetchMfaDevices: () => void
  fetchMfaDevicesRequest: AsyncRequestState
  disableMfaDeviceRequest: AsyncRequestState
  enableMfaDeviceRequest: AsyncRequestState
}

const title = <FormattedMessage id='uc.accountSecurity.heading' defaultMessage='Account security' />

class AccountSecurity extends Component<Props> {
  componentDidMount() {
    const { fetchMfaStatus, fetchMfaDevices } = this.props
    fetchMfaStatus()
    fetchMfaDevices()
  }

  render() {
    return (
      <div>
        <Header name={title} breadcrumbs={accountSecurityCrumbs()} />

        <EuiText>
          <FormattedMessage
            id='account-security.description'
            defaultMessage='Protect your Elasticsearch Service account, your data, and make sure that the right people have access.'
          />
        </EuiText>
        <EuiSpacer size='m' />
        {this.renderContent()}
      </div>
    )
  }

  renderContent = () => {
    const {
      disableMfa,
      disableMfaDeviceRequest,
      enableMfa,
      enableMfaDeviceRequest,
      fetchMfaDevicesRequest,
      isIpFilteringEnabled,
      mfaDevices,
      mfaEnabled,
    } = this.props

    if (fetchMfaDevicesRequest.inProgress) {
      return <EuiLoadingSpinner />
    }

    return (
      <Fragment>
        <EuiSpacer />

        <DeviceAuthentication
          mfaDevices={mfaDevices}
          enableMfa={enableMfa}
          disableMfa={disableMfa}
          mfaEnabled={mfaEnabled}
          disableMfaDeviceRequest={disableMfaDeviceRequest}
          enableMfaDeviceRequest={enableMfaDeviceRequest}
        />

        {isIpFilteringEnabled && (
          <Fragment>
            <EuiSpacer size='l' />

            <IpFilter regionId='us-east-1' />
          </Fragment>
        )}
      </Fragment>
    )
  }

  toggleMfa = () => {
    if (this.props.mfaEnabled) {
      this.props.disableMfa()
    } else {
      this.props.enableMfa()
    }
  }
}

export default AccountSecurity
