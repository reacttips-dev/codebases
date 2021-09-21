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

import React, { Fragment, PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { filter, find, some } from 'lodash'
import {
  EuiButtonEmpty,
  EuiCallOut,
  EuiDescribedFormGroup,
  EuiForm,
  EuiFormRow,
  EuiLoadingSpinner,
  EuiSpacer,
  EuiSwitch,
} from '@elastic/eui'

import PrivacySensitiveContainer from '../PrivacySensitiveContainer'
import MfaProvider from './MfaProvider'
import GoogleAuthenticator from './GoogleAuthenticator'
import TextMessageAuthentication from './TextMessageAuthentication'

import DocLink from '../DocLink'

import { DeviceType, RenderProps } from './MfaProvider/types'
import { MfaDevice } from '../../apps/userconsole/reducers/mfa/types'
import { AsyncRequestState } from '../../types'

import './deviceAuthentication.scss'

interface Props {
  mfaEnabled: boolean | null
  mfaDevices: MfaDevice[] | null
  enableMfa: () => void
  disableMfa: () => void
  disableMfaDeviceRequest: AsyncRequestState
  enableMfaDeviceRequest: AsyncRequestState
}

const enabledLabel = (
  <FormattedMessage id='uc.accountSecurity.enabledValue' defaultMessage='Enabled' />
)
const disabledLabel = (
  <FormattedMessage id='uc.accountSecurity.disabledValue' defaultMessage='Disabled' />
)
const enableForbidden = (
  <FormattedMessage
    id='uc.accountSecurity.enableForbidden'
    defaultMessage='Disabled. Add a device first.'
  />
)

class DeviceAuthentication extends PureComponent<Props> {
  render() {
    const { disableMfaDeviceRequest, enableMfaDeviceRequest } = this.props
    const hasEnableDisableRequestError =
      disableMfaDeviceRequest.error || enableMfaDeviceRequest.error

    return (
      <PrivacySensitiveContainer>
        <EuiForm className='device-authentication'>
          <EuiDescribedFormGroup
            title={
              <h3>
                <FormattedMessage
                  id='user-settings-profile-mfa'
                  defaultMessage='Multi-factor authentication'
                />
              </h3>
            }
            titleSize='xs'
            description={
              <Fragment>
                <FormattedMessage
                  id='user-settings-profile-help-text-mfa'
                  defaultMessage='Add an extra layer of security by setting up Google authenticator or text messaging on a mobile device. {docLink}'
                  values={{
                    docLink: (
                      <DocLink link='mfaDocLink'>
                        <FormattedMessage
                          id='device-authentication.link'
                          defaultMessage='Learn more'
                        />
                      </DocLink>
                    ),
                  }}
                />
                <EuiSpacer />
                {this.renderSwitch()}
                {hasEnableDisableRequestError && (
                  <Fragment>
                    <EuiSpacer size='xl' />
                    <EuiCallOut
                      className='user-settings-profile-mfa-toggle-error'
                      title={
                        disableMfaDeviceRequest.error ? (
                          <FormattedMessage
                            id='user-settings-profile-mfa-disable-error-title'
                            defaultMessage='Error disabling authenticator app'
                          />
                        ) : (
                          <FormattedMessage
                            id='user-settings-profile-mfa-enabled-error-title'
                            defaultMessage='Error enabling authenticator app'
                          />
                        )
                      }
                      color='danger'
                      iconType='alert'
                    >
                      <FormattedMessage
                        id='user-settings-profile-mfa-toggle-switch-error-description'
                        defaultMessage='Something went wrong. {tryAgain}'
                        values={{
                          tryAgain: (
                            <EuiButtonEmpty onClick={this.toggleMfa} size='s'>
                              <FormattedMessage
                                id='user-settings-profile-mfa-enabled-error-try-again'
                                defaultMessage='Try again'
                              />
                            </EuiButtonEmpty>
                          ),
                        }}
                      />
                    </EuiCallOut>
                  </Fragment>
                )}
              </Fragment>
            }
          >
            <Fragment>
              <EuiFormRow>{this.renderMfaDeviceComponent('GOOGLE')}</EuiFormRow>
              <EuiSpacer size='l' />
              <EuiFormRow>{this.renderMfaDeviceComponent('SMS')}</EuiFormRow>
            </Fragment>
          </EuiDescribedFormGroup>
        </EuiForm>
      </PrivacySensitiveContainer>
    )
  }

  renderSwitch = () => {
    const { mfaEnabled, mfaDevices, disableMfaDeviceRequest, enableMfaDeviceRequest } = this.props

    if (disableMfaDeviceRequest.inProgress || enableMfaDeviceRequest.inProgress) {
      return <EuiLoadingSpinner />
    }

    const hasAtLeastOneActiveDevice = some(mfaDevices, `isActive`)
    let switchLabel = <span>{mfaEnabled ? enabledLabel : disabledLabel}</span>

    if (!hasAtLeastOneActiveDevice && !mfaEnabled) {
      switchLabel = enableForbidden
    }

    return (
      <EuiSwitch
        className='user-settings-profile-toogle-mfa'
        label={switchLabel}
        checked={mfaEnabled || false}
        disabled={!hasAtLeastOneActiveDevice}
        onChange={this.toggleMfa}
      />
    )
  }

  renderMfaDeviceComponent(deviceType) {
    return (
      <MfaProvider
        device={this.getDevice(deviceType)}
        toggleMfa={this.toggleMfa}
        render={(props: RenderProps) => this.getDeviceComponent(deviceType, props)}
      />
    )
  }

  getDeviceComponent(deviceType, renderProps) {
    const canRemove = this.canRemoveMfaDevice()
    const Component = deviceType === 'GOOGLE' ? GoogleAuthenticator : TextMessageAuthentication
    return <Component canRemove={canRemove} {...renderProps} />
  }

  getDevice(device_type: DeviceType): MfaDevice {
    const { mfaDevices } = this.props
    return (
      find(mfaDevices, { device_type }) || {
        device_id: ``,
        device_type,
        status: `NOT_SETUP`,
        isActive: false,
      }
    )
  }

  canRemoveMfaDevice = () => {
    const { mfaEnabled, mfaDevices } = this.props
    return !mfaEnabled || filter(mfaDevices, `isActive`).length >= 2
  }

  toggleMfa = () => {
    if (this.props.mfaEnabled) {
      this.props.disableMfa()
    } else {
      this.props.enableMfa()
    }
  }
}

export default DeviceAuthentication
