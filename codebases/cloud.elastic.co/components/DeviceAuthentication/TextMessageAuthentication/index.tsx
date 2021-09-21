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

import Configure from './Configure'
import ConfigurationForm from './ConfigurationForm'
import ActivateDevice from './ActivateDevice'
import DeviceActive from './DeviceActive'
import AuthSwitch from '../AuthSwitch'

import { RenderProps as MfaProviderRenderProps } from '../MfaProvider/types'
import phoneSMSIcon from '../../../files/phone-sms.svg'
import './textMessageAuthentication.scss'

interface State {
  isActivating: boolean
  isConfiguring: boolean
}

interface Props extends MfaProviderRenderProps {
  canManageDeviceStatus?: boolean
  canRemove: boolean
}

class TextMessageAuthentication extends PureComponent<Props, State> {
  state = {
    isActivating: false,
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
      <EuiPanel className='user-settings-profile-card text-message-authentication'>
        <EuiFlexGroup gutterSize='m' responsive={false}>
          <EuiFlexItem grow={false}>
            <EuiIcon type={phoneSMSIcon} size='xxl' />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFlexGroup justifyContent='spaceEvenly' alignItems='center' gutterSize='s'>
              <EuiFlexItem>
                <EuiTitle size='s' className='user-settings-profile-card-title'>
                  <h3>
                    <FormattedMessage
                      id='text-message-authentication-title'
                      defaultMessage='Text message'
                    />
                  </h3>
                </EuiTitle>
              </EuiFlexItem>
              {device.isActive && canManageDeviceStatus && (
                <EuiFlexItem grow={false} style={{ minWidth: 30 }}>
                  <AuthSwitch
                    disableMfaDeviceRequest={disableMfaDeviceRequest}
                    enableMfaDeviceRequest={enableMfaDeviceRequest}
                    mfaEnabled={!!mfaEnabled}
                    toggle={toggleMfaDevice}
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
      device,
      canRemove,
      enrollMfaDeviceRequest,
      resetMfaEnrollment,
      activateMfaDeviceRequest,
      onRemoveMfaDevice,
      removeMfaDeviceRequest,
      mfaEnabled,
    } = this.props
    const { isActivating, isConfiguring } = this.state

    if (isConfiguring) {
      return (
        <ConfigurationForm
          enrollMfaDeviceRequest={enrollMfaDeviceRequest}
          resetMfaEnrollment={resetMfaEnrollment}
          onCancel={this.onCancelEnrollment}
          enrollDevice={this.enrollDevice}
          device={device}
        />
      )
    }

    if (isActivating) {
      return (
        <ActivateDevice
          activateMfaDeviceRequest={activateMfaDeviceRequest}
          onCancel={this.onCancelActivate}
          activateDevice={this.activateDevice}
        />
      )
    }

    if (device.isActive && device.phone_number) {
      return (
        <DeviceActive
          canRemove={canRemove}
          phoneNumber={device.phone_number}
          removeMfaDeviceRequest={removeMfaDeviceRequest}
          mfaEnabled={!!mfaEnabled}
          onRemoveMfaDevice={onRemoveMfaDevice}
        />
      )
    }

    return <Configure onClickConfigure={this.onClickConfigure} />
  }

  onClickConfigure = () => {
    this.setState({ isConfiguring: true })
  }

  onCancelEnrollment = () => {
    const { device, resetMfaEnrollment } = this.props
    resetMfaEnrollment(device)
    this.setState({ isConfiguring: false })
  }

  onCancelActivate = () => {
    const { device, resetMfaEnrollment } = this.props
    resetMfaEnrollment(device)
    this.setState({ isActivating: false })
  }

  enrollDevice = (phone_number) => {
    const { enrollMfaDevice } = this.props
    enrollMfaDevice(phone_number).then((status) => {
      this.setState({ isConfiguring: false, isActivating: !status.isActive })
    })
  }

  activateDevice = (pass_code: string) => {
    this.props.activateDevice(pass_code).then(() => {
      this.setState({ isConfiguring: false, isActivating: false })
    })
  }
}

export default TextMessageAuthentication
