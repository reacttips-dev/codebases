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

import React, { Component } from 'react'

import { find } from 'lodash'

import GoogleForm from './GoogleForm'
import SmsForm from './SmsForm'

import './mfaForm.scss'
import { AsyncRequestState } from '../../../../types'
import { MfaState, DEVICE_TYPES } from '../../../../reducers/auth/types'

export type Props = {
  mfa: MfaState
  sendMfaChallenge: (device_id: string) => Promise<any>
  submitMfaResponseRequest: AsyncRequestState
  resetSubmitMfaResponseRequest: () => void
  onSubmit: (args: { pass_code: string; device_id: string }) => void
}

type State = {
  deviceType: DEVICE_TYPES | null
}

export default class MfaForm extends Component<Props, State> {
  state: State = {
    deviceType: this.getInitialDeviceType(),
  }

  componentWillUnmount() {
    this.props.resetSubmitMfaResponseRequest()
  }

  render() {
    const { submitMfaResponseRequest, resetSubmitMfaResponseRequest } = this.props
    const { deviceType } = this.state

    const showGoogleForm = deviceType === DEVICE_TYPES.GOOGLE
    const showSmsForm = deviceType === DEVICE_TYPES.SMS
    const showSwitchToSmsLink =
      deviceType === DEVICE_TYPES.GOOGLE && this.allowsDeviceType(DEVICE_TYPES.SMS)
    const showBackToGoogleLink =
      deviceType === DEVICE_TYPES.SMS && this.allowsDeviceType(DEVICE_TYPES.GOOGLE)

    if (showGoogleForm) {
      return (
        <div className='mfa-form'>
          <GoogleForm
            submitMfaResponseRequest={submitMfaResponseRequest}
            onSubmit={this.submit}
            showSwitchToSmsLink={showSwitchToSmsLink}
            switchToDevice={this.switchToDevice}
            resetSubmitMfaResponseRequest={resetSubmitMfaResponseRequest}
          />
        </div>
      )
    }

    if (showSmsForm) {
      return (
        <div className='mfa-form'>
          <SmsForm
            submitMfaResponseRequest={submitMfaResponseRequest}
            onSubmit={this.submit}
            sendSms={this.sendSms}
            showBackToGoogleLink={showBackToGoogleLink}
            switchToDevice={this.switchToDevice}
          />
        </div>
      )
    }
  }

  submit = (pass_code) => {
    const device = this.getDevice()

    if (!device) {
      return
    }

    const { device_id } = device

    this.props.onSubmit({
      pass_code,
      device_id,
    })
  }

  switchToDevice = (deviceType) => {
    this.props.resetSubmitMfaResponseRequest()
    this.setState({ deviceType })
  }

  sendSms = () => {
    const device = this.getDevice()

    if (!device) {
      return Promise.reject()
    }

    const { device_id } = device
    return this.props.sendMfaChallenge(device_id)
  }

  allowsDeviceType(deviceType) {
    const {
      mfa: { mfa_devices },
    } = this.props
    return find(mfa_devices, { device_type: deviceType }) != null
  }

  getDevice = () => {
    const {
      mfa: { mfa_devices },
    } = this.props
    return find(mfa_devices, { device_type: this.state.deviceType })
  }

  getInitialDeviceType() {
    if (this.allowsDeviceType(DEVICE_TYPES.GOOGLE)) {
      return DEVICE_TYPES.GOOGLE
    }

    if (this.allowsDeviceType(DEVICE_TYPES.SMS)) {
      return DEVICE_TYPES.SMS
    }

    return null
  }
}
