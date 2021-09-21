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

import React, { PureComponent, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { EuiConfirmModal, EuiOverlayMask } from '@elastic/eui'

import { AsyncRequestState } from '../../../types'
import { MfaDevice } from '../../../apps/userconsole/reducers/mfa/types'
import { DeviceType, RenderProps } from './types'

interface Props {
  device: MfaDevice
  activateMfaDevice: (args: { device_id: string; pass_code: string }) => any
  activateMfaDeviceRequest: (device_id: string | null) => AsyncRequestState
  enableMfa: () => void
  disableMfa: () => void
  enrollMfaDevice: (args?: { device_type: string; phone_number?: string }) => any
  enrollMfaDeviceRequest: (device_type: DeviceType) => AsyncRequestState
  disableMfaDeviceRequest: AsyncRequestState
  enableMfaDeviceRequest: AsyncRequestState
  mfaEnabled: boolean | null
  removeMfaDevice: (args: { device_id: string }) => any
  removeMfaDeviceRequest: (device_id: string | null) => AsyncRequestState
  render: (props: RenderProps) => JSX.Element
  resetMfaEnrollment: (args: { device_type: string; device_id: string }) => void
  toggleMfa: () => void
}

interface State {
  confirmRemoveMfaDevice: boolean
  removingMfaDevice: boolean
}

class MfaProvider extends PureComponent<Props, State> {
  state = {
    confirmRemoveMfaDevice: false,
    removingMfaDevice: false,
  }

  render() {
    const {
      activateMfaDeviceRequest,
      device,
      disableMfaDeviceRequest,
      enableMfaDeviceRequest,
      enrollMfaDeviceRequest,
      mfaEnabled,
      removeMfaDeviceRequest,
    } = this.props
    const { confirmRemoveMfaDevice, removingMfaDevice } = this.state
    const showConfirmRemoveMfaModal = confirmRemoveMfaDevice && !removingMfaDevice

    return (
      <Fragment>
        {this.props.render({
          device,
          mfaEnabled,
          disableMfaDeviceRequest,
          enableMfaDeviceRequest,
          activateDevice: this.activateDevice,
          toggleMfaDevice: this.toggleMfaDevice,
          activateMfaDeviceRequest: activateMfaDeviceRequest(device.device_id),
          enrollMfaDeviceRequest: enrollMfaDeviceRequest(device.device_type),
          removeMfaDeviceRequest: removeMfaDeviceRequest(device.device_id),
          enrollMfaDevice: this.enrollMfaDevice,
          resetMfaEnrollment: this.resetMfaEnrollment,
          onRemoveMfaDevice: this.onRemoveMfaDevice,
        })}
        {showConfirmRemoveMfaModal && (
          <EuiOverlayMask>
            <EuiConfirmModal
              title={this.getConfirmModalTitle()}
              onCancel={this.onCancelRemoveMfaDevice}
              onConfirm={this.removeMfaDevice}
              cancelButtonText={
                <FormattedMessage id='mfa-provider.cancel-remove-device' defaultMessage='Cancel' />
              }
              confirmButtonText={
                <FormattedMessage id='mfa-provider.remove-device' defaultMessage='Remove device' />
              }
              buttonColor='danger'
              defaultFocusedButton={'cancel'}
            >
              <p>
                {
                  <FormattedMessage
                    id='mfa-provider.confirm-remove-device'
                    defaultMessage='You will no longer be able to log in with this device.'
                  />
                }
              </p>
            </EuiConfirmModal>
          </EuiOverlayMask>
        )}
      </Fragment>
    )
  }

  enrollMfaDevice = (phone_number) => {
    const { device, enrollMfaDevice } = this.props
    const { device_type } = device
    return enrollMfaDevice({ device_type, phone_number }).then((response) => {
      const isActive = response.payload.status === 'ACTIVE'

      if (isActive) {
        this.toggleMfaDevice({ enable: true })
      }

      return { isActive }
    })
  }

  resetMfaEnrollment = () => {
    const { device_id, device_type } = this.props.device
    this.props.resetMfaEnrollment({ device_type, device_id })
  }

  activateDevice = (pass_code) => {
    const { activateMfaDevice } = this.props
    const { device_id } = this.props.device
    return activateMfaDevice({ device_id, pass_code }).then(() => {
      this.toggleMfaDevice({ enable: true })
      return
    })
  }

  getConfirmModalTitle() {
    const { device_type } = this.props.device

    if (device_type === 'GOOGLE') {
      return (
        <FormattedMessage
          id='mfa-provider.remove-google-auth-confirmation-title'
          defaultMessage='Remove Google authenticator?'
        />
      )
    }

    return (
      <FormattedMessage
        id='mfa-provider.remove-sms-device-confirmation-title'
        defaultMessage='Remove SMS device?'
      />
    )
  }

  onRemoveMfaDevice = () => {
    this.setState({ confirmRemoveMfaDevice: true })
  }

  onCancelRemoveMfaDevice = () => {
    this.setState({ confirmRemoveMfaDevice: false })
  }

  removeMfaDevice = () => {
    const { device } = this.props
    this.setState({ removingMfaDevice: true }, () =>
      this.props.removeMfaDevice({ device_id: device.device_id }).then(() => {
        this.setState({
          confirmRemoveMfaDevice: false,
          removingMfaDevice: false,
        })
      }),
    )
  }

  toggleMfaDevice = (args?: { enable: boolean }) => {
    const enable = args && args.enable

    if (this.props.mfaEnabled && enable) {
      return
    }

    this.props.toggleMfa()
  }
}

export default MfaProvider
