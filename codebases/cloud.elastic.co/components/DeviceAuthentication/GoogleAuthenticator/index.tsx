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

import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { EuiFlexGroup, EuiFlexItem, EuiIcon, EuiPanel, EuiSpacer, EuiTitle } from '@elastic/eui'

import ConfigurationForm from './ConfigurationForm'
import DeviceActive from './DeviceActive'
import Configure from './Configure'
import AuthSwitch from '../AuthSwitch'

import { RenderProps as MfaProviderRenderProps } from '../MfaProvider/types'

import phoneMfaCodeIcon from '../../../files/phone-mfa-code.svg'
import './googleAuthenticator.scss'

interface State {
  isConfiguring: boolean
}

interface Props extends MfaProviderRenderProps {
  canManageDeviceStatus?: boolean
  canRemove: boolean
}

class GoogleAuthenticator extends PureComponent<Props, State> {
  state: State = {
    isConfiguring: false,
  }

  render() {
    const {
      canManageDeviceStatus,
      device,
      disableMfaDeviceRequest,
      enableMfaDeviceRequest,
      mfaEnabled,
      toggleMfaDevice,
    } = this.props

    return (
      <EuiPanel className='user-settings-profile-card google-authenticator'>
        <EuiFlexGroup gutterSize='m' responsive={false}>
          <EuiFlexItem grow={false}>
            <EuiIcon type={phoneMfaCodeIcon} size='xxl' />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFlexGroup justifyContent='spaceEvenly' alignItems='center' gutterSize='s'>
              <EuiFlexItem>
                <EuiTitle
                  size='s'
                  className='user-settings-profile-card-title google-authenticator-title'
                >
                  <h3>
                    <FormattedMessage
                      id='google-authenticator'
                      defaultMessage='Authenticator app'
                    />
                  </h3>
                </EuiTitle>
              </EuiFlexItem>
              {device.isActive && canManageDeviceStatus && (
                <EuiFlexItem grow={false} style={{ minWidth: 30 }}>
                  <AuthSwitch
                    disableMfaDeviceRequest={disableMfaDeviceRequest}
                    enableMfaDeviceRequest={enableMfaDeviceRequest}
                    toggle={toggleMfaDevice}
                    mfaEnabled={!!mfaEnabled}
                  />
                </EuiFlexItem>
              )}
            </EuiFlexGroup>
            <EuiSpacer size='s' />
            {this.renderContent()}
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPanel>
    )
  }

  renderContent() {
    const {
      activateMfaDeviceRequest,
      canRemove,
      device,
      enableMfaDeviceRequest,
      enrollMfaDeviceRequest,
      mfaEnabled,
      onRemoveMfaDevice,
      resetMfaEnrollment,
      removeMfaDeviceRequest,
    } = this.props
    const { isConfiguring } = this.state

    if (isConfiguring) {
      return (
        <ConfigurationForm
          device={device}
          resetMfaEnrollment={resetMfaEnrollment}
          activateMfaDeviceRequest={activateMfaDeviceRequest}
          enableMfaDeviceRequest={enableMfaDeviceRequest}
          enrollMfaDeviceRequest={enrollMfaDeviceRequest}
          onSubmitForm={this.activateDevice}
          onCancel={this.onCancel}
        />
      )
    }

    if (device.isActive) {
      return (
        <DeviceActive
          canRemove={canRemove}
          mfaEnabled={!!mfaEnabled}
          onRemoveMfaDevice={onRemoveMfaDevice}
          removeMfaDeviceRequest={removeMfaDeviceRequest}
        />
      )
    }

    return <Configure onClickConfigure={this.onClickConfigure} />
  }

  onClickConfigure = () => {
    this.props.enrollMfaDevice()
    this.setState({ isConfiguring: true })
  }

  onCancel = () => {
    const { device, resetMfaEnrollment } = this.props
    this.setState({ isConfiguring: false })
    resetMfaEnrollment(device)
  }

  activateDevice = (pass_code: string) =>
    this.props.activateDevice(pass_code).then(() => {
      this.setState({ isConfiguring: false })
    })
}

export default GoogleAuthenticator
